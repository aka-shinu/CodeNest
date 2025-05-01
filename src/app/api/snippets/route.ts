import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";

// Cache the snippets list for 30 seconds in development, 5 minutes in production
const getSnippetsFromDb = unstable_cache(
  async (language?: string | null, search?: string | null) => {
    try {
      const where = {
        visibility: "public",
        ...(language && { language }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { tags: { hasSome: [search] } },
          ],
        }),
      } as const;

      const snippets = await prisma.snippet.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20, // Limit to 20 snippets per page for better performance
      });

      return snippets.map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        description: snippet.description,
        language: snippet.language,
        tags: snippet.tags,
        author: snippet.author,
        createdAt: snippet.createdAt,
        _count: {
          likes: snippet._count.likes,
          comments: snippet._count.comments,
        },
      }));
    } catch (error) {
      console.error("Error fetching snippets:", error);
      return [];
    }
  },
  ["snippets-list"],
  { revalidate: process.env.NODE_ENV === "development" ? 30 : 300, tags: ["snippets"] }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const search = searchParams.get("search");

    const snippets = await getSnippetsFromDb(language, search);
    return NextResponse.json(snippets);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { title, description, code, language, tags } = await request.json();

    if (!title || !code || !language) {
      return NextResponse.json(
        { error: "Title, code, and language are required" },
        { status: 400 }
      );
    }

    // Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const processedTags = Array.isArray(tags) 
      ? tags 
      : typeof tags === 'string' 
        ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];

    const snippet = await prisma.snippet.create({
      data: {
        title,
        description: description || "",
        code,
        language,
        tags: processedTags,
        visibility: "public",
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Revalidate the snippets cache
    revalidateTag("snippets");

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error("Error creating snippet:", error);
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}

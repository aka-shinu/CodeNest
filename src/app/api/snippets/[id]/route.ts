import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

// Cache the snippet fetch for 1 minute in development, 1 hour in production
const getSnippetFromDb = unstable_cache(
  async (id: string, userId?: string) => {
    try {
      const snippet = await prisma.snippet.findUnique({
        where: {
          id,
          OR: [
            { visibility: "public" },
            { authorId: userId },
          ],
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          likes: userId ? {
            where: {
              userId: userId
            },
            select: {
              userId: true
            }
          } : false,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!snippet) return null;

      return {
        ...snippet,
        isLiked: userId ? snippet.likes.length > 0 : false,
        likes: undefined, // Remove the likes array from the response
      };
    } catch (error) {
      console.error("Error fetching snippet:", error);
      return null;
    }
  },
  ["snippet"],
  { revalidate: process.env.NODE_ENV === "development" ? 60 : 3600 }
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    const { id } = params;

    // Get user ID from session if available
    const userId = session?.user?.email ? 
      (await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      }))?.id : 
      undefined;

    const snippet = await getSnippetFromDb(id, userId);

    if (!snippet) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    const snippet = await prisma.snippet.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
      },
    });

    if (!snippet) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    if (snippet.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    await prisma.snippet.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { id } = params;

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!snippet) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    if (snippet.authorId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedSnippet = await prisma.snippet.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        code: body.code,
        language: body.language,
        tags: body.tags,
        visibility: body.visibility,
      },
    });

    return NextResponse.json(updatedSnippet);
  } catch (error) {
    console.error("Error updating snippet:", error);
    return NextResponse.json(
      { error: "Failed to update snippet" },
      { status: 500 }
    );
  }
} 
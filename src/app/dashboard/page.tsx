import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardClient from "./dashboard-client";

async function getMySnippets(userId: string) {
  const snippets = await prisma.snippet.findMany({
    where: {
      authorId: userId,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return snippets.map(snippet => ({
    ...snippet,
    tags: snippet.tags ?? [], // Ensure tags is never null
    description: snippet.description ?? "", // Ensure description is never null
  }));
}

async function getLikedSnippets(userId: string) {
  const snippets = await prisma.snippet.findMany({
    where: {
      likes: {
        some: {
          userId: userId,
        },
      },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return snippets.map(snippet => ({
    ...snippet,
    tags: snippet.tags ?? [], // Ensure tags is never null
    description: snippet.description ?? "", // Ensure description is never null
  }));
}

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get user from database using email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true }
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const [mySnippets, likedSnippets] = await Promise.all([
    getMySnippets(user.id),
    getLikedSnippets(user.id),
  ]);

  return <DashboardClient mySnippets={mySnippets} likedSnippets={likedSnippets} />;
} 
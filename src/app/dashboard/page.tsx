import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardClient from "./dashboard-client";

async function getMySnippets(userId: string) {
  return prisma.snippet.findMany({
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
}

async function getLikedSnippets(userId: string) {
  return prisma.snippet.findMany({
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
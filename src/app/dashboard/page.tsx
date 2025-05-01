import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardSnippets } from "@/components/dashboard-snippets";

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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <h1 className="text-5xl font-bold mb-12 font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#00a3ff]">
          Dashboard
        </h1>
        <DashboardSnippets
          mySnippets={mySnippets}
          likedSnippets={likedSnippets}
          user={session.user}
        />
      </div>
    </div>
  );
} 
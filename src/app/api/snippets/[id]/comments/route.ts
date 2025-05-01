import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const skip = (page - 1) * limit;

  try {
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          snippetId: params.id,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: skip,
      }),
      prisma.comment.count({
        where: {
          snippetId: params.id,
        },
      }),
    ]);

    return NextResponse.json({ comments, total });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (!user) {
        throw new Error("User not found");
      }

      const comment = await tx.comment.create({
        data: {
          content,
          authorId: user.id,
          snippetId: params.id,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      const commentCount = await tx.comment.count({
        where: {
          snippetId: params.id,
        },
      });

      return { comment, commentCount };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (!user) {
        throw new Error("User not found");
      }

      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true }
      });

      if (!comment) {
        throw new Error("Comment not found");
      }

      if (comment.authorId !== user.id) {
        throw new Error("Not authorized");
      }

      await tx.comment.delete({
        where: { id: commentId }
      });

      const commentCount = await tx.comment.count({
        where: { snippetId: params.id }
      });

      return { commentCount };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting comment:", error);
    const message = error instanceof Error ? error.message : "Failed to delete comment";
    return NextResponse.json(
      { error: message },
      { status: 
        message === "Not authorized" ? 403 :
        message === "Comment not found" ? 404 :
        500
      }
    );
  }
} 
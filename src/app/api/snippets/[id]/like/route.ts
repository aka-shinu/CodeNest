import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function POST(
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

    // Handle everything in a transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // First verify the snippet exists
      const snippet = await tx.snippet.findUnique({
        where: { id: params.id },
        select: { id: true }
      });

      if (!snippet) {
        throw new Error("Snippet not found");
      }

      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if like exists
      const existingLike = await tx.like.findUnique({
        where: {
          userId_snippetId: {
            userId: user.id,
            snippetId: params.id,
          },
        },
      });

      if (existingLike) {
        // Unlike - delete the like
        await tx.like.delete({
          where: {
            userId_snippetId: {
              userId: user.id,
              snippetId: params.id,
            },
          },
        });
      } else {
        // Like - create new like
        await tx.like.create({
      data: {
            userId: user.id,
            snippetId: params.id,
          },
        });
      }

      // Get final like count
      const likeCount = await tx.like.count({
        where: {
        snippetId: params.id,
      },
    });

      return {
        liked: !existingLike,
        likeCount,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error handling like:", error);
    const message = error instanceof Error ? error.message : "Failed to handle like";
    return NextResponse.json(
      { error: message },
      { status: 
        message === "User not found" ? 404 :
        message === "Snippet not found" ? 404 :
        500
      }
    );
  }
}

export async function DELETE(
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

    // Get user from database using email
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

    await prisma.like.delete({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId: params.id,
        },
      },
    });

    return NextResponse.json({ liked: false });
  } catch (error) {
    console.error("Error deleting like:", error);
    return NextResponse.json(
      { error: "Failed to delete like" },
      { status: 500 }
    );
  }
} 
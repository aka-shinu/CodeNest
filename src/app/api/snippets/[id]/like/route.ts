import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!snippet) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId: user.id,
        snippetId: snippet.id,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error("Error liking snippet:", error);
    return NextResponse.json(
      { error: "Failed to like snippet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const like = await prisma.like.findFirst({
      where: {
        userId: user.id,
        snippetId: params.id,
      },
    });

    if (!like) {
      return NextResponse.json(
        { error: "Like not found" },
        { status: 404 }
      );
    }

    await prisma.like.delete({
      where: { id: like.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unliking snippet:", error);
    return NextResponse.json(
      { error: "Failed to unlike snippet" },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Verify user has access to workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const scheduledPosts = await prisma.scheduledPost.findMany({
      where: {
        post: { workspaceId },
        ...(status && { status: status as any }),
      },
      include: {
        post: {
          include: {
            creator: {
              select: { id: true, name: true, email: true, image: true },
            },
            campaign: {
              select: { id: true, name: true, color: true },
            },
          },
        },
        socialAccount: {
          select: { id: true, platform: true, accountName: true },
        },
      },
      orderBy: { scheduledFor: "asc" },
    });

    return NextResponse.json(scheduledPosts);
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, socialAccountIds, scheduledFor } = await req.json();

    if (!postId || !socialAccountIds?.length || !scheduledFor) {
      return NextResponse.json(
        { error: "Post ID, social account IDs, and scheduled time are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Verify user has access to workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: post.workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!membership || membership.role === "VIEWER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Create scheduled posts for each social account
    const scheduledPosts = await prisma.$transaction(
      socialAccountIds.map((accountId: string) =>
        prisma.scheduledPost.create({
          data: {
            postId,
            socialAccountId: accountId,
            scheduledFor: new Date(scheduledFor),
          },
          include: {
            socialAccount: {
              select: { id: true, platform: true, accountName: true },
            },
          },
        })
      )
    );

    // Update post status to scheduled
    await prisma.post.update({
      where: { id: postId },
      data: { status: "SCHEDULED" },
    });

    return NextResponse.json(scheduledPosts, { status: 201 });
  } catch (error) {
    console.error("Error scheduling post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

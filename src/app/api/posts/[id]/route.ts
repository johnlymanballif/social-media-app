import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
        campaign: {
          select: { id: true, name: true, color: true },
        },
        platformContents: true,
        versions: {
          orderBy: { version: "desc" },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        scheduledPosts: {
          include: {
            socialAccount: true,
          },
        },
        publishedPosts: {
          include: {
            socialAccount: true,
            analytics: true,
          },
        },
      },
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

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { content, mediaUrls, status, campaignId } = await req.json();

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: "desc" }, take: 1 } },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Verify user has access to workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: existingPost.workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!membership || membership.role === "VIEWER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Create new version if content changed
    const contentChanged = content && content !== existingPost.content;
    const lastVersion = existingPost.versions[0]?.version || 0;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(mediaUrls && { mediaUrls }),
        ...(status && { status }),
        ...(campaignId !== undefined && { campaignId }),
        ...(contentChanged && {
          versions: {
            create: {
              content,
              mediaUrls: mediaUrls || existingPost.mediaUrls,
              version: lastVersion + 1,
            },
          },
        }),
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
        campaign: {
          select: { id: true, name: true, color: true },
        },
        platformContents: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Verify user has access to workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: existingPost.workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!membership || membership.role === "VIEWER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

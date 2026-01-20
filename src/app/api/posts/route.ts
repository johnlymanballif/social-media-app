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
    const campaignId = searchParams.get("campaignId");
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

    const posts = await prisma.post.findMany({
      where: {
        workspaceId,
        ...(campaignId && { campaignId }),
        ...(status && { status: status as any }),
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
        campaign: {
          select: { id: true, name: true, color: true },
        },
        scheduledPosts: {
          include: {
            socialAccount: {
              select: { id: true, platform: true, accountName: true },
            },
          },
        },
        _count: {
          select: { comments: true, publishedPosts: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
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

    const { content, mediaUrls, campaignId, workspaceId } = await req.json();

    if (!content || !workspaceId) {
      return NextResponse.json(
        { error: "Content and workspace ID are required" },
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

    if (!membership || membership.role === "VIEWER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        mediaUrls: mediaUrls || [],
        campaignId,
        workspaceId,
        creatorId: session.user.id,
        versions: {
          create: {
            content,
            mediaUrls: mediaUrls || [],
            version: 1,
          },
        },
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true },
        },
        campaign: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

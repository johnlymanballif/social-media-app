import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Platform } from "@/types";
import { validatePlatformContent } from "@/lib/validators/platform-content";

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
      where: { id: id },
      select: { workspaceId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

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

    const platformContents = await prisma.platformContent.findMany({
      where: { postId: id },
    });

    return NextResponse.json(platformContents);
  } catch (error) {
    console.error("Error fetching platform contents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { platform, content, mediaUrls, excluded } = body;

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    const validPlatforms: Platform[] = ["TWITTER", "INSTAGRAM", "FACEBOOK", "LINKEDIN"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: id },
      select: { workspaceId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

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

    const parsedMediaUrls = mediaUrls ? JSON.stringify(mediaUrls) : "[]";

    const validation = validatePlatformContent(
      platform as Platform,
      content || "",
      mediaUrls || []
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const platformContent = await prisma.platformContent.upsert({
      where: {
        postId_platform: {
          postId: id,
          platform,
        },
      },
      update: {
        content: content || "",
        mediaUrls: parsedMediaUrls,
        excluded: excluded || false,
      },
      create: {
        postId: id,
        platform,
        content: content || "",
        mediaUrls: parsedMediaUrls,
        excluded: excluded || false,
      },
    });

    return NextResponse.json(platformContent);
  } catch (error) {
    console.error("Error updating platform content:", error);
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
    const body = await req.json();
    const { platform, content, mediaUrls, excluded } = body;

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: id },
      select: { workspaceId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

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

    const updateData: Record<string, any> = {};
    if (content !== undefined) updateData.content = content;
    if (mediaUrls !== undefined) updateData.mediaUrls = JSON.stringify(mediaUrls);
    if (excluded !== undefined) updateData.excluded = excluded;

    const platformContent = await prisma.platformContent.update({
      where: {
        postId_platform: {
          postId: id,
          platform,
        },
      },
      data: updateData,
    });

    return NextResponse.json(platformContent);
  } catch (error) {
    console.error("Error patching platform content:", error);
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
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: id },
      select: { workspaceId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

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

    await prisma.platformContent.delete({
      where: {
        postId_platform: {
          postId: id,
          platform,
        },
      },
    });

    return NextResponse.json({ message: "Platform content deleted" });
  } catch (error) {
    console.error("Error deleting platform content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

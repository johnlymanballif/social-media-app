import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSocialClient } from "@/lib/social/mock-client";
import { Platform } from "@/lib/social/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scheduledPostId } = await req.json();

    if (!scheduledPostId) {
      return NextResponse.json(
        { error: "Scheduled post ID is required" },
        { status: 400 }
      );
    }

    const scheduledPost = await prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
      include: {
        post: true,
        socialAccount: true,
      },
    });

    if (!scheduledPost) {
      return NextResponse.json(
        { error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    // Verify user has access to workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: scheduledPost.post.workspaceId,
          userId: session.user.id,
        },
      },
    });

    if (!membership || membership.role === "VIEWER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update status to publishing
    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: { status: "PUBLISHING" },
    });

    // Publish using mock client
    const client = createSocialClient(
      scheduledPost.socialAccount.platform as Platform
    );
    const result = await client.publish(
      scheduledPost.post.content,
      scheduledPost.post.mediaUrls
    );

    if (result.success) {
      // Create published post record
      const publishedPost = await prisma.publishedPost.create({
        data: {
          postId: scheduledPost.postId,
          socialAccountId: scheduledPost.socialAccountId,
          scheduledPostId: scheduledPost.id,
          platformPostId: result.platformPostId,
          platformUrl: result.platformUrl,
        },
      });

      // Update scheduled post status
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      // Update post status
      await prisma.post.update({
        where: { id: scheduledPost.postId },
        data: { status: "PUBLISHED" },
      });

      // Generate initial mock analytics
      const analytics = await client.getAnalytics(result.platformPostId!);
      await prisma.analytics.create({
        data: {
          publishedPostId: publishedPost.id,
          ...analytics,
        },
      });

      return NextResponse.json({
        success: true,
        publishedPost,
        platformUrl: result.platformUrl,
      });
    } else {
      // Update status to failed
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { status: "FAILED" },
      });

      await prisma.post.update({
        where: { id: scheduledPost.postId },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

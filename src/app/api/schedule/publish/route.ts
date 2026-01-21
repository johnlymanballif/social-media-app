import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSocialClient } from "@/lib/social/mock-client";
import { Platform } from "@/lib/social/types";

function parseMediaUrls(mediaUrls: string | string[]): string[] {
  if (Array.isArray(mediaUrls)) return mediaUrls;
  try {
    return JSON.parse(mediaUrls || "[]");
  } catch {
    return [];
  }
}

interface ScheduledPostWithRelations {
  id: string;
  postId: string;
  socialAccountId: string;
  scheduledFor: Date;
  status: string;
  publishedAt: Date | null;
  post: {
    id: string;
    content: string;
    mediaUrls: string;
    workspaceId: string;
    platformContents: Array<{
      id: string;
      postId: string;
      platform: string;
      content: string;
      mediaUrls: string;
      excluded: boolean;
    }>;
  };
  socialAccount: {
    id: string;
    platform: string;
    accountId: string;
    accountName: string;
  };
}

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

    const scheduledPostResult = await prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
      include: {
        post: {
          include: {
            platformContents: true,
          },
        },
        socialAccount: true,
      },
    });

    if (!scheduledPostResult) {
      return NextResponse.json(
        { error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    const scheduledPost = scheduledPostResult as unknown as ScheduledPostWithRelations;

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

    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: { status: "PUBLISHING" },
    });

    const platform = scheduledPost.socialAccount.platform as Platform;
    const platformContent = scheduledPost.post.platformContents.find(
      (pc) => pc.platform === platform
    );

    let content = scheduledPost.post.content;
    let mediaUrls: string[] = parseMediaUrls(scheduledPost.post.mediaUrls);

    if (platformContent) {
      if (platformContent.excluded) {
        await prisma.scheduledPost.update({
          where: { id: scheduledPostId },
          data: { status: "SKIPPED" },
        });
        return NextResponse.json({
          success: true,
          skipped: true,
          message: `Post was excluded from ${platform}`,
        });
      }

      if (platformContent.content) {
        content = platformContent.content;
      }

      const platformMediaUrls = parseMediaUrls(platformContent.mediaUrls);
      if (platformMediaUrls.length > 0) {
        mediaUrls = platformMediaUrls;
      }
    }

    const client = createSocialClient(platform);
    const result = await client.publish(content, mediaUrls);

    if (result.success) {
      const publishedPost = await prisma.publishedPost.create({
        data: {
          postId: scheduledPost.postId,
          socialAccountId: scheduledPost.socialAccountId,
          scheduledPostId: scheduledPost.id,
          platformPostId: result.platformPostId,
          platformUrl: result.platformUrl,
        },
      });

      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      await prisma.post.update({
        where: { id: scheduledPost.postId },
        data: { status: "PUBLISHED" },
      });

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

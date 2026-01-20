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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const platform = searchParams.get("platform");

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

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Get published posts with analytics
    const publishedPosts = await prisma.publishedPost.findMany({
      where: {
        post: { workspaceId },
        ...(Object.keys(dateFilter).length && { publishedAt: dateFilter }),
        ...(platform && { socialAccount: { platform: platform as any } }),
      },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            campaign: { select: { id: true, name: true, color: true } },
          },
        },
        socialAccount: {
          select: { id: true, platform: true, accountName: true },
        },
        analytics: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    // Calculate aggregate stats
    const aggregateStats = await prisma.analytics.aggregate({
      where: {
        publishedPost: {
          post: { workspaceId },
          ...(Object.keys(dateFilter).length && { publishedAt: dateFilter }),
          ...(platform && { socialAccount: { platform: platform as any } }),
        },
      },
      _sum: {
        impressions: true,
        engagements: true,
        likes: true,
        comments: true,
        shares: true,
        clicks: true,
        reach: true,
      },
    });

    // Get stats by platform
    const platformStats = await prisma.publishedPost.groupBy({
      by: ["socialAccountId"],
      where: {
        post: { workspaceId },
        ...(Object.keys(dateFilter).length && { publishedAt: dateFilter }),
      },
      _count: true,
    });

    // Fetch platform details for grouped stats
    const platformDetails = await Promise.all(
      platformStats.map(async (stat) => {
        const account = await prisma.socialAccount.findUnique({
          where: { id: stat.socialAccountId },
          select: { platform: true, accountName: true },
        });

        const analytics = await prisma.analytics.aggregate({
          where: {
            publishedPost: { socialAccountId: stat.socialAccountId },
          },
          _sum: {
            impressions: true,
            engagements: true,
            likes: true,
          },
        });

        return {
          ...stat,
          platform: account?.platform,
          accountName: account?.accountName,
          totalImpressions: analytics._sum.impressions || 0,
          totalEngagements: analytics._sum.engagements || 0,
          totalLikes: analytics._sum.likes || 0,
        };
      })
    );

    return NextResponse.json({
      posts: publishedPosts,
      aggregate: {
        totalImpressions: aggregateStats._sum.impressions || 0,
        totalEngagements: aggregateStats._sum.engagements || 0,
        totalLikes: aggregateStats._sum.likes || 0,
        totalComments: aggregateStats._sum.comments || 0,
        totalShares: aggregateStats._sum.shares || 0,
        totalClicks: aggregateStats._sum.clicks || 0,
        totalReach: aggregateStats._sum.reach || 0,
      },
      byPlatform: platformDetails,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

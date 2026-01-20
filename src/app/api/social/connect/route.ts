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

    const { platform, authCode, workspaceId } = await req.json();

    if (!platform || !authCode || !workspaceId) {
      return NextResponse.json(
        { error: "Platform, auth code, and workspace ID are required" },
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

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can connect social accounts" },
        { status: 403 }
      );
    }

    // Connect using mock client
    const client = createSocialClient(platform as Platform);
    const accountData = await client.connect(authCode);

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        platform: platform as Platform,
        accountId: accountData.accountId,
        workspaceId,
      },
    });

    if (existingAccount) {
      // Update existing account
      const updated = await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: accountData.accessToken,
          refreshToken: accountData.refreshToken,
          expiresAt: accountData.expiresAt,
        },
      });
      return NextResponse.json(updated);
    }

    // Create new account
    const socialAccount = await prisma.socialAccount.create({
      data: {
        platform: platform as Platform,
        accountId: accountData.accountId,
        accountName: accountData.accountName,
        accessToken: accountData.accessToken,
        refreshToken: accountData.refreshToken,
        expiresAt: accountData.expiresAt,
        workspaceId,
      },
    });

    return NextResponse.json(socialAccount, { status: 201 });
  } catch (error) {
    console.error("Error connecting social account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

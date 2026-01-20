import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create a default workspace for the user
    const workspaceName = name ? `${name}'s Workspace` : "My Workspace";
    let slug = slugify(workspaceName);

    // Ensure unique slug
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug },
    });
    if (existingWorkspace) {
      slug = `${slug}-${Date.now()}`;
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        slug,
        creatorId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
        workspaceId: workspace.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

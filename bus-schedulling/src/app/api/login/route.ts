import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable, userRolesTable, rolesTable } from "@/db/schema";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log(`🔐 Login attempt for: ${email}`);

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email with role information
    const userWithRole = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        password: usersTable.password,
        roleName: rolesTable.name,
        roleId: rolesTable.id,
      })
      .from(usersTable)
      .leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.user_id))
      .leftJoin(rolesTable, eq(userRolesTable.role_id, rolesTable.id))
      .where(eq(usersTable.email, email))
      .limit(1);

    const user = userWithRole[0];

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log(`❌ Password mismatch for: ${email}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with role information
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.roleName || "viewer", // Default to viewer if no role assigned
        roleId: user.roleId,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    console.log(
      `✅ Login successful for: ${email} with role: ${user.roleName}`
    );

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleName || "viewer",
      },
    });

    // Set cookie with more permissive settings for development
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔓 Logout request received");

    // Create response
    const response = NextResponse.json({
      message: "Logout successful",
    });

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    console.log("✅ Logout successful - token cleared");

    return response;
  } catch (error) {
    console.error("❌ Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
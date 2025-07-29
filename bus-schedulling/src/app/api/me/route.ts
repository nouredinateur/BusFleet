import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt-web";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await verifyJWT(
      token.value,
      process.env.JWT_SECRET || "secretkey"
    );

    return NextResponse.json({
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

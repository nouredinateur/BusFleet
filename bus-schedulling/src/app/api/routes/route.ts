import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { routesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET() {
  try {
    const routes = await db.select().from(routesTable);
    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination, estimated_duration_minutes } = body;

    if (!origin || !destination || !estimated_duration_minutes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [route] = await db
      .insert(routesTable)
      .values({ origin, destination, estimated_duration_minutes })
      .returning();

    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create route" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, origin, destination, estimated_duration_minutes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 }
      );
    }

    const [route] = await db
      .update(routesTable)
      .set({ origin, destination, estimated_duration_minutes })
      .where(eq(routesTable.id, id))
      .returning();

    if (!route) {
      return NextResponse.json(
        { error: "Route not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(route);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update route" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 }
      );
    }

    await db.delete(routesTable).where(eq(routesTable.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete route" },
      { status: 500 }
    );
  }
}
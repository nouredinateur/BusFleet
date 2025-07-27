import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { busesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET() {
  try {
    const buses = await db.select().from(busesTable);
    return NextResponse.json(buses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch buses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plate_number, capacity } = body;

    if (!plate_number || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [bus] = await db
      .insert(busesTable)
      .values({ plate_number, capacity })
      .returning();

    return NextResponse.json(bus, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create bus" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, plate_number, capacity } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Bus ID is required" },
        { status: 400 }
      );
    }

    const [bus] = await db
      .update(busesTable)
      .set({ plate_number, capacity })
      .where(eq(busesTable.id, id))
      .returning();

    if (!bus) {
      return NextResponse.json(
        { error: "Bus not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bus);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update bus" },
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
        { error: "Bus ID is required" },
        { status: 400 }
      );
    }

    await db.delete(busesTable).where(eq(busesTable.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete bus" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { driversTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET() {
  try {
    const drivers = await db.select().from(driversTable);
    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, license_number, available } = body;

    if (!name || !license_number || available === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [driver] = await db
      .insert(driversTable)
      .values({ name, license_number, available })
      .returning();

    return NextResponse.json(driver, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create driver" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, license_number, available } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    const [driver] = await db
      .update(driversTable)
      .set({ name, license_number, available })
      .where(eq(driversTable.id, id))
      .returning();

    if (!driver) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(driver);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update driver" },
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
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    await db.delete(driversTable).where(eq(driversTable.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete driver" },
      { status: 500 }
    );
  }
}
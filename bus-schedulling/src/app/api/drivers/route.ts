import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { driversTable, shiftsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkPermission, createUnauthorizedResponse } from "@/lib/permissions";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET(request: NextRequest) {
  // Check view permission
  const { authorized, error } = await checkPermission(request, 'canView');
  if (!authorized) {
    return createUnauthorizedResponse(error || "Unauthorized");
  }

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
  // Check create permission
  const { authorized, error } = await checkPermission(request, 'canCreate');
  if (!authorized) {
    return createUnauthorizedResponse(error || "Unauthorized");
  }

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
  // Check edit permission
  const { authorized, error } = await checkPermission(request, 'canEdit');
  if (!authorized) {
    return createUnauthorizedResponse(error || "Unauthorized");
  }

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
  // Check delete permission
  const { authorized, error, user } = await checkPermission(request, 'canDelete');
  if (!authorized) {
    return createUnauthorizedResponse(error || "Unauthorized");
  }

  // Additional check: dispatchers cannot delete users or buses
  if (user.role === 'dispatcher') {
    return createUnauthorizedResponse("Dispatchers cannot delete drivers");
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    const driverId = parseInt(id);

    // Use a transaction to ensure both operations succeed or both fail
    await db.transaction(async (tx) => {
      // First, delete all shifts associated with this driver
      await tx.delete(shiftsTable).where(eq(shiftsTable.driver_id, driverId));
      
      // Then delete the driver
      await tx.delete(driversTable).where(eq(driversTable.id, driverId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("err", error);
    return NextResponse.json(
      { error: "Failed to delete driver" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { shiftsTable, driversTable, busesTable, routesTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export async function GET() {
  try {
    const shifts = await db
      .select({
        id: shiftsTable.id,
        driver_id: shiftsTable.driver_id,
        bus_id: shiftsTable.bus_id,
        route_id: shiftsTable.route_id,
        shift_date: shiftsTable.shift_date,
        shift_time: shiftsTable.shift_time,
        driver: {
          id: driversTable.id,
          name: driversTable.name,
          license_number: driversTable.license_number,
          available: driversTable.available,
        },
        bus: {
          id: busesTable.id,
          plate_number: busesTable.plate_number,
          capacity: busesTable.capacity,
        },
        route: {
          id: routesTable.id,
          origin: routesTable.origin,
          destination: routesTable.destination,
          estimated_duration_minutes: routesTable.estimated_duration_minutes,
        },
      })
      .from(shiftsTable)
      .leftJoin(driversTable, eq(shiftsTable.driver_id, driversTable.id))
      .leftJoin(busesTable, eq(shiftsTable.bus_id, busesTable.id))
      .leftJoin(routesTable, eq(shiftsTable.route_id, routesTable.id));

    return NextResponse.json(shifts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shifts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driver_id, bus_id, route_id, shift_date, shift_time } = body;

    if (!driver_id || !bus_id || !route_id || !shift_date || !shift_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts
    const existingShift = await db
      .select()
      .from(shiftsTable)
      .where(
        and(
          eq(shiftsTable.driver_id, driver_id),
          eq(shiftsTable.shift_date, shift_date),
          eq(shiftsTable.shift_time, shift_time)
        )
      );

    if (existingShift.length > 0) {
      return NextResponse.json(
        { error: "Driver already has a shift at this time" },
        { status: 400 }
      );
    }

    const [shift] = await db
      .insert(shiftsTable)
      .values({ driver_id, bus_id, route_id, shift_date, shift_time })
      .returning();

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create shift" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, driver_id, bus_id, route_id, shift_date, shift_time } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Shift ID is required" },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts (excluding current shift)
    const existingShift = await db
      .select()
      .from(shiftsTable)
      .where(
        and(
          eq(shiftsTable.driver_id, driver_id),
          eq(shiftsTable.shift_date, shift_date),
          eq(shiftsTable.shift_time, shift_time)
        )
      );

    const conflictingShift = existingShift.find(s => s.id !== id);
    if (conflictingShift) {
      return NextResponse.json(
        { error: "Driver already has a shift at this time" },
        { status: 400 }
      );
    }

    const [shift] = await db
      .update(shiftsTable)
      .set({ driver_id, bus_id, route_id, shift_date, shift_time })
      .where(eq(shiftsTable.id, id))
      .returning();

    if (!shift) {
      return NextResponse.json(
        { error: "Shift not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(shift);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update shift" },
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
        { error: "Shift ID is required" },
        { status: 400 }
      );
    }

    await db.delete(shiftsTable).where(eq(shiftsTable.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete shift" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  shiftsTable,
  driversTable,
  busesTable,
  routesTable,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Helper function to check if two time ranges overlap
function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}

// Helper function to add minutes to a time string (HH:MM:SS format)
function addMinutesToTime(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins
    .toString()
    .padStart(2, "0")}`;
}

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

    // Get the route duration for the new shift
    const [newShiftRoute] = await db
      .select({
        estimated_duration_minutes: routesTable.estimated_duration_minutes,
      })
      .from(routesTable)
      .where(eq(routesTable.id, route_id));

    if (!newShiftRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 400 });
    }

    // Calculate end time for the new shift
    const newShiftEndTime = addMinutesToTime(
      shift_time,
      newShiftRoute.estimated_duration_minutes
    );

    // Check for scheduling conflicts with overlapping shifts
    const existingShifts = await db
      .select({
        id: shiftsTable.id,
        shift_time: shiftsTable.shift_time,
        estimated_duration_minutes: routesTable.estimated_duration_minutes,
      })
      .from(shiftsTable)
      .leftJoin(routesTable, eq(shiftsTable.route_id, routesTable.id))
      .where(
        and(
          eq(shiftsTable.driver_id, driver_id),
          eq(shiftsTable.shift_date, shift_date)
        )
      );

    // Check for overlaps
    for (const existingShift of existingShifts) {
      const existingEndTime = addMinutesToTime(
        existingShift.shift_time,
        existingShift.estimated_duration_minutes || 0
      );

      if (
        timeRangesOverlap(
          shift_time,
          newShiftEndTime,
          existingShift.shift_time,
          existingEndTime
        )
      ) {
        return NextResponse.json(
          {
            error: `Driver already has an overlapping shift from ${existingShift.shift_time} to ${existingEndTime}. New shift would run from ${shift_time} to ${newShiftEndTime}.`,
          },
          { status: 400 }
        );
      }
    }

    const [shift] = await db
      .insert(shiftsTable)
      .values({ driver_id, bus_id, route_id, shift_date, shift_time })
      .returning();

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.log("error ====>", error);
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

    // Get the route duration for the updated shift
    const [updatedShiftRoute] = await db
      .select({
        estimated_duration_minutes: routesTable.estimated_duration_minutes,
      })
      .from(routesTable)
      .where(eq(routesTable.id, route_id));

    if (!updatedShiftRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 400 });
    }

    // Calculate end time for the updated shift
    const updatedShiftEndTime = addMinutesToTime(
      shift_time,
      updatedShiftRoute.estimated_duration_minutes
    );

    // Check for scheduling conflicts (excluding current shift)
    const existingShifts = await db
      .select({
        id: shiftsTable.id,
        shift_time: shiftsTable.shift_time,
        estimated_duration_minutes: routesTable.estimated_duration_minutes,
      })
      .from(shiftsTable)
      .leftJoin(routesTable, eq(shiftsTable.route_id, routesTable.id))
      .where(
        and(
          eq(shiftsTable.driver_id, driver_id),
          eq(shiftsTable.shift_date, shift_date)
        )
      );

    // Check for overlaps (excluding the current shift being updated)
    for (const existingShift of existingShifts) {
      if (existingShift.id === id) continue; // Skip the current shift being updated

      const existingEndTime = addMinutesToTime(
        existingShift.shift_time,
        existingShift.estimated_duration_minutes || 0
      );

      if (
        timeRangesOverlap(
          shift_time,
          updatedShiftEndTime,
          existingShift.shift_time,
          existingEndTime
        )
      ) {
        return NextResponse.json(
          {
            error: `Driver already has an overlapping shift from ${existingShift.shift_time} to ${existingEndTime}. Updated shift would run from ${shift_time} to ${updatedShiftEndTime}.`,
          },
          { status: 400 }
        );
      }
    }

    const [shift] = await db
      .update(shiftsTable)
      .set({ driver_id, bus_id, route_id, shift_date, shift_time })
      .where(eq(shiftsTable.id, id))
      .returning();

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
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

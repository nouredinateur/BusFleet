import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  // Seed roles
  const roles = await db
    .insert(schema.rolesTable)
    .values([{ name: "admin" }, { name: "dispatcher" }, { name: "viewer" }])
    .returning();

  // Seed users
  const users = await db
    .insert(schema.usersTable)
    .values([
      {
        name: "Alice",
        age: 30,
        email: "alice@example.com",
        password: "hashedpassword1",
      },
      {
        name: "Bob",
        age: 28,
        email: "bob@example.com",
        password: "hashedpassword2",
      },
    ])
    .returning();

  // Seed user_roles
  await db.insert(schema.userRolesTable).values([
    { user_id: users[0].id, role_id: roles[0].id }, // Alice is admin
    { user_id: users[1].id, role_id: roles[1].id }, // Bob is dispatcher
  ]);

  // Seed drivers
  const drivers = await db
    .insert(schema.driversTable)
    .values([
      { name: "Driver One", license_number: "LIC123", available: true },
      { name: "Driver Two", license_number: "LIC456", available: false },
    ])
    .returning();

  // Seed buses
  const buses = await db
    .insert(schema.busesTable)
    .values([
      { plate_number: "BUS001", capacity: 40 },
      { plate_number: "BUS002", capacity: 30 },
    ])
    .returning();

  // Seed routes
  const routes = await db
    .insert(schema.routesTable)
    .values([
      { origin: "A", destination: "B", estimated_duration_minutes: 60 },
      { origin: "B", destination: "C", estimated_duration_minutes: 45 },
    ])
    .returning();

  // Seed shifts
  await db.insert(schema.shiftsTable).values([
    {
      driver_id: drivers[0].id,
      bus_id: buses[0].id,
      route_id: routes[0].id,
      shift_date: "2024-06-01",
      shift_time: "08:00:00",
    },
    {
      driver_id: drivers[1].id,
      bus_id: buses[1].id,
      route_id: routes[1].id,
      shift_date: "2024-06-02",
      shift_time: "09:00:00",
    },
  ]);

  await pool.end();
}

main();

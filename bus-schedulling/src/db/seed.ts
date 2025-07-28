import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Helper functions for generating realistic data
function generateRandomName(): string {
  const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Helen", "Mark", "Sandra", "Donald", "Donna",
    "Steven", "Carol", "Paul", "Ruth", "Andrew", "Sharon", "Joshua", "Michelle",
    "Kenneth", "Laura", "Kevin", "Sarah", "Brian", "Kimberly", "George", "Deborah",
    "Timothy", "Dorothy", "Ronald", "Lisa", "Jason", "Nancy", "Edward", "Karen",
    "Jeffrey", "Betty", "Ryan", "Helen", "Jacob", "Sandra", "Gary", "Donna",
    "Nicholas", "Carol", "Eric", "Ruth", "Jonathan", "Sharon", "Stephen", "Michelle",
    "Larry", "Laura", "Justin", "Sarah", "Scott", "Kimberly", "Brandon", "Deborah",
    "Benjamin", "Dorothy", "Samuel", "Amy", "Gregory", "Angela", "Alexander", "Ashley",
    "Patrick", "Brenda", "Frank", "Emma", "Raymond", "Olivia", "Jack", "Cynthia"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
    "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker"
  ];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateEmail(name: string): string {
  const domain = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "company.com"][Math.floor(Math.random() * 5)];
  return `${name.toLowerCase().replace(" ", ".")}${Math.floor(Math.random() * 1000)}@${domain}`;
}

function generateLicenseNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
}

function generatePlateNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}-${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;
}

function generateRandomDate(): string {
  const start = new Date(2024, 0, 1);
  const end = new Date(2024, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateRandomTime(): string {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = (Math.floor(Math.random() * 4) * 15).toString().padStart(2, '0'); // 15-minute intervals
  return `${hours}:${minutes}:00`;
}

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data (optional - uncomment if needed)
  await db.delete(schema.shiftsTable);
  await db.delete(schema.userRolesTable);
  await db.delete(schema.driversTable);
  await db.delete(schema.busesTable);
  await db.delete(schema.routesTable);
  await db.delete(schema.usersTable);
  await db.delete(schema.rolesTable);

  // Seed roles
  console.log("Seeding roles...");
  const roles = await db
    .insert(schema.rolesTable)
    .values([
      { name: "admin" },
      { name: "dispatcher" },
      { name: "viewer" },
      { name: "supervisor" },
      { name: "maintenance" }
    ])
    .returning();

  // Seed 100 users
  console.log("Seeding users...");
  const userValues = [];
  for (let i = 0; i < 100; i++) {
    const name = generateRandomName();
    userValues.push({
      name,
      age: Math.floor(Math.random() * 40) + 25, // Age between 25-65
      email: generateEmail(name),
      password: `hashedpassword${i + 1}`,
    });
  }
  
  const users = await db
    .insert(schema.usersTable)
    .values(userValues)
    .returning();

  // Seed user_roles (assign random roles to users)
  console.log("Seeding user roles...");
  const userRoleValues = [];
  for (const user of users) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    userRoleValues.push({
      user_id: user.id,
      role_id: randomRole.id,
    });
  }
  
  await db.insert(schema.userRolesTable).values(userRoleValues);

  // Seed 100 drivers
  console.log("Seeding drivers...");
  const driverValues = [];
  for (let i = 0; i < 100; i++) {
    driverValues.push({
      name: generateRandomName(),
      license_number: generateLicenseNumber(),
      available: Math.random() > 0.3, // 70% available
    });
  }
  
  const drivers = await db
    .insert(schema.driversTable)
    .values(driverValues)
    .returning();

  // Seed 100 buses
  console.log("Seeding buses...");
  const busValues = [];
  const capacities = [25, 30, 35, 40, 45, 50, 55, 60]; // Different bus sizes
  
  for (let i = 0; i < 100; i++) {
    busValues.push({
      plate_number: generatePlateNumber(),
      capacity: capacities[Math.floor(Math.random() * capacities.length)],
    });
  }
  
  const buses = await db
    .insert(schema.busesTable)
    .values(busValues)
    .returning();

  // Seed 100 routes
  console.log("Seeding routes...");
  const cities = [
    "Downtown", "Airport", "University", "Mall", "Hospital", "Stadium", "Beach", "Park",
    "Station", "Harbor", "Museum", "Library", "School", "Market", "Plaza", "Center",
    "Heights", "Valley", "Hills", "Gardens", "Square", "Avenue", "Boulevard", "Street",
    "North End", "South Side", "East District", "West Quarter", "Uptown", "Midtown",
    "Riverside", "Lakeside", "Hillside", "Seaside", "Parkside", "Woodland", "Meadow", "Grove",
    "Industrial Zone", "Business District", "Residential Area", "Shopping Center", "Medical Center",
    "Tech Park", "Financial District", "Arts Quarter", "Historic District", "Waterfront"
  ];
  
  const routeValues = [];
  for (let i = 0; i < 100; i++) {
    const origin = cities[Math.floor(Math.random() * cities.length)];
    let destination = cities[Math.floor(Math.random() * cities.length)];
    
    // Ensure origin and destination are different
    while (destination === origin) {
      destination = cities[Math.floor(Math.random() * cities.length)];
    }
    
    routeValues.push({
      origin,
      destination,
      estimated_duration_minutes: Math.floor(Math.random() * 90) + 15, // 15-105 minutes
    });
  }
  
  const routes = await db
    .insert(schema.routesTable)
    .values(routeValues)
    .returning();

  // Seed 100 shifts
  console.log("Seeding shifts...");
  const shiftValues = [];
  
  for (let i = 0; i < 100; i++) {
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const randomBus = buses[Math.floor(Math.random() * buses.length)];
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];
    
    shiftValues.push({
      driver_id: randomDriver.id,
      bus_id: randomBus.id,
      route_id: randomRoute.id,
      shift_date: generateRandomDate(),
      shift_time: generateRandomTime(),
    });
  }
  
  await db.insert(schema.shiftsTable).values(shiftValues);

  console.log("Database seeding completed successfully!");
  console.log(`Seeded:
    - ${roles.length} roles
    - ${users.length} users
    - ${users.length} user role assignments
    - ${drivers.length} drivers
    - ${buses.length} buses
    - ${routes.length} routes
    - ${shiftValues.length} shifts`);

  await pool.end();
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});

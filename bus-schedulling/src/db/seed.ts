import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import bcrypt from "bcrypt";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Helper functions for generating realistic data
function generateRandomName(): string {
  const firstNames = [
    "Ahmed",
    "Fatima",
    "Mohammed",
    "Aicha",
    "Youssef",
    "Khadija",
    "Omar",
    "Zineb",
    "Hassan",
    "Amina",
    "Khalid",
    "Nadia",
    "Abdelaziz",
    "Laila",
    "Rachid",
    "Samira",
    "Mustapha",
    "Houda",
    "Said",
    "Malika",
    "Abderrahim",
    "Souad",
    "Brahim",
    "Rajae",
    "Karim",
    "Nezha",
    "Driss",
    "Latifa",
    "Hamid",
    "Nawal",
    "Abdellah",
    "Karima",
    "Jamal",
    "Hafida",
    "Aziz",
    "Zahra",
    "Noureddine",
    "Siham",
    "Larbi",
    "Jamila",
    "Redouane",
    "Ghizlane",
    "Tarik",
    "Meriem",
    "Amine",
    "Salma",
    "Hicham",
    "Imane",
    "Samir",
    "Widad",
    "Fouad",
    "Hayat",
    "Adil",
    "Btissam",
    "Mehdi",
    "Loubna",
    "Othmane",
    "Sanae",
    "Ismail",
    "Hanane",
    "Zakaria",
    "Ilham",
    "Yassine",
    "Chaimae",
    "Soufiane",
    "Dounia",
    "Ayoub",
    "Rim",
    "Bilal",
    "Safae",
    "Anass",
    "Ikram",
    "Hamza",
    "Amal",
    "Oussama",
    "Leila",
    "Walid",
    "Meryem",
    "Anas",
    "Fadwa",
    "Badr",
    "Asma",
    "Marouane",
    "Jihane",
    "Ilyass",
    "Wafae",
    "Nabil",
    "Mouna",
    "Saad",
    "Kenza",
    "Haitham",
    "Yasmine",
    "Adnane",
    "Chaima",
    "Mourad",
    "Salwa",
    "Taha",
    "Oumaima",
    "Sami",
    "Hajar",
    "Riad",
    "Soukaina",
    "Anouar",
    "Zineb",
  ];

  const lastNames = [
    "Alami",
    "Benali",
    "Cherkaoui",
    "Drissi",
    "El Fassi",
    "Filali",
    "Ghazi",
    "Hajji",
    "Idrissi",
    "Jebari",
    "Kettani",
    "Lahlou",
    "Mansouri",
    "Naciri",
    "Ouali",
    "Qadiri",
    "Rami",
    "Sabri",
    "Tazi",
    "Usmani",
    "Wahbi",
    "Yousfi",
    "Ziani",
    "Amrani",
    "Benjelloun",
    "Chraibi",
    "Douiri",
    "El Alaoui",
    "Fassi Fihri",
    "Guessous",
    "Haddad",
    "Ismaili",
    "Jaidi",
    "Kabbaj",
    "Lamrani",
    "Mekouar",
    "Nejjar",
    "Ouazzani",
    "Pascon",
    "Rachidi",
    "Sefrioui",
    "Tounsi",
    "Bennani",
    "Cherif",
    "Dahbi",
    "El Mokri",
    "Fassi",
    "Guerraoui",
    "Hariri",
    "Iraki",
    "Jazouli",
    "Kadiri",
    "Lazrak",
    "Mernissi",
    "Naji",
    "Oufkir",
    "Qotbi",
    "Riffi",
    "Skalli",
    "Tahiri",
    "Benkirane",
    "Chafik",
    "Darif",
    "El Otmani",
    "Fettouhi",
    "Ghallab",
    "Himmi",
    "Ibrahimi",
    "Jettou",
    "Karam",
    "Laenser",
    "Mezouar",
    "Nabili",
    "Omari",
    "Benabdellah",
    "Chabat",
    "Daoudi",
    "El Yazghi",
    "Fathallah",
    "Ghali",
    "Hilali",
    "Ibrahimi",
    "Jemli",
    "Karroum",
    "Lahjouji",
    "Meziane",
    "Nasser",
    "Ouahbi",
  ];

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`;
}

function generateEmail(name: string): string {
  const domain = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "maroc.ma",
  ][Math.floor(Math.random() * 5)];
  return `${name.toLowerCase().replace(" ", ".")}${Math.floor(
    Math.random() * 1000
  )}@${domain}`;
}

function generateLicenseNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  return `${letters[Math.floor(Math.random() * letters.length)]}${
    letters[Math.floor(Math.random() * letters.length)]
  }${numbers[Math.floor(Math.random() * numbers.length)]}${
    numbers[Math.floor(Math.random() * numbers.length)]
  }${numbers[Math.floor(Math.random() * numbers.length)]}${
    numbers[Math.floor(Math.random() * numbers.length)]
  }`;
}

function generatePlateNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  return `${letters[Math.floor(Math.random() * letters.length)]}${
    letters[Math.floor(Math.random() * letters.length)]
  }${letters[Math.floor(Math.random() * letters.length)]}-${
    numbers[Math.floor(Math.random() * numbers.length)]
  }${numbers[Math.floor(Math.random() * numbers.length)]}${
    numbers[Math.floor(Math.random() * numbers.length)]
  }`;
}

function generateRandomDate(): string {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 365); // One year from today

  const date = new Date(
    today.getTime() + Math.random() * (futureDate.getTime() - today.getTime())
  );
  return date.toISOString().split("T")[0];
}

function generateRandomTime(): string {
  const hours = Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.floor(Math.random() * 4) * 15)
    .toString()
    .padStart(2, "0"); // 15-minute intervals
  return `${hours}:${minutes}:00`;
}

async function main() {
  console.log("Starting database seeding...");

  // await db.delete(schema.shiftsTable);
  // await db.delete(schema.userRolesTable);
  // await db.delete(schema.driversTable);
  // await db.delete(schema.busesTable);
  // await db.delete(schema.routesTable);
  // await db.delete(schema.usersTable);
  // await db.delete(schema.rolesTable);

  // Seed roles
  console.log("Seeding roles...");
  const roles = await db
    .insert(schema.rolesTable)
    .values([
      { name: "admin" },
      { name: "dispatcher" },
      { name: "viewer" },
      { name: "supervisor" },
      { name: "maintenance" },
    ])
    .returning();

  // Create specific test users with known credentials
  console.log("Creating test users with hashed passwords...");
  const saltRounds = 10;

  const testUsers = [
    {
      name: "Ahmed Alami",
      age: 35,
      email: "admin@test.com",
      password: await bcrypt.hash("admin123", saltRounds),
      role: "admin",
    },
    {
      name: "Fatima Benali",
      age: 30,
      email: "dispatcher@test.com",
      password: await bcrypt.hash("dispatcher123", saltRounds),
      role: "dispatcher",
    },
    {
      name: "Mohammed Cherkaoui",
      age: 28,
      email: "viewer@test.com",
      password: await bcrypt.hash("viewer123", saltRounds),
      role: "viewer",
    },
  ];

  // Seed additional random users
  console.log("Seeding additional users...");
  const userValues = [];

  // Add test users first
  for (const testUser of testUsers) {
    userValues.push({
      name: testUser.name,
      age: testUser.age,
      email: testUser.email,
      password: testUser.password,
    });
  }

  // Add random users
  for (let i = 0; i < 97; i++) {
    // 97 + 3 test users = 100 total
    const name = generateRandomName();
    const plainPassword = `password${i + 1}`;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    userValues.push({
      name,
      age: Math.floor(Math.random() * 40) + 25,
      email: generateEmail(name),
      password: hashedPassword,
    });
  }

  const users = await db
    .insert(schema.usersTable)
    .values(userValues)
    .returning();

  // Seed user_roles with guaranteed test users
  console.log("Seeding user roles...");
  const userRoleValues = [];

  // Assign specific roles to test users (first 3 users)
  const requiredRoles = ["admin", "dispatcher", "viewer"];
  for (let i = 0; i < requiredRoles.length; i++) {
    const role = roles.find((r) => r.name === requiredRoles[i]);
    if (role) {
      userRoleValues.push({
        user_id: users[i].id,
        role_id: role.id,
      });
    }
  }

  // Assign random roles to remaining users
  for (let i = 3; i < users.length; i++) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    userRoleValues.push({
      user_id: users[i].id,
      role_id: randomRole.id,
    });
  }

  await db.insert(schema.userRolesTable).values(userRoleValues);

  // Log test user credentials
  console.log("\n🔑 Test Users Created:");
  console.log("====================");
  testUsers.forEach((user, index) => {
    const plainPassword =
      user.role === "admin"
        ? "admin123"
        : user.role === "dispatcher"
        ? "dispatcher123"
        : "viewer123";
    console.log(
      `${user.role.toUpperCase()}: ${user.email} | Password: ${plainPassword}`
    );
  });
  console.log("====================\n");

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

  // Seed 100 routes with Moroccan cities
  console.log("Seeding routes...");
  const cities = [
    "Casablanca",
    "Rabat",
    "Fès",
    "Marrakech",
    "Agadir",
    "Tanger",
    "Meknès",
    "Oujda",
    "Kenitra",
    "Tétouan",
    "Safi",
    "Mohammedia",
    "Khouribga",
    "El Jadida",
    "Béni Mellal",
    "Nador",
    "Taza",
    "Settat",
    "Larache",
    "Ksar El Kebir",
    "Khemisset",
    "Guelmim",
    "Berrechid",
    "Wazzane",
    "Ouarzazate",
    "Tiznit",
    "Taroudant",
    "Sidi Kacem",
    "Khenifra",
    "Errachidia",
    "Ouezzane",
    "Sidi Slimane",
    "Youssoufia",
    "Fnideq",
    "Martil",
    "Asilah",
    "Chefchaouen",
    "Al Hoceima",
    "Ifrane",
    "Azrou",
    "Midelt",
    "Zagora",
    "Tinghir",
    "Boujdour",
    "Laâyoune",
    "Dakhla",
    "Smara",
    "Tan-Tan",
    "Sidi Ifni",
    "Essaouira",
    "Aéroport Mohammed V",
    "Gare Casa-Port",
    "Gare Rabat-Ville",
    "Université Al Akhawayn",
    "Université Hassan II",
    "CHU Ibn Rochd",
    "Hôpital Militaire",
    "Stade Mohammed V",
    "Marina Bouregreg",
    "Corniche Casablanca",
    "Médina de Fès",
    "Place Jemaa el-Fna",
    "Kasbah des Oudayas",
    "Hassan Tower",
    "Majorelle Garden",
    "Bahia Palace",
    "Saadian Tombs",
    "Volubilis",
    "Chellah",
    "Ait Benhaddou",
    "Todra Gorge",
    "Dades Valley",
    "Merzouga",
    "Imlil",
    "Taghazout",
    "Legzira Beach",
    "Paradise Valley",
    "Ouzoud Falls",
    "Akchour Falls",
    "Cap Spartel",
    "Hercules Caves",
    "Lalla Takerkoust",
    "Bin el Ouidane",
    "Sidi Bouzid",
    "Moulay Bousselham",
    "Plage des Nations",
    "Mehdia Plage",
    "Skhirat Plage",
    "Bouznika Bay",
    "Dar Bouazza",
    "Tamaris",
    "Cabo Negro",
    "Marina Smir",
    "M'diq",
    "Restinga Smir",
    "Saïdia",
    "Ras El Ma",
    "Oued Laou",
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

  // Seed 100 shifts with future dates
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

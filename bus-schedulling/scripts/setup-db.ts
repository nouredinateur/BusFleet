import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { execSync } from "child_process";
import "dotenv/config";

async function setupDatabase() {
  console.log("🚀 Setting up database...");
  
  try {
    // Run migrations
    console.log("📦 Running migrations...");
    execSync("pnpm db:migrate", { stdio: "inherit" });
    
    // Check if we should seed
    const shouldSeed = process.argv.includes("--seed");
    
    if (shouldSeed) {
      console.log("🌱 Seeding database...");
      execSync("pnpm db:seed", { stdio: "inherit" });
    }
    
    // Verify setup
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);
    
    const result = await pool.query("SELECT COUNT(*) FROM users");
    console.log(`✅ Database setup complete! Users count: ${result.rows[0].count}`);
    
    await pool.end();
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
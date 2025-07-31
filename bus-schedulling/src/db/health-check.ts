import { Pool } from "pg";
import "dotenv/config";

async function healthCheck() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 1,
  });

  try {
    console.log("🔍 Testing database connection...");
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✅ Database connected successfully at ${result.rows[0].current_time}`);
    client.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

healthCheck();

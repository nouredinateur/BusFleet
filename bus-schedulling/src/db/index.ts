import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

// Optional: Health check function
export async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
import { config } from "dotenv";
config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: "postgresql",
};

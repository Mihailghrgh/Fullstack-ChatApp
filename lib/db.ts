import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/schema/schema";

const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = globalForDrizzle.db ?? drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") globalForDrizzle.db = db;

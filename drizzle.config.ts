import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
});

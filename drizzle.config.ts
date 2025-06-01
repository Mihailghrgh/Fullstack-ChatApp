import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/schema.ts",
  out: "./drizzle",
  driver: "d1-http",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
});

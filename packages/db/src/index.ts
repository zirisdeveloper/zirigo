import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/zirigo";

// For serverless or connection pool
const client = postgres(connectionString, { max: 10 });
export const db = drizzle(client, { schema });

export * from "./schema/index.js";
export type Database = typeof db;

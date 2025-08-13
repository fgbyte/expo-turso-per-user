//tools
import { useAuth } from "@clerk/clerk-expo";
import md5 from "md5";
import { router } from "expo-router";
//clients
import { drizzle } from "drizzle-orm/libsql/web";
import { createClient as createLibsqlClient } from "@libsql/client/web";
import { createClient as createTursoClient } from "@tursodatabase/api";

import * as schema from "./schema";


const turso = createTursoClient({
  token: process.env.TURSO_API_TOKEN!,
  org: process.env.TURSO_ORG!,
});

export function getDatabaseName(): string | null {
  const userId = useAuth().userId;
  return userId ? md5(userId) : null;
}

export async function checkDatabaseExists(): Promise<boolean> {
  const dbName = getDatabaseName();

  if (!dbName) return false;

  try {
    await turso.databases.get(dbName);
    return true;
  } catch (error) {
    console.error("Error checking database existence:", error);
    return false;
  }
}

function getDatabaseUrl(dbName: string | null): string | null {
  return dbName ? `${dbName}-${process.env.TURSO_ORG}.turso.io` : null;
}

function getLibsqlUrl(): string | null {
  const dbName = getDatabaseName();
  const url = getDatabaseUrl(dbName);
  console.log({ url });
  return url ? `libsql://${url}` : null;
}

export async function getDatabaseClient() {
  const url = getLibsqlUrl();

  if (!url) {
    console.error("Failed to create database client: URL is null.");
    return router.replace('/(auth)/login')
  }

  try {
    const client = createLibsqlClient({
      url,
      authToken: process.env.TURSO_GROUP_AUTH_TOKEN,
    });

    return drizzle(client, { schema });//here is when allow drizzle
  } catch (error) {
    console.error("Failed to create database client:", error);
    return null;
  }
}

// export function getDumpUrl(): string | null {
//   const dbName = getDatabaseName();
//   const url = getDatabaseUrl(dbName);
//   return url ? `https://${url}/dump` : null;
// }

export async function createUserDatabase(userId: string): Promise<boolean> {
  if (!userId) return false;

  const dbName = md5(userId);

  try {
    await turso.databases.create(dbName, {
      group: "default",
      seed: {
        type: "database",
        name: process.env.TURSO_DATABASE_NAME!,
      },
    });

    return true;
  } catch (err) {
    console.error("Error creating user database:", err);
    return false;
  }
}
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config';

let pgClient: ReturnType<typeof postgres> | null = null;

pgClient = postgres(config.databaseUrl);
export const db = drizzle(pgClient);

export const disconnectDb = async (): Promise<void> => {
  if (pgClient) await pgClient.end();
};

import { defineConfig } from 'drizzle-kit';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';
const postgresUser = process.env.POSTGRES_USER ?? 'app_user';
const postgresPassword = process.env.POSTGRES_PASSWORD ?? 'app_password';
const postgresDb = process.env.POSTGRES_DB ?? 'app';
const postgresHost = process.env.POSTGRES_HOST ?? 'localhost';
const postgresPort = process.env.POSTGRES_PORT ?? '5432';
const localDatabaseUrl = `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDb}`;
const databaseUrlDev = process.env.DATABASE_URL_DEV;
const databaseUrlProd = process.env.DATABASE_URL_PROD;
const databaseUrl = isProduction ? (databaseUrlProd ?? localDatabaseUrl) : (databaseUrlDev ?? localDatabaseUrl);

if (!databaseUrl) {
  throw new Error('DATABASE_URL_PROD is required when NODE_ENV=production');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});

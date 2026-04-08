const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const nodeEnv = getEnv('NODE_ENV', 'development');
const isProduction = nodeEnv === 'production';
const postgresUser = getEnv('POSTGRES_USER', 'app_user');
const postgresPassword = getEnv('POSTGRES_PASSWORD', 'app_password');
const postgresDb = getEnv('POSTGRES_DB', 'app');
const postgresHost = getEnv('POSTGRES_HOST', 'localhost');
const postgresPort = getEnv('POSTGRES_PORT', '5432');
const localDatabaseUrl = `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDb}`;
const databaseUrlDev = process.env.DATABASE_URL_DEV;
const databaseUrlProd = process.env.DATABASE_URL_PROD;
const productionDatabaseUrl = databaseUrlProd ?? getEnv('DATABASE_URL_PROD');
const databaseUrl = isProduction ? productionDatabaseUrl : (databaseUrlDev ?? localDatabaseUrl);

if (isProduction && /(localhost|127\.0\.0\.1)/.test(databaseUrl)) {
  throw new Error('DATABASE_URL must not point to localhost in production');
}

export const config = {
  databaseUrl,
  nodeEnv,
  port: parseInt(getEnv('PORT', '3001'), 10),
};

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env');

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const testDatabase = process.env.TEST_DB_NAME ?? 'tcit_posts_test';

if (!testDatabase.endsWith('_test')) {
  throw new Error(
    `La base de tests debe terminar en _test para evitar borrar datos de desarrollo: ${testDatabase}`,
  );
}

process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.FRONTEND_URL = 'http://localhost:4200';
process.env.DB_HOST = process.env.DB_HOST ?? 'localhost';
process.env.DB_PORT = process.env.DB_PORT ?? '5432';
process.env.DB_USER = process.env.DB_USER ?? 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'postgres';
process.env.DB_NAME = testDatabase;

import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { validateEnv } from '../../src/config/env.validation';
import { createTypeOrmDataSourceOptions } from '../../src/config/typeorm.config';

/**
 * DataSource de integración contra la base de tests.
 * La base debe terminar en `_test`; la validación vive en test/setup-env.ts.
 */
export function createTestDataSource(): DataSource {
  const configService = new ConfigService(
    validateEnv({ ...process.env, NODE_ENV: 'test' }),
  );

  return new DataSource({
    ...createTypeOrmDataSourceOptions(configService),
    migrationsRun: false,
  });
}

export async function resetTestSchema(dataSource: DataSource): Promise<void> {
  await dataSource.query('DROP SCHEMA IF EXISTS public CASCADE');
  await dataSource.query('CREATE SCHEMA public');
}

/**
 * Limpia los datos de la base de tests entre suites: trunca todas las tablas
 * del esquema público (excepto `migrations`) y reinicia las identidades.
 * Es más rápida que `resetTestSchema` y conserva el estado de las migraciones.
 */
export async function truncateTestTables(
  dataSource: DataSource,
): Promise<void> {
  const tables = await dataSource.query<{ tablename: string }[]>(
    `SELECT tablename
     FROM pg_tables
     WHERE schemaname = 'public' AND tablename <> 'migrations'
     ORDER BY tablename`,
  );

  for (const { tablename } of tables) {
    await dataSource.query(
      `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE`,
    );
  }
}

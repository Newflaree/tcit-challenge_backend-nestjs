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

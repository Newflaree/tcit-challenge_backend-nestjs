import 'reflect-metadata';
import type { ConfigService } from '@nestjs/config';
import { validateEnv, type EnvironmentVariables } from '../../src/config/env.validation';
import {
  createTypeOrmDataSource,
  createTypeOrmDataSourceOptions,
} from '../../src/config/typeorm.config';

function createConfigServiceStub(
  overrides: Record<string, unknown> = {},
): ConfigService {
  const env: EnvironmentVariables = validateEnv({
    NODE_ENV: 'test',
    PORT: '3000',
    FRONTEND_URL: 'http://localhost:4200',
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_USER: 'postgres',
    DB_PASSWORD: 'secret',
    DB_NAME: 'tcit_posts_test',
    ...overrides,
  });

  const values = env as unknown as Record<string, unknown>;

  return {
    get: (key: string, defaultValue?: unknown) => values[key] ?? defaultValue,
    getOrThrow: (key: string) => {
      if (values[key] === undefined) {
        throw new Error(`Variable de configuración ausente: ${key}`);
      }

      return values[key];
    },
  } as unknown as ConfigService;
}

describe('createTypeOrmDataSource', () => {
  it('rechaza la ausencia de opciones', async () => {
    await expect(createTypeOrmDataSource()).rejects.toThrow(
      'No se recibieron las opciones de conexión de TypeORM.',
    );
  });

  it('traduce el fallo de conexión a un mensaje accionable', async () => {
    const options = createTypeOrmDataSourceOptions(
      createConfigServiceStub({ DB_PORT: '1' }),
    );

    await expect(createTypeOrmDataSource(options)).rejects.toThrow(
      /No se pudo conectar a PostgreSQL en localhost:1\/tcit_posts_test/,
    );
  }, 15000);
});

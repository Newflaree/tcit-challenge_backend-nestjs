import 'reflect-metadata';
import type { ConfigService } from '@nestjs/config';
import { validateEnv, type EnvironmentVariables } from '../../src/config/env.validation';
import {
  createTypeOrmDataSource,
  createTypeOrmDataSourceOptions,
  createTypeOrmOptions,
} from '../../src/config/typeorm.config';

/**
 * `@nestjs/config` se distribuye como ESM y el runtime unitario es CJS, por lo
 * que se stubbean los dos métodos que `typeorm.config.ts` usa de ConfigService.
 * El import del tipo se elide en tiempo de ejecución.
 */
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

describe('createTypeOrmDataSourceOptions', () => {
  it('mapea las variables de entorno a opciones de PostgreSQL', () => {
    const options = createTypeOrmDataSourceOptions(createConfigServiceStub());

    expect(options).toEqual(
      expect.objectContaining({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'secret',
        database: 'tcit_posts_test',
        synchronize: false,
        migrationsRun: false,
      }),
    );

    const { entities, migrations } = options as {
      entities: string[];
      migrations: string[];
    };
    expect(entities).toHaveLength(1);
    expect(migrations).toHaveLength(1);
  });

  it('registra errores y advertencias sólo en desarrollo', () => {
    expect(
      createTypeOrmDataSourceOptions(createConfigServiceStub()).logging,
    ).toEqual(['error']);

    expect(
      createTypeOrmDataSourceOptions(
        createConfigServiceStub({ NODE_ENV: 'development' }),
      ).logging,
    ).toEqual(['error', 'warn']);
  });
});

describe('createTypeOrmOptions', () => {
  it('falla rápido con un único reintento', () => {
    const options = createTypeOrmOptions(createConfigServiceStub());

    expect(options).toEqual(
      expect.objectContaining({ retryAttempts: 1, retryDelay: 1000 }),
    );
  });
});

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

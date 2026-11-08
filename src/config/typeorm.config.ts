import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Environment } from './env.validation';

const ENTITIES_GLOB = `${__dirname}/../**/*.entity{.ts,.js}`;
const MIGRATIONS_GLOB = `${__dirname}/../database/migrations/*{.ts,.js}`;

export function createTypeOrmDataSourceOptions(
  configService: ConfigService,
): DataSourceOptions {
  const environment = configService.get<Environment>(
    'NODE_ENV',
    Environment.Development,
  );

  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('DB_HOST'),
    port: configService.getOrThrow<number>('DB_PORT'),
    username: configService.getOrThrow<string>('DB_USER'),
    password: configService.getOrThrow<string>('DB_PASSWORD'),
    database: configService.getOrThrow<string>('DB_NAME'),
    entities: [ENTITIES_GLOB],
    migrations: [MIGRATIONS_GLOB],
    synchronize: false,
    migrationsRun: false,
    logging:
      environment === Environment.Development ? ['error', 'warn'] : ['error'],
  };
}

export function createTypeOrmOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    ...createTypeOrmDataSourceOptions(configService),
    retryAttempts: 1,
    retryDelay: 1000,
  };
}

export async function createTypeOrmDataSource(
  options?: DataSourceOptions,
): Promise<DataSource> {
  if (!options) {
    throw new Error('No se recibieron las opciones de conexión de TypeORM.');
  }

  const dataSource = new DataSource(options);
  const { host, port, database } = options as DataSourceOptions & {
    host?: string;
    port?: number;
    database?: string;
  };

  try {
    await dataSource.initialize();
    return dataSource;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);

    throw new Error(
      `No se pudo conectar a PostgreSQL en ${host}:${port}/${database}. ` +
        'Verifica que la base esté disponible y que DB_HOST, DB_PORT, ' +
        `DB_USER, DB_PASSWORD y DB_NAME sean correctos. Detalle: ${detail}`,
      { cause: error },
    );
  }
}

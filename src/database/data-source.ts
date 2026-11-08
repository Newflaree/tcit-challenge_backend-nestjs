import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { validateEnv } from '../config/env.validation';
import { createTypeOrmDataSourceOptions } from '../config/typeorm.config';

const envFile = resolve(process.cwd(), '.env');

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const configService = new ConfigService(validateEnv({ ...process.env }));

const dataSource = new DataSource(
  createTypeOrmDataSourceOptions(configService),
);

export default dataSource;

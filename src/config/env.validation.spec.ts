import 'reflect-metadata';
import { Environment, validateEnv } from './env.validation';

const minimalConfig = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'tcit_posts',
};

describe('validateEnv', () => {
  it('acepta variables mínimas válidas y convierte los puertos a número', () => {
    const config = validateEnv({
      ...minimalConfig,
      NODE_ENV: 'development',
      PORT: '3000',
      FRONTEND_URL: 'http://localhost:4200',
    });

    expect(config.NODE_ENV).toBe(Environment.Development);
    expect(config.PORT).toBe(3000);
    expect(config.DB_PORT).toBe(5432);
    expect(config.FRONTEND_URL).toBe('http://localhost:4200');
  });

  it('aplica los valores por defecto de entorno, puerto y origen', () => {
    const config = validateEnv(minimalConfig);

    expect(config.NODE_ENV).toBe(Environment.Development);
    expect(config.PORT).toBe(3000);
    expect(config.FRONTEND_URL).toBe('http://localhost:4200');
  });
});

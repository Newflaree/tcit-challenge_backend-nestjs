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

  it('rechaza un puerto no numérico', () => {
    expect(() => validateEnv({ ...minimalConfig, PORT: 'abc' })).toThrow(
      'PORT debe ser un número entero',
    );
  });

  it('rechaza un puerto fuera de rango', () => {
    expect(() => validateEnv({ ...minimalConfig, PORT: '70000' })).toThrow(
      'PORT debe ser menor o igual a 65535',
    );
  });

  it('rechaza un entorno desconocido', () => {
    expect(() =>
      validateEnv({ ...minimalConfig, NODE_ENV: 'staging' }),
    ).toThrow('NODE_ENV debe ser development, production o test');
  });

  it('rechaza un origen de frontend inválido', () => {
    expect(() =>
      validateEnv({ ...minimalConfig, FRONTEND_URL: 'no-es-una-url' }),
    ).toThrow('FRONTEND_URL debe ser una URL válida');
  });

  it('rechaza una credencial de base de datos faltante', () => {
    const { DB_PASSWORD, ...configWithoutPassword } = minimalConfig;

    expect(DB_PASSWORD).toBe('postgres');
    expect(() => validateEnv(configWithoutPassword)).toThrow(
      'DB_PASSWORD es obligatorio',
    );
  });
});

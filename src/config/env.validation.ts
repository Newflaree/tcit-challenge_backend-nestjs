import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment, {
    message: 'NODE_ENV debe ser development, production o test',
  })
  NODE_ENV: Environment = Environment.Development;

  @Type(() => Number)
  @IsInt({ message: 'PORT debe ser un número entero' })
  @Min(1, { message: 'PORT debe ser mayor o igual a 1' })
  @Max(65535, { message: 'PORT debe ser menor o igual a 65535' })
  PORT: number = 3000;

  @IsUrl(
    {
      require_protocol: true,
      require_tld: false,
      protocols: ['http', 'https'],
    },
    { message: 'FRONTEND_URL debe ser una URL válida' },
  )
  FRONTEND_URL: string = 'http://localhost:4200';

  @IsString({ message: 'DB_HOST debe ser un string' })
  @IsNotEmpty({ message: 'DB_HOST es obligatorio' })
  DB_HOST: string;

  @Type(() => Number)
  @IsInt({ message: 'DB_PORT debe ser un número entero' })
  @Min(1, { message: 'DB_PORT debe ser mayor o igual a 1' })
  @Max(65535, { message: 'DB_PORT debe ser menor o igual a 65535' })
  DB_PORT: number;

  @IsString({ message: 'DB_USER debe ser un string' })
  @IsNotEmpty({ message: 'DB_USER es obligatorio' })
  DB_USER: string;

  @IsString({ message: 'DB_PASSWORD debe ser un string' })
  @IsNotEmpty({ message: 'DB_PASSWORD es obligatorio' })
  DB_PASSWORD: string;

  @IsString({ message: 'DB_NAME debe ser un string' })
  @IsNotEmpty({ message: 'DB_NAME es obligatorio' })
  DB_NAME: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );

    throw new Error(
      `Configuración de entorno inválida:\n- ${messages.join('\n- ')}`,
    );
  }

  return validatedConfig;
}

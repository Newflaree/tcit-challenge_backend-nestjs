import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppModule } from './app.module';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const frontendUrl = configService.get<string>(
    'FRONTEND_URL',
    'http://localhost:4200',
  );

  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerEnabled =
    (process.env.SWAGGER_ENABLED ?? 'true').toLowerCase() !== 'false';

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('TCIT Posts API')
      .setDescription('API REST del challenge de Posts')
      .setVersion('1.0')
      .addTag('Posts', 'Operaciones sobre posts')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  app.enableCors({
    origin: frontendUrl,
  });

  await app.listen(port);
}

void bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`No se pudo iniciar la aplicación: ${message}`);
  process.exit(1);
});

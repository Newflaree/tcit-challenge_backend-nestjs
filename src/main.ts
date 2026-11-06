import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4200',
  });

  await app.listen(port);
}
bootstrap();

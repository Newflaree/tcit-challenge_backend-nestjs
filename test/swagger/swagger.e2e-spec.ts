import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('Swagger/OpenAPI (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('TCIT Posts API')
      .setDescription('API REST del challenge de Posts')
      .setVersion('1.0')
      .addTag('posts', 'Operaciones sobre posts')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/docs responde 200', async () => {
    await request(app.getHttpServer()).get('/api/docs').expect(200);
  });

  it('GET /api/docs-json responde 200', async () => {
    await request(app.getHttpServer()).get('/api/docs-json').expect(200);
  });

  it('el documento contiene los tres paths y métodos esperados', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);

    const doc = response.body as {
      paths: Record<string, Record<string, unknown>>;
    };

    expect(doc.paths['/api/posts']).toBeDefined();
    expect(doc.paths['/api/posts'].get).toBeDefined();
    expect(doc.paths['/api/posts'].post).toBeDefined();
    expect(doc.paths['/api/posts/{id}']).toBeDefined();
    expect(doc.paths['/api/posts/{id}'].delete).toBeDefined();
  });

  it('los schemas de request y response existen', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);

    const doc = response.body as {
      components: { schemas: Record<string, unknown> };
    };

    expect(doc.components.schemas.PostResponseDto).toBeDefined();
    expect(doc.components.schemas.CreatePostDto).toBeDefined();
    expect(doc.components.schemas.ErrorResponseDto).toBeDefined();
  });

  it('Swagger convive con el prefijo /api', async () => {
    await request(app.getHttpServer()).get('/api/docs').expect(200);
    await request(app.getHttpServer()).get('/api/docs-json').expect(200);
  });
});

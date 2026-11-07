import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import {
  createTestDataSource,
  truncateTestTables,
} from '../database/test-data-source';

describe('POST /api/posts (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = createTestDataSource();
    await dataSource.initialize();
    await dataSource.runMigrations({ transaction: 'all' });
  });

  beforeEach(async () => {
    await truncateTestTables(dataSource);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('crea un post válido y responde 201 con id, name, description', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: 'Nuevo post', description: 'Descripción del nuevo post' })
      .set('Content-Type', 'application/json')
      .expect(201);

    const created = response.body as {
      id: number;
      name: string;
      description: string;
    };

    expect(created.id).toEqual(expect.any(Number));
    expect(created.name).toBe('Nuevo post');
    expect(created.description).toBe('Descripción del nuevo post');
  });

  it('el post creado aparece en GET /api/posts', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: 'Post visible', description: 'Visible' })
      .set('Content-Type', 'application/json')
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/api/posts')
      .expect(200);

    const listBody = list.body as unknown as Array<{ name: string }>;
    expect(listBody).toHaveLength(1);
    expect(listBody[0].name).toBe('Post visible');
  });

  it('normaliza espacios al inicio/fin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: '  Con espacios  ', description: '  Desc  ' })
      .set('Content-Type', 'application/json')
      .expect(201);

    const normalized = response.body as unknown as {
      name: string;
      description: string;
    };
    expect(normalized.name).toBe('Con espacios');
    expect(normalized.description).toBe('Desc');
  });

  it('body vacío responde 400', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({})
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('nombre sólo espacios responde 400', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: '   ', description: 'Desc' })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('nombre mayor a 120 responde 400', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: 'a'.repeat(121), description: 'Desc' })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('campo desconocido responde 400', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: 'Post', description: 'Desc', unknownField: 'x' })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('no se permiten strings compuestos sólo por espacios en description', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: 'Post', description: '   ' })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('description mayor a 1000 responde 400', async () => {
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ name: 'Post', description: 'a'.repeat(1001) })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('la respuesta de error no contiene stack ni SQL', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/posts')
      .send({})
      .set('Content-Type', 'application/json')
      .expect(400);

    const body = JSON.stringify(response.body);
    expect(body).not.toMatch(/stack/i);
    expect(body).not.toMatch(/SELECT|INSERT|UPDATE|DELETE|FROM/i);
    expect(body).not.toMatch(/password|credential/i);
  });
});

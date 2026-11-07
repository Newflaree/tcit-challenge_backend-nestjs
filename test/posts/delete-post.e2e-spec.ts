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

describe('DELETE /api/posts/:id (e2e)', () => {
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

  async function seedPost(
    name = 'A borrar',
    description = 'Desc',
  ): Promise<number> {
    const rows = await dataSource.query<{ id: number }[]>(
      'INSERT INTO posts (name, description) VALUES ($1, $2) RETURNING id',
      [name, description],
    );
    return rows[0].id;
  }

  it('elimina un post existente y responde 200 con sus datos', async () => {
    const id = await seedPost('Post a eliminar', 'Desc eliminar');

    const response = await request(app.getHttpServer())
      .delete(`/api/posts/${id}`)
      .expect(200);

    const body = response.body as {
      id: number;
      name: string;
      description: string;
    };
    expect(body.id).toBe(id);
    expect(body.name).toBe('Post a eliminar');
    expect(body.description).toBe('Desc eliminar');
  });

  it('el post eliminado ya no aparece en el listado', async () => {
    const id = await seedPost('Post listado', 'Desc');

    await request(app.getHttpServer()).delete(`/api/posts/${id}`).expect(200);

    const list = await request(app.getHttpServer())
      .get('/api/posts')
      .expect(200);
    const body = list.body as Array<{ id: number }>;
    expect(body.find((p) => p.id === id)).toBeUndefined();
  });

  it('eliminar dos veces responde 404 la segunda vez', async () => {
    const id = await seedPost('Post doble', 'Desc');

    await request(app.getHttpServer()).delete(`/api/posts/${id}`).expect(200);
    await request(app.getHttpServer()).delete(`/api/posts/${id}`).expect(404);
  });

  it('DELETE /api/posts/abc responde 400', async () => {
    await request(app.getHttpServer()).delete('/api/posts/abc').expect(400);
  });

  it('no se eliminan otros posts', async () => {
    const id1 = await seedPost('Post 1', 'Desc 1');
    const id2 = await seedPost('Post 2', 'Desc 2');

    await request(app.getHttpServer()).delete(`/api/posts/${id1}`).expect(200);

    const list = await request(app.getHttpServer())
      .get('/api/posts')
      .expect(200);
    const body = list.body as Array<{ id: number }>;
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe(id2);
  });

  it('id inexistente responde 404', async () => {
    await request(app.getHttpServer()).delete('/api/posts/99999').expect(404);
  });
});

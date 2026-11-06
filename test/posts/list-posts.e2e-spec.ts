import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import {
  createTestDataSource,
  truncateTestTables,
} from '../database/test-data-source';

describe('GET /api/posts (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
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

  it('responde 200 con [] cuando no hay posts', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual([]);
  });

  it('devuelve todos los posts en orden id descendente', async () => {
    await dataSource.query(
      'INSERT INTO posts (name, description) VALUES ($1, $2), ($3, $4)',
      ['Primer post', 'Desc 1', 'Segundo post', 'Desc 2'],
    );

    const response = await request(app.getHttpServer())
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /json/);

    const body = response.body as Array<{
      id: number;
      name: string;
      description: string;
    }>;

    expect(body).toHaveLength(2);
    expect(body[0]).toEqual({
      id: 2,
      name: 'Segundo post',
      description: 'Desc 2',
    });
    expect(body[1]).toEqual({
      id: 1,
      name: 'Primer post',
      description: 'Desc 1',
    });
  });

  it('cada elemento cumple el contrato (id, name, description)', async () => {
    await dataSource.query(
      'INSERT INTO posts (name, description) VALUES ($1, $2)',
      ['Post de contrato', 'Desc contrato'],
    );

    const response = await request(app.getHttpServer())
      .get('/api/posts')
      .expect(200);

    const body = response.body as Array<{
      id: number;
      name: string;
      description: string;
    }>;

    expect(Object.keys(body[0])).toEqual(['id', 'name', 'description']);
  });
});

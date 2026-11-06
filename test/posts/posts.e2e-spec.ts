import { DataSource } from 'typeorm';
import { Post } from '../../src/posts/entities/post.entity';
import { toPostResponse } from '../../src/posts/dto/post-response.dto';
import {
  createTestDataSource,
  truncateTestTables,
} from '../database/test-data-source';

describe('Modelo Post y contrato JSON (integración)', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
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
  });

  it('persiste y recupera un post conservando nombre y descripción', async () => {
    const name = 'Primer post';
    const description = 'Contenido del post';

    await dataSource.query(
      'INSERT INTO posts (name, description) VALUES ($1, $2)',
      [name, description],
    );

    const rows = await dataSource.query<
      { id: number; name: string; description: string }[]
    >('SELECT id, name, description FROM posts ORDER BY id DESC LIMIT 1');

    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe(name);
    expect(rows[0].description).toBe(description);
    expect(rows[0].id).toBeGreaterThan(0);
  });

  it('el contrato de respuesta usa exactamente id, name y description', async () => {
    await dataSource.query(
      'INSERT INTO posts (name, description) VALUES ($1, $2)',
      ['Post de contrato', 'Descripción de contrato'],
    );

    const rows = await dataSource.query<
      { id: number; name: string; description: string }[]
    >('SELECT id, name, description FROM posts ORDER BY id DESC LIMIT 1');

    const entity = Object.assign(new Post(), rows[0]);
    const response = toPostResponse(entity);

    expect(Object.keys(response)).toEqual(['id', 'name', 'description']);
    expect(response.id).toBe(rows[0].id);
    expect(response.name).toBe(rows[0].name);
    expect(response.description).toBe(rows[0].description);
  });

  it('la tabla posts tiene PK e id, name y description no nulos', async () => {
    const columns = await dataSource.query<
      { column_name: string; is_nullable: string }[]
    >(
      `SELECT column_name, is_nullable
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'posts'
       ORDER BY ordinal_position`,
    );

    const byName = Object.fromEntries(
      columns.map(({ column_name, is_nullable }) => [column_name, is_nullable]),
    );

    expect(byName.id).toBe('NO');
    expect(byName.name).toBe('NO');
    expect(byName.description).toBe('NO');

    const pk = await dataSource.query<{ column_name: string }[]>(
      `SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON kcu.constraint_name = tc.constraint_name
         AND kcu.table_schema = tc.table_schema
       WHERE tc.table_schema = 'public'
         AND tc.table_name = 'posts'
         AND tc.constraint_type = 'PRIMARY KEY'`,
    );

    expect(pk.map(({ column_name }) => column_name)).toEqual(['id']);
  });
});

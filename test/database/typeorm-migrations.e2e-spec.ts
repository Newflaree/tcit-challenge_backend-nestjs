import { DataSource } from 'typeorm';
import { createTestDataSource, resetTestSchema } from './test-data-source';

describe('TypeORM y migraciones (integración)', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = createTestDataSource();
    await dataSource.initialize();
    await resetTestSchema(dataSource);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('conecta con la base de test y ejecuta las migraciones pendientes', async () => {
    expect(dataSource.isInitialized).toBe(true);
    expect(dataSource.options.database).toBe('tcit_posts_test');
    expect(dataSource.options.synchronize).toBe(false);

    const executedMigrations = await dataSource.runMigrations({
      transaction: 'all',
    });

    expect(executedMigrations.map(({ name }) => name)).toEqual([
      'CreatePostsTable1793985139557',
    ]);

    const migrationsTable = await dataSource.query(
      'SELECT "name" FROM "migrations" ORDER BY "id"',
    );

    expect(migrationsTable).toEqual([
      { name: 'CreatePostsTable1793985139557' },
    ]);
  });
});

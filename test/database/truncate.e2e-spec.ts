import { DataSource } from 'typeorm';
import {
  countPosts,
  insertFixturePosts,
  insertPost,
  postsFixtures,
} from './posts-queries';
import { createTestDataSource, truncateTestTables } from './test-data-source';

describe('Helper de limpieza de la base de test (integración)', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = createTestDataSource();
    await dataSource.initialize();
    await dataSource.runMigrations({ transaction: 'all' });
    await truncateTestTables(dataSource);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('trunca los datos y reinicia las identidades', async () => {
    const inserted = await insertFixturePosts(dataSource);
    expect(inserted).toHaveLength(postsFixtures.posts.length);
    expect(await countPosts(dataSource)).toBe(postsFixtures.posts.length);

    await truncateTestTables(dataSource);
    expect(await countPosts(dataSource)).toBe(0);
  });

  it('reinicia la secuencia de ids al truncar', async () => {
    const { name, description } = postsFixtures.newPost;
    const inserted = await insertPost(dataSource, name, description);
    expect(inserted.id).toBe(1);

    await truncateTestTables(dataSource);
    const reinserted = await insertPost(dataSource, name, description);
    expect(reinserted.id).toBe(1);
  });

  it('conserva el registro de migraciones aplicadas', async () => {
    const migrations = await dataSource.query<{ name: string }[]>(
      'SELECT name FROM migrations ORDER BY id',
    );

    expect(migrations.map(({ name }) => name)).toEqual([
      'CreatePostsTable1793985139557',
    ]);
  });
});

import { DataSource } from 'typeorm';
import { countPosts, insertFixturePosts, postsFixtures } from './posts-queries';
import { createTestDataSource, truncateTestTables } from './test-data-source';

/**
 * Suite A del test de aislamiento: inserta los tres posts del fixture y los
 * ve completos. Si el orden de ejecución importara, la suite B (que corre
 * después y también trunca al iniciar) vería datos ajenos o esta suite vería
 * los de B en una ejecución previa.
 */
describe('Aislamiento entre suites — A (integración)', () => {
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

  it('arranca limpia y sólo ve sus propios datos', async () => {
    expect(await countPosts(dataSource)).toBe(0);

    await insertFixturePosts(dataSource);

    expect(await countPosts(dataSource)).toBe(postsFixtures.posts.length);

    const rows = await dataSource.query<{ name: string }[]>(
      'SELECT name FROM posts ORDER BY id',
    );
    expect(rows.map(({ name }) => name)).toEqual(
      postsFixtures.posts.map(({ name }) => name),
    );
  });
});

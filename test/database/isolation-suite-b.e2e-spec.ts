import { DataSource } from 'typeorm';
import { countPosts, insertPost, postsFixtures } from './posts-queries';
import { createTestDataSource, truncateTestTables } from './test-data-source';

/**
 * Suite B del test de aislamiento: inserta un único post. Si la suite A
 * hubiera dejado datos y no existiera limpieza entre suites, el conteo sería
 * mayor a 1. La limpieza ocurre en beforeAll (truncateTestTables), por lo que
 * el resultado no depende del orden ni del estado previo de la base.
 */
describe('Aislamiento entre suites — B (integración)', () => {
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

  it('arranca limpia aunque otra suite haya dejado datos', async () => {
    expect(await countPosts(dataSource)).toBe(0);

    const { name, description } = postsFixtures.newPost;
    await insertPost(dataSource, name, description);

    expect(await countPosts(dataSource)).toBe(1);

    const rows = await dataSource.query<{ name: string }[]>(
      'SELECT name FROM posts',
    );
    expect(rows.map(({ name: rowName }) => rowName)).toEqual([name]);
  });
});

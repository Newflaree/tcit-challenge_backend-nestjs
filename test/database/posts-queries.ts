import { DataSource } from 'typeorm';
import postsFixtures from '../fixtures/posts.json';

export interface PostRow {
  id: number;
  name: string;
  description: string;
}

export { postsFixtures };

/** Inserta los tres posts canónicos del fixture y devuelve sus filas. */
export async function insertFixturePosts(
  dataSource: DataSource,
): Promise<PostRow[]> {
  const rows: PostRow[] = [];

  for (const post of postsFixtures.posts) {
    const inserted = await dataSource.query<PostRow[]>(
      'INSERT INTO posts (name, description) VALUES ($1, $2) RETURNING id, name, description',
      [post.name, post.description],
    );
    rows.push(...inserted);
  }

  return rows;
}

export async function insertPost(
  dataSource: DataSource,
  name: string,
  description: string,
): Promise<PostRow> {
  const inserted = await dataSource.query<PostRow[]>(
    'INSERT INTO posts (name, description) VALUES ($1, $2) RETURNING id, name, description',
    [name, description],
  );

  return inserted[0];
}

export async function countPosts(dataSource: DataSource): Promise<number> {
  const rows = await dataSource.query<{ count: number }[]>(
    'SELECT COUNT(*)::int AS count FROM posts',
  );

  return rows[0].count;
}

import { DataSource } from 'typeorm';
import { createTestDataSource, resetTestSchema } from './test-data-source';

describe('TypeORM y migraciones (integración)', () => {
  let dataSource: DataSource;
  let executedMigrationNames: string[];

  beforeAll(async () => {
    dataSource = createTestDataSource();
    await dataSource.initialize();
    await resetTestSchema(dataSource);

    const executedMigrations = await dataSource.runMigrations({
      transaction: 'all',
    });
    executedMigrationNames = executedMigrations.map(({ name }) => name);
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

    expect(executedMigrationNames).toEqual(['CreatePostsTable1793985139557']);

    const migrationsTable = await dataSource.query<MigrationRow[]>(
      'SELECT "name" FROM "migrations" ORDER BY "id"',
    );

    expect(migrationsTable).toEqual([
      { name: 'CreatePostsTable1793985139557' },
    ]);
  });

  it('crea la tabla posts con las columnas y restricciones esperadas', async () => {
    const columns = await dataSource.query<PostColumnRow[]>(`
      SELECT
        column_name,
        data_type,
        character_maximum_length,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'posts'
      ORDER BY ordinal_position
    `);

    expect(columns).toEqual([
      {
        column_name: 'id',
        data_type: 'integer',
        character_maximum_length: null,
        is_nullable: 'NO',
      },
      {
        column_name: 'name',
        data_type: 'character varying',
        character_maximum_length: 120,
        is_nullable: 'NO',
      },
      {
        column_name: 'description',
        data_type: 'character varying',
        character_maximum_length: 1000,
        is_nullable: 'NO',
      },
    ]);

    const primaryKey = await dataSource.query<ColumnNameRow[]>(`
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON kcu.constraint_schema = tc.constraint_schema
        AND kcu.constraint_name = tc.constraint_name
        AND kcu.table_schema = tc.table_schema
        AND kcu.table_name = tc.table_name
      WHERE tc.table_schema = 'public'
        AND tc.table_name = 'posts'
        AND tc.constraint_type = 'PRIMARY KEY'
      ORDER BY kcu.ordinal_position
    `);

    expect(primaryKey).toEqual([{ column_name: 'id' }]);

    const checkConstraints = await dataSource.query<ConstraintRow[]>(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'posts'
        AND constraint_type = 'CHECK'
        AND constraint_name LIKE 'CHK_posts%'
      ORDER BY constraint_name
    `);

    expect(checkConstraints).toEqual([
      { constraint_name: 'CHK_posts_description_not_blank' },
      { constraint_name: 'CHK_posts_name_not_blank' },
    ]);
  });

  it('ejecuta y revierte las migraciones sobre una base limpia', async () => {
    await resetTestSchema(dataSource);

    const appliedMigrations = await dataSource.runMigrations({
      transaction: 'all',
    });

    expect(appliedMigrations.map(({ name }) => name)).toEqual([
      'CreatePostsTable1793985139557',
    ]);
    await expect(tableExists(dataSource, 'posts')).resolves.toBe(true);

    await dataSource.undoLastMigration({ transaction: 'all' });

    await expect(tableExists(dataSource, 'posts')).resolves.toBe(false);
    const migrationsAfterRevert = await dataSource.query<MigrationRow[]>(
      'SELECT "name" FROM "migrations" ORDER BY "id"',
    );

    expect(migrationsAfterRevert).toEqual([]);

    await dataSource.runMigrations({ transaction: 'all' });

    await expect(tableExists(dataSource, 'posts')).resolves.toBe(true);
  });
});

async function tableExists(
  dataSource: DataSource,
  tableName: string,
): Promise<boolean> {
  const rows = await dataSource.query<TableNameRow[]>(
    'SELECT to_regclass($1) AS table_name',
    [`public.${tableName}`],
  );

  return rows[0]?.table_name !== null;
}

interface MigrationRow {
  name: string;
}

interface PostColumnRow {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  is_nullable: string;
}

interface ColumnNameRow {
  column_name: string;
}

interface ConstraintRow {
  constraint_name: string;
}

interface TableNameRow {
  table_name: string | null;
}

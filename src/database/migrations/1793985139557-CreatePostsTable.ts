import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostsTable1793985139557 implements MigrationInterface {
  name = 'CreatePostsTable1793985139557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" SERIAL NOT NULL,
        "name" character varying(120) NOT NULL,
        "description" character varying(1000) NOT NULL,
        CONSTRAINT "PK_posts" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_posts_name_not_blank" CHECK (btrim("name") <> ''),
        CONSTRAINT "CHK_posts_description_not_blank" CHECK (btrim("description") <> '')
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "posts"');
  }
}

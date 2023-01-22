import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateArticleTable1674382037755 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "articles" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "date" TEXT NOT NULL,
        "rate" INTEGER,
        "TEXT" TEXT,
        "created_at" TEXT,
        "updated_at" TEXT
      );
    `)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "articles";
    `)
  }
}

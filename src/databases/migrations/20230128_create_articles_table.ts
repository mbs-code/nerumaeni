import { Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('articles')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('text', 'text', col => col.notNull())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('articles').ifExists().execute()
}

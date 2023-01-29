import { Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('articles')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('date', 'text', col => col.notNull().unique())
    .addColumn('rate', 'integer', col => col.notNull().defaultTo(0))
    .addColumn('text', 'text', col => col.notNull())
    .addColumn('created_at', 'datetime', col => col.notNull())
    .addColumn('updated_at', 'datetime', col => col.notNull())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('articles').ifExists().execute()
}

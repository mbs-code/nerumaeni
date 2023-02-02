import { Migration } from 'kysely'
import * as CreateArticlesTable from './migrations/20230128_create_articles_table'

export const migrations: Record<string, Migration> = {
  '20230128_create_articles_table': CreateArticlesTable,
}

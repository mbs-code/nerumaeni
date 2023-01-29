import { Kysely, Migrator } from 'kysely'
import { BuildinMigrationProvider } from '~~/src/databases/libs/BuildinMigrationProvider'
import { CapacitorSqliteDialect } from '~~/src/databases/libs/CapacitorSqliteDialect'
import { migrations } from '~~/src/databases/Migrations'
import { Tables } from '~~/src/databases/Tables'

export default defineNuxtPlugin((nuxtApp) => {
  const path = 'sqlite:./test.db'
  const debug = true

  const db = new Kysely<Tables>({
    dialect: new CapacitorSqliteDialect({ path, debug }),
  })

  const migrator = new Migrator({
    db,
    provider: new BuildinMigrationProvider(migrations),
  })

  nuxtApp.provide('db', db)
  nuxtApp.provide('migrator', migrator)
})

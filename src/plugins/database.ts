import { Kysely, Migrator } from 'kysely'
import { BuildinMigrationProvider } from '~~/src/databases/libs/BuildinMigrationProvider'
import { CapacitorSqliteDialect } from '~~/src/databases/libs/CapacitorSqliteDialect'
import { migrations } from '~~/src/databases/Migrations'
import { testSeeder } from '~~/src/databases/seeders/TestSeeder'
import { Tables } from '~~/src/databases/Tables'

export default defineNuxtPlugin(async (nuxtApp) => {
  const dbName = 'store'
  const debug = true

  const db = new Kysely<Tables>({
    dialect: new CapacitorSqliteDialect({ dbName, debug }),
  })

  const migrator = new Migrator({
    db,
    provider: new BuildinMigrationProvider(migrations),
  })

  nuxtApp.provide('db', db)
  nuxtApp.provide('migrator', migrator)

  await migrator.migrateToLatest()
  await testSeeder()
})

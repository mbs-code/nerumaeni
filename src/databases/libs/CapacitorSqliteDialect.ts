import {
  Kysely,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  Dialect,
  Driver,
  QueryCompiler,
  DialectAdapter,
  DatabaseIntrospector,
} from 'kysely'
import { CapacitorSqliteDialectConfig } from './CapacitorSqliteDialectConfig'
import { CapacitorSqliteDriver } from './CapacitorSqliteDriver'

export class CapacitorSqliteDialect implements Dialect {
  readonly #config: CapacitorSqliteDialectConfig

  constructor (config: CapacitorSqliteDialectConfig) {
    this.#config = Object.freeze({ ...config })
  }

  createDriver (): Driver {
    return new CapacitorSqliteDriver(this.#config)
  }

  createQueryCompiler (): QueryCompiler {
    return new SqliteQueryCompiler()
  }

  createAdapter (): DialectAdapter {
    return new SqliteAdapter()
  }

  createIntrospector (db: Kysely<unknown>): DatabaseIntrospector {
    return new SqliteIntrospector(db)
  }
}

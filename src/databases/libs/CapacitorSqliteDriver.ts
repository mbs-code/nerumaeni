import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import {
  Driver,
  DatabaseConnection,
  CompiledQuery,
  QueryResult,
} from 'kysely'
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'
import { CapacitorSqliteDialectConfig } from './CapacitorSqliteDialectConfig'

export class CapacitorSqliteDriver implements Driver {
  readonly #config: CapacitorSqliteDialectConfig
  readonly #connectionMutex = new ConnectionMutex()

  #db: SQLiteDBConnection | undefined
  #connection!: DatabaseConnection

  constructor (config: CapacitorSqliteDialectConfig) {
    this.#config = Object.freeze({ ...config })
  }

  async init (): Promise<void> {
    // capacitor sqlite の生成
    const dbName = this.#config.dbName
    const platform = Capacitor.getPlatform()
    const sqlite = new SQLiteConnection(CapacitorSQLite)

    // web mock
    if (platform === 'web') {
      customElements.define('jeep-sqlite', JeepSqlite)
      const jeepSqlite = document.createElement('jeep-sqlite')
      document.body.appendChild(jeepSqlite)

      await customElements.whenDefined('jeep-sqlite')
      await sqlite.initWebStore()
    }

    // conn の生成
    const ret = await sqlite.checkConnectionsConsistency()
    const isConn = (await sqlite.isConnection(dbName, false)).result
    const db = ret.result && isConn
      ? await sqlite.retrieveConnection(dbName, false)
      : await sqlite.createConnection(dbName, false, 'no-encryption', 1, false)

    await db.open()

    this.#db = db

    // kysely load
    this.#connection = new CapacitorSqliteConnection(this.#config, this.#db)
  }

  async acquireConnection (): Promise<DatabaseConnection> {
    await this.#connectionMutex.lock()
    return this.#connection
  }

  async beginTransaction (connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('begin'))
  }

  async commitTransaction (connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('commit'))
  }

  async rollbackTransaction (connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('rollback'))
  }

  // eslint-disable-next-line require-await
  async releaseConnection (): Promise<void> {
    this.#connectionMutex.unlock()
  }

  // eslint-disable-next-line require-await
  async destroy (): Promise<void> {
    this.#db = undefined
  }
}

class CapacitorSqliteConnection implements DatabaseConnection {
  readonly #config: CapacitorSqliteDialectConfig
  readonly #db: SQLiteDBConnection

  constructor (config: CapacitorSqliteDialectConfig, db: SQLiteDBConnection) {
    this.#config = config
    this.#db = db
  }

  streamQuery<R> (_compiledQuery: CompiledQuery, _chunkSize?: number): AsyncIterableIterator<QueryResult<R>> {
    throw new Error('Method not implemented.')
  }

  async executeQuery<O> (compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const { sql, parameters } = compiledQuery
    if (this.#config.debug) {
      // eslint-disable-next-line no-console
      console.debug(sql, parameters)
    }

    if (sql.startsWith('select')) {
      const res = await this.#db.query(sql, parameters as any[])

      return {
        rows: res.values ?? [],
      }
    } else {
      const res = await this.#db.executeSet([{
        statement: sql,
        values: parameters as any[],
      }])

      const lastId = res.changes?.lastId
      const changes = res.changes?.changes

      return {
        numAffectedRows: changes ? BigInt(changes) : undefined,
        insertId: lastId ? BigInt(lastId) : undefined,
        rows: [],
      }
    }
  }
}

class ConnectionMutex {
  #promise?: Promise<void>
  #resolve?: () => void

  async lock (): Promise<void> {
    while (this.#promise) {
      await this.#promise
    }

    this.#promise = new Promise((resolve) => {
      this.#resolve = resolve
    })
  }

  unlock (): void {
    const resolve = this.#resolve

    this.#promise = undefined
    this.#resolve = undefined

    resolve?.()
  }
}

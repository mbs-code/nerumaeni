import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'

customElements.define('jeep-sqlite', JeepSqlite)

const database = 'storage'
const readonly = false

// TODO: public/assets/sql-wasm を消す
export default defineNuxtPlugin(async (nuxtApp) => {
  const platform = Capacitor.getPlatform()
  const sqlite = new SQLiteConnection(CapacitorSQLite)

  try {
    if (platform === 'web') {
      // Create the 'jeep-sqlite' Stencil component
      const jeepSqlite = document.createElement('jeep-sqlite')
      document.body.appendChild(jeepSqlite)
      await customElements.whenDefined('jeep-sqlite')
      // Initialize the Web store
      await sqlite.initWebStore()
    }
    // here you can initialize some database schema if required

    // example: database creation with standard SQLite statements
    const ret = await sqlite.checkConnectionsConsistency()
    const isConn = (await sqlite.isConnection(database, readonly)).result
    let db = null
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection(database, readonly)
    } else {
      db = await sqlite.createConnection(database, false, 'no-encryption', 1, readonly)
    }
    await db.open()
    const query = `
      CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
      );
    `
    const res = await db.execute(query)
    if (res.changes && res.changes.changes && res.changes.changes < 0) {
      throw new Error('Error: execute failed')
    }

    await sqlite.closeConnection(database, readonly)
  } catch (err) {
    console.log(`Error: ${err}`)
    throw new Error(`Error: ${err}`)
  }
})

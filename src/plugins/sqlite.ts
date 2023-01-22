import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'
import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { BaseEntity } from 'typeorm'
import { initDataSource } from '~~/src/databases/initDataSource'

customElements.define('jeep-sqlite', JeepSqlite)

export const dataSourceKey: InjectionKey<ReturnType<typeof initDataSource>> = Symbol('data-source')

// TODO: public/assets/sql-wasm を消す
export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const platform = Capacitor.getPlatform()
    const sqlite = new SQLiteConnection(CapacitorSQLite)

    // web のときに jeep indexedDB を立ち上げる
    if (platform === 'web') {
      const jeepSqlite = document.createElement('jeep-sqlite')
      document.body.appendChild(jeepSqlite)

      await customElements.whenDefined('jeep-sqlite')
      await sqlite.initWebStore()
    }

    // 接続テスト
    const echoRes = await sqlite.echo('Hello from echo')
    if (echoRes.value !== 'Hello from echo') {
      throw new Error('Echo failed.')
    }

    // 接続
    const dataSource = initDataSource(sqlite)
    await dataSource.initialize()

    await dataSource.runMigrations()

    // アプリに公開
    BaseEntity.useDataSource(dataSource)
    nuxtApp.provide('db', dataSource)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error: ${err}`)
  }
})

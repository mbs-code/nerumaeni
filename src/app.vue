<template>
  <van-config-provider :theme="theme">
    <div class="h-screen flex flex-col van-doc-theme-dark">
      <van-nav-bar :title="title" />

      <div class="flex-grow">
        <van-cell center title="ダークモード">
          <template #right-icon>
            <van-switch v-model="isDark" />
          </template>
        </van-cell>

        <NuxtPage />
      </div>

      <van-tabbar route>
        <van-tabbar-item replace icon="home-o" :to="{ name: 'index' }">
          ホーム
        </van-tabbar-item>
        <van-tabbar-item replace icon="setting-o" :to="{ name: 'config' }">
          設定
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </van-config-provider>
</template>

<script setup lang='ts'>
import { useSQLite } from 'vue-sqlite-hook'

const app = getCurrentInstance()

onMounted(async () => {
  console.log(' in App on Mounted')
  if (app != null) {
    app.appContext.config.globalProperties.$sqlite = useSQLite()
    const sqlite = app.appContext.config.globalProperties.$sqlite
    try {
      let res = await sqlite.echo('Hello from echo')
      console.log(res)
      if (res.value !== 'Hello from echo') {
        console.log('> Echo not returning "Hello from echo"\n')
        return
      }

      console.log('> Echo successful\n')
      // create a connection for NoEncryption
      const db = await sqlite.createConnection('NoEncryption')
      console.log('> createConnection \'NoEncryption\' successful\n')
      // open NoEncryption database
      await db.open()
      console.log('> open \'NoEncryption\' successful\n')

      const createTablesNoEncryption = `
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY NOT NULL,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            company TEXT,
            size FLOAT,
            age INTEGER,
            last_modified INTEGER DEFAULT (strftime('%s', 'now'))
            );
            CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY NOT NULL,
            userid INTEGER,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            last_modified INTEGER DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (userid) REFERENCES users(id) ON DELETE SET DEFAULT
            );
            CREATE INDEX IF NOT EXISTS users_index_name ON users (name);
            CREATE INDEX IF NOT EXISTS users_index_last_modified ON users (last_modified);
            CREATE INDEX IF NOT EXISTS messages_index_last_modified ON messages (last_modified);
            CREATE TRIGGER IF NOT EXISTS users_trigger_last_modified
            AFTER UPDATE ON users
            FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
            BEGIN
                UPDATE users SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
            END;
            CREATE TRIGGER IF NOT EXISTS messages_trigger_last_modified AFTER UPDATE ON messages
            FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified
            BEGIN
                UPDATE messages SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;
            END;
            PRAGMA user_version = 1;
          `
      const importTwoUsers = `
            DELETE FROM users;
            INSERT INTO users (name,email,age) VALUES ("Whiteley","Whiteley.com",30);
            INSERT INTO users (name,email,age) VALUES ("Jones","Jones.com",44);
          `
      const importThreeMessages = `
            DELETE FROM messages;
            INSERT INTO messages (userid,title,body) VALUES (1,"test post 1","content test post 1");
            INSERT INTO messages (userid,title,body) VALUES (2,"test post 2","content test post 2");
            INSERT INTO messages (userid,title,body) VALUES (1,"test post 3","content test post 3");
          `
      const dropTablesTablesNoEncryption = `
            PRAGMA foreign_keys = OFF;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS messages;
            PRAGMA foreign_keys = ON;
          `
      // Drop tables if exists
      res = await db.execute(dropTablesTablesNoEncryption, false)
      console.log(`drop tables res: ${JSON.stringify(res)}`)
      console.log(`drop tables res: ${JSON.stringify(res)}\n`)
      if (res.changes.changes < 0) {
        console.log(' Execute1 failed\n')
        return
      }
      // Create tables
      res = await db.execute(createTablesNoEncryption)
      if (res.changes.changes !== 0 && res.changes.changes !== 1) {
        console.log(' Execute2 failed\n')
        return
      }
      // Insert two users with execute method
      res = await db.execute(importTwoUsers)
      if (res.changes.changes !== 2) {
        console.log(' Execute3 failed\n')
        return
      }

      res = await db.execute(importThreeMessages)
      if (res.changes.changes !== 3) {
        console.log(' Execute4 failed\n')
        return
      }

      // Close Connection NoEncryption
      await sqlite.closeConnection('NoEncryption')
      console.log('* Ending test successfully*\n')
    } catch (err) {
      console.log(err)
    }
  }
})

const route = useRoute()
const title = computed(() => route.meta.title as string)

const isDark = ref<boolean>(false)
const theme = computed(() => isDark.value ? 'dark' : 'light')

</script>

<style lang="scss">
body {
  color: var(--van-text-color);
  background-color: var(--van-background);

  font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
}

.panel {
    width: auto;
    margin: 20px;
    background-color: var(--van-background-2);
    border-radius: 12px;
    padding: 16px 32px;
}
</style>

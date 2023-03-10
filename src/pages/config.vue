<template>
  <div class="main">
    <div class="panel flex items-center justify-between flex-wrap">
      <span>ダークモード</span>
      <van-switch v-model="configStore.config.isDark" />
    </div>

    <div class="panel flex items-center justify-between flex-wrap">
      <span>単日表示</span>
      <van-switch v-model="configStore.config.showAlone" />
    </div>

    <div class="panel flex items-center justify-between flex-wrap">
      <span>ズーム率</span>
      <DigitForm v-model="configStore.config.zoom" />
    </div>

    <div class="panel flex items-center justify-between flex-wrap">
      <span>日付を変更する時間</span>
      <HourForm v-model="configStore.config.startHour" />
    </div>

    <div class="panel flex items-center justify-between flex-wrap">
      <span>アラーム</span>
      <div class="flex gap-8 flex-wrap">
        <van-switch v-model="configStore.config.canNotify" />
        <HourForm v-model="configStore.config.notifyHour" :disabled="!configStore.config.canNotify" />
      </div>
    </div>

    <van-divider class="px-4 py-2" />

    <div class="panel flex flex-wrap gap-2">
      <van-button icon="share-o" type="success" plain @click="onBackup">
        日記のバックアップ
      </van-button>

      <van-button icon="description" type="primary" plain @click="onRestore">
        日記の復元
      </van-button>

      <input
        ref="uploadRef"
        class="hidden"
        type="file"
        accept=".json"
        @change="onUpload"
      >
    </div>

    <div class="panel">
      <van-button icon="warn-o" type="danger" plain @click="onClearDB">
        データの初期化
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { showConfirmDialog } from 'vant'

definePageMeta({ title: '設定' })

const articleStore = useArticleStore()
const configStore = useConfigStore()

const database = useDatabase()
const filer = useFiler()

const onClearDB = () => {
  showConfirmDialog({
    title: 'データの初期化',
    message: 'アプリのデータを初期化します。\nよろしいですか？',
    confirmButtonText: 'OK',
    confirmButtonColor: 'red',
  }).then(async () => {
    await database.dbWipe()

    window.location.reload()
  })
}

/// ////////////////////////////////////////////////////////////

const uploadRef = ref<HTMLInputElement>()

const onBackup = () => {
  showConfirmDialog({
    title: '日記のバックアップ',
    message: '全ての日記をファイルに出力します。',
    confirmButtonText: 'OK',
  }).then(async () => {
    await filer.share()
  })
}

const onRestore = () => {
  showConfirmDialog({
    title: '日記の復元',
    message: 'ファイルから日記を復元します。\n現在の日記は全て削除されます。\nよろしいですか？',
    confirmButtonText: 'OK',
  }).then(() => {
    uploadRef.value?.click()
  })
}

const onUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.item(0) ?? undefined

  if (file) {
    await filer.input(file)

    await articleStore.onFetchDate(DateTime.local())
  }
}
</script>

<template>
  <div class="main">
    <div class="panel">
      config
    </div>

    <div class="panel">
      <van-button icon="warn-o" type="danger" plain @click="onClearDB">
        データの初期化
      </van-button>
    </div>

    <div class="panel flex flex-wrap gap-2">
      <van-button icon="share-o" type="success" plain @click="filer.share()">
        日記のバックアップ
      </van-button>

      <van-button icon="description" type="primary" plain @click="onOpenUploader">
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
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { showConfirmDialog } from 'vant'

definePageMeta({ title: '設定' })

const articleStore = useArticleStore()
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

///

const uploadRef = ref<HTMLInputElement>()

const onOpenUploader = () => {
  uploadRef.value?.click()
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

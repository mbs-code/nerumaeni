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
  </div>
</template>

<script setup lang="ts">
import { showConfirmDialog } from 'vant'

definePageMeta({ title: '設定' })

const database = useDatabase()

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
</script>

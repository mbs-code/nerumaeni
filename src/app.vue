<template>
  <van-config-provider :theme="theme">
    <div class="h-screen flex flex-col van-doc-theme-dark">
      <van-nav-bar
        :title="title"
        @click-right="openCalendarDialog"
      >
        <template #right>
          <van-icon name="notes-o" />
        </template>
      </van-nav-bar>

      <div class="flex-grow">
        <!-- TODO: ダークモード対応 -->
        <!-- <van-cell center title="ダークモード">
          <template #right-icon>
            <van-switch v-model="isDark" />
          </template>
        </van-cell> -->

        <div
          class="border-y-1 overflow-y-scroll overflow-x-clip"
          :style="{ height: 'calc(100vh - 96px)' }"
        >
          <NuxtPage />
        </div>
      </div>

      <van-tabbar route>
        <van-tabbar-item replace icon="notes-o" :to="{ name: 'index' }">
          日記
        </van-tabbar-item>

        <van-tabbar-item icon="column" @click="openTodayArticleDialog">
          書き込み
        </van-tabbar-item>

        <van-tabbar-item replace icon="setting-o" :to="{ name: 'config' }">
          設定
        </van-tabbar-item>
      </van-tabbar>
    </div>

    <CalendarDrawer
      v-model="showCalendarDrawer"
      @input="onSelectedDate"
    />

    <ArticleEditDialog
      v-model="showArticleEditDialog"
      :article="selectedArticle"
      :date-time="selectedDateTime"
      @save="articleStore.fetch()"
      @delete="articleStore.fetch()"
    />
  </van-config-provider>
</template>

<script setup lang='ts'>
import { DateTime } from 'luxon'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'
import { useArticleStore } from '~~/src/composables/useArticleStore'
import { Article } from '~~/src/databases/models/Article'
import { testSeeder } from '~~/src/databases/seeders/TestSeeder'

const route = useRoute()
const title = computed(() => route.meta.title as string)

const isDark = ref<boolean>(false)
const theme = computed(() => isDark.value ? 'dark' : 'light')

/// ////////////////////////////////////////////////////////////

const articleStore = useArticleStore()
const database = useDatabase()

onMounted(async () => {
  await database.migrateToLatest()
  await testSeeder()

  await articleStore.fetch()
})

/// ////////////////////////////////////////////////////////////

const showArticleEditDialog = ref<boolean>(false)
const selectedArticle = ref<Article>()
const selectedDateTime = ref<DateTime>(DateTime.now())

const openTodayArticleDialog = async () => {
  // 今日の記事を探す
  const now = DateTime.now().startOf('day')
  const article = await ArticleAPI.getByDate(now)

  selectedArticle.value = article
  selectedDateTime.value = now
  showArticleEditDialog.value = true
}

/// ////////////////////////////////////////////////////////////

const showCalendarDrawer = ref<boolean>(false)

const openCalendarDialog = () => {
  showCalendarDrawer.value = true
}

const onSelectedDate = async (date: DateTime) => {
  // TODO: 対象の日に日記が無いなら編集、あるならそこを中心にリスト表示

  // 対象の日の記事を探す
  const target = date.startOf('day')
  const article = await ArticleAPI.getByDate(target)

  // 対象の日に日記がなければ新規作成
  if (!article) {
    selectedArticle.value = article
    selectedDateTime.value = target
    showArticleEditDialog.value = true
  }
}
</script>

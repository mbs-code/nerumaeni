<template>
  <van-config-provider :theme="theme" :style="{ zoom }">
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
        <NuxtPage />
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
      @save="articleStore.onFetchDate($event.date)"
      @delete="articleStore.onFetchDate($event.date)"
    />
  </van-config-provider>
</template>

<script setup lang='ts'>
import { DateTime } from 'luxon'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'
import { useArticleStore } from '~~/src/composables/useArticleStore'
import { Article } from '~~/src/databases/models/Article'

const route = useRoute()
const title = computed(() => route.meta.title as string)

const articleStore = useArticleStore()
const configStore = useConfigStore()

const theme = computed(() => configStore.config.isDark ? 'dark' : 'light')
const zoom = computed(() => configStore.config.zoom ?? 1)

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
  // 対象の日の記事を探す
  const target = date.startOf('day')
  const article = await ArticleAPI.getByDate(target)

  // 対象の日があればリスト表示, なければ新規作成
  if (article) {
    articleStore.onFetchDate(date)
  } else {
    selectedArticle.value = article
    selectedDateTime.value = target
    showArticleEditDialog.value = true
  }
}
</script>

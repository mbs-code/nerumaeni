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

        <van-tabbar-item icon="column" @click="openTodayArticle">
          書き込み
        </van-tabbar-item>

        <van-tabbar-item replace icon="setting-o" :to="{ name: 'config' }">
          設定
        </van-tabbar-item>
      </van-tabbar>
    </div>

    <ArticleEditDialog
      v-model="showArticleEditModal"
      :article="selectedArticle"
      :date-time="selectedDateTime"
      @save="articleStore.fetch()"
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

const isDark = ref<boolean>(false)
const theme = computed(() => isDark.value ? 'dark' : 'light')

/// ////////////////////////////////////////////////////////////

const articleStore = useArticleStore()
const database = useDatabase()

onMounted(async () => {
  await database.migrateToLatest()

  await articleStore.fetch()
})

/// ////////////////////////////////////////////////////////////

const showArticleEditModal = ref<boolean>(false)
const selectedArticle = ref<Article>()
const selectedDateTime = ref<DateTime>(DateTime.now())

const openArticleEditModal = () => {
  // TODO: 今日の記事を探す
  // selectedArticle.value = undefined
  // selectedDateTime.value = DateTime.now().startOf('day')
  // showArticleEditModal.value = true
}

const openTodayArticle = async () => {
  // 今日の記事を探す
  const now = DateTime.now().startOf('day')
  const article = await ArticleAPI.getByDate(now)

  selectedArticle.value = article
  selectedDateTime.value = now
  showArticleEditModal.value = true
}
</script>

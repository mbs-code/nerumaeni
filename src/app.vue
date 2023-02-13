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
      v-model="articleDialogStore.showDialog"
      :article="articleDialogStore.selectedArticle"
      :date-time="articleDialogStore.selectedDateTime"
      @save="articleStore.onFetchDate($event.date)"
      @delete="articleStore.onFetchDate($event.date)"
    />
  </van-config-provider>
</template>

<script setup lang='ts'>
import { DateTime } from 'luxon'
import { App as CapacitorApp } from '@capacitor/app'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'
import { useArticleDialogStore } from '~~/src/composables/useArticleDialogStore'
import { useArticleStore } from '~~/src/composables/useArticleStore'
import { Article } from '~~/src/databases/models/Article'

const route = useRoute()
const router = useRouter()
const title = computed(() => route.meta.title as string)

const articleStore = useArticleStore()
const articleDialogStore = useArticleDialogStore()
const configStore = useConfigStore()

const theme = computed(() => configStore.config.isDark ? 'dark' : 'light')

/// ////////////////////////////////////////////////////////////
// Article ダイアログ管理
/// ////////////////////////////////////////////////////////////

const showArticleEditDialog = ref<boolean>(false)
const selectedArticle = ref<Article>()
const selectedDateTime = ref<DateTime>(DateTime.now())

const openTodayArticleDialog = async () => {
  // 今日の記事を探す
  const padHour = configStore.config.startHour ?? 0
  const now = DateTime.now().minus({ hour: padHour }).startOf('day')
  const article = await ArticleAPI.getByDate(now)

  articleDialogStore.open(article, now)
}

/// ////////////////////////////////////////////////////////////
// Calendar ドロワー管理
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

/// ////////////////////////////////////////////////////////////
// android 戻るボタン管理
/// ////////////////////////////////////////////////////////////

onMounted(() => {
  CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    // ダイアログが開いてたら閉じる
    if (articleDialogStore.showDialog) {
      articleDialogStore.showDialog = false
      return
    }

    // カレンダーが開いてたら閉じる
    if (showCalendarDrawer.value) {
      showCalendarDrawer.value = false
      return
    }

    // もし URL が index でないなら移動
    console.log(route)
    if (route.name !== 'index') {
      router.replace({ name: 'index' })
      return
    }

    // それ以外は capacitor に従う
    if (!canGoBack) {
      CapacitorApp.exitApp()
    } else {
      window.history.back()
    }
  })
})

/// ////////////////////////////////////////////////////////////
// ズーム率監視
/// ////////////////////////////////////////////////////////////

const zoom = computed(() => configStore.config.zoom ?? 1)

const viewportHeight = computed(() => 100 / zoom.value)
const scrollHeight = computed(() => `calc(${viewportHeight.value}vh - 96px)`)

useHead({
  bodyAttrs: {
    style: () => `zoom: ${zoom.value};`,
  },
})

/// ////////////////////////////////////////////////////////////
// アラーム監視
/// ////////////////////////////////////////////////////////////

const notify = useNotify()

watch(() => [configStore.config.canNotify, configStore.config.notifyHour], async () => {
  await notify.reset()
})
</script>

<style lang="scss">
.main {
  height: v-bind(scrollHeight);
}

.h-screen {
  height: v-bind(viewportHeight);
}
</style>

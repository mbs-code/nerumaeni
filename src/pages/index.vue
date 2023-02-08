<template>
  <div ref="infiniteRef" class="main">
    <template v-for="(article, _) of articleStore.articles" :key="_">
      <div
        :name="article.date.toFormat('yyyyMMdd')"
        class="panel"
        @dblclick="openArticleDialog(article)"
      >
        <div class="flex items-center justify-between flex-wrap gap-1">
          <h2 class="text-lg font-bold">
            {{ article.date.setLocale('ja-JP').toFormat('M月d日 (EEE)') }}
          </h2>

          <AppRate
            :model-value="article.rate"
            :size="22"
            class="pointer-events-none"
          />
        </div>

        <hr class="my-2">

        <div class="whitespace-pre-wrap break-all">
          {{ article.text }}
        </div>
      </div>
    </template>

    <ArticleEditDialog
      v-model="showArticleEditModal"
      :article="selectedArticle"
      :date-time="selectedDateTime"
      @save="articleStore.onFetchDate($event.date)"
      @delete="articleStore.onFetchDate($event.date)"
    />
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useArticleStore } from '~~/src/composables/useArticleStore'
import { Article } from '~~/src/databases/models/Article'

definePageMeta({ title: '日記' })

const articleStore = useArticleStore()
const configStore = useConfigStore()

/// ////////////////////////////////////////////////////////////

const infiniteRef = ref()

onMounted(async () => {
  // 今日の記事を探す
  const padHour = configStore.config.startHour ?? 0
  const now = DateTime.now().minus({ hour: padHour }).startOf('day')
  await articleStore.onFetchDate(now)

  // TL自動更新用
  useInfiniteScroll(
    () => infiniteRef.value,
    () => articleStore.onFetchOldest(),
    { distance: 10, direction: 'top' },
  )

  // TL自動更新用
  useInfiniteScroll(
    () => infiniteRef.value,
    () => articleStore.onFetchLatest(),
    { distance: 10, direction: 'bottom' },
  )
})

/// ////////////////////////////////////////////////////////////

const showArticleEditModal = ref<boolean>(false)
const selectedArticle = ref<Article>()
const selectedDateTime = ref<DateTime>(DateTime.now())

const openArticleDialog = (article: Article) => {
  selectedArticle.value = article
  selectedDateTime.value = article.date
  showArticleEditModal.value = true
}
</script>

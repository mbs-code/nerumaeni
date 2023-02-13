<template>
  <div ref="infiniteRef" class="main">
    <template v-for="(article, _) of articleStore.articles" :key="_">
      <div
        :name="article.date.toFormat('yyyyMMdd')"
        class="panel"
        @dblclick="onEdit(article)"
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

    <template v-if="articleStore.articles.length === 0">
      <div class="panel">
        日記がありません。
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useArticleDialogStore } from '~~/src/composables/useArticleDialogStore'
import { Article } from '~~/src/databases/models/Article'

definePageMeta({ title: '日記' })

const articleStore = useArticleStore()
const articleDialogStore = useArticleDialogStore()
const configStore = useConfigStore()

/// ////////////////////////////////////////////////////////////

const infiniteRef = ref()

onMounted(async () => {
  // 今日の記事を探す
  const padHour = configStore.config.startHour ?? 0
  const now = DateTime.now().minus({ hour: padHour }).startOf('day')
  await articleStore.onFetchDate(now)

  nextTick(() => {
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
})

/// ////////////////////////////////////////////////////////////

const onEdit = (article: Article) => {
  articleDialogStore.open(article)
}
</script>

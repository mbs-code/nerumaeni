<template>
  <div ref="infiniteRef" class="main">
    <template v-for="(article, _) of articleStore.articles" :key="_">
      <div
        :name="article.date.toFormat('yyyyMMdd')"
        class="panel"
        @dblclick="emit('edit', article)"
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
import { useArticleStore } from '~~/src/composables/useArticleStore'
import { Article } from '~~/src/databases/models/Article'

const configStore = useConfigStore()
const articleStore = useArticleStore()

const infiniteRef = ref()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'edit', value: Article): void,
}>()

/// ////////////////////////////////////////////////////////////

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
</script>

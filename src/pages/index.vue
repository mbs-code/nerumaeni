<template>
  <div>
    <template v-for="(article, _) of articleStore.articles" :key="_">
      <div class="panel">
        <div class="flex items-center justify-between flex-wrap">
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
  </div>
</template>

<script setup lang="ts">
import { useArticleStore } from '~~/src/composables/useArticleStore'

definePageMeta({ title: 'ホーム' })

const articleStore = useArticleStore()
</script>

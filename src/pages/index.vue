<template>
  <div>
    <template v-for="(article, _) of articleStore.articles" :key="_">
      <div class="panel" @dblclick="openArticleDialog(article)">
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
      @save="articleStore.fetch()"
    />
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useArticleStore } from '~~/src/composables/useArticleStore'
import { Article } from '~~/src/databases/models/Article'

definePageMeta({ title: 'ホーム' })

const articleStore = useArticleStore()

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

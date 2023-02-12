<template>
  <div>
    <ArticleTimeline @edit="openArticleDialog" />

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
import { Article } from '~~/src/databases/models/Article'

definePageMeta({ title: '日記' })

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

<template>
  <div>
    <template v-for="(article, _) of articles" :key="_">
      <div class="panel">
        {{ article }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Article } from '~~/src/databases/entity'

definePageMeta({ title: 'ホーム' })

const articles = ref<Article[]>([])

const fetchArticles = async () => {
  articles.value = await Article.find()
}

onMounted(async () => await fetchArticles())
</script>

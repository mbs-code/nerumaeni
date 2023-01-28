<template>
  <div>
    <template v-for="(article, _) of articleStore.articles" :key="_">
      <div class="panel">
        {{ article }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useArticleStore } from '~~/src/composables/useArticleStore'

definePageMeta({ title: 'ホーム' })

const articleStore = useArticleStore()
</script>

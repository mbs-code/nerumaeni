import { defineStore } from 'pinia'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'
import { Article } from '~~/src/databases/models/Article'

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])

  const fetch = async () => {
    // TODO: 検索、無限スクロール機能
    const items = await ArticleAPI.getAll()
    articles.value = items
  }

  return {
    articles,
    fetch,
  }
})

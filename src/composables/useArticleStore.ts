import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { Article } from '~~/src/databases/entity'

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])

  const fetch = async () => {
    // TODO: 検索、無限スクロール機能
    const items = await Article.find()
    articles.value = items
  }

  const getByDay = async (dateTime: DateTime) => {
    const article = await Article.findOneBy({ date: dateTime.toFormat('yyyy-MM-dd') })
    return article ?? undefined
  }

  return {
    articles,
    fetch,

    getByDay,
  }
})

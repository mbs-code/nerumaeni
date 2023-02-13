import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { Article } from '~~/src/databases/models/Article'

export const useArticleDialogStore = defineStore('articleDialog', () => {
  const showDialog = ref<boolean>(false)
  const selectedArticle = ref<Article>()
  const selectedDateTime = ref<DateTime>(DateTime.now())

  const open = (article?: Article, date?: DateTime) => {
    const dateTime = date ?? article?.date
    if (dateTime) {
      selectedArticle.value = article
      selectedDateTime.value = dateTime
      showDialog.value = true
    }
  }

  return {
    showDialog,
    selectedArticle,
    selectedDateTime,

    open,
  }
})

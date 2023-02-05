import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'
import { Article, SearchArticle } from '~~/src/databases/models/Article'

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])

  const _fetch = async (search?: SearchArticle) => {
    const items = await ArticleAPI.getAll({
      limit: 5,
      ...search,
    })

    // ソート済み配列に追加する
    for (const item of items) {
      // 日付が自身を超えるところを探す
      const overIdx = articles.value.findIndex(a => a.date > item.date)

      // あればそのidxに、なければ末尾に
      if (overIdx >= 0) {
        articles.value.splice(overIdx, 0, item)
      } else {
        articles.value.push(item)
      }
    }
  }

  /** 特定の日を中心に取得 */
  const onFetchDate = async (date: DateTime) => {
    // 値を初期化する
    articles.value = []

    await _fetch({ before: date, order: 'desc', canSame: true }) // 上側を取得
    await _fetch({ after: date, order: 'asc' }) // 下側を取得

    // 対象のdateに一番近いidxを取得（なければ末尾）
    const overIdx = articles.value.findIndex(a => a.date >= date)
    const article = articles.value.at(overIdx) ?? articles.value[articles.value.length - 1]

    // スクロールさせる
    if (article) {
      const domName = article?.date.toFormat('yyyyMMdd')
      nextTick(() => {
        document.querySelector(`[name="${domName}"]`)
          ?.scrollIntoView()
      })
    }
  }

  /** より古いものを取得 */
  const onFetchOldest = async () => {
    const oldest = articles.value[0]
    await _fetch({ before: oldest.date, order: 'desc' }) // 上側を取得

    // 取得前の先頭にスクロール
    if (oldest) {
      const domName = oldest?.date.toFormat('yyyyMMdd')
      nextTick(() => {
        document.querySelector(`[name="${domName}"]`)
          ?.scrollIntoView()
      })
    }
  }

  /** より新しいものを取得 */
  const onFetchLatest = async () => {
    const latest = articles.value[articles.value.length - 1]
    await _fetch({ after: latest.date, order: 'asc' }) // 下側を取得

    // NOTE: スクロールは特にしない
  }

  return {
    articles,

    onFetchDate,
    onFetchOldest,
    onFetchLatest,
  }
})

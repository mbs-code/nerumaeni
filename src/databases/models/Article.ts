import { DateTime } from 'luxon'
import { MetaColumns } from '~~/src/databases/Tables'

export type DBArticle = {
  id?: number
  date: string // yyyy-mm-dd
  rate: number // 0-5
  text: string
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Article = {
  id: number
  date: DateTime
  rate: number // 0-5
  text: string
  createdAt: DateTime
  updatedAt: DateTime
}

export type FormArticle = Partial<{
  date: DateTime
  rate: number
  text: string
}>

export const formatArticle = (db: DBArticle): Article => {
  return {
    id: db.id as number,
    date: DateTime.fromISO(db.date),
    rate: db.rate,
    text: db.text,
    createdAt: DateTime.fromISO(db.created_at),
    updatedAt: DateTime.fromISO(db.updated_at),
  }
}

export const parseArticle = (form: FormArticle): Omit<DBArticle, MetaColumns> => {
  // TODO: 簡易バリデ
  // const date = form.date?.trim()
  // if (!date) { throw new Error('名称が空欄です。') }
  // const icon = form.icon?.trim()
  // if (icon && icon.length >= 3) { throw new Error('アイコン名は2文字まで入力可能です。') }

  if (!form.date) { throw new Error('valid error') }
  if (!form.text || !form.text.trim()) { throw new Error('valid error') }

  return {
    date: form.date.toFormat('yyyy-MM-dd'),
    rate: form.rate ?? 0,
    text: form.text,
  }
}

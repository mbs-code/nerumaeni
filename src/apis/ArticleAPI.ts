import { DateTime } from 'luxon'
import { Article, FormArticle, formatArticle, parseArticle } from '~~/src/databases/models/Article'

export class ArticleAPI {
  public static async getAll (): Promise<Article[]> {
    const { db } = useDatabase()

    const items = await db
      .selectFrom('articles')
      .selectAll()
      .execute()

    return items.map(item => formatArticle(item))
  }

  /// ////////////////////////////////////////

  public static async get (id: number): Promise<Article> {
    const { db } = useDatabase()

    const item = await db
      .selectFrom('articles')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    if (!item) { throw new Error(`取得に失敗しました。(a${id})`) }

    return formatArticle(item)
  }

  public static async create (form: FormArticle): Promise<Article> {
    const { db } = useDatabase()
    const parse = parseArticle(form)

    const { insertId } = await db
      .insertInto('articles')
      .values({
        ...parse,
        created_at: DateTime.now().toISO(),
        updated_at: DateTime.now().toISO(),
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update (id: number, form: FormArticle): Promise<Article> {
    const { db } = useDatabase()
    const parse = parseArticle(form)

    const { numUpdatedRows } = await db
      .updateTable('articles')
      .set({
        ...parse,
        updated_at: DateTime.now().toISO(),
      })
      .where('id', '=', id)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error(`更新に失敗しました。(a${id})`)
    }

    return await this.get(Number(id))
  }

  public static async remove (id: number): Promise<boolean> {
    const { db } = useDatabase()

    const { numDeletedRows } = await db
      .deleteFrom('articles')
      .where('id', '=', id)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error(`削除に失敗しました。(a${id})`)
    }

    return true
  }
}

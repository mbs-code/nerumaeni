import { Filesystem } from '@capacitor/filesystem'
import { Directory, Encoding } from '@capacitor/filesystem/dist/esm/definitions'
import { Share } from '@capacitor/share'
import { DateTime } from 'luxon'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'

export const useFiler = () => {
  const { db } = useDatabase()

  const share = async () => {
    // 全てのarticleを取り出す
    const articles = await db
      .selectFrom('articles')
      .selectAll()
      .orderBy('date', 'asc')
      .execute()

    // ファイルを cache に作成
    const json = JSON.stringify(articles)
    const timestamp = DateTime.local().toFormat('yyyyMMddHHmmss')
    const filename = `nerumaeni_${timestamp}.json`

    const res = await Filesystem.writeFile({
      path: filename,
      data: json,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
      recursive: true,
    })

    // 作成したファイルをシェア
    await Share.share({
      title: filename,
      files: [res.uri],
    })
  }

  const input = async (file: File) => {
    // ファイルからテキストを読み込む
    const json = await _readFile(file)

    // objectに変換
    const items = JSON.parse(json ?? '')

    // TODO: エラーチェック

    // 現在存在する article を削除する
    // TODO: 削除確認
    await ArticleAPI.clear()

    // article を保存していく
    await db
      .insertInto('articles')
      .values(items)
      .executeTakeFirst()
  }

  const _readFile = (file: File): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = event => resolve(event.target?.result?.toString() ?? undefined)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  return {
    share,
    input,
  }
}

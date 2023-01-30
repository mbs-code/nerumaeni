import { DateTime } from 'luxon'
import { ArticleAPI } from '~~/src/apis/ArticleAPI'

export const testSeeder = async () => {
  await ArticleAPI.create({
    date: DateTime.local(2023, 1, 30),
    rate: 4,
    text: 'ダミーテキスト\n' +
      'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdas\n' +
      'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdas\n',
  })

  for (let i = 0; i < 20; i++) {
    await ArticleAPI.create({
      date: DateTime.local(2022, 12, 1).plus({ day: 1 * i }),
      rate: i % 5,
      text: 'ダミーテキスト\n' +
        'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdas\n' +
        'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdas\n',
    })
  }
}

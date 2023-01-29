import { DataSource } from 'typeorm'
import { Article } from '~~/src/databases/entity'

import { CreateArticleTable1674382037755 } from '~~/src/databases/migration/1674382037755-CreateArticleTable'

export const initDataSource = (driver: any) => {
  return new DataSource({
    type: 'capacitor',
    driver,
    database: 'app',
    entities: [
      Article,
    ],
    migrations: [
      CreateArticleTable1674382037755,
    ],
  })
}

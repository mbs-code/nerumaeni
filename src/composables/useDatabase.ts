import { DataSource } from 'typeorm'

export const useDataSource = (): DataSource => {
  const { $db } = useNuxtApp()
  if (!$db) {
    throw new Error('DB connection error.')
  }

  return $db
}

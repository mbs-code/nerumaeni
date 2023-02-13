import { Capacitor } from '@capacitor/core'

export default defineNuxtPlugin(async () => {
  // web 以外なら設定読み込み
  const platform = Capacitor.getPlatform()

  if (platform !== 'web') {
    const configStore = useConfigStore()
    await configStore.onLoad()
  }
})

export default defineNuxtPlugin(async () => {
  // 設定読み込み
  const configStore = useConfigStore()
  await configStore.onLoad()
})

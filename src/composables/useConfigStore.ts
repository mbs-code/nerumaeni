import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { defineStore } from 'pinia'

export type Config = {
  isDark: boolean
  zoom: number
}

const filename = 'config.json'

export const useConfigStore = defineStore('configs', () => {
  const isLoading = ref<boolean>(false)
  const config = ref<Partial<Config>>({})

  const load = async () => {
    // ファイルを読み込む
    const file = await Filesystem.readFile({
      path: filename,
      directory: Directory.External,
      encoding: Encoding.UTF8,
    })

    // TODO: ローディング、バリデなど

    config.value = JSON.parse(file.data)
  }

  const save = async () => {
    // ファイルを書き出す
    await Filesystem.writeFile({
      path: filename,
      data: JSON.stringify(config.value),
      directory: Directory.External,
      encoding: Encoding.UTF8,
      recursive: true,
    })

    // TODO: ローディングなど
  }

  ///

  onMounted(async () => {
    try {
      isLoading.value = true

      await load()
    } finally {
      isLoading.value = false
    }
  })

  watch(() => config.value, async () => {
    if (isLoading.value) { return }

    try {
      isLoading.value = true

      await save()
    } finally {
      isLoading.value = false
    }
  }, { deep: true })

  return {
    config,

    save,
  }
})
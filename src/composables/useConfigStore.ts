import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { defineStore } from 'pinia'

export type Config = {
  isDark: boolean
  zoom: number
  showAlone: boolean
  startHour: number

  canNotify: boolean
  notifyHour: number
}

const filename = 'config.json'

export const useConfigStore = defineStore('configs', () => {
  const isLoading = ref<boolean>(false)
  const config = ref<Partial<Config>>({})

  const _load = async () => {
    // ファイルを読み込む
    const file = await Filesystem.readFile({
      path: filename,
      directory: Directory.External,
      encoding: Encoding.UTF8,
    })

    // TODO: ローディング、バリデなど

    config.value = JSON.parse(file.data)
    console.log('load')
  }

  const _save = async () => {
    // ファイルを書き出す
    await Filesystem.writeFile({
      path: filename,
      data: JSON.stringify(config.value),
      directory: Directory.External,
      encoding: Encoding.UTF8,
      recursive: true,
    })

    // TODO: ローディングなど
    console.log('save')
  }

  /// ////////////////////////////////////////////////////////////

  watch(() => config.value, async () => await onSave(), { deep: true })

  const onLoad = async () => {
    try {
      isLoading.value = true

      await _load()
    } finally {
      isLoading.value = false
    }
  }

  const onSave = async () => {
    if (isLoading.value) { return }

    try {
      isLoading.value = true

      await _save()
    } finally {
      isLoading.value = false
    }
  }

  return {
    config,

    onLoad,
    onSave,
  }
})

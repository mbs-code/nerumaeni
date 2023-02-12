import { LocalNotifications } from '@capacitor/local-notifications'

export const useNotify = () => {
  const configStore = useConfigStore()

  const clearAll = async () => {
    const pendings = await LocalNotifications.getPending()

    if (pendings.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pendings.notifications,
      })
    }
  }

  const reset = async () => {
    // 一旦全ての通知をOFFにする
    await clearAll()

    // 通知をONにする
    if (configStore.config.canNotify) {
      const hour = configStore.config.notifyHour ?? 0

      return await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'nerumaeni',
            body: '本日もお疲れ様です！\n日記を書く時間になりました！',
            schedule: { on: { hour, minute: 0 }, allowWhileIdle: true, repeats: true },
          },
        ],
      })
    }
  }

  return {
    clearAll,
    reset,
  }
}

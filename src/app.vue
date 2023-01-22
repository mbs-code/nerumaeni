<template>
  <van-config-provider :theme="theme">
    <div class="h-screen flex flex-col van-doc-theme-dark">
      <van-nav-bar :title="title" />

      <div class="flex-grow">
        <van-cell center title="ダークモード">
          <template #right-icon>
            <van-switch v-model="isDark" />
          </template>
        </van-cell>

        <div>{{ keepArticle }}</div>

        <NuxtPage />
      </div>

      <van-tabbar route>
        <van-tabbar-item replace icon="home-o" :to="{ name: 'index' }">
          ホーム
        </van-tabbar-item>
        <van-tabbar-item replace icon="setting-o" :to="{ name: 'config' }">
          設定
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </van-config-provider>
</template>

<script setup lang='ts'>
import { Article } from '~~/src/databases/entity/article'

const keepArticle = ref<Article>()

onMounted(async () => {
  const article = new Article()
  article.date = String(new Date())
  article.rate = 5
  article.text = 'asdasd'
  await article.save()

  // eslint-disable-next-line no-console
  console.log(article)
  keepArticle.value = article
})

const route = useRoute()
const title = computed(() => route.meta.title as string)

const isDark = ref<boolean>(false)
const theme = computed(() => isDark.value ? 'dark' : 'light')
</script>

<style lang="scss">
body {
  color: var(--van-text-color);
  background-color: var(--van-background);

  font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
}

.panel {
  width: auto;
  margin: 20px;
  background-color: var(--van-background-2);
  border-radius: 12px;
  padding: 16px 32px;
}
</style>

<template>
  <van-config-provider :theme="theme">
    <div class="h-screen flex flex-col van-doc-theme-dark">
      <van-nav-bar :title="title" />

      <div class="flex-grow">
        <NuxtPage />
      </div>

      <van-tabbar route>
        <van-tabbar-item replace icon="home-o" :to="{ name: 'index' }">ホーム</van-tabbar-item>
        <van-tabbar-item replace icon="setting-o" :to="{ name: 'config' }">設定</van-tabbar-item>
      </van-tabbar>
    </div>
  </van-config-provider>
</template>

<script setup lang='ts'>
const route = useRoute()
const title = computed(() => route.meta.title as string)

const theme = ref<'light' | 'dark'>('light')
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

import eslint from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',

  css: [
    'vant/lib/index.css',
    '~~/src/assets/css/main.scss',
  ],

  modules: [
    'nuxt-windicss',
  ],

  vite: {
    plugins: [
      eslint({ fix: true, include: 'src/**/*.{js,ts,vue}' }),
    ],
  },
})

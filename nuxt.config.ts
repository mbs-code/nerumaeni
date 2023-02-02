import eslint from 'vite-plugin-eslint'

const isProduction = process.env.NODE_ENV === 'production'

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
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  vite: {
    plugins: [
      isProduction
        ? undefined
        : eslint({ fix: true, include: 'src/**/*.{js,ts,vue}' }),
    ],
  },
})

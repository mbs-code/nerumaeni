import eslint from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',

  modules: [
    'nuxt-windicss',
  ],

  vite: {
    plugins: [
      eslint({ fix: true, include: 'src/**/*.{js,ts,vue}' }),
    ],
  },
})

import {
  Cell,
  CellGroup,
  ConfigProvider,
  NavBar,
  Switch,
  Tabbar,
  TabbarItem,
} from 'vant'

import 'vant/lib/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ConfigProvider)
  nuxtApp.vueApp.use(NavBar)
  nuxtApp.vueApp.use(Tabbar)
  nuxtApp.vueApp.use(TabbarItem)
  nuxtApp.vueApp.use(Cell)
  nuxtApp.vueApp.use(CellGroup)
  nuxtApp.vueApp.use(Switch)
})

import {
  Button,
  Cell,
  CellGroup,
  ConfigProvider,
  Field,
  Icon,
  Locale,
  NavBar,
  Popup,
  Rate,
  Switch,
  Tabbar,
  TabbarItem,
} from 'vant'
import jaJP from 'vant/es/locale/lang/ja-JP'

export default defineNuxtPlugin((nuxtApp) => {
  Locale.use('ja-JP', jaJP)

  nuxtApp.vueApp.use(ConfigProvider)
  nuxtApp.vueApp.use(NavBar)
  nuxtApp.vueApp.use(Tabbar)
  nuxtApp.vueApp.use(TabbarItem)
  nuxtApp.vueApp.use(Cell)
  nuxtApp.vueApp.use(CellGroup)
  nuxtApp.vueApp.use(Switch)
  nuxtApp.vueApp.use(Rate)
  nuxtApp.vueApp.use(CellGroup)
  nuxtApp.vueApp.use(Field)
  nuxtApp.vueApp.use(Popup)
  nuxtApp.vueApp.use(NavBar)
  nuxtApp.vueApp.use(Icon)
  nuxtApp.vueApp.use(Button)
})

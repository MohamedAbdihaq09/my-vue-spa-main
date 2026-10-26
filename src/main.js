import { createApp, watch } from 'vue'
import './style.css'
import App from './App.vue'
import { locale } from './i18n.js'
import router from './router'

watch(
  locale,
  (value) => {
    document.documentElement.lang = value
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr'
  },
  { immediate: true },
)

createApp(App).use(router).mount('#app')

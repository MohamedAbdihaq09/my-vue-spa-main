<template>
  <div class="museum-shell">
    <header class="site-header">
      <div class="header-topline">
        <RouterLink
          class="brand-lockup"
          :to="{ name: 'map' }"
          :aria-label="t('shell.homeLabel')"
        >
          <span class="brand-mark">SMK</span>
          <span class="brand-name">{{ t('shell.brandName') }}</span>
        </RouterLink>
        <div class="header-tools">
          <span class="header-note">{{ t('shell.headerNote') }}</span>
          <select
            class="language-select"
            :value="currentLocale"
            :aria-label="t('shell.languageLabel')"
            @change="changeLocale"
          >
            <option v-for="language in languages" :key="language.code" :value="language.code">
              {{ language.label }}
            </option>
          </select>
        </div>
      </div>
      <nav class="primary-nav" :aria-label="t('shell.navigationLabel')">
        <RouterLink :to="{ name: 'map' }">{{ t('nav.explore') }}</RouterLink>
        <RouterLink :to="{ name: 'find' }">{{ t('nav.find') }}</RouterLink>
      </nav>
    </header>
    <RouterView />
    <footer class="site-footer">
      {{ t('shell.footer') }}
    </footer>
    <VisitorUtilityBar />
  </div>
</template>

<script>
import VisitorUtilityBar from './VisitorUtilityBar.vue'
import { languages, locale, t } from '../i18n.js'

export default {
  name: 'MuseumShell',
  components: {
    VisitorUtilityBar,
  },
  data() {
    return {
      languages,
    }
  },
  computed: {
    currentLocale() {
      return locale.value
    },
  },
  methods: {
    t,
    changeLocale(event) {
      locale.value = event.target.value
    },
  },
}
</script>

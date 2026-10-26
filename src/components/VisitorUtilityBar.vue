<template>
  <aside class="utility-bar" :aria-label="t('utility.ariaLabel')">
    <div class="utility-inner">
      <span class="utility-heading">{{ t('utility.heading') }}</span>
      <nav class="utility-actions" :aria-label="t('utility.heading')">
        <a
          class="utility-link"
          href="https://www.smk.dk/en/section/visit-smk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('utility.openingHours') }}
        </a>
        <a
          class="utility-link"
          href="https://www.smk.dk/en/?s=audio+guide"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('utility.audioGuides') }}
        </a>
        <RouterLink
          v-for="facility in facilities"
          :key="facility.id"
          class="utility-link"
          :to="{ name: 'map', query: { place: facility.id } }"
        >
          {{ t(`places.${facility.id}.name`) }}
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

<script>
import { t } from '../i18n.js'

export default {
  name: 'VisitorUtilityBar',
  data() {
    return {
      facilities: [
        { id: 'lockers' },
        { id: 'cafe' },
        { id: 'restrooms' },
      ],
    }
  },
  methods: {
    t,
  },
}
</script>

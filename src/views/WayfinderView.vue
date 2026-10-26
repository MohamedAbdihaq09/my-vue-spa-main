<template>
  <main class="page-content">
    <section :aria-labelledby="t('wayfinder.titleId')">
      <p class="eyebrow">{{ t('wayfinder.eyebrow') }}</p>
      <h1 :id="t('wayfinder.titleId')" class="page-title">{{ t('wayfinder.title') }}</h1>
      <p class="page-intro">{{ t('wayfinder.intro') }}</p>
    </section>

    <section class="wayfinder-layout" :aria-label="t('wayfinder.ariaLabel')">
      <div class="wayfinder-panel">
        <h2>{{ t('wayfinder.panelTitle') }}</h2>
        <label class="search-label" for="destination-search">{{ t('wayfinder.searchLabel') }}</label>
        <input
          id="destination-search"
          v-model="searchQuery"
          class="search-input"
          type="search"
          :placeholder="t('wayfinder.searchPlaceholder')"
          autocomplete="off"
        />

        <div v-if="filteredDestinations.length" class="destination-results">
          <button
            v-for="destination in filteredDestinations"
            :key="destination.id"
            class="destination-button"
            :class="{ 'is-selected': selectedDestinationId === destination.id }"
            type="button"
            :aria-pressed="selectedDestinationId === destination.id"
            @click="selectDestination(destination)"
          >
            <span class="destination-name">{{ t(`destinations.${destination.id}.name`) }}</span>
            <span class="destination-row">
              <span class="destination-type">{{ t(`destinations.${destination.id}.kind`) }}</span>
              <span class="destination-type">{{ t(`destinations.${destination.id}.zone`) }}</span>
            </span>
          </button>
        </div>
        <p v-else class="muted-copy" role="status">
          {{ t('wayfinder.noResults') }}
        </p>
      </div>

      <article v-if="selectedDestination" class="destination-list" aria-live="polite">
        <p class="eyebrow">{{ t(`destinations.${selectedDestination.id}.kind`) }}</p>
        <h2>{{ t(`destinations.${selectedDestination.id}.name`) }}</h2>
        <p class="muted-copy">{{ t(`destinations.${selectedDestination.id}.zone`) }}</p>
        <p class="route-origin">{{ t('wayfinder.routeOrigin') }}</p>
        <ol class="direction-list" :aria-label="t('wayfinder.directionsLabel')">
          <li
            v-for="(step, index) in t(`destinations.${selectedDestination.id}.directions`)"
            :key="index"
          >
            {{ step }}
          </li>
        </ol>
        <aside class="notice" :aria-label="t('wayfinder.noticeLabel')">
          <span aria-hidden="true">i</span>
          <span>
            <strong>{{ t('wayfinder.noticeTitle') }}</strong>
            {{ t('wayfinder.noticeBody') }}
          </span>
        </aside>
      </article>
      <article v-else class="destination-list">
        <p class="eyebrow">{{ t('wayfinder.emptyEyebrow') }}</p>
        <h2>{{ t('wayfinder.emptyTitle') }}</h2>
        <p class="muted-copy">{{ t('wayfinder.emptyBody') }}</p>
      </article>
    </section>
  </main>
</template>

<script>
import { t } from '../i18n.js'

export default {
  name: 'WayfinderView',
  data() {
    return {
      searchQuery: '',
      selectedDestinationId: 'european-highlight',
      destinations: [
        {
          id: 'european-highlight',
          name: 'European painting highlight',
          kind: 'Collection highlight · example',
          zone: 'European Art 1300–1800',
          directions: [
            'From the main entrance, follow the signs toward the European Art galleries.',
            'Turn toward the historic collections at the next gallery junction.',
            'Continue through the gallery and look for the European painting highlights.',
          ],
        },
        {
          id: 'golden-age-landscape',
          name: 'Golden Age landscape highlight',
          kind: 'Artwork highlight · example',
          zone: 'Danish Golden Age',
          directions: [
            'From the main entrance, follow the signs toward the Danish Golden Age galleries.',
            'Turn into the Danish collection area when you reach the gallery junction.',
            'Look for landscape works in the Danish Golden Age galleries.',
          ],
        },
        {
          id: 'modern-highlight',
          name: 'Modern art highlight',
          kind: 'Collection highlight · example',
          zone: 'Modern Art',
          directions: [
            'From the main entrance, follow the signs toward the Modern Art galleries.',
            'Turn toward the modern collections at the next gallery junction.',
            'Continue into the Modern Art galleries to find the featured works.',
          ],
        },
        {
          id: 'european-galleries',
          name: 'European Art 1300–1800 galleries',
          kind: 'Gallery area · example',
          zone: 'European Art 1300–1800',
          directions: [
            'Start at the main entrance and follow the signs to the European Art area.',
            'Turn toward the historic collection galleries at the next junction.',
            'Follow the gallery signs to explore the European Art rooms.',
          ],
        },
        {
          id: 'golden-age-galleries',
          name: 'Danish Golden Age galleries',
          kind: 'Gallery area · example',
          zone: 'Danish Golden Age',
          directions: [
            'Start at the main entrance and follow the signs to the Danish collection.',
            'Turn toward the Danish Golden Age galleries at the next junction.',
            'Follow the gallery signs into the collection rooms.',
          ],
        },
        {
          id: 'modern-galleries',
          name: 'Modern Art galleries',
          kind: 'Gallery area · example',
          zone: 'Modern Art',
          directions: [
            'Start at the main entrance and follow the signs toward Modern Art.',
            'Turn toward the modern collections at the next junction.',
            'Follow the gallery signs to the Modern Art rooms.',
          ],
        },
      ],
    }
  },
  computed: {
    filteredDestinations() {
      const query = this.searchQuery.trim().toLocaleLowerCase()
      if (!query) return this.destinations

      return this.destinations.filter((destination) =>
        `${destination.name} ${destination.kind} ${destination.zone} ${this.t(`destinations.${destination.id}.name`)} ${this.t(`destinations.${destination.id}.kind`)} ${this.t(`destinations.${destination.id}.zone`)}`
          .toLocaleLowerCase()
          .includes(query),
      )
    },
    selectedDestination() {
      return this.destinations.find(
        (destination) => destination.id === this.selectedDestinationId,
      )
    },
  },
  methods: {
    t,
    selectDestination(destination) {
      this.selectedDestinationId = destination.id
    },
  },
}
</script>

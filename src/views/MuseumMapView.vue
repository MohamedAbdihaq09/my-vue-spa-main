<template>
  <main class="page-content">
    <section aria-labelledby="map-title">
      <p class="eyebrow">{{ t('map.eyebrow') }}</p>
      <h1 id="map-title" class="page-title">{{ t('map.title') }}</h1>
      <p class="page-intro">{{ t('map.intro') }}</p>
    </section>

    <div class="section-heading">
      <h2>{{ t('map.sectionTitle') }}</h2>
      <span class="section-kicker">{{ t('map.sectionKicker') }}</span>
    </div>

    <section class="map-layout" :aria-label="t('map.ariaLabel')">
      <div class="map-panel floor-plan-panel">
        <div class="floor-tabs" role="tablist" :aria-label="t('map.levelsLabel')">
          <button
            v-for="level in levels"
            :key="level.id"
            class="floor-tab"
            :class="{ 'is-selected': selectedLevelId === level.id }"
            type="button"
            role="tab"
            :id="`floor-tab-${level.id}`"
            aria-controls="floor-plan-panel"
            :aria-selected="selectedLevelId === level.id"
            @click="selectLevel(level)"
          >
            {{ t(`map.levels.${level.id}`) }}
          </button>
        </div>

        <p class="map-label">
          {{ t(`map.levels.${currentLevel.id}`) }} · {{ t('map.schematicPlan') }}
        </p>

        <div class="floor-map-scroll">
          <svg
            id="floor-plan-panel"
            class="floor-plan"
            viewBox="0 0 640 370"
            role="tabpanel"
            :aria-labelledby="`floor-tab-${currentLevel.id} floor-plan-title`"
            aria-describedby="floor-plan-description"
          >
            <title id="floor-plan-title">
              {{ t(`map.levels.${currentLevel.id}`) }} {{ t('map.floorPlanSuffix') }}
            </title>
            <desc id="floor-plan-description">{{ t('map.floorPlanDescription') }}</desc>
            <path class="floor-outline" d="M22 24H618V330H355V352H285V330H22Z" />
            <path class="floor-corridor" d="M43 163H597M320 163V315" />
            <path
              v-for="room in currentLevelRooms"
              :key="`${room.place.id}-connector`"
              class="room-connector"
              :d="room.connector"
            />
            <g
              v-for="room in currentLevelRooms"
              :key="room.place.id"
              class="floor-room"
              :class="{ 'is-selected': selectedPlaceId === room.place.id }"
              role="button"
              tabindex="0"
              :aria-label="t('map.roomSelectLabel', { name: t(`places.${room.place.id}.name`), location: t(`places.${room.place.id}.location`) })"
              :aria-pressed="selectedPlaceId === room.place.id"
              @click="selectPlace(room.place)"
              @keydown="activateRoom($event, room.place)"
            >
              <rect
                class="room-shape"
                :x="room.x"
                :y="room.y"
                :width="room.width"
                :height="room.height"
                rx="2"
              />
              <text class="room-map-label" :x="room.x + room.width / 2" :y="room.y + 42">
                {{ t(`places.${room.place.id}.mapLabel`) }}
              </text>
              <text class="room-map-caption" :x="room.x + room.width / 2" :y="room.y + 66">
                {{ t(`places.${room.place.id}.location`).split(' · ')[0] }}
              </text>
            </g>
            <text class="entrance-label" x="320" y="348">{{ t('map.mainEntrance') }}</text>
          </svg>
        </div>

        <div class="map-legend">
          <span class="legend-swatch" aria-hidden="true"></span>
          <span>{{ t('map.selectedRoom') }}</span>
          <span class="legend-outline" aria-hidden="true"></span>
          <span>{{ t('map.roomOutline') }}</span>
        </div>
      </div>

      <article v-if="selectedPlace" class="detail-card" aria-live="polite">
        <div>
          <p class="eyebrow">{{ t(`places.${selectedPlace.id}.category`) }}</p>
          <h2>{{ t(`places.${selectedPlace.id}.name`) }}</h2>
          <p class="muted-copy">{{ t(`places.${selectedPlace.id}.description`) }}</p>
        </div>
        <p class="detail-meta">{{ t(`places.${selectedPlace.id}.location`) }}</p>
        <div class="room-directions">
          <h3>{{ t('map.directionsTitle') }}</h3>
          <ol class="direction-list">
            <li
              v-for="(step, index) in t(`places.${selectedPlace.id}.directions`)"
              :key="index"
            >
              {{ step }}
            </li>
          </ol>
        </div>
      </article>
    </section>

    <section aria-labelledby="facilities-title">
      <div class="section-heading">
        <h2 id="facilities-title">{{ t('map.facilitiesTitle') }}</h2>
        <span class="section-kicker">{{ t('map.facilitiesKicker') }}</span>
      </div>
      <div class="facility-grid">
        <button
          v-for="(facility, index) in facilities"
          :key="facility.id"
          class="facility-link"
          :class="{ 'is-selected': selectedPlaceId === facility.id }"
          type="button"
          :aria-pressed="selectedPlaceId === facility.id"
          @click="selectPlace(facility)"
        >
          <span class="facility-icon" aria-hidden="true">{{ index + 1 }}</span>
          <span class="facility-name">{{ t(`places.${facility.id}.name`) }}</span>
        </button>
      </div>
    </section>

    <aside class="notice" :aria-label="t('map.noticeLabel')">
      <span aria-hidden="true">i</span>
      <span>
        <strong>{{ t('map.noticeTitle') }}</strong>
        {{ t('map.noticeBody') }}
      </span>
    </aside>
  </main>
</template>

<script>
import { t } from '../i18n.js'

export default {
  name: 'MuseumMapView',
  data() {
    return {
      selectedPlaceId: 'european-art',
      zones: [
        {
          id: 'european-art',
          category: 'Collection zone',
          name: 'European Art 1300–1800',
          location: 'Ground level · prototype room',
          directions: [
            'From the main entrance, continue into the ground-level gallery corridor.',
            'Turn toward the European Art gallery on your left.',
            'Enter the European Art 1300–1800 room.',
          ],
          description:
            'Explore European paintings and sculpture from the late medieval period through the eighteenth century.',
        },
        {
          id: 'danish-golden-age',
          category: 'Collection zone',
          name: 'Danish Golden Age',
          location: 'First level · prototype room',
          directions: [
            'From the main entrance, follow the stairs to the first level.',
            'Turn into the gallery corridor and continue toward Danish collections.',
            'Enter the Danish Golden Age room.',
          ],
          description:
            'Discover the artists and changing cultural life of Denmark in the early nineteenth century.',
        },
        {
          id: 'modern-art',
          category: 'Collection zone',
          name: 'Modern Art',
          location: 'Second level · prototype room',
          directions: [
            'From the main entrance, follow the stairs to the second level.',
            'Turn into the gallery corridor toward the modern collections.',
            'Enter the Modern Art room.',
          ],
          description:
            'Move through modern and contemporary works from Denmark and around the world.',
        },
      ],
      facilities: [
        {
          id: 'lockers',
          category: 'Visitor facility',
          name: 'Lockers',
          location: 'Ground level · prototype room',
          directions: [
            'From the main entrance, continue into the ground-level corridor.',
            'Turn toward visitor services on your right.',
            'The locker area is in the visitor-services room.',
          ],
          description: 'Find the visitor-services area and check with staff for current locker access.',
        },
        {
          id: 'cafe',
          category: 'Visitor facility',
          name: 'Café',
          location: 'First level · prototype room',
          directions: [
            'From the main entrance, follow the stairs to the first level.',
            'Turn toward the visitor café from the gallery corridor.',
            'Enter the café area.',
          ],
          description: 'Take a pause at the museum café; ask staff for current service information.',
        },
        {
          id: 'restrooms',
          category: 'Visitor facility',
          name: 'Restrooms',
          location: 'Second level · prototype room',
          directions: [
            'From the main entrance, follow the stairs to the second level.',
            'Continue along the corridor toward visitor facilities.',
            'Enter the restroom area.',
          ],
          description: 'Use the museum signs to find the nearest restroom from your current gallery.',
        },
      ],
      selectedLevelId: 'ground',
      levels: [
        {
          id: 'ground',
          name: 'Ground level',
          rooms: [
            {
              placeId: 'european-art',
              mapLabel: 'European Art',
              x: 48,
              y: 43,
              width: 242,
              height: 98,
              connector: 'M169 141V163',
            },
            {
              placeId: 'lockers',
              mapLabel: 'Lockers',
              x: 350,
              y: 220,
              width: 242,
              height: 88,
              connector: 'M471 163V220',
            },
          ],
        },
        {
          id: 'first',
          name: 'First level',
          rooms: [
            {
              placeId: 'danish-golden-age',
              mapLabel: 'Danish Golden Age',
              x: 48,
              y: 43,
              width: 242,
              height: 98,
              connector: 'M169 141V163',
            },
            {
              placeId: 'cafe',
              mapLabel: 'Café',
              x: 350,
              y: 220,
              width: 242,
              height: 88,
              connector: 'M471 163V220',
            },
          ],
        },
        {
          id: 'second',
          name: 'Second level',
          rooms: [
            {
              placeId: 'modern-art',
              mapLabel: 'Modern Art',
              x: 48,
              y: 43,
              width: 242,
              height: 98,
              connector: 'M169 141V163',
            },
            {
              placeId: 'restrooms',
              mapLabel: 'Restrooms',
              x: 350,
              y: 220,
              width: 242,
              height: 88,
              connector: 'M471 163V220',
            },
          ],
        },
      ],
    }
  },
  computed: {
    allPlaces() {
      return [...this.zones, ...this.facilities]
    },
    currentLevel() {
      return this.levels.find((level) => level.id === this.selectedLevelId) ?? this.levels[0]
    },
    currentLevelRooms() {
      return this.currentLevel.rooms
        .map((room) => ({
          ...room,
          place: this.allPlaces.find((place) => place.id === room.placeId),
        }))
        .filter((room) => room.place)
    },
    selectedPlace() {
      return this.allPlaces.find(
        (place) => place.id === this.selectedPlaceId,
      )
    },
  },
  watch: {
    '$route.query.place': {
      handler(placeId) {
        const place = this.allPlaces.find((item) => item.id === placeId)
        if (place) {
          this.selectedPlaceId = placeId
          const level = this.levels.find((item) =>
            item.rooms.some((room) => room.placeId === placeId),
          )
          if (level) this.selectedLevelId = level.id
        }
      },
      immediate: true,
    },
  },
  methods: {
    t,
    selectLevel(level) {
      this.selectedLevelId = level.id
      const firstRoom = level.rooms[0]
      const place = this.allPlaces.find((item) => item.id === firstRoom?.placeId)
      if (place) this.selectPlace(place)
    },
    selectPlace(place) {
      this.selectedPlaceId = place.id
      const level = this.levels.find((item) =>
        item.rooms.some((room) => room.placeId === place.id),
      )
      if (level) this.selectedLevelId = level.id
      if (this.$route.query.place !== place.id) {
        this.$router.replace({ query: { ...this.$route.query, place: place.id } })
      }
    },
    activateRoom(event, place) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.selectPlace(place)
      }
    },
  },
}
</script>

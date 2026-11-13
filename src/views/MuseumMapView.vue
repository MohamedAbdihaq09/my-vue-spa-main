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

        <div class="map-toolbar">
          <p class="map-label">
            {{ t(`map.levels.${currentLevel.id}`) }} · {{ t('map.schematicPlan') }}
          </p>
          <div v-if="currentLevel.planAvailable" class="zoom-controls" role="group" :aria-label="t('map.zoomLabel')">
            <button class="zoom-button" type="button" :disabled="zoom <= minZoom" :aria-label="t('map.zoomOut')" @click="zoomOut">−</button>
            <button class="zoom-button" type="button" :disabled="zoom === 1" :aria-label="t('map.zoomReset')" @click="zoomReset">100%</button>
            <button class="zoom-button" type="button" :disabled="zoom >= maxZoom" :aria-label="t('map.zoomIn')" @click="zoomIn">+</button>
          </div>
        </div>

        <div v-if="currentLevel.planAvailable" class="floor-map-scroll">
          <svg
            id="floor-plan-panel"
            class="floor-plan"
            :viewBox="viewBox"
            :style="svgStyle"
            role="tabpanel"
            :aria-labelledby="`floor-tab-${currentLevel.id} floor-plan-title`"
            aria-describedby="floor-plan-description"
          >
            <title id="floor-plan-title">
              {{ t(`map.levels.${currentLevel.id}`) }} {{ t('map.floorPlanSuffix') }}
            </title>
            <desc id="floor-plan-description">{{ t('map.floorPlanDescription') }}</desc>

            <defs>
              <pattern id="floor-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" class="hatch-line" />
              </pattern>
            </defs>

            <g :transform="currentLevel.transform || null">
              <path v-for="(d, i) in currentLevel.shell" :key="`shell-${i}`" class="floor-outline" :d="d" />
              <path v-for="(d, i) in currentLevel.spaces" :key="`space-${i}`" class="floor-space" :d="d" />
              <path v-for="(d, i) in currentLevel.bridges" :key="`bridge-${i}`" class="floor-space floor-bridge" :d="d" />
              <path v-for="(d, i) in currentLevel.voids" :key="`void-${i}`" class="floor-void" :d="d" />
              <path v-for="(d, i) in currentLevel.fixtures" :key="`fixture-${i}`" class="floor-fixture" :d="d" />

              <g
                v-for="room in orderedRooms"
                :key="room.placeId"
                class="floor-room"
                :class="{ 'is-selected': selectedPlaceId === room.placeId }"
                role="button"
                tabindex="0"
                :aria-label="t('map.roomSelectLabel', { name: placeName(room.placeId), location: placeLocation(room.placeId) })"
                :aria-pressed="selectedPlaceId === room.placeId"
                @click="selectPlaceById(room.placeId)"
                @keydown="activateRoom($event, room.placeId)"
              >
                <path class="room-shape" :d="room.d" />
                <text
                  v-if="roomLabel(room)"
                  class="room-map-label"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  :x="room.x"
                  :y="room.y"
                  :font-size="room.labelSize || currentLevel.labelSize"
                >
                  {{ roomLabel(room) }}
                </text>
                <g v-if="room.icon" class="map-icon" :transform="`translate(${room.icon.x} ${room.icon.y})`" aria-hidden="true">
                  <circle :r="room.icon.r" />
                  <g class="map-icon-glyph" :transform="`scale(${room.icon.r / 22})`">
                    <template v-if="room.icon.type === 'wc'">
                      <circle cx="-8" cy="-11" r="3.5" />
                      <path d="M-12 -5H-4V6H-6V13H-10V6H-12Z" />
                      <circle cx="8" cy="-11" r="3.5" />
                      <path d="M8 -5L13 6H3Z M6 6H10V13H6Z" />
                      <path d="M0 -14V14" class="glyph-stroke" />
                    </template>
                  </g>
                </g>
              </g>

              <g
                v-for="(icon, i) in currentLevel.icons"
                :key="`icon-${i}`"
                class="map-icon"
                :transform="`translate(${icon.x} ${icon.y})`"
                aria-hidden="true"
              >
                <circle :r="icon.r" />
                <g class="map-icon-glyph glyph-stroke" :transform="`scale(${icon.r / 22})`">
                  <path v-if="icon.type === 'stairs'" d="M-10 10H-4V4H2V-2H8V-8H12" />
                  <template v-else-if="icon.type === 'lift'">
                    <rect x="-11" y="-11" width="22" height="22" rx="2" />
                    <path d="M-5 -1L0 -7L5 -1M-5 2L0 8L5 2" />
                  </template>
                </g>
              </g>
            </g>
          </svg>
        </div>

        <div v-else id="floor-plan-panel" class="plan-pending" role="tabpanel" :aria-labelledby="`floor-tab-${currentLevel.id}`">
          <p>{{ t('map.planUnavailable') }}</p>
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
          <p class="eyebrow">{{ placeCategory(selectedPlace) }}</p>
          <h2>{{ placeName(selectedPlace.id) }}</h2>
          <p class="muted-copy">{{ placeDescription(selectedPlace) }}</p>
        </div>
        <p class="detail-meta">{{ placeLocation(selectedPlace.id) }}</p>
        <p v-if="!selectedRoomOnMap" class="detail-meta">{{ t('map.notOnPlan') }}</p>
        <div class="room-directions">
          <h3>{{ t('map.directionsTitle') }}</h3>
          <ol class="direction-list">
            <li v-for="(step, index) in placeDirections(selectedPlace)" :key="index">
              {{ step }}
            </li>
          </ol>
        </div>
      </article>
    </section>

    <section aria-labelledby="zones-title">
      <div class="section-heading">
        <h2 id="zones-title">{{ t('map.zonesTitle') }}</h2>
        <span class="section-kicker">{{ t('map.zonesKicker') }}</span>
      </div>
      <div class="facility-grid">
        <button
          v-for="(zone, index) in zones"
          :key="zone.id"
          class="facility-link"
          :class="{ 'is-selected': selectedPlaceId === zone.id }"
          type="button"
          :aria-pressed="selectedPlaceId === zone.id"
          @click="selectPlace(zone)"
        >
          <span class="facility-icon" aria-hidden="true">{{ index + 1 }}</span>
          <span class="facility-name">{{ placeName(zone.id) }}</span>
        </button>
      </div>
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
          <span class="facility-name">{{ placeName(facility.id) }}</span>
        </button>
      </div>
    </section>

    <GettingHereMap />

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
import GettingHereMap from '../components/GettingHereMap.vue'
import { VIEWBOX, levels, zones, facilities, places } from '../data/smkFloorPlans.js'

export default {
  name: 'MuseumMapView',
  components: { GettingHereMap },
  data() {
    return {
      levels,
      zones,
      facilities,
      viewBox: VIEWBOX,
      selectedPlaceId: 'european-art',
      selectedLevelId: 'ground',
      zoom: 1,
      minZoom: 1,
      maxZoom: 3,
    }
  },
  computed: {
    placesById() {
      return new Map(places.map((place) => [place.id, place]))
    },
    currentLevel() {
      return this.levels.find((level) => level.id === this.selectedLevelId) ?? this.levels[0]
    },
    // Selected room is drawn last so its outline is never covered.
    orderedRooms() {
      const rooms = this.currentLevel.rooms
      return [...rooms].sort(
        (a, b) => (a.placeId === this.selectedPlaceId) - (b.placeId === this.selectedPlaceId),
      )
    },
    selectedPlace() {
      return this.placesById.get(this.selectedPlaceId)
    },
    selectedRoomOnMap() {
      return this.currentLevel.rooms.some((room) => room.placeId === this.selectedPlaceId)
    },
    svgStyle() {
      return { width: `${this.zoom * 100}%`, minWidth: `${this.zoom * 640}px` }
    },
  },
  watch: {
    '$route.query.place': {
      handler(placeId) {
        const place = this.placesById.get(placeId)
        if (place) {
          this.selectedPlaceId = place.id
          this.selectedLevelId = place.levelId
        }
      },
      immediate: true,
    },
  },
  methods: {
    t,

    // Returns the i18n string when the key exists, otherwise the fallback.
    tx(key, fallback, params) {
      const value = t(key, params)
      if (value === undefined || value === null || value === '' || value === key) return fallback
      return value
    },
    levelName(levelId) {
      return t(`map.levels.${levelId}`)
    },
    placeName(id) {
      const place = this.placesById.get(id)
      if (!place) return id
      const fallback = place.number ? t('map.roomName', { number: place.number }) : place.name
      return this.tx(`places.${id}.name`, fallback)
    },
    placeLocation(id) {
      const place = this.placesById.get(id)
      if (!place) return ''
      const fallback = t('map.roomLocation', { level: this.levelName(place.levelId) })
      return this.tx(`places.${id}.location`, fallback)
    },
    placeCategory(place) {
      const fallback = place.kind === 'room' ? t('map.categoryRoom') : place.name
      return this.tx(`places.${place.id}.category`, place.kind === 'room' ? fallback : '')
    },
    placeDescription(place) {
      const fallback = place.number
        ? t('map.roomDescription', { number: place.number, level: this.levelName(place.levelId) })
        : place.description
      return this.tx(`places.${place.id}.description`, fallback)
    },
    placeDirections(place) {
      const own = t(`places.${place.id}.directions`)
      if (Array.isArray(own) && own.length) return own
      const level = this.levelName(place.levelId)
      return [
        t('map.genericDirections.step1', { level }),
        t('map.genericDirections.step2'),
        t('map.genericDirections.step3', { name: this.placeName(place.id) }),
      ]
    },
    roomLabel(room) {
      if (!room.label) return ''
      return this.tx(`places.${room.placeId}.mapLabel`, room.label)
    },

    selectLevel(level) {
      this.selectedLevelId = level.id
      this.zoom = 1
      const firstRoom = level.rooms[0]
      const place =
        (firstRoom && this.placesById.get(firstRoom.placeId)) ||
        places.find((item) => item.levelId === level.id)
      if (place) this.selectPlace(place)
    },
    selectPlaceById(id) {
      const place = this.placesById.get(id)
      if (place) this.selectPlace(place)
    },
    selectPlace(place) {
      this.selectedPlaceId = place.id
      this.selectedLevelId = place.levelId
      if (this.$route.query.place !== place.id) {
        this.$router.replace({ query: { ...this.$route.query, place: place.id } })
      }
    },
    activateRoom(event, id) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.selectPlaceById(id)
      }
    },
    zoomIn() {
      this.zoom = Math.min(this.maxZoom, this.zoom + 0.5)
    },
    zoomOut() {
      this.zoom = Math.max(this.minZoom, this.zoom - 0.5)
    },
    zoomReset() {
      this.zoom = 1
    },
  },
}
</script>

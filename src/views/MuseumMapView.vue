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
            {{ levelName(level.id) }}
          </button>
        </div>

        <div class="map-toolbar">
          <p class="map-label">{{ levelName(currentLevel.id) }} · {{ t('map.schematicPlan') }}</p>
          <div class="zoom-controls" role="group" :aria-label="t('map.zoomLabel')">
            <button class="zoom-button" type="button" :disabled="zoom <= minZoom" :aria-label="t('map.zoomOut')" @click="zoomOut">−</button>
            <button class="zoom-button" type="button" :disabled="zoom === 1" :aria-label="t('map.zoomReset')" @click="zoomReset">{{ Math.round(zoom * 100) }}%</button>
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
            <title id="floor-plan-title">{{ levelName(currentLevel.id) }} {{ t('map.floorPlanSuffix') }}</title>
            <desc id="floor-plan-description">{{ t('map.floorPlanDescription') }}</desc>

            <defs>
              <pattern id="smk-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect class="hatch-bg" width="9" height="9" />
                <line class="hatch-line" x1="0" y1="0" x2="0" y2="9" />
              </pattern>
            </defs>

            <g :transform="currentLevel.transform">
              <!-- Building footprint in the wall colour; the walls are the gaps between shapes. -->
              <path class="floor-shell" :d="currentLevel.shell" />
              <path v-for="(d, i) in currentLevel.voids" :key="`void-${i}`" class="floor-void" :d="d" />
              <path
                v-for="(space, i) in currentLevel.spaces"
                :key="`space-${i}`"
                class="floor-space"
                :class="{ 'is-hatched': space.h }"
                fill-rule="evenodd"
                :d="space.d"
              />

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
                <path class="room-shape" :class="{ 'is-hatched': room.h }" fill-rule="evenodd" :d="room.d" />
              </g>

              <!-- Partition walls drawn on top of the rooms they divide. -->
              <path v-if="currentLevel.walls" class="floor-wall" :d="currentLevel.walls" />

              <!-- Labels last so walls never cover them; the room buttons carry the accessible names. -->
              <g aria-hidden="true">
                <text
                  v-for="room in labelledRooms"
                  :key="`label-${room.placeId}`"
                  class="room-map-label"
                  :class="{ 'is-outside': room.outside, 'is-selected': selectedPlaceId === room.placeId }"
                  text-anchor="middle"
                  dominant-baseline="central"
                  :x="room.x"
                  :y="room.y"
                  :font-size="labelSize(room)"
                >
                  {{ roomLabel(room) }}
                </text>
              </g>

              <g
                v-for="(icon, i) in currentLevel.icons"
                :key="`icon-${i}`"
                class="map-icon"
                :class="`is-${icon.type}`"
                :transform="`translate(${icon.x} ${icon.y})`"
                aria-hidden="true"
              >
                <circle :r="icon.r" />
                <MapIconGlyph :type="icon.type" :transform="`scale(${icon.r / 22})`" />
              </g>

              <text
                v-if="currentLevel.entranceLabel"
                class="entrance-label"
                text-anchor="middle"
                dominant-baseline="central"
                :x="currentLevel.entranceLabel.x"
                :y="currentLevel.entranceLabel.y"
              >
                {{ t('map.mainEntrance') }}
              </text>
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
          <span v-for="type in legendIcons" :key="type" class="legend-icon">
            <svg class="legend-icon-svg" viewBox="-24 -24 48 48" aria-hidden="true">
              <g class="map-icon" :class="`is-${type}`">
                <circle r="22" />
                <MapIconGlyph :type="type" />
              </g>
            </svg>
            <span>{{ t(`map.legend.${type}`) }}</span>
          </span>
        </div>
      </div>

      <article v-if="selectedPlace" class="detail-card" aria-live="polite">
        <div>
          <p class="eyebrow">{{ placeCategory(selectedPlace) }}</p>
          <h2>{{ placeName(selectedPlace.id) }}</h2>
          <p class="muted-copy">{{ placeDescription(selectedPlace) }}</p>
        </div>
        <p class="detail-meta">{{ placeLocation(selectedPlace.id) }}</p>
        <p v-if="!onPlan.has(selectedPlace.id)" class="detail-meta">{{ t('map.notOnPlan') }}</p>
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
import { h } from 'vue'
import { t } from '../i18n.js'
import GettingHereMap from '../components/GettingHereMap.vue'
import { VIEWBOX, levels, zones, facilities, places, DEFAULT_PLACE } from '../data/smkFloorPlans.js'

// The level with the main entrance (Forhal).
const ENTRANCE_LEVEL = 'first'
const ICON_ORDER = ['entrance', 'stairs', 'lift', 'wc', 'cafe', 'shop']
// CJK / full-width characters are about 1em wide; everything else ~0.6em.
const WIDE_CHARS = /[\u1100-\u11ff\u2e80-\u9fff\uac00-\ud7af\uff00-\uffef]/

// Icon glyphs, drawn in a 44×44 box centred on 0,0. `fill: true` = solid shape.
const GLYPHS = {
  stairs: [['path', { d: 'M-11 9H-5V3H1V-3H7V-9H11' }]],
  lift: [
    ['rect', { x: -11, y: -11, width: 22, height: 22, rx: 2 }],
    ['path', { d: 'M-5 -2L0 -7L5 -2M-5 2L0 7L5 2' }],
  ],
  wc: [
    ['circle', { cx: -7, cy: -10, r: 3, fill: true }],
    ['path', { d: 'M-11 -5H-3V5H-5V12H-9V5H-11Z', fill: true }],
    ['circle', { cx: 7, cy: -10, r: 3, fill: true }],
    ['path', { d: 'M7 -5L12 6H9V12H5V6H2Z', fill: true }],
    ['path', { d: 'M0 -13V13' }],
  ],
  cafe: [
    ['path', { d: 'M-11 -3H6V3A6 6 0 0 1 0 9H-5A6 6 0 0 1 -11 3Z' }],
    ['path', { d: 'M6 -1H8A3 3 0 0 1 8 5H5' }],
    ['path', { d: 'M-6 -11V-7M-1 -11V-7' }],
  ],
  shop: [
    ['path', { d: 'M0 -6Q-5 -9 -11 -7V9Q-5 7 0 10Q5 7 11 9V-7Q5 -9 0 -6Z' }],
    ['path', { d: 'M0 -6V10' }],
  ],
  entrance: [
    ['path', { d: 'M-11 0H3M-2 -5L3 0L-2 5' }],
    ['path', { d: 'M2 -10H10V10H2' }],
  ],
}

// Renders one icon glyph; used on the map and in the legend.
const MapIconGlyph = {
  name: 'MapIconGlyph',
  props: { type: { type: String, required: true } },
  render() {
    return h(
      'g',
      { class: 'map-icon-glyph' },
      (GLYPHS[this.type] || []).map(([tag, { fill, ...attrs }]) =>
        h(tag, { ...attrs, class: fill ? 'is-filled' : null }),
      ),
    )
  },
}

export default {
  name: 'MuseumMapView',
  components: { GettingHereMap, MapIconGlyph },
  data() {
    return {
      levels,
      zones,
      facilities,
      viewBox: VIEWBOX,
      selectedPlaceId: 'forhal',
      selectedLevelId: ENTRANCE_LEVEL,
      zoom: 1,
      minZoom: 1,
      maxZoom: 3,
    }
  },
  computed: {
    placesById() {
      return new Map(places.map((place) => [place.id, place]))
    },
    // Ids of every place that has a shape on some level.
    onPlan() {
      return new Set(this.levels.flatMap((level) => level.rooms.map((room) => room.placeId)))
    },
    currentLevel() {
      return this.levels.find((level) => level.id === this.selectedLevelId) ?? this.levels[0]
    },
    // Selected room is drawn last so its outline is never covered by a neighbour.
    orderedRooms() {
      const selected = this.selectedPlaceId
      return [...this.currentLevel.rooms].sort(
        (a, b) => (a.placeId === selected) - (b.placeId === selected),
      )
    },
    labelledRooms() {
      return this.currentLevel.rooms.filter((room) => this.roomLabel(room))
    },
    legendIcons() {
      const present = new Set(this.currentLevel.icons.map((icon) => icon.type))
      return ICON_ORDER.filter((type) => present.has(type))
    },
    selectedPlace() {
      return this.placesById.get(this.selectedPlaceId)
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
          if (place.levelId) this.selectedLevelId = place.levelId
        }
      },
      immediate: true,
    },
  },
  methods: {
    t,

    // i18n lookup with a fallback when the key is missing (t() returns the key).
    tx(key, fallback, params) {
      const value = t(key, params)
      return typeof value === 'string' && value !== key && value !== '' ? value : fallback
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
      const fallback = place.levelId ? this.levelName(place.levelId) : t('map.locationSigns')
      return this.tx(`places.${id}.location`, fallback)
    },
    placeCategory(place) {
      return this.tx(`places.${place.id}.category`, t(`map.category.${place.kind}`))
    },
    placeDescription(place) {
      const fallback = place.number
        ? t('map.roomDescription', { number: place.number, level: this.levelName(place.levelId) })
        : ''
      return this.tx(`places.${place.id}.description`, fallback)
    },
    placeDirections(place) {
      const own = t(`places.${place.id}.directions`)
      if (Array.isArray(own) && own.length) return own

      const g = 'map.genericDirections.'
      const name = this.placeName(place.id)
      if (!place.levelId) {
        return [t(`${g}entrance`), t(`${g}zoneFollow`, { name }), t(`${g}askStaff`)]
      }
      const steps = [t(`${g}entrance`)]
      if (place.id === 'forhal') return [...steps, t(`${g}highlight`, { name })]
      if (place.levelId !== ENTRANCE_LEVEL) {
        steps.push(t(`${g}stairs`, { level: this.levelName(place.levelId) }))
      }
      steps.push(t(place.kind === 'room' ? `${g}followRoom` : `${g}followSigns`, { name }))
      return steps
    },
    roomLabel(room) {
      if (room.noLabel) return ''
      if (room.number) return room.number
      return this.tx(`places.${room.placeId}.mapLabel`, this.placeName(room.placeId))
    },
    // Shrink the label until it fits the room's width (CJK glyphs are ~1em wide).
    labelSize(room) {
      const text = this.roomLabel(room)
      const perChar = WIDE_CHARS.test(text) ? 1 : 0.6
      const fit = Math.min(room.fs, room.lw / (Math.max(text.length, 1) * perChar))
      // Room numbers may overflow a narrow room slightly (as on the printed plan).
      return Math.max(room.number ? 14 : 9, fit)
    },

    selectLevel(level) {
      this.selectedLevelId = level.id
      this.zoom = 1
      const place =
        this.placesById.get(DEFAULT_PLACE[level.id]) ||
        this.placesById.get(level.rooms[0]?.placeId)
      if (place) this.selectPlace(place)
    },
    selectPlaceById(id) {
      const place = this.placesById.get(id)
      if (place) this.selectPlace(place)
    },
    selectPlace(place) {
      this.selectedPlaceId = place.id
      if (place.levelId) this.selectedLevelId = place.levelId
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

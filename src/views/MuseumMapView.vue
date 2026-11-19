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
            <button class="zoom-button" type="button" :disabled="zoom <= minZoom" :aria-label="t('map.zoomReset')" @click="zoomReset">{{ Math.round(zoom * 100) }}%</button>
            <button class="zoom-button" type="button" :disabled="zoom >= maxZoom" :aria-label="t('map.zoomIn')" @click="zoomIn">+</button>
          </div>
        </div>

        <!-- Pan/zoom viewport: pinch or Ctrl+scroll to zoom, drag to pan, double-click to zoom in. -->
        <div
          v-if="currentLevel.planAvailable"
          ref="viewport"
          class="floor-map-scroll floor-map-viewport"
          :class="{ 'is-zoomed': zoom > minZoom, 'is-dragging': dragging }"
          @wheel="onWheel"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @click.capture="onClickCapture"
          @dblclick="onDoubleClick"
          @keydown="onMapKeydown"
          @focusin="onMapFocus"
        >
          <svg
            id="floor-plan-panel"
            ref="svg"
            class="floor-plan"
            :viewBox="viewBox"
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

            <!-- Zoom layer: its transform is written directly in the animation loop (no re-render). -->
            <g ref="zoomLayer">
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
                :data-place="room.placeId"
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
            </g>
          </svg>
          <p class="zoom-hint" :class="{ 'is-visible': hintVisible }" aria-hidden="true">{{ t('map.zoomHint') }}</p>
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
const [, , VB_W, VB_H] = VIEWBOX.split(' ').map(Number)
const MIN_ZOOM = 1
const MAX_ZOOM = 4
const BUTTON_STEP = 1.6
const EASE = 0.2 // fraction of the remaining distance covered per animation frame
const DRAG_THRESHOLD = 5 // px before a press becomes a drag instead of a click
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
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
      zoom: 1, // reactive copy of the zoom factor, synced when a gesture/animation ends
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      dragging: false,
      hintVisible: false,
    }
  },
  created() {
    // Pan/zoom state lives outside Vue's reactivity so 60fps updates never re-render the page.
    this.view = { x: 0, y: 0, k: 1 }
    this.anim = null
    this.raf = 0
    this.pointers = new Map()
    this.gesture = null
    this.suppressClick = false
    this.hintTimer = 0
    this.reducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  },
  mounted() {
    this.applyView()
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf)
    clearTimeout(this.hintTimer)
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
  },
  watch: {
    selectedLevelId() {
      // New floor: start from the full view. The SVG may be re-created, so wait a tick.
      this.resetView(false)
      this.$nextTick(this.applyView)
    },
    selectedPlaceId(id) {
      // When zoomed in, bring a room picked from the lists into view.
      if (this.zoom > MIN_ZOOM) this.$nextTick(() => this.revealRoom(id))
    },
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

    // ---------------------------------------------------------------- pan & zoom
    // `view` maps plan coordinates to the SVG viewBox: screen = plan * k + (x, y).

    zoomIn() {
      this.zoomBy(BUTTON_STEP)
    },
    zoomOut() {
      this.zoomBy(1 / BUTTON_STEP)
    },
    zoomReset() {
      this.zoomTo(MIN_ZOOM, this.viewCenter())
    },
    viewCenter() {
      return { x: VB_W / 2, y: VB_H / 2 }
    },
    clampView({ x, y, k }) {
      k = clamp(k, MIN_ZOOM, MAX_ZOOM)
      return { k, x: clamp(x, VB_W - VB_W * k, 0), y: clamp(y, VB_H - VB_H * k, 0) }
    },
    applyView() {
      const layer = this.$refs.zoomLayer
      if (!layer) return
      const { x, y, k } = this.view
      layer.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${k.toFixed(4)})`)
    },
    syncZoom() {
      this.zoom = Math.round(this.view.k * 100) / 100
    },
    setView(view) {
      this.anim = null
      this.view = this.clampView(view)
      this.applyView()
    },
    resetView(animate = true) {
      if (animate) return this.zoomTo(MIN_ZOOM, this.viewCenter())
      cancelAnimationFrame(this.raf)
      this.anim = null
      this.view = { x: 0, y: 0, k: 1 }
      this.applyView()
      this.syncZoom()
    },
    // Client (pixel) coordinates -> SVG viewBox coordinates.
    toViewBox(clientX, clientY) {
      const svg = this.$refs.svg
      const ctm = svg?.getScreenCTM()
      if (!ctm) return this.viewCenter()
      const point = svg.createSVGPoint()
      point.x = clientX
      point.y = clientY
      return point.matrixTransform(ctm.inverse())
    },
    // Animate so the plan point now under `screen` stays there while zooming to `k`.
    zoomTo(k, screen) {
      const v = this.view
      const anchor = { x: (screen.x - v.x) / v.k, y: (screen.y - v.y) / v.k }
      this.animate({ anchor, screen, k: clamp(k, MIN_ZOOM, MAX_ZOOM) })
    },
    zoomBy(factor, screen = this.viewCenter()) {
      const base = this.anim ? this.anim.k : this.view.k // accumulate rapid wheel/button input
      this.zoomTo(base * factor, screen)
    },
    // Animate a plan point to a screen position without changing zoom.
    panTo(anchor, screen = this.viewCenter()) {
      this.animate({ anchor, screen, k: this.anim ? this.anim.k : this.view.k })
    },
    animate(target) {
      this.anim = target
      if (this.reducedMotion) {
        this.anim = null
        this.view = this.clampView({
          k: target.k,
          x: target.screen.x - target.anchor.x * target.k,
          y: target.screen.y - target.anchor.y * target.k,
        })
        this.applyView()
        this.syncZoom()
        return
      }
      if (!this.raf) this.raf = requestAnimationFrame(this.step)
    },
    step() {
      this.raf = 0
      const a = this.anim
      if (!a) return
      const v = this.view
      // Ease zoom in log space (feels even at every scale) and the anchor's screen position.
      const lk = Math.log(v.k) + (Math.log(a.k) - Math.log(v.k)) * EASE
      const k = Math.exp(lk)
      const cx = a.anchor.x * v.k + v.x
      const cy = a.anchor.y * v.k + v.y
      const sx = cx + (a.screen.x - cx) * EASE
      const sy = cy + (a.screen.y - cy) * EASE
      const next = this.clampView({ k, x: sx - a.anchor.x * k, y: sy - a.anchor.y * k })
      const settled =
        Math.abs(next.k - v.k) < 0.0005 && Math.abs(next.x - v.x) < 0.05 && Math.abs(next.y - v.y) < 0.05
      if (settled) {
        this.view = this.clampView({ k: a.k, x: a.screen.x - a.anchor.x * a.k, y: a.screen.y - a.anchor.y * a.k })
        this.anim = null
        this.applyView()
        this.syncZoom()
        return
      }
      this.view = next
      this.applyView()
      this.raf = requestAnimationFrame(this.step)
    },

    onWheel(event) {
      // Plain scrolling keeps scrolling the page; Ctrl/⌘ + scroll (and trackpad pinch) zooms.
      if (!event.ctrlKey && !event.metaKey) {
        this.showHint()
        return
      }
      event.preventDefault()
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
      const factor = Math.exp(-clamp(delta, -60, 60) * 0.006)
      this.zoomBy(factor, this.toViewBox(event.clientX, event.clientY))
    },
    onDoubleClick(event) {
      const point = this.toViewBox(event.clientX, event.clientY)
      if (this.view.k >= MAX_ZOOM - 0.01) this.zoomTo(MIN_ZOOM, point)
      else this.zoomBy(2, point)
    },
    onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      this.startGesture()
    },
    startGesture() {
      const pts = [...this.pointers.values()]
      if (pts.length === 1) {
        this.gesture = { type: 'pan', start: pts[0], view: { ...this.view }, moved: false }
      } else if (pts.length >= 2) {
        const [p, q] = pts
        const mid = this.toViewBox((p.x + q.x) / 2, (p.y + q.y) / 2)
        const v = this.view
        this.anim = null
        this.gesture = {
          type: 'pinch',
          dist: Math.hypot(p.x - q.x, p.y - q.y) || 1,
          k: v.k,
          anchor: { x: (mid.x - v.x) / v.k, y: (mid.y - v.y) / v.k },
          moved: true,
        }
      }
    },
    onPointerMove(event) {
      if (!this.pointers.has(event.pointerId)) return
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      const g = this.gesture
      if (!g) return

      if (g.type === 'pinch' && this.pointers.size >= 2) {
        const [p, q] = [...this.pointers.values()]
        const mid = this.toViewBox((p.x + q.x) / 2, (p.y + q.y) / 2)
        const k = clamp((g.k * Math.hypot(p.x - q.x, p.y - q.y)) / g.dist, MIN_ZOOM, MAX_ZOOM)
        this.setView({ k, x: mid.x - g.anchor.x * k, y: mid.y - g.anchor.y * k })
        return
      }

      if (g.type !== 'pan') return
      const dx = event.clientX - g.start.x
      const dy = event.clientY - g.start.y
      if (!g.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      if (this.view.k <= MIN_ZOOM + 0.001) return // nothing to pan; let touch scroll the page
      if (!g.moved) {
        g.moved = true
        this.dragging = true
        event.currentTarget.setPointerCapture?.(event.pointerId)
      }
      const scale = VB_W / (this.$refs.svg?.clientWidth || VB_W) // viewBox units per pixel
      this.setView({ k: g.view.k, x: g.view.x + dx * scale, y: g.view.y + dy * scale })
    },
    onPointerUp(event) {
      if (!this.pointers.delete(event.pointerId)) return
      if (this.gesture?.moved) this.suppressClick = true
      if (this.pointers.size > 0) {
        this.startGesture() // e.g. pinch -> one finger left: continue as a pan without jumping
        if (this.gesture) this.gesture.moved = true
        return
      }
      this.gesture = null
      this.dragging = false
      this.syncZoom()
      setTimeout(() => (this.suppressClick = false), 0)
    },
    // A drag must not also select the room it ended on.
    onClickCapture(event) {
      if (this.suppressClick) {
        event.stopPropagation()
        event.preventDefault()
        this.suppressClick = false
      }
    },
    onMapKeydown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const step = 0.15
      const zoomed = this.view.k > MIN_ZOOM + 0.001
      // Move the plan point at the centre by a fraction of the view.
      const pan = (dx, dy) => {
        event.preventDefault()
        const c = this.viewCenter()
        const v = this.view
        const anchor = { x: (c.x - v.x) / v.k, y: (c.y - v.y) / v.k }
        this.animate({ anchor, k: v.k, screen: { x: c.x + dx * VB_W, y: c.y + dy * VB_H } })
      }
      switch (event.key) {
        case '+':
        case '=':
          event.preventDefault()
          return this.zoomIn()
        case '-':
        case '_':
          event.preventDefault()
          return this.zoomOut()
        case '0':
          event.preventDefault()
          return this.zoomReset()
        case 'ArrowLeft':
          return zoomed && pan(step, 0)
        case 'ArrowRight':
          return zoomed && pan(-step, 0)
        case 'ArrowUp':
          return zoomed && pan(0, step)
        case 'ArrowDown':
          return zoomed && pan(0, -step)
      }
    },
    // Keep the keyboard-focused room visible while zoomed in.
    onMapFocus(event) {
      const room = event.target.closest?.('.floor-room')
      if (room) this.revealElement(room)
    },
    revealRoom(id) {
      const el = this.$refs.viewport?.querySelector(`[data-place="${id}"]`)
      if (el) this.revealElement(el)
    },
    revealElement(el) {
      if (this.view.k <= MIN_ZOOM + 0.001 || !this.$refs.viewport) return
      const box = el.getBoundingClientRect()
      const vp = this.$refs.viewport.getBoundingClientRect()
      const inside = box.left >= vp.left && box.right <= vp.right && box.top >= vp.top && box.bottom <= vp.bottom
      if (inside) return
      const c = this.toViewBox(box.left + box.width / 2, box.top + box.height / 2)
      const v = this.view
      this.panTo({ x: (c.x - v.x) / v.k, y: (c.y - v.y) / v.k })
    },
    showHint() {
      if (!this.hintVisible) this.hintVisible = true
      clearTimeout(this.hintTimer)
      this.hintTimer = setTimeout(() => (this.hintVisible = false), 1600)
    },
  },
}
</script>

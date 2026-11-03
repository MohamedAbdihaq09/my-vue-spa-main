<script>
import { markRaw } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchSmkFeatures, CATEGORIES } from '../services/overpassService.js';

// Markør-billederne importeres direkte, ellers finder Vite dem ikke
// efter "npm run build" (fx på Netlify), og markøren bliver et brudt billede.
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.imagePath = '';
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

// SMK koordinater
const SMK_LAT = 55.6886;
const SMK_LON = 12.5783;

// Hjørnerne af SMK-bygningen [lat, lon], med uret fra nordvest.
// Bruges til at TEGNE bygningen.
const SMK_POLYGON = [
  [55.68910, 12.57791], // glasgang, venstre ende
  [55.68910, 12.57976], // glasgang, højre ende
  [55.68906, 12.57976],
  [55.68906, 12.57960], // nordøst-hjørnet
  [55.68900, 12.57960],
  [55.68898, 12.57946], // hak i østsiden
  [55.68891, 12.57948],
  [55.68856, 12.57956], // sydøst-hjørnet
  [55.68855, 12.57926], // trin i sydsiden
  [55.68859, 12.57926],
  [55.68855, 12.57870], // hjørne øst for indgangen
  [55.68849, 12.57871], // indgangen, højre side
  [55.68845, 12.57815], // indgangen, venstre side
  [55.68851, 12.57814], // hjørne vest for indgangen
  [55.68846, 12.57759],
  [55.68842, 12.57760],
  [55.68840, 12.57730], // sydvest-hjørnet
  [55.68891, 12.57720], // vestsiden
  [55.68893, 12.57698], // vestfløjens nederste spids
  [55.68896, 12.57698], // vestfløjens øverste spids
  [55.68904, 12.57791]  // tilbage mod glasgangen
];

// Søgeområdet rundt om museet og parken [lat, lon].
// Bruges til at SØGE i Overpass. Må gerne være groft.
const SEARCH_AREA = [
  [55.6898, 12.5755], // nordvest
  [55.6898, 12.5810], // nordøst
  [55.6876, 12.5810], // sydøst
  [55.6876, 12.5755]  // sydvest
];

// Reserve: faste steder aflæst fra OpenStreetMap-kortet.
// Bruges kun, hvis Overpass ikke finder noget eller fejler.
function place(categoryId, name, lat, lon) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return {
    id: `fallback/${categoryId}/${lat}`,
    name: name || category.label,
    categoryLabel: category.label,
    color: category.color,
    lat,
    lon
  };
}

const FALLBACK_PLACES = [
  place('cafes', 'Magnolia', 55.68860, 12.57866),
  place('toilets', null, 55.68872, 12.57837),
  place('parking', null, 55.68838, 12.57792),
  place('bicycleParking', null, 55.68844, 12.57691),
  place('bicycleParking', null, 55.68837, 12.57704)
];

export default {
  name: 'GettingHereMap',

  data() {
    return {
      map: null,
      markerLayer: null, // LayerGroup med alle prikker fra Overpass
      features: [], // Stederne fra Overpass
      loading: false, // true mens der hentes
      error: '', // Fejlbesked, hvis det går galt
      categories: CATEGORIES // Bruges til farveforklaringen
    };
  },

  mounted() {
    // 1. Opret kortet, når komponenten er i DOM'en
    this.initMap();
    // 2. Hent steder fra Overpass
    this.loadFeatures();
  },

  beforeUnmount() {
    // 3. Ryd op, så kortet ikke giver memory leaks
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },

  methods: {
    initMap() {
      // markRaw stopper Vue i at gøre Leaflet reaktivt
      this.map = markRaw(
        L.map(this.$refs.mapContainer).setView([SMK_LAT, SMK_LON], 17)
      );

      // Baggrundskortet fra OpenStreetMap
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      // Markør på SMK
      L.marker([SMK_LAT, SMK_LON])
        .addTo(this.map)
        .bindPopup('SMK – National Gallery of Denmark')
        .openPopup();

      // Polygon rundt om SMK-bygningen
      L.polygon(SMK_POLYGON, {
        color: '#1f1f1f',      // Kantfarve
        weight: 2,             // Kantens tykkelse
        fillColor: '#b26f37',  // Fyldfarve (SMK kobber)
        fillOpacity: 0.3       // Gennemsigtighed
      })
        .addTo(this.map)
        .bindPopup('SMK');

      // Tom LayerGroup, som prikkerne fra Overpass lægges i
      this.markerLayer = markRaw(L.layerGroup().addTo(this.map));
    },

    // Henter data (async/await + try/catch/finally)
    async loadFeatures() {
      this.loading = true;
      this.error = '';

      // Vis reservepunkterne med det samme, så kortet aldrig er tomt
      this.features = FALLBACK_PLACES;
      this.updateMarkers();

      try {
        // await: vent på svaret uden at fryse siden
        const features = await fetchSmkFeatures(SEARCH_AREA);
        // Kom der rigtige data? Så skift reservepunkterne ud
        if (features.length) {
          this.features = features;
          this.updateMarkers();
        }
      } catch (err) {
        // Fejl: reservepunkterne bliver bare stående
        console.error(err);
        this.error = 'Live data unavailable. Showing saved places.';
      } finally {
        // Kører altid, uanset om det lykkedes eller ej
        this.loading = false;
      }
    },

    // Tegner alle steder som farvede prikker
    updateMarkers() {
      if (!this.markerLayer) return;
      // Ryd gamle prikker (vigtigt ved "Refresh")
      this.markerLayer.clearLayers();

      this.features.forEach(feature => {
        L.circleMarker([feature.lat, feature.lon], {
          radius: 7,
          color: '#fff',
          fillColor: feature.color,
          fillOpacity: 0.9,
          weight: 2
        })
          .bindPopup(`<strong>${feature.name}</strong><br><small>${feature.categoryLabel}</small>`)
          .addTo(this.markerLayer);
      });
    }
  }
};
</script>

<template>
  <section class="getting-here">
    <h2>Find the museum</h2>

    <!-- Status: henter / fejl / antal fundne steder -->
    <div class="status-bar">
      <button type="button" :disabled="loading" @click="loadFeatures">
        {{ loading ? 'Loading…' : 'Refresh' }}
      </button>
      <span v-if="error" class="error">{{ error }}</span>
      <span v-else-if="!loading">{{ features.length }} places nearby</span>
    </div>

    <!-- Her monterer Leaflet kortet -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- Farveforklaring: hvad betyder prikkerne -->
    <ul class="legend">
      <li v-for="category in categories" :key="category.id">
        <span class="dot" :style="{ background: category.color }"></span>
        {{ category.label }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.getting-here {
  margin-top: 40px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.status-bar button {
  padding: 5px 10px;
  border: 1px solid var(--copper);
  background: transparent;
  color: var(--copper);
  cursor: pointer;
}

.status-bar button:disabled {
  opacity: 0.5;
}

.error {
  color: #b42318;
}

/* Leaflet kræver en fast højde.
   position + z-index: 0 holder kortets lag under den faste bundbjælke */
.map-container {
  position: relative;
  z-index: 0;
  height: 400px;
  width: 100%;
  border: 1px solid var(--line);
}

/* Farveforklaringen på én række */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  font-size: 0.85rem;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
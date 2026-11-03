// ─────────────────────────────────────────────────────────────
// overpassService.js
// Bygger på undervisningens Overpass-eksempel, tilpasset til SMK.
// Henter steder omkring museet fra OpenStreetMap via Overpass API.
// ─────────────────────────────────────────────────────────────

// Flere Overpass-servere med de samme data.
// Svarer den første ikke, prøves den næste.
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];

// Prøver serverne én ad gangen, indtil én svarer.
// Hver server får max 10 sekunder, ellers prøves den næste.
async function fetchFromOverpass(query) {
  let lastError;

  for (const url of OVERPASS_URLS) {
    // AbortController kan afbryde en fetch, der tager for lang tid
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000); // 10 sek.

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ data: query }),
        signal: controller.signal // kobler timeren til forespørgslen
      });

      if (response.ok) return response; // Succes: stop her
      lastError = new Error(`Overpass API error: ${response.status} (${url})`);
    } catch (err) {
      lastError = err; // Timeout eller netværksfejl: prøv næste server
    } finally {
      clearTimeout(timer); // Stop timeren, uanset hvad der skete
    }
  }

  throw lastError; // Alle servere fejlede
}

// Hvad der hentes:
// label   = teksten i popup og farveforklaring
// color   = farven på prikken
// filters = det OSM-tag, Overpass søger efter (kan være flere)
const CATEGORIES = [
  { id: 'cafes', label: 'Café', color: '#2f7d4f', filters: [{ key: 'amenity', value: 'cafe' }] },
  { id: 'toilets', label: 'Toilets', color: '#2563eb', filters: [{ key: 'amenity', value: 'toilets' }] },
  { id: 'benches', label: 'Benches', color: '#716c65', filters: [{ key: 'amenity', value: 'bench' }] },
  { id: 'bicycleParking', label: 'Bicycle parking', color: '#9333ea', filters: [{ key: 'amenity', value: 'bicycle_parking' }] },
  { id: 'artworks', label: 'Artworks', color: '#db2777', filters: [{ key: 'tourism', value: 'artwork' }] },
  { id: 'parking', label: 'Parking', color: '#0e7490', filters: [{ key: 'amenity', value: 'parking' }] }
];

export { CATEGORIES };

// Henter alle steder inden for polygonen
export async function fetchSmkFeatures(polygon) {
  // Overpass vil have polygonen som én tekst: "lat lon lat lon ..."
  const polygonQuery = polygon
    .map(([lat, lon]) => `${lat} ${lon}`)
    .join(' ');

  // Én søgelinje pr. filter, fx: nwr(poly:"...")[amenity=cafe];
  // nwr = nodes, ways og relations
  const queryLines = CATEGORIES.flatMap(category =>
    category.filters.map(({ key, value }) => `nwr(poly:"${polygonQuery}")[${key}=${value}];`)
  ).join('\n');

  // Hele forespørgslen i Overpass QL
  // out center = giv hvert sted ét midtpunkt, så det kan vises som en prik
  const query = `
    [out:json][timeout:25];
    (
      ${queryLines}
    );
    out center;
  `;

  // Send forespørgslen (prøver flere servere)
  const response = await fetchFromOverpass(query);

  // Svaret skal indeholde en liste kaldet elements
  const data = await response.json();
  if (!Array.isArray(data.elements)) {
    throw new Error('Overpass API returned an invalid response');
  }

  // Normalisering: lav rå OSM-data om til et simpelt format, som appen forstår
  return data.elements.flatMap(element => {
    // Find kategorien ud fra stedets tags
    const category = CATEGORIES.find(item =>
      item.filters.some(filter => element.tags?.[filter.key] === filter.value)
    );

    // Punkter har lat/lon direkte, andre har et center
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;

    // Spring steder over, vi ikke kan bruge
    if (!category || !Number.isFinite(lat) || !Number.isFinite(lon)) {
      return [];
    }

    return [{
      id: `${element.type}/${element.id}`,
      name: element.tags?.name || category.label, // intet navn? brug kategorien
      categoryLabel: category.label,
      color: category.color,
      lat,
      lon
    }];
  });
}
/** Ventlore FE v1.5: framework-neutral search and one-shot browser location.
 * No network, storage, analytics, authentication or global browser mocks.
 * Call readDevicePosition only from an explicit user action.
 */

export function isCoordinate(value) {
  return !!value && Number.isFinite(value.latitude) && Number.isFinite(value.longitude)
    && value.latitude >= -90 && value.latitude <= 90
    && value.longitude >= -180 && value.longitude <= 180;
}

export function normalizeSearch(value) {
  return String(value ?? '').toLocaleLowerCase('vi')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export function haversineKm(a, b) {
  if (!isCoordinate(a) || !isCoordinate(b)) throw new RangeError('Invalid coordinates');
  const toRad = value => value * Math.PI / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, h))));
}

const collator = new Intl.Collator('vi', { numeric: true, sensitivity: 'base' });
const tieBreak = (a, b) => collator.compare(a.name, b.name)
  || String(a.placeId).localeCompare(String(b.placeId));

/** Filter and sort the complete permitted catalog BEFORE pagination.
 * allMatches powers count + map; items powers the current list page.
 * radiusKm:null means no radius. Never silently expand the user's radius.
 */
export function queryPlaces(places, options = {}) {
  const { q = '', provinceCode = null, activityId = null, origin = null,
    radiusKm = null, sort = 'catalog', page = 1, pageSize = 12 } = options;
  if (!Array.isArray(places)) throw new TypeError('places must be an array');
  if (origin !== null && !isCoordinate(origin)) throw new RangeError('Invalid origin');
  if (radiusKm !== null && (!Number.isFinite(radiusKm) || radiusKm < 0)) {
    throw new RangeError('Invalid radius');
  }
  if ((radiusKm !== null || sort === 'distance') && origin === null) {
    throw new Error('Location is required for radius or distance sort');
  }
  if (!['catalog', 'name', 'distance'].includes(sort)) throw new RangeError('Invalid sort');
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('Invalid pagination');
  }
  const tokens = normalizeSearch(q).split(' ').filter(Boolean);
  const facetMatches = places.filter(place => {
    if (provinceCode && place.provinceCode !== provinceCode) return false;
    if (activityId && !place.activityIds?.includes(activityId)) return false;
    const searchText = normalizeSearch([
      place.name, place.provinceName, place.areaLabel,
      ...(place.searchAliases ?? []), ...(place.activityIds ?? [])
    ].join(' '));
    return tokens.every(token => searchText.includes(token));
  });
  const ranked = facetMatches.map(place => ({
    ...place,
    distanceKm: origin && isCoordinate(place.location)
      ? haversineKm(origin, place.location) : null
  }));
  const unlocatedCount = ranked.filter(place => !isCoordinate(place.location)).length;
  let allMatches = ranked.filter(place => {
    if (radiusKm !== null) return place.distanceKm !== null && place.distanceKm <= radiusKm;
    if (sort === 'distance') return place.distanceKm !== null;
    return true;
  });
  if (sort === 'distance') allMatches.sort((a, b) => a.distanceKm - b.distanceKm || tieBreak(a, b));
  else if (sort === 'name') allMatches.sort(tieBreak);
  else allMatches.sort((a, b) => (a.catalogOrder ?? 0) - (b.catalogOrder ?? 0) || tieBreak(a, b));
  const nearestOutsideRadius = radiusKm === null ? [] : ranked
    .filter(place => place.distanceKm !== null && place.distanceKm > radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm || tieBreak(a, b)).slice(0, 3);
  const total = allMatches.length;
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  return {
    total, totalPages, page: currentPage, pageSize, unlocatedCount,
    allMatches, mappableMatches: allMatches.filter(place => isCoordinate(place.location)),
    items: allMatches.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    nearestOutsideRadius
  };
}

/** Returns a normalized state; never substitutes a fabricated successful location.
 * The UI owns Vietnamese/localized messages and requesting state.
 * Optional dependencies below allow tests without modifying navigator globally.
 * The UI watchdog ends waiting, but cannot dismiss the native permission prompt.
 */
export function readDevicePosition({
  timeoutMs = 10000,
  signal,
  geolocation = globalThis.navigator?.geolocation,
  secureContext = globalThis.isSecureContext
} = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1) throw new RangeError('Invalid timeout');
  if (signal?.aborted) return Promise.resolve({ status: 'cancelled' });
  if (secureContext === false) return Promise.resolve({ status: 'insecure_context' });
  if (!geolocation?.getCurrentPosition) return Promise.resolve({ status: 'unsupported' });
  return new Promise(resolve => {
    let settled = false;
    let watchdog;
    const abort = () => finish({ status: 'cancelled' });
    const finish = result => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      signal?.removeEventListener('abort', abort);
      resolve(result);
    };
    signal?.addEventListener('abort', abort, { once: true });
    watchdog = setTimeout(() => finish({ status: 'timeout' }), timeoutMs + 5000);
    try {
      geolocation.getCurrentPosition(position => {
        const point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        if (!isCoordinate(point)) return finish({ status: 'unavailable' });
        finish({ status: 'ready', origin: {
          ...point,
          accuracyMeters: Number.isFinite(position.coords.accuracy) && position.coords.accuracy >= 0
            ? position.coords.accuracy : null,
          timestamp: position.timestamp,
          source: 'device'
        }});
      }, error => finish({ status: ({ 1: 'denied', 2: 'unavailable', 3: 'timeout' })[error.code] ?? 'unavailable' }), {
        enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60000
      });
    } catch {
      finish({ status: 'unavailable' });
    }
  });
}

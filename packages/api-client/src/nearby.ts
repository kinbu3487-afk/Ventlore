/** Ventlore FE v1.5: framework-neutral search and one-shot browser location.
 * No network, storage, analytics, authentication or global browser mocks.
 * Call readDevicePosition only from an explicit user action.
 */

export interface Point {
  latitude: number;
  longitude: number;
}

export interface Origin extends Point {
  accuracyMeters: number | null;
  timestamp: number;
  source: 'device' | 'manual';
}

export interface PlaceLocation extends Point {
  coordinateKind?: string;
  accuracyMeters?: number | null;
}

export interface NearbyPlaceItem {
  placeId: string;
  name: string;
  provinceCode?: string;
  provinceName?: string;
  areaLabel?: string;
  searchAliases?: string[];
  activityIds?: string[];
  location?: PlaceLocation | null;
  coordinates?: { lat: number; lng: number } | null;
  catalogOrder?: number;
  distanceKm?: number | null;
  [key: string]: any;
}

export interface QueryPlacesOptions {
  q?: string;
  provinceCode?: string | null;
  activityId?: string | null;
  origin?: Point | null;
  radiusKm?: number | null;
  sort?: 'catalog' | 'name' | 'distance';
  page?: number;
  pageSize?: number;
}

export interface QueryPlacesResult<T = any> {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  unlocatedCount: number;
  allMatches: (T & { distanceKm: number | null })[];
  mappableMatches: (T & { distanceKm: number | null })[];
  items: (T & { distanceKm: number | null })[];
  nearestOutsideRadius: (T & { distanceKm: number | null })[];
}

export type GeolocationStatus =
  | 'ready'
  | 'denied'
  | 'unavailable'
  | 'timeout'
  | 'unsupported'
  | 'insecure_context'
  | 'cancelled';

export interface ReadDevicePositionResult {
  status: GeolocationStatus;
  origin?: Origin;
}

export interface ReadDevicePositionOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
  geolocation?: any;
  secureContext?: boolean;
}

export function isCoordinate(value: any): value is Point {
  return (
    !!value &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    value.latitude >= -90 &&
    value.latitude <= 90 &&
    value.longitude >= -180 &&
    value.longitude <= 180
  );
}

export function normalizeSearch(value: any): string {
  return String(value ?? '')
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function haversineKm(a: Point, b: Point): number {
  if (!isCoordinate(a) || !isCoordinate(b)) {
    throw new RangeError('Invalid coordinates');
  }
  const toRad = (val: number) => (val * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, h))));
}

const collator = new Intl.Collator('vi', { numeric: true, sensitivity: 'base' });
const tieBreak = (a: any, b: any) =>
  collator.compare(a.name, b.name) || String(a.placeId).localeCompare(String(b.placeId));

function extractPoint(place: NearbyPlaceItem): Point | null {
  if (isCoordinate(place.location)) return place.location;
  if (place.coordinates && Number.isFinite(place.coordinates.lat) && Number.isFinite(place.coordinates.lng)) {
    const pt = { latitude: place.coordinates.lat, longitude: place.coordinates.lng };
    if (isCoordinate(pt)) return pt;
  }
  return null;
}

/** Filter and sort the complete permitted catalog BEFORE pagination.
 * allMatches powers count + map; items powers the current list page.
 * radiusKm:null means no radius. Never silently expand the user's radius.
 */
export function queryPlaces<T extends NearbyPlaceItem>(
  places: T[],
  options: QueryPlacesOptions = {}
): QueryPlacesResult<T> {
  const {
    q = '',
    provinceCode = null,
    activityId = null,
    origin = null,
    radiusKm = null,
    sort = 'catalog',
    page = 1,
    pageSize = 12,
  } = options;

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
  const facetMatches = places.filter((place) => {
    if (provinceCode && place.provinceCode !== provinceCode) return false;
    if (activityId && !place.activityIds?.includes(activityId)) return false;
    const searchText = normalizeSearch(
      [
        place.name,
        place.provinceName,
        place.areaLabel,
        ...(place.searchAliases ?? []),
        ...(place.activityIds ?? []),
      ].join(' ')
    );
    return tokens.every((token) => searchText.includes(token));
  });

  const ranked = facetMatches.map((place) => {
    const pt = extractPoint(place);
    return {
      ...place,
      distanceKm: origin && pt ? haversineKm(origin, pt) : null,
    };
  });

  const unlocatedCount = ranked.filter((place) => !extractPoint(place)).length;
  let allMatches = ranked.filter((place) => {
    if (radiusKm !== null) return place.distanceKm !== null && place.distanceKm <= radiusKm;
    if (sort === 'distance') return place.distanceKm !== null;
    return true;
  });

  if (sort === 'distance') {
    allMatches.sort((a, b) => (a.distanceKm! - b.distanceKm!) || tieBreak(a, b));
  } else if (sort === 'name') {
    allMatches.sort(tieBreak);
  } else {
    allMatches.sort((a, b) => ((a.catalogOrder ?? 0) - (b.catalogOrder ?? 0)) || tieBreak(a, b));
  }

  const nearestOutsideRadius =
    radiusKm === null
      ? []
      : ranked
          .filter((place) => place.distanceKm !== null && place.distanceKm > radiusKm)
          .sort((a, b) => (a.distanceKm! - b.distanceKm!) || tieBreak(a, b))
          .slice(0, 3);

  const total = allMatches.length;
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  return {
    total,
    totalPages,
    page: currentPage,
    pageSize,
    unlocatedCount,
    allMatches,
    mappableMatches: allMatches.filter((place) => extractPoint(place) !== null),
    items: allMatches.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    nearestOutsideRadius,
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
  geolocation = typeof globalThis !== 'undefined' ? (globalThis as any).navigator?.geolocation : undefined,
  secureContext = typeof globalThis !== 'undefined' ? (globalThis as any).isSecureContext : undefined,
}: ReadDevicePositionOptions = {}): Promise<ReadDevicePositionResult> {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1) throw new RangeError('Invalid timeout');
  if (signal?.aborted) return Promise.resolve({ status: 'cancelled' });
  if (secureContext === false) return Promise.resolve({ status: 'insecure_context' });
  if (!geolocation?.getCurrentPosition) return Promise.resolve({ status: 'unsupported' });

  return new Promise((resolve) => {
    let settled = false;
    let watchdog: any;
    const abort = () => finish({ status: 'cancelled' });
    const finish = (result: ReadDevicePositionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      signal?.removeEventListener('abort', abort);
      resolve(result);
    };

    signal?.addEventListener('abort', abort, { once: true });
    watchdog = setTimeout(() => finish({ status: 'timeout' }), timeoutMs + 5000);

    try {
      geolocation.getCurrentPosition(
        (position: any) => {
          const point = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          if (!isCoordinate(point)) return finish({ status: 'unavailable' });
          finish({
            status: 'ready',
            origin: {
              ...point,
              accuracyMeters:
                Number.isFinite(position.coords.accuracy) && position.coords.accuracy >= 0
                  ? position.coords.accuracy
                  : null,
              timestamp: position.timestamp || Date.now(),
              source: 'device',
            },
          });
        },
        (error: any) => {
          const statusMap: Record<number, GeolocationStatus> = {
            1: 'denied',
            2: 'unavailable',
            3: 'timeout',
          };
          finish({ status: statusMap[error?.code] ?? 'unavailable' });
        },
        {
          enableHighAccuracy: false,
          timeout: timeoutMs,
          maximumAge: 60000,
        }
      );
    } catch {
      finish({ status: 'unavailable' });
    }
  });
}

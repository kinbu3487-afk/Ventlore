import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isCoordinate, normalizeSearch, haversineKm, queryPlaces, readDevicePosition } from './nearby.mjs';

const data = JSON.parse(await readFile(new URL('./ventlore-destinations-100.json', import.meta.url), 'utf8'));
const { places, provinces } = data;
const officialCodes = '01 04 08 11 12 14 15 19 20 22 24 25 31 33 37 38 40 42 44 46 48 51 52 56 66 68 75 79 80 82 86 91 92 96'.split(' ');
assert.equal(places.length, 100);
assert.deepEqual(provinces.map(p => p.code), officialCodes);
assert.equal(new Set(places.map(p => p.placeId)).size, 100);
assert.equal(new Set(places.map(p => p.seedKey)).size, 100);
assert.equal(new Set(places.map(p => p.slug)).size, 100);
assert.equal(new Set(places.map(p => `${p.location.latitude},${p.location.longitude}`)).size, 100);
for (const province of provinces) {
  const count = places.filter(p => p.provinceCode === province.code).length;
  assert.ok(count >= 2, `${province.name} needs >=2 places`);
  assert.equal(count, province.seedCount);
}
for (const p of places) {
  assert.match(p.placeId, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.ok(isCoordinate(p.location));
  assert.ok(officialCodes.includes(p.provinceCode));
  assert.equal(p.provinceName, provinces.find(x => x.code === p.provinceCode).name);
  assert.ok(p.activityIds.every(id => data.activities.some(a => a.id === id)));
  assert.equal(p.verificationStatus, 'UNVERIFIED');
  assert.equal(p.provenance.independentlyVerified, false);
  assert.equal(p.safetyClaims.length, 0);
  // Geographic bounds are only a coarse sanity check, NOT province-boundary verification.
  assert.ok(p.location.latitude >= 8 && p.location.latitude <= 24);
  assert.ok(p.location.longitude >= 102 && p.location.longitude <= 110);
}
assert.equal(places.filter(p => p.provenance.dataKind === 'EXISTING_SITE_REFERENCE').length, 3);
assert.equal(normalizeSearch('ĐÀ NẴNG'), 'da nang');
assert.equal(queryPlaces(places, { q: 'da nang' }).total, 3);
assert.equal(queryPlaces(places, { q: 'Quảng Nam' }).total, 3);
assert.equal(queryPlaces(places, { q: 'kon tum' }).total, 3);
assert.equal(queryPlaces(places, { q: 'Mỹ Khê' }).total, 2);
assert.equal(queryPlaces(places, { q: 'My Khe', provinceCode: '48' }).total, 1);
assert.equal(queryPlaces(places, { provinceCode: '12', activityId: 'mountain' }).total, 2);
assert.equal(queryPlaces(places).totalPages, 9);
assert.equal(queryPlaces(places, { page: 9 }).items.length, 4);
assert.equal(queryPlaces(places, { q: 'nomatch-12345', page: 9 }).total, 0);
assert.equal(queryPlaces(places, { provinceCode: '12', page: 9 }).page, 1);

const zero = { latitude: 0, longitude: 0 };
assert.equal(haversineKm(zero, zero), 0);
assert.ok(Math.abs(haversineKm(zero, { latitude: 0, longitude: 1 }) - 111.19508) < 0.001);
assert.throws(() => haversineKm(zero, { latitude: null, longitude: 1 }));
assert.throws(() => queryPlaces(places, { radiusKm: 50 }));
assert.throws(() => queryPlaces(places, { origin: { latitude: NaN, longitude: 1 } }));
assert.throws(() => queryPlaces(places, { origin: zero, radiusKm: -1 }));

const pointLastInInput = places[99];
const ranked = queryPlaces(places, { origin: pointLastInInput.location, sort: 'distance' });
assert.equal(ranked.items[0].placeId, pointLastInInput.placeId, 'Sort complete catalog, not first page');
assert.equal(ranked.items[0].distanceKm, 0);
assert.equal(ranked.allMatches.length, 100);
assert.equal(ranked.mappableMatches.length, ranked.total);
assert.ok(ranked.allMatches.every((p, i, a) => i === 0 || p.distanceKm >= a[i-1].distanceKm));
const outside = queryPlaces(places, { origin: zero, radiusKm: 5, sort: 'distance' });
assert.equal(outside.total, 0);
assert.equal(outside.nearestOutsideRadius.length, 3);
assert.ok(outside.nearestOutsideRadius.every(p => p.distanceKm > 5));
const synthetic = [
  { placeId: 'a', name: 'A', location: zero },
  { placeId: 'b', name: 'B', location: { latitude: 0, longitude: 1 } },
  { placeId: 'c', name: 'C', location: { latitude: null, longitude: 1 } }
];
const boundaryRadius = haversineKm(synthetic[0].location, synthetic[1].location);
assert.equal(queryPlaces(synthetic, { origin: zero, radiusKm: boundaryRadius, sort: 'distance' }).total, 2);
assert.equal(queryPlaces(synthetic, { origin: zero, radiusKm: boundaryRadius - 0.001, sort: 'distance' }).total, 1);
assert.equal(queryPlaces(synthetic, { origin: zero, sort: 'distance' }).unlocatedCount, 1);

// Inject dependencies into this utility only. Never patch navigator on the public app.
let requestedOptions;
const success = await readDevicePosition({ secureContext: true, geolocation: {
  getCurrentPosition(ok, fail, options) {
    requestedOptions = options;
    ok({ coords: { latitude: 16.059, longitude: 108.246, accuracy: 35 }, timestamp: 12345 });
  }
}});
assert.equal(success.status, 'ready');
assert.equal(success.origin.source, 'device');
assert.equal(success.origin.accuracyMeters, 35);
assert.deepEqual(requestedOptions, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
for (const [code, expected] of [[1,'denied'], [2,'unavailable'], [3,'timeout']]) {
  const result = await readDevicePosition({ secureContext: true, geolocation: {
    getCurrentPosition(ok, fail) { fail({ code }); }
  }});
  assert.equal(result.status, expected);
  assert.equal('origin' in result, false);
}
assert.equal((await readDevicePosition({ secureContext: false })).status, 'insecure_context');
assert.equal((await readDevicePosition({ secureContext: true, geolocation: {} })).status, 'unsupported');
const controller = new AbortController();
let delayedSuccess;
const cancelled = readDevicePosition({ secureContext: true, signal: controller.signal,
  geolocation: { getCurrentPosition(ok) { delayedSuccess = ok; } }
});
controller.abort();
assert.equal((await cancelled).status, 'cancelled');
delayedSuccess({ coords: { latitude: 1, longitude: 1, accuracy: 20 }, timestamp: 99 });
assert.equal((await cancelled).status, 'cancelled');
console.log(JSON.stringify({ status: 'PASS', destinations: places.length, provinces: provinces.length,
  perProvince: '2–3', authoredCoordinates: 97, existingSiteReferences: 3,
  coverage: ['data integrity', 'search aliases', 'global sort', 'pagination', 'radius boundary',
    'empty radius', 'invalid coordinates', 'location success/errors/cancellation'],
  notVerified: ['real coordinates', 'province polygons', 'browser permission prompt', 'iPad UI', 'website deployment']
}, null, 2));

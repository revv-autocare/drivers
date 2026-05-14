import {
  useState, useEffect, useCallback,
  createContext, useContext, ReactNode,
} from 'react';
import type { Vehicle, Shop, ServiceEntry, Deal, Claim, Appointment } from './types';
import { client, daysUntil } from './api';

// ─── Detect unconfigured backend ────────────────────────────────────────────
// amplify_outputs.json ships with placeholder values during local dev.
// We fall back to seed data so the app runs without a deployed backend.
import outputs from '../amplify_outputs.json';
export const BACKEND_LIVE = !outputs.data.url.includes('PLACEHOLDER');

// ─── Seed data (fallback / demo mode) ───────────────────────────────────────
export const SEED_VEHICLE: Vehicle = {
  id: 'v1',
  vin: '1HGCM82633A004352',
  year: 2018, make: 'Toyota', model: 'Corolla', engine: '1.8L I4',
  plate: 'BC RVV-204', mileage: 84_120,
  nickname: 'My Corolla',
  trim: 'LE',
  color: 'Silver',
  drivetrain: 'FWD',
  transmission: '6-speed CVT',
  owners: 2,
  nextServiceKm: 90_000,
  purchasedYear: 2019,
  primary: true,
};

export const SEED_SHOPS: Shop[] = [
  { id: 'egban',    name: 'Egban Autos',             neighborhood: 'Mount Pleasant',  address: '2310 Main St, Vancouver',        logo: 'EA', logoColor: '#3777FF', rating: 4.8, reviews: 142, distanceKm: 1.4, hours: 'Mon–Sat · 8am–6pm',  specialties: ['Oil change', 'Brakes', 'Inspection'], linked: true,  verified: true,  honorRate: 96 },
  { id: 'lonsdale', name: 'Lonsdale Auto Care',      neighborhood: 'North Vancouver', address: '845 Lonsdale Ave, North Van',    logo: 'LA', logoColor: '#1F8A5B', rating: 4.7, reviews: 98,  distanceKm: 4.8, hours: 'Mon–Fri · 9am–5pm',  specialties: ['Brakes', 'Suspension', 'Tires'],     linked: true,  verified: true,  honorRate: 94 },
  { id: 'marpole',  name: 'Marpole Tire & Wheel',   neighborhood: 'Marpole',         address: '8730 Granville St, Vancouver',   logo: 'MT', logoColor: '#3779C2', rating: 4.6, reviews: 73,  distanceKm: 6.2, hours: 'Tue–Sat · 8am–7pm',  specialties: ['Tires', 'Wheel alignment'],          linked: false, verified: true,  honorRate: 91 },
  { id: 'eastvan',  name: 'East Van AC Specialists', neighborhood: 'East Vancouver',  address: '1422 Commercial Dr, Vancouver', logo: 'EV', logoColor: '#0E7AB8', rating: 4.9, reviews: 56,  distanceKm: 2.6, hours: 'Mon–Sat · 9am–5pm',  specialties: ['AC service', 'Electrical'],          linked: false, verified: true,  honorRate: 98 },
  { id: 'mainst',   name: 'Main St Garage',          neighborhood: 'Mount Pleasant',  address: '3010 Main St, Vancouver',        logo: 'MS', logoColor: '#7C2D92', rating: 4.5, reviews: 211, distanceKm: 1.9, hours: 'Mon–Fri · 8am–6pm',  specialties: ['Inspection', 'Engine', 'Diagnostics'], linked: false, verified: true,  honorRate: 89 },
  { id: 'fraser',   name: 'Fraser St Auto',          neighborhood: 'Mount Pleasant',  address: '4280 Fraser St, Vancouver',      logo: 'FA', logoColor: '#D14343', rating: 4.4, reviews: 67,  distanceKm: 2.1, hours: 'Wed–Sun · 10am–6pm', specialties: ['Detailing', 'Body work'],            linked: false, verified: false, honorRate: 88 },
  { id: 'kits',     name: 'Kitsilano Foreign',       neighborhood: 'Kitsilano',       address: '2150 W 4th Ave, Vancouver',      logo: 'KF', logoColor: '#1B2649', rating: 4.9, reviews: 184, distanceKm: 5.4, hours: 'Mon–Fri · 8am–5pm',  specialties: ['BMW', 'Audi', 'VW'],                 linked: false, verified: true,  honorRate: 97 },
  { id: 'burnaby',  name: 'Burnaby Auto Hub',        neighborhood: 'Burnaby',         address: '4310 Hastings St, Burnaby',      logo: 'BA', logoColor: '#9C5616', rating: 4.3, reviews: 88,  distanceKm: 8.1, hours: 'Mon–Sat · 8am–6pm',  specialties: ['General service'],                   linked: false, verified: true,  honorRate: 90 },
];

export const SEED_SERVICE_LOG: ServiceEntry[] = [
  { id: 's1', date: '2024-03-12', mileage: 78_420, what: 'Oil change + 25-pt inspection',       cost: 79,  shop: 'Egban Autos',        shopId: 'egban',    via: 'auto',   notes: 'Synthetic blend 5W-30. Air filter replaced.', category: 'oil' },
  { id: 's2', date: '2023-09-04', mileage: 71_030, what: 'Front brake pads + rotor resurface', cost: 340, shop: 'Lonsdale Auto Care', shopId: 'lonsdale', via: 'auto',   notes: 'Ceramic pads. Rotors within spec, resurfaced.', category: 'brake' },
  { id: 's3', date: '2023-04-18', mileage: 64_800, what: 'Tire rotation',                      cost: 35,  shop: null,                 shopId: null,       via: 'manual', notes: 'DIY — front-to-back rotation.', category: 'tire' },
  { id: 's4', date: '2023-02-02', mileage: 62_100, what: 'BC Out-of-Province Inspection',       cost: 150, shop: 'Main St Garage',     shopId: 'mainst',   via: 'manual', notes: 'Passed first time.', category: 'insp' },
  { id: 's5', date: '2022-08-22', mileage: 56_200, what: 'Oil change',                          cost: 65,  shop: 'Egban Autos',        shopId: 'egban',    via: 'auto',   notes: 'Full synthetic 5W-30.', category: 'oil' },
  { id: 's6', date: '2022-04-10', mileage: 51_200, what: 'Battery replacement',                 cost: 195, shop: 'Egban Autos',        shopId: 'egban',    via: 'auto',   notes: 'Original battery 6 years old.', category: 'other' },
];

export const SEED_DEALS: Deal[] = [
  { id: 'd1', shopId: 'egban',    shop: 'Egban Autos',             neighborhood: 'Mount Pleasant',  category: 'oil',    categoryLabel: 'Oil change',      offer: '$79 oil change includes filter and 25-point inspection', priceNow: 79,  priceWas: 119, distanceKm: 1.4, expiresInDays: 12, hours: 'Mon–Sat · 8am–6pm',  address: '2310 Main St, Vancouver' },
  { id: 'd2', shopId: 'lonsdale', shop: 'Lonsdale Auto Care',      neighborhood: 'North Vancouver', category: 'brake',  categoryLabel: 'Brake service',   offer: '20% off all brake jobs through May',                     priceNow: null, priceWas: null, pct: 20, distanceKm: 4.8, expiresInDays: 22, hours: 'Mon–Fri · 9am–5pm',  address: '845 Lonsdale Ave, North Van' },
  { id: 'd3', shopId: 'marpole',  shop: 'Marpole Tire & Wheel',   neighborhood: 'Marpole',         category: 'tire',   categoryLabel: 'Tire service',    offer: 'Seasonal swap + balance — $89 (4 tires)',                priceNow: 89,  priceWas: 140, distanceKm: 6.2, expiresInDays: 1,  hours: 'Tue–Sat · 8am–7pm',  address: '8730 Granville St, Vancouver' },
  { id: 'd4', shopId: 'eastvan',  shop: 'East Van AC Specialists', neighborhood: 'East Vancouver',  category: 'ac',     categoryLabel: 'AC service',      offer: 'AC recharge + leak inspection — $129',                   priceNow: 129, priceWas: 179, distanceKm: 2.6, expiresInDays: 28, hours: 'Mon–Sat · 9am–5pm',  address: '1422 Commercial Dr, Vancouver' },
  { id: 'd5', shopId: 'mainst',   shop: 'Main St Garage',          neighborhood: 'Mount Pleasant',  category: 'insp',   categoryLabel: 'Full inspection', offer: 'Pre-purchase inspection — $149',                         priceNow: 149, priceWas: 199, distanceKm: 1.9, expiresInDays: 35, hours: 'Mon–Fri · 8am–6pm',  address: '3010 Main St, Vancouver' },
  { id: 'd6', shopId: 'fraser',   shop: 'Fraser St Auto',          neighborhood: 'Mount Pleasant',  category: 'detail', categoryLabel: 'Detailing',       offer: 'Interior + exterior detail — $99 (was $160)',            priceNow: 99,  priceWas: 160, distanceKm: 2.1, expiresInDays: 18, hours: 'Wed–Sun · 10am–6pm', address: '4280 Fraser St, Vancouver' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function findDeal(deals: Deal[], dealId: string): Deal | undefined {
  return deals.find(d => d.id === dealId) ?? SEED_DEALS.find(d => d.id === dealId);
}
export function findShop(shops: Shop[], shopId: string): Shop | undefined {
  return shops.find(s => s.id === shopId) ?? SEED_SHOPS.find(s => s.id === shopId);
}
export function getClaimForDeal(claims: Claim[], dealId: string): Claim | null {
  const active = claims.filter(c => c.dealId === dealId && c.status !== 'expired' && c.status !== 'no_response');
  return active[active.length - 1] ?? null;
}
export function formatTimeLeft(claimedAt: number, now: number): string {
  const remaining = 24 * 60 * 60_000 - (now - claimedAt);
  if (remaining <= 0) return 'Expired';
  const hrs  = Math.floor(remaining / (60 * 60_000));
  const mins = Math.floor((remaining % (60 * 60_000)) / 60_000);
  return hrs >= 1 ? `${hrs}h ${mins}m left` : `${mins}m left`;
}
export function categoryIcon(cat: string): string {
  const map: Record<string, string> = {
    oil:    '/assets/icons/extra/lightbulb-02.svg',
    brake:  '/assets/icons/extra/shield-tick.svg',
    tire:   '/assets/icons/extra/scan.svg',
    ac:     '/assets/icons/extra/wifi.svg',
    insp:   '/assets/icons/revv/check-done-01.svg',
    detail: '/assets/icons/extra/shield-zap.svg',
    other:  '/assets/icons/revv/help-circle.svg',
  };
  return map[cat] ?? map['other'] ?? '';
}

// ─── Type mappers (API → app types) ─────────────────────────────────────────
function mapShop(s: any): Shop {
  return {
    id: s.id,
    name: s.name ?? '',
    neighborhood: s.neighborhood ?? '',
    address: s.address ?? '',
    logo: s.logo ?? s.name?.slice(0, 2).toUpperCase() ?? '??',
    logoColor: s.logoColor ?? '#3777FF',
    rating: s.rating ?? 0,
    reviews: s.reviewsCount ?? 0,
    distanceKm: s.distanceKm ?? 0,
    hours: s.hours ?? '',
    specialties: s.specialties ?? [],
    linked: false,
    verified: s.verified ?? false,
    honorRate: s.honorRate ?? 100,
    ...(s.contactPhone ? { contactPhone: s.contactPhone as string } : {}),
  };
}

function mapDeal(d: any, shopMap: Record<string, Shop>): Deal {
  const shop = shopMap[d.shopId];
  return {
    id: d.id,
    shopId: d.shopId ?? '',
    shop: shop?.name ?? '',
    neighborhood: shop?.neighborhood ?? '',
    category: d.category ?? 'other',
    categoryLabel: d.categoryLabel ?? d.category ?? '',
    offer: d.offer ?? '',
    priceNow: d.priceNow ?? null,
    priceWas: d.priceWas ?? null,
    ...(d.pct != null ? { pct: d.pct as number } : {}),
    distanceKm: shop?.distanceKm ?? 0,
    expiresInDays: daysUntil(d.expiresAt),
    hours: shop?.hours ?? '',
    address: shop?.address ?? '',
  };
}

function mapClaim(c: any): Claim {
  return {
    id: c.id,
    dealId: c.dealId ?? '',
    claimedAt: c.claimedAt ? new Date(c.claimedAt).getTime() : Date.now(),
    status: c.status ?? 'awaiting',
    ...(c.contactedAt ? { contactedAt: new Date(c.contactedAt).getTime() } : {}),
    ...(c.confirmedAt ? { confirmedAt: new Date(c.confirmedAt).getTime() } : {}),
    ...(c.expiredAt   ? { expiredAt:   new Date(c.expiredAt).getTime()   } : {}),
  };
}

function mapVehicle(v: any): Vehicle {
  return {
    vin: v.vin ?? '',
    year: v.year ?? 0,
    make: v.make ?? '',
    model: v.model ?? '',
    engine: v.engine ?? '',
    plate: v.plate ?? '',
    mileage: v.mileage ?? 0,
  };
}

function mapServiceEntry(e: any, shopMap: Record<string, Shop>): ServiceEntry {
  const shop = e.shopId ? shopMap[e.shopId] : null;
  return {
    id: e.id,
    date: e.date ?? '',
    mileage: e.mileage ?? 0,
    what: e.what ?? '',
    cost: e.cost ?? null,
    shop: shop?.name ?? e.shopName ?? null,
    shopId: e.shopId ?? null,
    via: e.via ?? 'manual',
    notes: e.notes ?? '',
    category: e.category ?? 'other',
  };
}

function mapAppointment(a: any): Appointment {
  return {
    id: a.id,
    shopId: a.shopId ?? '',
    service: a.service ?? '',
    date: a.date ?? '',
    time: a.time ?? '',
    notes: a.notes ?? '',
    bookedAt: a.bookedAt ? new Date(a.bookedAt).getTime() : Date.now(),
    status: a.status ?? 'pending',
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface StoreValue {
  loaded: boolean;
  error: string | null;
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
  setVehicle: (v: Vehicle) => void;
  addVehicle: (v: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (vehicleId: string, changes: Partial<Vehicle>) => Promise<void>;
  setPrimaryVehicle: (vehicleId: string) => void;
  unlockedHistoryIds: string[];
  unlockHistory: (vehicleId: string) => void;
  deals: Deal[];
  shops: Shop[];
  linkedShops: Shop[];
  serviceLog: ServiceEntry[];
  claims: Claim[];
  claimDeal: (dealId: string) => Promise<string>;
  advanceClaim: (claimId: string, toStatus: 'contacted' | 'confirmed' | 'expired') => Promise<void>;
  cancelClaim: (claimId: string) => Promise<void>;
  appointments: Appointment[];
  bookAppointment: (appt: Omit<Appointment, 'id' | 'bookedAt' | 'status'>) => Promise<string>;
  cancelAppointment: (id: string) => Promise<void>;
  now: number;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [loaded,              setLoaded]              = useState(false);
  const [error,               setError]               = useState<string | null>(null);
  const [vehicle,             setVehicle]             = useState<Vehicle | null>(null);
  const [vehicleId,           setVehicleId]           = useState<string | null>(null);
  const [vehicles,            setVehicles]            = useState<Vehicle[]>([]);
  const [unlockedHistoryIds,  setUnlockedHistoryIds]  = useState<string[]>([]);
  const [shops,               setShops]               = useState<Shop[]>([]);
  const [deals,               setDeals]               = useState<Deal[]>([]);
  const [serviceLog,          setServiceLog]          = useState<ServiceEntry[]>([]);
  const [claims,              setClaims]              = useState<Claim[]>([]);
  const [appointments,        setAppointments]        = useState<Appointment[]>([]);
  const [, setTick] = useState(0);

  // Tick every second for claim countdown
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1_000);
    return () => clearInterval(t);
  }, []);

  // ── Initial data load ────────────────────────────────────────────
  useEffect(() => {
    if (!BACKEND_LIVE) {
      // Demo mode: use seed data
      setShops(SEED_SHOPS);
      setDeals(SEED_DEALS);
      setServiceLog(SEED_SERVICE_LOG);
      setVehicle(SEED_VEHICLE);
      setVehicles([SEED_VEHICLE]);
      setLoaded(true);
      return;
    }

    async function load() {
      try {
        // Shops
        const { data: rawShops } = await client.models.Shop.list();
        const shopMap: Record<string, Shop> = {};
        const mappedShops = rawShops.map(s => { const m = mapShop(s); shopMap[m.id] = m; return m; });
        setShops(mappedShops.length ? mappedShops : SEED_SHOPS);

        const activeShopMap = mappedShops.length
          ? Object.fromEntries(mappedShops.map(s => [s.id, s]))
          : Object.fromEntries(SEED_SHOPS.map(s => [s.id, s]));

        // Deals
        const { data: rawDeals } = await client.models.Deal.list({ filter: { active: { eq: true } } });
        setDeals(rawDeals.length ? rawDeals.map(d => mapDeal(d, activeShopMap)) : SEED_DEALS);

        // Vehicle (owner-filtered)
        const { data: rawVehicles } = await client.models.Vehicle.list();
        const mappedVehicles = rawVehicles.map(mapVehicle);
        setVehicles(mappedVehicles.length ? mappedVehicles : [SEED_VEHICLE]);
        const firstVehicle = rawVehicles[0];
        if (firstVehicle) {
          const v = firstVehicle;
          setVehicleId(v.id);
          setVehicle(mapVehicle(v));

          // Service log for this vehicle
          const { data: rawLog } = await client.models.ServiceLogEntry.list({
            filter: { vehicleId: { eq: v.id } },
          });
          setServiceLog(rawLog.map(e => mapServiceEntry(e, activeShopMap)));
        }

        // Claims (owner-filtered)
        const { data: rawClaims } = await client.models.Claim.list();
        setClaims(rawClaims.map(mapClaim));

        // Appointments (owner-filtered)
        const { data: rawAppts } = await client.models.Appointment.list();
        setAppointments(rawAppts.map(mapAppointment));

        setLoaded(true);
      } catch (err: any) {
        console.error('Store load error:', err);
        setError(err?.message ?? 'Failed to load data');
        // Fall back to seed data so the app is usable
        setShops(SEED_SHOPS);
        setDeals(SEED_DEALS);
        setServiceLog(SEED_SERVICE_LOG);
        setVehicle(SEED_VEHICLE);
        setVehicles([SEED_VEHICLE]);
        setLoaded(true);
      }
    }

    load();
  }, []);

  // ── Expire awaiting claims ───────────────────────────────────────
  useEffect(() => {
    const now = Date.now();
    setClaims(prev => prev.map(c => {
      if (c.status !== 'awaiting') return c;
      if (now - c.claimedAt > 24 * 60 * 60_000) {
        return { ...c, status: 'expired' as const, expiredAt: c.claimedAt + 24 * 60 * 60_000 };
      }
      return c;
    }));
  }, [Math.floor(Date.now() / 60_000)]);

  // ── Mutations ────────────────────────────────────────────────────
  const setPrimaryVehicle = useCallback((vehicleId: string) => {
    setVehicles(prev => prev.map(v => ({ ...v, primary: v.id === vehicleId })));
    setVehicle(prev => prev ? { ...prev, primary: prev.id === vehicleId } : prev);
  }, []);

  const unlockHistory = useCallback((vehicleId: string) => {
    setUnlockedHistoryIds(prev => prev.includes(vehicleId) ? prev : [...prev, vehicleId]);
  }, []);

  const addVehicle = useCallback(async (v: Omit<Vehicle, 'id'>) => {
    if (!BACKEND_LIVE) {
      const newV: Vehicle = { ...v, id: 'v-' + Date.now(), primary: vehicles.length === 0 };
      setVehicles(prev => [...prev, newV]);
      setVehicle(newV);
      return;
    }
    const { data: created } = await client.models.Vehicle.create({
      vin: v.vin, year: v.year, make: v.make, model: v.model,
      engine: v.engine, plate: v.plate, mileage: v.mileage,
    });
    if (created) { setVehicleId(created.id); setVehicle(mapVehicle(created)); }
  }, [vehicles.length]);

  const updateVehicle = useCallback(async (vehicleId: string, changes: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, ...changes } : v));
    setVehicle(prev => prev?.id === vehicleId ? { ...prev, ...changes } : prev);
    if (!BACKEND_LIVE) return;
    await client.models.Vehicle.update({ id: vehicleId, ...changes } as any);
  }, []);

  const claimDeal = useCallback(async (dealId: string): Promise<string> => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) throw new Error('Deal not found');

    if (!BACKEND_LIVE) {
      const id = 'c-' + Date.now();
      setClaims(prev => [...prev, { id, dealId, claimedAt: Date.now(), status: 'awaiting' }]);
      return id;
    }

    const { data: claim } = await client.models.Claim.create({
      dealId,
      shopId: deal.shopId,
      status: 'awaiting',
      claimedAt: new Date().toISOString(),
    });
    if (!claim) throw new Error('Failed to create claim');

    setClaims(prev => [...prev, mapClaim(claim)]);

    // Fire-and-forget: notify the shop via Lambda
    // contactPhone comes from the shop list (already fetched); Lambda uses it directly
    const shopRecord = shops.find(s => s.id === deal.shopId);
    client.mutations.notifyShopOfClaim({
      claimId: claim.id,
      ...(shopRecord?.contactPhone ? { contactPhone: shopRecord.contactPhone } : {}),
      dealOffer: deal.offer,
    }).catch(e => console.warn('Notification failed:', e));

    return claim.id;
  }, [deals]);

  const advanceClaim = useCallback(async (claimId: string, toStatus: 'contacted' | 'confirmed' | 'expired') => {
    const now = new Date().toISOString();
    if (!BACKEND_LIVE) {
      setClaims(prev => prev.map(c => c.id !== claimId ? c : {
        ...c, status: toStatus,
        ...(toStatus === 'contacted' ? { contactedAt: Date.now() } : {}),
        ...(toStatus === 'confirmed' ? { confirmedAt: Date.now() } : {}),
        ...(toStatus === 'expired'   ? { expiredAt:   Date.now() } : {}),
      }));
      return;
    }
    const update: Record<string, string> = { id: claimId, status: toStatus };
    if (toStatus === 'contacted') update.contactedAt = now;
    if (toStatus === 'confirmed') update.confirmedAt = now;
    if (toStatus === 'expired')   update.expiredAt   = now;
    const { data: updated } = await client.models.Claim.update(update as any);
    if (updated) setClaims(prev => prev.map(c => c.id === claimId ? mapClaim(updated) : c));
  }, []);

  const cancelClaim = useCallback(async (claimId: string) => {
    if (!BACKEND_LIVE) { setClaims(prev => prev.filter(c => c.id !== claimId)); return; }
    await client.models.Claim.update({ id: claimId, status: 'cancelled' } as any);
    setClaims(prev => prev.filter(c => c.id !== claimId));
  }, []);

  const bookAppointment = useCallback(async (
    appt: Omit<Appointment, 'id' | 'bookedAt' | 'status'>,
  ): Promise<string> => {
    if (!BACKEND_LIVE) {
      const id = 'a-' + Date.now();
      setAppointments(prev => [...prev, { id, ...appt, bookedAt: Date.now(), status: 'pending' }]);
      return id;
    }
    const { data: created } = await client.models.Appointment.create({
      shopId: appt.shopId,
      ...(vehicleId ? { vehicleId } : {}),
      service: appt.service,
      date: appt.date,
      time: appt.time,
      notes: appt.notes,
      status: 'pending',
      bookedAt: new Date().toISOString(),
    });
    if (!created) throw new Error('Failed to book appointment');
    setAppointments(prev => [...prev, mapAppointment(created)]);
    return created.id;
  }, [vehicleId]);

  const cancelAppointment = useCallback(async (id: string) => {
    if (!BACKEND_LIVE) { setAppointments(prev => prev.filter(a => a.id !== id)); return; }
    await client.models.Appointment.update({ id, status: 'cancelled' } as any);
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const linkedShops = shops.filter(s => {
    const hasVisit = serviceLog.some(e => e.shopId === s.id);
    return hasVisit || s.linked;
  });

  const value: StoreValue = {
    loaded, error,
    vehicle, vehicles, setVehicle, addVehicle, updateVehicle,
    setPrimaryVehicle, unlockedHistoryIds, unlockHistory,
    deals, shops, linkedShops, serviceLog,
    claims, claimDeal, advanceClaim, cancelClaim,
    appointments, bookAppointment, cancelAppointment,
    now: Date.now(),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

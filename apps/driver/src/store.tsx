import {
  useState, useEffect, useMemo, useCallback,
  createContext, useContext, ReactNode,
} from 'react';
import type { Vehicle, Shop, ServiceEntry, Deal, Claim, Appointment } from './types';

// ─── Seed data ─────────────────────────────────────────────────────
export const SEED_VEHICLE: Vehicle = {
  vin: '1HGCM82633A004352',
  year: 2018, make: 'Toyota', model: 'Corolla', engine: '1.8L I4',
  plate: 'BC RVV-204', mileage: 84120,
};

export const SEED_SHOPS: Shop[] = [
  { id: 'egban',    name: 'Egban Autos',             neighborhood: 'Mount Pleasant',  address: '2310 Main St, Vancouver',        logo: 'EA', logoColor: '#3777FF', rating: 4.8, reviews: 142, distanceKm: 1.4, hours: 'Mon–Sat · 8am–6pm',  specialties: ['Oil change', 'Brakes', 'Inspection'], linked: true,  visits: 3, lastVisit: 'Mar 12, 2024', verified: true,  honorRate: 96 },
  { id: 'lonsdale', name: 'Lonsdale Auto Care',      neighborhood: 'North Vancouver', address: '845 Lonsdale Ave, North Van',    logo: 'LA', logoColor: '#1F8A5B', rating: 4.7, reviews: 98,  distanceKm: 4.8, hours: 'Mon–Fri · 9am–5pm',  specialties: ['Brakes', 'Suspension', 'Tires'],     linked: true,  visits: 1, lastVisit: 'Sep 4, 2023',  verified: true,  honorRate: 94 },
  { id: 'marpole',  name: 'Marpole Tire & Wheel',   neighborhood: 'Marpole',         address: '8730 Granville St, Vancouver',   logo: 'MT', logoColor: '#3779C2', rating: 4.6, reviews: 73,  distanceKm: 6.2, hours: 'Tue–Sat · 8am–7pm',  specialties: ['Tires', 'Wheel alignment'],          linked: false, verified: true,  honorRate: 91 },
  { id: 'eastvan',  name: 'East Van AC Specialists', neighborhood: 'East Vancouver',  address: '1422 Commercial Dr, Vancouver', logo: 'EV', logoColor: '#0E7AB8', rating: 4.9, reviews: 56,  distanceKm: 2.6, hours: 'Mon–Sat · 9am–5pm',  specialties: ['AC service', 'Electrical'],          linked: false, verified: true,  honorRate: 98 },
  { id: 'mainst',   name: 'Main St Garage',          neighborhood: 'Mount Pleasant',  address: '3010 Main St, Vancouver',        logo: 'MS', logoColor: '#7C2D92', rating: 4.5, reviews: 211, distanceKm: 1.9, hours: 'Mon–Fri · 8am–6pm',  specialties: ['Inspection', 'Engine', 'Diagnostics'], linked: false, verified: true,  honorRate: 89 },
  { id: 'fraser',   name: 'Fraser St Auto',          neighborhood: 'Mount Pleasant',  address: '4280 Fraser St, Vancouver',      logo: 'FA', logoColor: '#D14343', rating: 4.4, reviews: 67,  distanceKm: 2.1, hours: 'Wed–Sun · 10am–6pm', specialties: ['Detailing', 'Body work'],            linked: false, verified: false, honorRate: 88 },
  { id: 'kits',     name: 'Kitsilano Foreign',       neighborhood: 'Kitsilano',       address: '2150 W 4th Ave, Vancouver',      logo: 'KF', logoColor: '#1B2649', rating: 4.9, reviews: 184, distanceKm: 5.4, hours: 'Mon–Fri · 8am–5pm',  specialties: ['BMW', 'Audi', 'VW'],                 linked: false, verified: true,  honorRate: 97 },
  { id: 'burnaby',  name: 'Burnaby Auto Hub',        neighborhood: 'Burnaby',         address: '4310 Hastings St, Burnaby',      logo: 'BA', logoColor: '#9C5616', rating: 4.3, reviews: 88,  distanceKm: 8.1, hours: 'Mon–Sat · 8am–6pm',  specialties: ['General service'],                   linked: false, verified: true,  honorRate: 90 },
];

export const SEED_SERVICE_LOG: ServiceEntry[] = [
  { id: 's1', date: '2024-03-12', mileage: 78420, what: 'Oil change + 25-pt inspection',        cost: 79,  shop: 'Egban Autos',        shopId: 'egban',    via: 'auto',   notes: 'Synthetic blend 5W-30. Air filter replaced. Brakes 70% remaining front, 80% rear.', category: 'oil' },
  { id: 's2', date: '2023-09-04', mileage: 71030, what: 'Front brake pads + rotor resurface',  cost: 340, shop: 'Lonsdale Auto Care', shopId: 'lonsdale', via: 'auto',   notes: 'Ceramic pads. Rotors within spec, resurfaced rather than replaced.',                category: 'brake' },
  { id: 's3', date: '2023-04-18', mileage: 64800, what: 'Tire rotation',                       cost: 35,  shop: null,                 shopId: null,       via: 'manual', notes: 'DIY — logged manually. Front-to-back rotation.',                                       category: 'tire' },
  { id: 's4', date: '2023-02-02', mileage: 62100, what: 'BC Out-of-Province Inspection',        cost: 150, shop: 'Main St Garage',     shopId: 'mainst',   via: 'manual', notes: 'Passed first time. Receipt uploaded to Revv.',                                       category: 'insp' },
  { id: 's5', date: '2022-08-22', mileage: 56200, what: 'Oil change',                           cost: 65,  shop: 'Egban Autos',        shopId: 'egban',    via: 'auto',   notes: 'Full synthetic 5W-30.',                                                              category: 'oil' },
  { id: 's6', date: '2022-04-10', mileage: 51200, what: 'Battery replacement',                  cost: 195, shop: 'Egban Autos',        shopId: 'egban',    via: 'auto',   notes: 'Original battery 6 years old. New 5-year warranty battery installed.',              category: 'other' },
];

export const SEED_DEALS: Deal[] = [
  { id: 'd1', shopId: 'egban',    shop: 'Egban Autos',             neighborhood: 'Mount Pleasant',  category: 'oil',    categoryLabel: 'Oil change',      offer: '$79 oil change includes filter and 25-point inspection', priceNow: 79,  priceWas: 119, distanceKm: 1.4, expiresInDays: 12, hours: 'Mon–Sat · 8am–6pm',  address: '2310 Main St, Vancouver' },
  { id: 'd2', shopId: 'lonsdale', shop: 'Lonsdale Auto Care',      neighborhood: 'North Vancouver', category: 'brake',  categoryLabel: 'Brake service',   offer: '20% off all brake jobs through May',                     priceNow: null, priceWas: null, pct: 20, distanceKm: 4.8, expiresInDays: 22, hours: 'Mon–Fri · 9am–5pm',  address: '845 Lonsdale Ave, North Van' },
  { id: 'd3', shopId: 'marpole',  shop: 'Marpole Tire & Wheel',   neighborhood: 'Marpole',         category: 'tire',   categoryLabel: 'Tire service',    offer: 'Seasonal swap + balance — $89 (4 tires)',                priceNow: 89,  priceWas: 140, distanceKm: 6.2, expiresInDays: 1,  hours: 'Tue–Sat · 8am–7pm',  address: '8730 Granville St, Vancouver' },
  { id: 'd4', shopId: 'eastvan',  shop: 'East Van AC Specialists', neighborhood: 'East Vancouver',  category: 'ac',     categoryLabel: 'AC service',      offer: 'AC recharge + leak inspection — $129',                   priceNow: 129, priceWas: 179, distanceKm: 2.6, expiresInDays: 28, hours: 'Mon–Sat · 9am–5pm',  address: '1422 Commercial Dr, Vancouver' },
  { id: 'd5', shopId: 'mainst',   shop: 'Main St Garage',          neighborhood: 'Mount Pleasant',  category: 'insp',   categoryLabel: 'Full inspection', offer: 'Pre-purchase inspection — $149',                         priceNow: 149, priceWas: 199, distanceKm: 1.9, expiresInDays: 35, hours: 'Mon–Fri · 8am–6pm',  address: '3010 Main St, Vancouver' },
  { id: 'd6', shopId: 'fraser',   shop: 'Fraser St Auto',          neighborhood: 'Mount Pleasant',  category: 'detail', categoryLabel: 'Detailing',       offer: 'Interior + exterior detail — $99 (was $160)',            priceNow: 99,  priceWas: 160, distanceKm: 2.1, expiresInDays: 18, hours: 'Wed–Sun · 10am–6pm', address: '4280 Fraser St, Vancouver' },
];

// ─── Helpers ───────────────────────────────────────────────────────
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
  const elapsed = now - claimedAt;
  const remaining = 24 * 60 * 60_000 - elapsed;
  if (remaining <= 0) return 'Expired';
  const hrs = Math.floor(remaining / (60 * 60_000));
  const mins = Math.floor((remaining % (60 * 60_000)) / 60_000);
  if (hrs >= 1) return `${hrs}h ${mins}m left`;
  return `${mins}m left`;
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
  return map[cat] ?? map['other'];
}

// ─── Context ───────────────────────────────────────────────────────
interface StoreValue {
  vehicle: Vehicle;
  setVehicle: (v: Vehicle) => void;
  deals: Deal[];
  shops: Shop[];
  linkedShops: Shop[];
  serviceLog: ServiceEntry[];
  claims: Claim[];
  claimDeal: (dealId: string) => string;
  advanceClaim: (claimId: string, toStatus: 'contacted' | 'confirmed' | 'expired') => void;
  cancelClaim: (claimId: string) => void;
  resetAll: () => void;
  appointments: Appointment[];
  bookAppointment: (appt: Omit<Appointment, 'id' | 'bookedAt' | 'status'>) => string;
  cancelAppointment: (id: string) => void;
  now: number;
  simMinutes: number;
  setSimMinutes: (m: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<Vehicle>(SEED_VEHICLE);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [simMinutes, setSimMinutes] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = Date.now() + simMinutes * 60_000;

  useEffect(() => {
    setClaims(prev => prev.map(c => {
      if (c.status !== 'awaiting') return c;
      if (now - c.claimedAt > 24 * 60 * 60_000) {
        return { ...c, status: 'expired' as const, expiredAt: c.claimedAt + 24 * 60 * 60_000 };
      }
      return c;
    }));
  }, [now]);

  const claimDeal = useCallback((dealId: string) => {
    const id = 'c-' + Date.now();
    setClaims(prev => [...prev, { id, dealId, claimedAt: Date.now() + simMinutes * 60_000, status: 'awaiting' }]);
    return id;
  }, [simMinutes]);

  const advanceClaim = useCallback((claimId: string, toStatus: 'contacted' | 'confirmed' | 'expired') => {
    setClaims(prev => prev.map(c => {
      if (c.id !== claimId) return c;
      const t = Date.now() + simMinutes * 60_000;
      if (toStatus === 'contacted') return { ...c, status: 'contacted' as const, contactedAt: t };
      if (toStatus === 'confirmed') return { ...c, status: 'confirmed' as const, confirmedAt: t };
      if (toStatus === 'expired')   return { ...c, status: 'expired' as const,   expiredAt: t };
      return c;
    }));
  }, [simMinutes]);

  const cancelClaim = useCallback((claimId: string) => {
    setClaims(prev => prev.filter(c => c.id !== claimId));
  }, []);

  const resetAll = useCallback(() => {
    setClaims([]);
    setAppointments([]);
    setSimMinutes(0);
  }, []);

  const bookAppointment = useCallback((appt: Omit<Appointment, 'id' | 'bookedAt' | 'status'>) => {
    const id = 'a-' + Date.now();
    setAppointments(prev => [...prev, { id, ...appt, bookedAt: Date.now() + simMinutes * 60_000, status: 'pending' }]);
    return id;
  }, [simMinutes]);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const deals = useMemo(() => SEED_DEALS, []);

  const value: StoreValue = {
    vehicle, setVehicle,
    deals,
    shops: SEED_SHOPS,
    linkedShops: SEED_SHOPS.filter(s => s.linked),
    serviceLog: SEED_SERVICE_LOG,
    claims, claimDeal, advanceClaim, cancelClaim, resetAll,
    appointments, bookAppointment, cancelAppointment,
    now, simMinutes, setSimMinutes,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

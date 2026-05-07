/* global React */
// Shared store for the Revv driver prototype.
// Holds vehicle, deals catalog, claims, time, and exposes mutations.
// Time is simulated — `now` advances via Tweaks → enables expiry demo.

const { useState, useEffect, useMemo, useCallback, createContext, useContext } = React;

// ─── Seed data ─────────────────────────────────────────────────────────
const SEED_VEHICLE = {
  vin: '1HGCM82633A004352',
  year: 2018, make: 'Toyota', model: 'Corolla', engine: '1.8L I4',
  plate: 'BC RVV-204', mileage: 84120,
};

// Full shop catalog. `linked` flag marks ones the driver has used.
const SEED_SHOPS = [
  { id: 'egban',    name: 'Egban Autos',          neighborhood: 'Mount Pleasant',  address: '2310 Main St, Vancouver',         logo: 'EA', logoColor: '#3777FF', rating: 4.8, reviews: 142, distanceKm: 1.4, hours: 'Mon–Sat · 8am–6pm',  specialties: ['Oil change', 'Brakes', 'Inspection'], linked: true,  visits: 3, lastVisit: 'Mar 12, 2024', verified: true,  honorRate: 96 },
  { id: 'lonsdale', name: 'Lonsdale Auto Care',   neighborhood: 'North Vancouver',  address: '845 Lonsdale Ave, North Van',     logo: 'LA', logoColor: '#1F8A5B', rating: 4.7, reviews: 98,  distanceKm: 4.8, hours: 'Mon–Fri · 9am–5pm',   specialties: ['Brakes', 'Suspension', 'Tires'],     linked: true,  visits: 1, lastVisit: 'Sep 4, 2023',  verified: true,  honorRate: 94 },
  { id: 'marpole',  name: 'Marpole Tire & Wheel', neighborhood: 'Marpole',          address: '8730 Granville St, Vancouver',    logo: 'MT', logoColor: '#3779C2', rating: 4.6, reviews: 73,  distanceKm: 6.2, hours: 'Tue–Sat · 8am–7pm',   specialties: ['Tires', 'Wheel alignment'],          linked: false, verified: true,  honorRate: 91 },
  { id: 'eastvan',  name: 'East Van AC Specialists', neighborhood: 'East Vancouver', address: '1422 Commercial Dr, Vancouver',  logo: 'EV', logoColor: '#0E7AB8', rating: 4.9, reviews: 56,  distanceKm: 2.6, hours: 'Mon–Sat · 9am–5pm',   specialties: ['AC service', 'Electrical'],          linked: false, verified: true,  honorRate: 98 },
  { id: 'mainst',   name: 'Main St Garage',       neighborhood: 'Mount Pleasant',   address: '3010 Main St, Vancouver',         logo: 'MS', logoColor: '#7C2D92', rating: 4.5, reviews: 211, distanceKm: 1.9, hours: 'Mon–Fri · 8am–6pm',   specialties: ['Inspection', 'Engine', 'Diagnostics'],linked: false, verified: true,  honorRate: 89 },
  { id: 'fraser',   name: 'Fraser St Auto',       neighborhood: 'Mount Pleasant',   address: '4280 Fraser St, Vancouver',       logo: 'FA', logoColor: '#D14343', rating: 4.4, reviews: 67,  distanceKm: 2.1, hours: 'Wed–Sun · 10am–6pm',  specialties: ['Detailing', 'Body work'],            linked: false, verified: false, honorRate: 88 },
  { id: 'kits',     name: 'Kitsilano Foreign',    neighborhood: 'Kitsilano',        address: '2150 W 4th Ave, Vancouver',       logo: 'KF', logoColor: '#1B2649', rating: 4.9, reviews: 184, distanceKm: 5.4, hours: 'Mon–Fri · 8am–5pm',   specialties: ['BMW', 'Audi', 'VW'],                  linked: false, verified: true,  honorRate: 97 },
  { id: 'burnaby',  name: 'Burnaby Auto Hub',     neighborhood: 'Burnaby',          address: '4310 Hastings St, Burnaby',       logo: 'BA', logoColor: '#9C5616', rating: 4.3, reviews: 88,  distanceKm: 8.1, hours: 'Mon–Sat · 8am–6pm',   specialties: ['General service'],                    linked: false, verified: true,  honorRate: 90 },
];

// Backwards-compat alias for any earlier reference
const SEED_LINKED_SHOPS = SEED_SHOPS.filter(s => s.linked);

// Service-log entries — mix of auto-logged (from Revv shops) and manual
const SEED_SERVICE_LOG = [
  { id: 's1', date: '2024-03-12', mileage: 78420, what: 'Oil change + 25-pt inspection',           cost: 79,  shop: 'Egban Autos',         shopId: 'egban',    via: 'auto',   notes: 'Synthetic blend 5W-30. Air filter replaced. Brakes 70% remaining front, 80% rear.', category: 'oil' },
  { id: 's2', date: '2023-09-04', mileage: 71030, what: 'Front brake pads + rotor resurface',     cost: 340, shop: 'Lonsdale Auto Care',  shopId: 'lonsdale', via: 'auto',   notes: 'Ceramic pads. Rotors within spec, resurfaced rather than replaced.',                category: 'brake' },
  { id: 's3', date: '2023-04-18', mileage: 64800, what: 'Tire rotation',                          cost: 35,  shop: null,                  shopId: null,       via: 'manual', notes: 'DIY — logged manually. Front-to-back rotation.',                                       category: 'tire' },
  { id: 's4', date: '2023-02-02', mileage: 62100, what: 'BC Out-of-Province Inspection',           cost: 150, shop: 'Main St Garage',      shopId: 'mainst',   via: 'manual', notes: 'Passed first time. Receipt uploaded to Revv.',                                       category: 'insp' },
  { id: 's5', date: '2022-08-22', mileage: 56200, what: 'Oil change',                              cost: 65,  shop: 'Egban Autos',         shopId: 'egban',    via: 'auto',   notes: 'Full synthetic 5W-30.',                                                              category: 'oil' },
  { id: 's6', date: '2022-04-10', mileage: 51200, what: 'Battery replacement',                     cost: 195, shop: 'Egban Autos',         shopId: 'egban',    via: 'auto',   notes: 'Original battery 6 years old. New 5-year warranty battery installed.',              category: 'other' },
];

const SEED_DEALS = [
  {
    id: 'd1', shopId: 'egban', shop: 'Egban Autos', neighborhood: 'Mount Pleasant',
    category: 'oil', categoryLabel: 'Oil change',
    offer: '$79 oil change includes filter and 25-point inspection',
    priceNow: 79, priceWas: 119, distanceKm: 1.4,
    expiresInDays: 12, hours: 'Mon–Sat · 8am–6pm',
    address: '2310 Main St, Vancouver',
  },
  {
    id: 'd2', shopId: 'lonsdale', shop: 'Lonsdale Auto Care', neighborhood: 'North Vancouver',
    category: 'brake', categoryLabel: 'Brake service',
    offer: '20% off all brake jobs through May',
    priceNow: null, priceWas: null, pct: 20, distanceKm: 4.8,
    expiresInDays: 22, hours: 'Mon–Fri · 9am–5pm',
    address: '845 Lonsdale Ave, North Van',
  },
  {
    id: 'd3', shopId: 'marpole', shop: 'Marpole Tire & Wheel', neighborhood: 'Marpole',
    category: 'tire', categoryLabel: 'Tire service',
    offer: 'Seasonal swap + balance — $89 (4 tires)',
    priceNow: 89, priceWas: 140, distanceKm: 6.2,
    expiresInDays: 1, hours: 'Tue–Sat · 8am–7pm',
    address: '8730 Granville St, Vancouver',
  },
  {
    id: 'd4', shopId: 'eastvan', shop: 'East Van AC Specialists', neighborhood: 'East Vancouver',
    category: 'ac', categoryLabel: 'AC service',
    offer: 'AC recharge + leak inspection — $129',
    priceNow: 129, priceWas: 179, distanceKm: 2.6,
    expiresInDays: 28, hours: 'Mon–Sat · 9am–5pm',
    address: '1422 Commercial Dr, Vancouver',
  },
  {
    id: 'd5', shopId: 'mainst', shop: 'Main St Garage', neighborhood: 'Mount Pleasant',
    category: 'insp', categoryLabel: 'Full inspection',
    offer: 'Pre-purchase inspection — $149',
    priceNow: 149, priceWas: 199, distanceKm: 1.9,
    expiresInDays: 35, hours: 'Mon–Fri · 8am–6pm',
    address: '3010 Main St, Vancouver',
  },
  {
    id: 'd6', shopId: 'fraser', shop: 'Fraser St Auto', neighborhood: 'Mount Pleasant',
    category: 'detail', categoryLabel: 'Detailing',
    offer: 'Interior + exterior detail — $99 (was $160)',
    priceNow: 99, priceWas: 160, distanceKm: 2.1,
    expiresInDays: 18, hours: 'Wed–Sun · 10am–6pm',
    address: '4280 Fraser St, Vancouver',
  },
];

// ─── Context ───────────────────────────────────────────────────────────
const StoreContext = createContext(null);

function StoreProvider({ children, tweaks, setTweak }) {
  // Vehicle profile — onboarded once
  const [vehicle, setVehicle] = useState(SEED_VEHICLE);

  // Active claims, keyed by claim id
  // shape: { id, dealId, claimedAt, status, contactedAt, convertedAt, expiredAt }
  const [claims, setClaims] = useState([]);

  // Booked appointments (from Find-a-Shop flow)
  // shape: { id, shopId, service, date, time, notes, bookedAt, status }
  const [appointments, setAppointments] = useState([]);

  // Simulated clock — minutes since now
  // 0 = real time. Tweaks can fast-forward this.
  const [simMinutes, setSimMinutes] = useState(0);

  // Force re-render every second so countdown ticks
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Actions ──
  const claimDeal = useCallback((dealId) => {
    const id = 'c-' + Date.now();
    const claim = {
      id, dealId,
      claimedAt: Date.now() + simMinutes * 60_000,
      status: 'awaiting',
    };
    setClaims(prev => [...prev, claim]);
    return id;
  }, [simMinutes]);

  const advanceClaim = useCallback((claimId, toStatus) => {
    setClaims(prev => prev.map(c => {
      if (c.id !== claimId) return c;
      const t = Date.now() + simMinutes * 60_000;
      if (toStatus === 'contacted') return { ...c, status: 'contacted', contactedAt: t };
      if (toStatus === 'confirmed') return { ...c, status: 'confirmed', confirmedAt: t };
      if (toStatus === 'expired')   return { ...c, status: 'expired',   expiredAt: t };
      return c;
    }));
  }, [simMinutes]);

  const cancelClaim = useCallback((claimId) => {
    setClaims(prev => prev.filter(c => c.id !== claimId));
  }, []);

  const resetAll = useCallback(() => {
    setClaims([]);
    setAppointments([]);
    setSimMinutes(0);
  }, []);

  const bookAppointment = useCallback((appt) => {
    const id = 'a-' + Date.now();
    const full = { id, ...appt, bookedAt: Date.now() + simMinutes * 60_000, status: 'pending' };
    setAppointments(prev => [...prev, full]);
    return id;
  }, [simMinutes]);

  const cancelAppointment = useCallback((id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  // ── Derived: auto-expire claims past 24h ──
  const now = Date.now() + simMinutes * 60_000;
  useEffect(() => {
    setClaims(prev => prev.map(c => {
      if (c.status !== 'awaiting') return c;
      if (now - c.claimedAt > 24 * 60 * 60_000) {
        return { ...c, status: 'expired', expiredAt: c.claimedAt + 24 * 60 * 60_000 };
      }
      return c;
    }));
  }, [now]);

  // Filter deals by tweaks
  const deals = useMemo(() => {
    if (tweaks.emptyMarket) return [];
    return SEED_DEALS;
  }, [tweaks.emptyMarket]);

  const value = {
    vehicle, setVehicle,
    deals,
    shops: SEED_SHOPS,
    linkedShops: SEED_SHOPS.filter(s => s.linked),
    serviceLog: SEED_SERVICE_LOG,
    claims, claimDeal, advanceClaim, cancelClaim, resetAll,
    appointments, bookAppointment, cancelAppointment,
    now, simMinutes, setSimMinutes,
    tweaks, setTweak,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function useStore() {
  return useContext(StoreContext);
}

// ─── Helpers ───────────────────────────────────────────────────────────
function findDeal(deals, dealId) {
  return deals.find(d => d.id === dealId) ||
         SEED_DEALS.find(d => d.id === dealId); // fallback if filtered out
}

function getClaimForDeal(claims, dealId) {
  // Returns the most recent active (non-expired) claim for this deal
  const active = claims.filter(c => c.dealId === dealId && c.status !== 'expired' && c.status !== 'no_response');
  return active[active.length - 1] || null;
}

function formatTimeLeft(claimedAt, now) {
  const elapsed = now - claimedAt;
  const remaining = 24 * 60 * 60_000 - elapsed;
  if (remaining <= 0) return 'Expired';
  const hrs = Math.floor(remaining / (60 * 60_000));
  const mins = Math.floor((remaining % (60 * 60_000)) / 60_000);
  if (hrs >= 1) return `${hrs}h ${mins}m left`;
  return `${mins}m left`;
}

function categoryIcon(cat) {
  // Use Revv/extra icons, falling back to a generic
  const map = {
    oil:    '../../assets/icons/extra/lightbulb-02.svg',
    brake:  '../../assets/icons/extra/shield-tick.svg',
    tire:   '../../assets/icons/extra/scan.svg',
    ac:     '../../assets/icons/extra/wifi.svg',
    insp:   '../../assets/icons/revv/check-done-01.svg',
    detail: '../../assets/icons/extra/shield-zap.svg',
    other:  '../../assets/icons/revv/help-circle.svg',
  };
  return map[cat] || map.other;
}

function findShop(shops, shopId) {
  return shops.find(s => s.id === shopId) || SEED_SHOPS.find(s => s.id === shopId);
}

// Expose globals for other Babel scripts
Object.assign(window, {
  StoreProvider, useStore,
  findDeal, findShop, getClaimForDeal, formatTimeLeft, categoryIcon,
  SEED_DEALS, SEED_VEHICLE, SEED_SHOPS,
});

import { useState, useMemo } from 'react';
import type { GoFn } from '../types';
import { useStore, findShop } from '../store';
import { DetailHead, Pill, BottomNav } from '../components';

// ─── Find a Shop ─────────────────────────────────────
export function FindShopScreen({ go }: { go: GoFn }) {
  const { shops } = useStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'nearby' | 'top-rated' | 'verified'>('all');

  const filtered = useMemo(() => {
    let result = [...shops];
    if (filter === 'nearby')     result = result.filter(s => s.distanceKm <= 5).sort((a, b) => a.distanceKm - b.distanceKm);
    if (filter === 'top-rated')  result = result.sort((a, b) => b.rating - a.rating);
    if (filter === 'verified')   result = result.filter(s => s.verified);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.neighborhood.toLowerCase().includes(q) ||
        s.specialties.some(sp => sp.toLowerCase().includes(q))
      );
    }
    return result;
  }, [shops, query, filter]);

  const filterChips = [
    { id: 'all',       label: 'All shops' },
    { id: 'nearby',    label: 'Within 5 km' },
    { id: 'top-rated', label: 'Top rated' },
    { id: 'verified',  label: 'Verified only' },
  ] as const;

  return (
    <div className="dv-screen">
      <div style={{ padding: '16px 20px 12px', background: '#fff' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Find a shop</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-secondary)' }}>
          Browse {shops.length} verified shops in greater Vancouver
        </p>
      </div>

      <div style={{ padding: '14px 0 0', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="dv-searchbar" style={{ marginBottom: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .55 }}>
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            placeholder="Shop name, neighborhood, specialty…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="dv-chips">
          {filterChips.map(f => (
            <div
              key={f.id}
              className={'dv-chip ' + (filter === f.id ? 'on' : '')}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px' }}>
        {filtered.length === 0 ? (
          <div className="dv-empty" style={{ padding: '30px 20px' }}>
            <div className="ic">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <h3>No shops match</h3>
            <p>Try a different search or filter.</p>
          </div>
        ) : filtered.map(s => (
          <div
            key={s.id}
            style={{
              background: '#fff', border: '1px solid var(--border-subtle)',
              borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer',
            }}
            onClick={() => go('shop-detail', s.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, background: s.logoColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>{s.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
                  {s.verified && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--color-brand-500)">
                      <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/>
                    </svg>
                  )}
                  {s.linked && <Pill kind="brand">Linked</Pill>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-warning-500)">
                      <path d="m12 2 3.1 6.3 7 1-5 4.9 1.1 6.8L12 18l-6.2 3.3 1.2-6.8-5-5 7-1z"/>
                    </svg>
                    <strong style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{s.rating}</strong>
                    <span>({s.reviews})</span>
                  </span>
                  <span>·</span>
                  <span>{s.distanceKm} km</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
              {s.specialties.join(' · ')}
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="profile" go={go}/>
    </div>
  );
}

// ─── Shop Detail ─────────────────────────────────────
export function ShopDetailScreen({ go, shopId }: { go: GoFn; shopId?: string }) {
  const { shops, serviceLog } = useStore();
  const shop = findShop(shops, shopId ?? '') ?? shops[0];
  if (!shop) return <div className="dv-screen"><div className="dv-empty"><h3>Shop not found</h3></div></div>;
  const visits = serviceLog.filter(e => e.shopId === shop.id);

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <DetailHead title="Shop" onBack={() => go(-1)}/>

      <div style={{ padding: '20px 16px 18px', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, background: shop.logoColor, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, flexShrink: 0,
          }}>{shop.logo}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>{shop.name}</div>
              {shop.verified && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-brand-500)">
                  <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/>
                </svg>
              )}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 2 }}>
              {shop.neighborhood} · {shop.distanceKm} km
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--color-warning-500)">
                <path d="m12 2 3.1 6.3 7 1-5 4.9 1.1 6.8L12 18l-6.2 3.3 1.2-6.8-5-5 7-1z"/>
              </svg>
              <strong style={{ fontSize: 13, fontWeight: 600 }}>{shop.rating}</strong>
              <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>({shop.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {shop.specialties.map(sp => (
            <span key={sp} style={{
              fontSize: 11, padding: '4px 9px', borderRadius: 5, fontWeight: 500,
              background: 'var(--color-brand-50)', color: 'var(--color-brand-700)',
            }}>{sp}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '18px 16px', flex: 1, overflowY: 'auto' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600 }}>Details</h4>
        <div className="dv-vincard" style={{ marginBottom: 16 }}>
          <div className="info-row" style={{ borderTop: 'none' }}>
            <span className="l">Address</span>
            <span className="v" style={{ textAlign: 'right', maxWidth: '60%' }}>{shop.address}</span>
          </div>
          <div className="info-row">
            <span className="l">Hours</span>
            <span className="v">{shop.hours}</span>
          </div>
          <div className="info-row">
            <span className="l">Honor rate</span>
            <span className="v" style={{ color: 'var(--color-success-700)' }}>
              {shop.honorRate}% · responds within 24h
            </span>
          </div>
        </div>

        {visits.length > 0 && (
          <>
            <h4 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600 }}>Your history here</h4>
            {visits.map(v => (
              <div key={v.id} className="dv-item">
                <div className="badge" style={{ background: 'var(--color-success-50)' }}>
                  <img src="/assets/icons/revv/check-circle.svg" style={{ width: 18 }} alt=""/>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="ttl">{v.what}</div>
                  <div className="meta">{v.date} · {v.mileage.toLocaleString()} km</div>
                </div>
                {v.cost && <div className="price">${v.cost}</div>}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--ghost-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2"/>
          </svg>
        </button>
        <button className="dv-btn dv-btn--primary" onClick={() => go('book', shop.id)}>
          Book appointment
        </button>
      </div>
    </div>
  );
}

// ─── Book Appointment ────────────────────────────────
export function BookAppointmentScreen({ go, shopId }: { go: GoFn; shopId?: string }) {
  const { shops, bookAppointment } = useStore();
  const shop = findShop(shops, shopId ?? '') ?? shops[0];

  const SERVICES = ['Oil change', 'Brake service', 'Tire rotation', 'Inspection', 'AC service', 'Diagnostic / Other'];

  const DAYS = useMemo(() => {
    const out = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push({
        iso:   d.toISOString().slice(0, 10),
        dow:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        day:   d.getDate(),
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()],
      });
    }
    return out;
  }, []);

  const TIMES = ['8:00 am', '9:30 am', '11:00 am', '1:00 pm', '2:30 pm', '4:00 pm'];

  const [service, setService] = useState(SERVICES[0] ?? 'Oil change');
  const [day, setDay]         = useState(DAYS[1]?.iso ?? DAYS[0]?.iso ?? '');
  const [time, setTime]       = useState(TIMES[2] ?? TIMES[0] ?? '');
  const [notes, setNotes]     = useState('');
  const [booking, setBooking] = useState(false);

  if (!shop) return <div className="dv-screen"><div className="dv-empty"><h3>Shop not found</h3></div></div>;

  const handleBook = async () => {
    setBooking(true);
    try {
      const id = await bookAppointment({ shopId: shop.id, service, date: day, time, notes });
      go('booking-confirm', id);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <DetailHead title="Book appointment" onBack={() => go(-1)}/>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--color-neutral-50)', borderRadius: 12, marginBottom: 20 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: shop.logoColor, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700,
          }}>{shop.logo}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{shop.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>{shop.neighborhood} · {shop.hours}</div>
          </div>
        </div>

        <h4 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600 }}>Service needed</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {SERVICES.map(s => (
            <div key={s} className={'dv-chip ' + (service === s ? 'on' : '')} onClick={() => setService(s)} style={{ flexShrink: 0 }}>
              {s}
            </div>
          ))}
        </div>

        <h4 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600 }}>Pick a day</h4>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 22, paddingBottom: 4 }}>
          {DAYS.map(d => (
            <div key={d.iso} onClick={() => setDay(d.iso)} style={{
              flexShrink: 0, width: 60, padding: '10px 8px', textAlign: 'center',
              background: day === d.iso ? 'var(--color-brand-500)' : '#fff',
              color: day === d.iso ? '#fff' : 'var(--fg-primary)',
              border: '1px solid ' + (day === d.iso ? 'var(--color-brand-500)' : 'var(--border-default)'),
              borderRadius: 10, cursor: 'pointer',
            }}>
              <div style={{ fontSize: 10, fontWeight: 500, opacity: .8, textTransform: 'uppercase', letterSpacing: '.05em' }}>{d.dow}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{d.day}</div>
              <div style={{ fontSize: 10, opacity: .8, marginTop: 1 }}>{d.month}</div>
            </div>
          ))}
        </div>

        <h4 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600 }}>Pick a time</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 22 }}>
          {TIMES.map(t => (
            <div key={t} onClick={() => setTime(t)} style={{
              padding: '11px 4px', textAlign: 'center', fontSize: 13, fontWeight: 500,
              background: time === t ? 'var(--color-brand-500)' : '#fff',
              color: time === t ? '#fff' : 'var(--fg-primary)',
              border: '1px solid ' + (time === t ? 'var(--color-brand-500)' : 'var(--border-default)'),
              borderRadius: 10, cursor: 'pointer',
            }}>{t}</div>
          ))}
        </div>

        <h4 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600 }}>
          Notes for the shop{' '}
          <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>(optional)</span>
        </h4>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. Hearing a squeak from the front-right when braking…"
          style={{
            width: '100%', minHeight: 80, padding: '12px 14px', fontSize: 14,
            border: '1px solid var(--border-default)', borderRadius: 10, outline: 'none',
            fontFamily: 'var(--font-sans)', resize: 'vertical',
          }}
        />
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--primary" style={{ flex: 1 }} onClick={handleBook} disabled={booking}>
          {booking ? <><div className="dv-spinner"/>Booking…</> : 'Request appointment'}
        </button>
      </div>
    </div>
  );
}

// ─── Booking Confirm ─────────────────────────────────
export function BookingConfirmScreen({ go, apptId }: { go: GoFn; apptId?: string }) {
  const { appointments, shops } = useStore();
  const appt = appointments.find(a => a.id === apptId) ?? appointments[appointments.length - 1];
  const shop = appt ? findShop(shops, appt.shopId) : undefined;

  if (!appt || !shop) {
    return <div className="dv-screen"><div className="dv-empty"><h3>No appointment found</h3></div></div>;
  }

  const dateNice = new Date(appt.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div className="dv-screen">
      <div className="dv-confirm">
        <div className="badge">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>
          </svg>
        </div>
        <h2>Appointment requested</h2>
        <p>{shop.name} will confirm your time within 24 hours.</p>

        <div className="dv-handshake-card">
          <div style={{ padding: '4px 0 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Service</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{appt.service}</div>
          </div>
          <div style={{ padding: '4px 0 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>When</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{dateNice} · {appt.time}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Where</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{shop.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>{shop.address}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 24 }}>
          <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => go('home')}>Done</button>
          <button className="dv-btn dv-btn--primary"   style={{ flex: 1 }} onClick={() => go('shop-detail', shop.id)}>View shop</button>
        </div>
      </div>
    </div>
  );
}

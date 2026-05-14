import { useState } from 'react';
import type { GoFn } from '../types';
import { useStore, categoryIcon } from '../store';
import { DetailHead } from '../components';

interface HistoryItem {
  kind: 'accident' | 'owners' | 'mileage' | 'title' | 'recalls' | 'lien';
  date: string;
  ttl: string;
  meta: string;
  tone: 'success' | 'warning' | 'neutral';
}

const DETAILED_HISTORY: HistoryItem[] = [
  { kind: 'accident', date: 'Mar 2019', ttl: 'Minor rear-end · reported', meta: 'Vancouver, BC · estimated $2,400 damage · repaired at Burrard Collision', tone: 'warning' },
  { kind: 'owners',   date: 'May 2017 – present', ttl: '2 registered owners', meta: 'Owner 1: 2017–2019 (BC) · Owner 2: 2019–present (BC). No out-of-province transfers.', tone: 'neutral' },
  { kind: 'mileage',  date: '7 verifications', ttl: 'Odometer readings verified', meta: 'Insurance, OOP inspection, and service-shop records align. No suspected rollback.', tone: 'success' },
  { kind: 'title',    date: 'Mar 2019', ttl: 'Clean title — minor damage on record', meta: 'Not salvage, not rebuilt. Title brand: Clean.', tone: 'success' },
  { kind: 'recalls',  date: '1 open recall', ttl: 'Fuel pump assembly (NHTSA 21V-660)', meta: 'Free repair at any Toyota dealer. Affects 2018–2019 Corolla. Not yet completed.', tone: 'warning' },
  { kind: 'lien',     date: 'Cleared Apr 2022', ttl: 'No active liens', meta: 'Prior auto loan with TD paid in full. Vehicle is owned outright.', tone: 'success' },
];

const toneStyle = {
  success: { bg: 'var(--color-success-50)',  fg: 'var(--color-success-700)' },
  warning: { bg: 'var(--color-warning-50)',  fg: 'var(--color-warning-700)' },
  neutral: { bg: 'var(--color-neutral-100)', fg: 'var(--fg-secondary)' },
};

function HistoryIcon({ kind }: { kind: HistoryItem['kind'] }) {
  const paths: Record<HistoryItem['kind'], React.ReactNode> = {
    accident: <><path d="M12 2 2 22h20L12 2zm0 6v6m0 4h.01"/></>,
    owners:   <><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87"/></>,
    mileage:  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    title:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    recalls:  <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    lien:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  };
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[kind]}
    </svg>
  );
}

const sH: React.CSSProperties = { margin: '18px 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center' };

export function VehicleDetailScreen({ go, vehicleId }: { go: GoFn; vehicleId?: string }) {
  const { vehicles, vehicle, serviceLog, setPrimaryVehicle, unlockedHistoryIds, unlockHistory } = useStore();
  const displayVehicles = vehicles.length > 0 ? vehicles : (vehicle ? [vehicle] : []);
  const v = displayVehicles.find(x => x.id === vehicleId) ?? displayVehicles[0];

  const [unlocking, setUnlocking] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  if (!v) return <div className="dv-screen"><div className="dv-empty"><h3>Vehicle not found</h3></div></div>;

  const isUnlocked = unlockedHistoryIds.includes(v.id ?? '');
  const ownService = serviceLog.slice(0, 3);

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(() => {
      unlockHistory(v.id ?? v.vin);
      setUnlocking(false);
      setShowPaywall(false);
    }, 1200);
  };

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)', position: 'relative' }}>
      <DetailHead title={v.nickname ?? 'Vehicle'} onBack={() => go('profile')}/>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1B2649 0%, #2B3F86 60%, var(--color-brand-500) 130%)', color: '#fff', padding: '18px 18px 22px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {v.nickname && <div style={{ fontSize: 11, opacity: .8, textTransform: 'uppercase', letterSpacing: '.07em', fontWeight: 600 }}>{v.nickname}</div>}
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 3 }}>{v.year} {v.make} {v.model}</div>
            {(v.trim || v.color) && <div style={{ fontSize: 12.5, opacity: .82, marginTop: 3 }}>{[v.trim, v.color].filter(Boolean).join(' · ')}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <span style={{ display: 'inline-block', padding: '4px 11px', borderRadius: 5, background: 'rgba(255,255,255,.16)', fontSize: 12, fontWeight: 600, letterSpacing: '.05em' }}>{v.plate}</span>
              {v.primary && <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 4, background: 'rgba(255,228,138,.18)', color: '#FFE48A', fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', border: '1px solid rgba(255,228,138,.3)' }}>Primary</span>}
            </div>
          </div>
          <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M5 17h14M5 17l-2-6a1 1 0 0 1 .9-1.3l3.6-.5a2 2 0 0 0 1.5-.9L11 6h2l2 2.3a2 2 0 0 0 1.5.9l3.6.5A1 1 0 0 1 21 11l-2 6"/>
            <circle cx="7.5" cy="17.5" r="1.5"/>
            <circle cx="16.5" cy="17.5" r="1.5"/>
          </svg>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.18)' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{v.mileage.toLocaleString()}</div>
            <div style={{ fontSize: 10.5, opacity: .78, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginTop: 2 }}>Kilometres</div>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{v.owners ?? '—'}</div>
            <div style={{ fontSize: 10.5, opacity: .78, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginTop: 2 }}>Owners</div>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{v.nextServiceKm ? (v.nextServiceKm - v.mileage).toLocaleString() : '—'}</div>
            <div style={{ fontSize: 10.5, opacity: .78, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginTop: 2 }}>Km to next svc</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
        {/* Specs */}
        <h4 style={sH}>Specifications</h4>
        <div className="dv-vincard" style={{ marginBottom: 4 }}>
          <div className="info-row" style={{ borderTop: 'none' }}><span className="l">VIN</span><span className="v" style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.vin}</span></div>
          <div className="info-row"><span className="l">Engine</span><span className="v">{v.engine}</span></div>
          {v.drivetrain && <div className="info-row"><span className="l">Drivetrain</span><span className="v">{v.drivetrain}</span></div>}
          {v.transmission && <div className="info-row"><span className="l">Transmission</span><span className="v">{v.transmission}</span></div>}
          {v.purchasedYear && <div className="info-row"><span className="l">Purchased</span><span className="v">{v.purchasedYear}</span></div>}
        </div>

        {/* Detailed history */}
        <h4 style={sH}>
          Detailed history
          {isUnlocked && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'var(--color-success-50)', color: 'var(--color-success-700)', textTransform: 'none', letterSpacing: 0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
              Unlocked
            </span>
          )}
        </h4>

        {!isUnlocked ? (
          <div className="dv-unlock-card">
            <span className="dv-unlock-card__badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
              Pay-as-you-go
            </span>
            <div className="dv-unlock-card__ttl">Unlock the full vehicle history</div>
            <div className="dv-unlock-card__desc">Pulled from NHTSA, provincial registries, and partner insurers. One-time charge per car — keep the report forever.</div>
            <div className="dv-unlock-card__features">
              {['Accident records', 'Ownership timeline', 'Mileage verifications', 'Recall status', 'Title & lien records', 'Prior-owner service'].map(f => (
                <div key={f} className="feat">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </div>
              ))}
            </div>
            <button className="dv-unlock-card__cta" onClick={() => setShowPaywall(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Unlock for {v.make} {v.model}
              <span className="price">$14.99</span>
            </button>
            <div className="dv-unlock-card__fine">One-time charge · No subscription · Powered by Revv Data API</div>
          </div>
        ) : (
          <div className="dv-vincard" style={{ paddingTop: 4 }}>
            {DETAILED_HISTORY.map((h, i) => {
              const t = toneStyle[h.tone];
              return (
                <div key={i} className="dv-history-row">
                  <div className="ic" style={{ background: t.bg, color: t.fg }}><HistoryIcon kind={h.kind}/></div>
                  <div className="body">
                    <div className="ttl">{h.ttl}</div>
                    <div className="meta">{h.meta}</div>
                    <div className="date">{h.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent service */}
        <h4 style={sH}>Recent service on Revv</h4>
        {ownService.map(e => (
          <div key={e.id} className="dv-item" style={{ cursor: 'pointer' }} onClick={() => go('service-detail', e.id)}>
            <div className="badge" style={{ background: e.via === 'auto' ? 'var(--color-success-50)' : 'var(--color-neutral-100)' }}>
              <img src={categoryIcon(e.category)} style={{ width: 18, opacity: .85 }} alt=""/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="ttl">{e.what}</div>
              <div className="meta">{e.shop ?? 'Self-logged'} · {e.date} · {e.mileage.toLocaleString()} km</div>
            </div>
            {e.cost != null && <div className="price">${e.cost}</div>}
          </div>
        ))}

        {!v.primary && (
          <button className="dv-btn dv-btn--secondary" style={{ width: '100%', marginTop: 16 }} onClick={() => setPrimaryVehicle(v.id ?? v.vin)}>
            Set as primary vehicle
          </button>
        )}
      </div>

      {/* Paywall sheet */}
      {showPaywall && (
        <>
          <div onClick={() => !unlocking && setShowPaywall(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,21,48,.55)', zIndex: 20 }}/>
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 24, zIndex: 21, background: '#fff', borderRadius: 18, padding: '22px 20px 18px', boxShadow: '0 18px 48px rgba(15,21,48,.35)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>Unlock detailed history</h3>
            <p style={{ margin: '6px 0 14px', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
              We'll pull a full report on your {v.year} {v.make} {v.model} — accidents, owners, recalls, and verified mileage. One-time charge.
            </p>
            <div style={{ padding: 14, background: 'var(--color-neutral-50)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Vehicle history report</div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-secondary)', marginTop: 1 }}>VIN {v.vin.slice(-6)} · charged to •••• 4242</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>$14.99</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} disabled={unlocking} onClick={() => setShowPaywall(false)}>Cancel</button>
              <button className="dv-btn dv-btn--primary" style={{ flex: 1.4 }} onClick={handleUnlock} disabled={unlocking}>
                {unlocking ? <><div className="dv-spinner"/>Unlocking…</> : 'Pay & unlock'}
              </button>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--fg-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
              Secure payment · Report stays in your account
            </div>
          </div>
        </>
      )}
    </div>
  );
}

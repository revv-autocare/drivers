import { useMemo } from 'react';
import type { GoFn } from '../types';
import { useStore, findShop, categoryIcon } from '../store';
import { DetailHead, BackArrow, Pill } from '../components';

// ─── Mock service reports keyed by service-log entry id ──
interface LineItem { label: string; qty: number; price: number }
interface InspItem { area: string; status: 'good' | 'watch' | 'replaced' | 'fail'; detail: string }
interface Rec { ttl: string; meta: string; priority: 'low' | 'medium' | 'high' }
interface ServiceReport {
  workOrder: string | null;
  technician: string;
  techRole: string;
  duration: string;
  bay: string;
  photos: number;
  summary: string;
  lineItems: LineItem[];
  inspection: InspItem[];
  recommendations: Rec[];
  nextService: { ttl: string; detail: string; mileage: number | null } | null;
}

const REPORTS: Record<string, ServiceReport> = {
  s1: {
    workOrder: 'WO-24031210', technician: 'Marcus T.', techRole: 'Red Seal mechanic', duration: '52 min', bay: 'Bay 3', photos: 3,
    summary: 'Routine oil & filter change with 25-point inspection. Vehicle in good overall health. Air filter showed heavier loading than expected — replaced with OEM equivalent.',
    lineItems: [
      { label: 'Mobil 1 Synthetic Blend 5W-30 (5 qt)', qty: 1, price: 38 },
      { label: 'OEM oil filter — Toyota 90915-YZZF2', qty: 1, price: 12 },
      { label: 'Engine air filter — replaced', qty: 1, price: 18 },
      { label: 'Labor — oil change + 25-pt inspection', qty: 1, price: 11 },
    ],
    inspection: [
      { area: 'Brakes — front', status: 'good', detail: '70% pad life remaining' },
      { area: 'Brakes — rear',  status: 'good', detail: '80% pad life remaining' },
      { area: 'Tires',          status: 'good', detail: 'All 4 within wear bars · 5/32"' },
      { area: 'Battery',        status: 'good', detail: '12.6V · 580 CCA (rated 590)' },
      { area: 'Coolant',        status: 'good', detail: 'Level OK, condition good' },
      { area: 'Air filter',     status: 'replaced', detail: 'Replaced — heavier loading than expected' },
      { area: 'Wipers',         status: 'watch', detail: 'Streaking on driver side — replace next visit' },
      { area: 'Lights',         status: 'good', detail: 'All exterior bulbs functioning' },
    ],
    recommendations: [
      { ttl: 'Wiper blades', meta: 'Recommended in next 30 days', priority: 'low' },
      { ttl: 'Cabin air filter', meta: 'Last replaced 2022 — due', priority: 'medium' },
    ],
    nextService: { ttl: 'Next oil change', detail: 'In ~8,000 km or by Sep 2024', mileage: 86420 },
  },
  s2: {
    workOrder: 'WO-23090401', technician: 'Priya S.', techRole: 'Lead brake technician', duration: '2h 10m', bay: 'Bay 1', photos: 5,
    summary: 'Front brake pads replaced with ceramic, rotors measured within spec and resurfaced rather than replaced. Test-driven, no pulsation or noise. Rear brakes still have life remaining.',
    lineItems: [
      { label: 'Front ceramic brake pads — Akebono', qty: 1, price: 145 },
      { label: 'Rotor resurfacing (pair, front)', qty: 2, price: 70 },
      { label: 'Brake hardware kit + clips', qty: 1, price: 22 },
      { label: 'Brake fluid top-up — DOT 3', qty: 1, price: 8 },
      { label: 'Labor — 2.0 hrs', qty: 1, price: 95 },
    ],
    inspection: [
      { area: 'Front rotor thickness', status: 'good',     detail: '24.2mm — min spec 22.0mm' },
      { area: 'Front pads — old',      status: 'replaced', detail: 'Worn to 2mm · replaced' },
      { area: 'Rear pads',             status: 'watch',    detail: '40% remaining · watch in 12 months' },
      { area: 'Rear rotors',           status: 'good',     detail: 'No scoring, within spec' },
      { area: 'Caliper slides',        status: 'good',     detail: 'Cleaned and lubricated' },
      { area: 'Brake fluid',           status: 'good',     detail: 'Topped up · clean' },
    ],
    recommendations: [
      { ttl: 'Rear brake service', meta: 'Estimated in 12 months', priority: 'low' },
      { ttl: 'Brake fluid flush', meta: 'Last done >3 years ago', priority: 'medium' },
    ],
    nextService: { ttl: 'Brake re-check', detail: 'Free re-check at 5,000 km', mileage: 76030 },
  },
  s3: {
    workOrder: null, technician: 'Self-logged', techRole: 'Owner', duration: '40 min', bay: 'Driveway', photos: 0,
    summary: 'DIY tire rotation — front-to-back, kept side. Torqued lugs to 76 ft-lb in 3 passes (star pattern). All tire pressures reset to 35 psi cold.',
    lineItems: [{ label: 'No parts — labor only (DIY)', qty: 1, price: 0 }],
    inspection: [
      { area: 'Tire wear',     status: 'good', detail: 'Even across all 4 · 6/32"' },
      { area: 'Tire pressure', status: 'good', detail: 'Set to 35 psi cold' },
      { area: 'Lug torque',   status: 'good', detail: '76 ft-lb · 3-pass star' },
    ],
    recommendations: [{ ttl: 'Next rotation', meta: 'Every ~10,000 km', priority: 'low' }],
    nextService: { ttl: 'Next rotation', detail: 'In ~10,000 km', mileage: 74800 },
  },
  s4: {
    workOrder: 'WO-23020203', technician: 'Diana R.', techRole: 'Provincial inspector', duration: '1h 45m', bay: 'Inspection bay', photos: 8,
    summary: 'BC Out-of-Province inspection — passed first attempt. All required items met provincial standards. Decal affixed.',
    lineItems: [{ label: 'BC OOP inspection fee', qty: 1, price: 150 }],
    inspection: [
      { area: 'Brakes',          status: 'good', detail: 'Pass — within spec' },
      { area: 'Steering',        status: 'good', detail: 'Pass — no play' },
      { area: 'Suspension',      status: 'good', detail: 'Pass — bushings OK' },
      { area: 'Tires',           status: 'good', detail: 'Pass — 6/32"' },
      { area: 'Lights & signals', status: 'good', detail: 'Pass — all functional' },
      { area: 'Body & frame',    status: 'good', detail: 'Pass — no rust-through' },
      { area: 'Emissions',       status: 'good', detail: 'Pass — no DTCs' },
    ],
    recommendations: [],
    nextService: { ttl: 'Next OOP inspection', detail: 'Not required for BC plates', mileage: null },
  },
  s5: {
    workOrder: 'WO-22082209', technician: 'Marcus T.', techRole: 'Red Seal mechanic', duration: '38 min', bay: 'Bay 2', photos: 2,
    summary: 'Oil and filter change. Full synthetic 5W-30. Vehicle health-check normal — flagged battery age (5+ years) for monitoring.',
    lineItems: [
      { label: 'Mobil 1 Full Synthetic 5W-30 (5 qt)', qty: 1, price: 44 },
      { label: 'OEM oil filter', qty: 1, price: 12 },
      { label: 'Labor — oil change', qty: 1, price: 9 },
    ],
    inspection: [
      { area: 'Brakes',  status: 'good',  detail: '85% / 90% pad life front/rear' },
      { area: 'Tires',   status: 'good',  detail: 'Even wear · 7/32"' },
      { area: 'Battery', status: 'watch', detail: '5+ years old — monitor' },
      { area: 'Coolant', status: 'good',  detail: 'Clean, full' },
    ],
    recommendations: [{ ttl: 'Battery test', meta: 'Recommended at next visit', priority: 'medium' }],
    nextService: { ttl: 'Next oil change', detail: 'In ~8,000 km', mileage: 64200 },
  },
  s6: {
    workOrder: 'WO-22041005', technician: 'Marcus T.', techRole: 'Red Seal mechanic', duration: '25 min', bay: 'Bay 2', photos: 4,
    summary: 'Battery replaced. Original 6-year-old battery testing weak under load. New 5-year-warranty battery installed.',
    lineItems: [
      { label: 'Group 35 battery — 5-yr warranty', qty: 1, price: 175 },
      { label: 'Battery installation + recycling', qty: 1, price: 20 },
    ],
    inspection: [
      { area: 'Old battery',     status: 'replaced', detail: '11.2V under load · failed test' },
      { area: 'New battery',     status: 'good',     detail: '12.7V · 590 CCA' },
      { area: 'Charging system', status: 'good',     detail: '14.2V · alternator OK' },
      { area: 'Terminals',       status: 'good',     detail: 'Cleaned, treated' },
    ],
    recommendations: [],
    nextService: { ttl: 'Battery health test', detail: 'Free re-test in 12 months', mileage: 60200 },
  },
};

const STATUS_STYLE = {
  good:     { bg: 'var(--color-success-50)',  fg: 'var(--color-success-700)', label: 'OK',       dot: 'var(--color-success-500)' },
  watch:    { bg: 'var(--color-warning-50)',  fg: 'var(--color-warning-700)', label: 'Watch',    dot: 'var(--color-warning-500)' },
  replaced: { bg: 'var(--color-brand-50)',    fg: 'var(--color-brand-700)',   label: 'Replaced', dot: 'var(--color-brand-500)' },
  fail:     { bg: 'var(--color-error-50)',    fg: 'var(--color-error-700)',   label: 'Failed',   dot: 'var(--color-error-500)' },
};

const sH: React.CSSProperties = { margin: '18px 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center' };
const card: React.CSSProperties = { background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 14, marginBottom: 4 };

export function ServiceDetailScreen({ go, entryId }: { go: GoFn; entryId?: string }) {
  const { serviceLog, vehicle, shops } = useStore();
  const entry = serviceLog.find(e => e.id === entryId) ?? serviceLog[0];
  if (!entry || !vehicle) return <div className="dv-screen"><div className="dv-empty"><h3>Report not found</h3></div></div>;

  const report: ServiceReport = REPORTS[entry.id] ?? REPORTS['s1']!;
  const shop = entry.shopId ? findShop(shops, entry.shopId) : null;
  const subtotal = report.lineItems.reduce((s, l) => s + (l.price ?? 0), 0);

  const dateNice = useMemo(() => {
    const [y, m, d] = entry.date.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [entry.date]);

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="Service report" onBack={() => go('service-log')}/>

      {/* Hero summary */}
      <div style={{ background: '#fff', padding: '18px 16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: entry.via === 'auto' ? 'var(--color-success-50)' : 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src={categoryIcon(entry.category)} style={{ width: 22, opacity: .85 }} alt=""/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' }}>{entry.what}</h2>
            <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)', marginTop: 4 }}>{dateNice}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
              {entry.via === 'auto'   && <Pill kind="success">Auto-logged</Pill>}
              {entry.via === 'manual' && <Pill kind="neutral">Self-logged</Pill>}
              {report.workOrder && <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 500, fontFamily: 'monospace' }}>{report.workOrder}</span>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>${entry.cost ?? 0}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginTop: 2 }}>Total</div>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{entry.mileage.toLocaleString()}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginTop: 2 }}>Km on car</div>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{report.duration}</div>
            <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginTop: 2 }}>In shop</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
        {/* Shop / technician */}
        {shop ? (
          <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => go('shop-detail', shop.id)}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: shop.logoColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{shop.logo}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{shop.name}</div>
                {shop.verified && <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-brand-500)"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/></svg>}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-secondary)', marginTop: 1 }}>{report.technician} · {report.techRole} · {report.bay}</div>
            </div>
            <BackArrow/>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fg-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Self-logged</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-secondary)', marginTop: 1 }}>{report.bay} · {report.duration}</div>
            </div>
          </div>
        )}

        <h4 style={sH}>Summary</h4>
        <div style={card}><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>{report.summary}</p></div>

        {report.photos > 0 && (
          <>
            <h4 style={sH}>Photos <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-tertiary)', fontWeight: 500 }}>{report.photos} attached</span></h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
              {Array.from({ length: report.photos }).map((_, i) => (
                <div key={i} style={{ flexShrink: 0, width: 92, height: 92, borderRadius: 10, background: 'repeating-linear-gradient(45deg, var(--color-neutral-100) 0 6px, var(--color-neutral-50) 6px 12px)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--fg-tertiary)', fontFamily: 'monospace' }}>
                  IMG_{String(i + 1).padStart(2, '0')}
                </div>
              ))}
            </div>
          </>
        )}

        <h4 style={sH}>Inspection</h4>
        <div style={{ ...card, padding: 0 }}>
          {report.inspection.map((it, i) => {
            const s = STATUS_STYLE[it.status] ?? STATUS_STYLE.good;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, marginTop: 6, flexShrink: 0 }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{it.area}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2, lineHeight: 1.4 }}>{it.detail}</div>
                </div>
                <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 5, fontWeight: 600, background: s.bg, color: s.fg, flexShrink: 0, marginTop: 1, textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <h4 style={sH}>Line items</h4>
        <div style={{ ...card, padding: 0 }}>
          {report.lineItems.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '11px 14px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', fontSize: 13 }}>
              <span style={{ flex: 1 }}>{l.label}</span>
              <span style={{ fontWeight: 600, flexShrink: 0 }}>${l.price}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--color-neutral-50)', fontSize: 13.5, fontWeight: 700 }}>
            <span>Subtotal</span><span>${subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px 12px', background: 'var(--color-neutral-50)', fontSize: 12, color: 'var(--fg-secondary)' }}>
            <span>Tax & fees</span><span>${Math.max(0, (entry.cost ?? 0) - subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 14, fontWeight: 700 }}>
            <span>Total paid</span><span style={{ color: 'var(--color-brand-600)' }}>${entry.cost ?? 0}</span>
          </div>
        </div>

        {report.recommendations.length > 0 && (
          <>
            <h4 style={sH}>Recommendations</h4>
            <div style={card}>
              {report.recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: i === 0 ? 0 : 12, paddingBottom: i === report.recommendations.length - 1 ? 0 : 12, borderBottom: i === report.recommendations.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: r.priority === 'medium' ? 'var(--color-warning-50)' : 'var(--color-neutral-100)', color: r.priority === 'medium' ? 'var(--color-warning-700)' : 'var(--fg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.ttl}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-secondary)', marginTop: 1 }}>{r.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {report.nextService && (
          <div onClick={() => shop ? go('book', shop.id) : go('find-shop')} style={{ marginTop: 6, padding: 14, background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-100)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--color-brand-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-brand-800)' }}>{report.nextService.ttl}</div>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: 'var(--color-brand-500)', color: '#fff', textTransform: 'uppercase', letterSpacing: '.05em' }}>Book</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-brand-700)', marginTop: 2, lineHeight: 1.4 }}>{report.nextService.detail}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--color-brand-700)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                {shop ? `Tap to re-book at ${shop.name}` : 'Tap to find a shop'}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--ghost-icon" title="Share report">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        {shop ? (
          <button className="dv-btn dv-btn--primary" onClick={() => go('book', shop.id)}>
            Book again at {shop.name.split(' ')[0]}
          </button>
        ) : (
          <button className="dv-btn dv-btn--primary" onClick={() => go('find-shop')}>
            Find a shop
          </button>
        )}
      </div>
    </div>
  );
}

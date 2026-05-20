import { useMemo } from 'react';
import type { GoFn } from '../types';
import { useStore, categoryIcon } from '../store';
import { DetailHead, Pill } from '../components';

export function ServiceLogScreen({ go }: { go: GoFn }) {
  const { vehicle, serviceLog } = useStore();

  const grouped = useMemo(() => {
    const out: Record<string, typeof serviceLog> = {};
    serviceLog.forEach(e => {
      const y = e.date.slice(0, 4);
      (out[y] = out[y] ?? []).push(e);
    });
    return Object.entries(out).sort((a, b) => b[0].localeCompare(a[0]));
  }, [serviceLog]);

  const totalSpent = serviceLog.reduce((s, e) => s + (e.cost ?? 0), 0);

  if (!vehicle) return null;
  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <DetailHead title="Service log" onBack={() => go('home')}/>

      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{serviceLog.length}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 1 }}>Services logged</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${totalSpent}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 1 }}>Total spent</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{vehicle.mileage.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 1 }}>Current km</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div className="dv-add-cta" onClick={() => go('add-service')}>
          <div className="dv-add-cta__ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <div className="dv-add-cta__body">
            <div className="dv-add-cta__ttl">Log a service</div>
            <div className="dv-add-cta__sub">Photo, paste receipt, or voice — AI fills the form</div>
          </div>
          <div className="dv-add-cta__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>

        {grouped.map(([year, items]) => (
          <div key={year} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 10 }}>
              {year}
            </div>
            {items.map(e => (
              <div key={e.id} className="dv-item" style={{ alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => go('service-detail', e.id)}>
                <div className="badge" style={{ background: e.via === 'auto' ? 'var(--color-success-50)' : 'var(--color-neutral-100)' }}>
                  <img src={categoryIcon(e.category)} style={{ width: 18, opacity: .85 }} alt=""/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ttl">{e.what}</div>
                  <div className="meta">{e.shop ?? 'Self-logged'} · {e.date} · {e.mileage.toLocaleString()} km</div>
                  {e.notes && (
                    <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 6, lineHeight: 1.5, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                      {e.notes}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                    {e.via === 'auto'   && <Pill kind="success">Auto-logged</Pill>}
                    {e.via === 'manual' && <Pill kind="neutral">Manual</Pill>}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-brand-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                      View report
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </span>
                  </div>
                </div>
                {e.cost != null && <div className="price">${e.cost}</div>}
              </div>
            ))}
          </div>
        ))}

        <button className="dv-btn dv-btn--secondary" style={{ width: '100%', marginTop: 8, background: 'transparent', border: 'none', color: 'var(--fg-tertiary)', fontSize: 13 }} onClick={() => go('add-service-manual')}>
          Enter manually instead
        </button>
      </div>
    </div>
  );
}

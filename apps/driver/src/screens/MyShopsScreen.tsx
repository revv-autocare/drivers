import type { GoFn } from '../types';
import { useStore } from '../store';
import { BackArrow, BottomNav } from '../components';

export function MyShopsScreen({ go }: { go: GoFn }) {
  const { linkedShops, serviceLog } = useStore();

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <div style={{ padding: '60px 20px 18px', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>My shops</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-secondary)' }}>
          Shops you've used — auto-log services, re-book in one tap.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px' }}>
        {linkedShops.map(s => {
          const visits = serviceLog.filter(e => e.shopId === s.id).length;
          const lastEntry = serviceLog.find(e => e.shopId === s.id);
          return (
            <div
              key={s.id}
              style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 16, marginBottom: 12, cursor: 'pointer' }}
              onClick={() => go('shop-detail', s.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: s.logoColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{s.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
                    {s.verified && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-brand-500)">
                        <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>{s.neighborhood} · {s.distanceKm} km</div>
                </div>
                <BackArrow/>
              </div>

              <div style={{ display: 'flex', gap: 18, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{visits}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500, marginTop: 1 }}>Visits</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{lastEntry?.date ?? '—'}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500, marginTop: 1 }}>Last visit</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-success-700)' }}>{s.honorRate}%</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500, marginTop: 1 }}>Honor rate</div>
                </div>
              </div>
            </div>
          );
        })}

        <div
          style={{ marginTop: 6, padding: 16, border: '1.5px dashed var(--color-brand-200)', borderRadius: 12, background: 'var(--color-brand-50)', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => go('find-shop')}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-brand-700)' }}>+ Find a new shop</div>
          <div style={{ fontSize: 12, color: 'var(--color-brand-700)', marginTop: 3, opacity: .8 }}>Browse all Revv shops near you</div>
        </div>
      </div>

      <BottomNav active="my-shops" go={go}/>
    </div>
  );
}

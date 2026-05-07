/* global React, useStore, findShop, findDeal, categoryIcon,
          BackArrow, BottomNav, DetailHead, Pill */
const { useState: useS3, useMemo: useM3 } = React;

// ═══════════ SERVICE LOG ══════════════════════════════════════════
function ServiceLogScreen({ go }) {
  const { vehicle, serviceLog } = useStore();

  // Group by year
  const grouped = useM3(() => {
    const out = {};
    serviceLog.forEach(e => {
      const y = e.date.slice(0, 4);
      (out[y] = out[y] || []).push(e);
    });
    return Object.entries(out).sort((a, b) => b[0].localeCompare(a[0]));
  }, [serviceLog]);

  const totalSpent = serviceLog.reduce((s, e) => s + (e.cost || 0), 0);

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <DetailHead title="Service log" onBack={() => go('home')}/>

      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
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
        {grouped.map(([year, items]) => (
          <div key={year} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 10 }}>{year}</div>
            {items.map(e => (
              <div key={e.id} className="dv-item" style={{ alignItems: 'flex-start' }}>
                <div className="badge" style={{ background: e.via === 'auto' ? 'var(--color-success-50)' : 'var(--color-neutral-100)' }}>
                  <img src={categoryIcon(e.category)} style={{ width: 18, opacity: .85 }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ttl">{e.what}</div>
                  <div className="meta">{e.shop || 'Self-logged'} · {e.date} · {e.mileage.toLocaleString()} km</div>
                  {e.notes && (
                    <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 6, lineHeight: 1.5, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                      {e.notes}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                    {e.via === 'auto' && <Pill kind="success">Auto-logged</Pill>}
                    {e.via === 'manual' && <Pill kind="neutral">Manual</Pill>}
                  </div>
                </div>
                {e.cost && <div className="price">${e.cost}</div>}
              </div>
            ))}
          </div>
        ))}

        <button className="dv-btn dv-btn--secondary" style={{ width: '100%', marginTop: 8 }}>
          + Add service manually
        </button>
      </div>
    </div>
  );
}

// ═══════════ MY SHOPS ═════════════════════════════════════════════
function MyShopsScreen({ go }) {
  const { linkedShops, serviceLog } = useStore();

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <DetailHead title="My shops" onBack={() => go('home')}/>

      <div style={{ padding: '18px 16px 4px' }}>
        <p style={{ fontSize: 13, color: 'var(--fg-secondary)', margin: 0, lineHeight: 1.5 }}>
          Shops you've used. They auto-log services and you can re-book in one tap.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px' }}>
        {linkedShops.map(s => {
          const visits = serviceLog.filter(e => e.shopId === s.id).length;
          const lastEntry = serviceLog.find(e => e.shopId === s.id);
          return (
            <div key={s.id} style={{
              background: '#fff', border: '1px solid var(--border-subtle)',
              borderRadius: 14, padding: 16, marginBottom: 12, cursor: 'pointer',
            }} onClick={() => go('shop-detail', s.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: s.logoColor, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>{s.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
                    {s.verified && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-brand-500)"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/></svg>
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
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{lastEntry?.date || '—'}</div>
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

        <div style={{
          marginTop: 6, padding: 16, border: '1.5px dashed var(--color-brand-200)',
          borderRadius: 12, background: 'var(--color-brand-50)', textAlign: 'center', cursor: 'pointer',
        }} onClick={() => go('find-shop')}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-brand-700)' }}>+ Find a new shop</div>
          <div style={{ fontSize: 12, color: 'var(--color-brand-700)', marginTop: 3, opacity: .8 }}>Browse all Revv shops near you</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ServiceLogScreen, MyShopsScreen });

import type { GoFn } from '../types';
import { useStore } from '../store';
import { Avatar, BackArrow, Pill, BottomNav } from '../components';

export function ProfileScreen({ go }: { go: GoFn }) {
  const { vehicles, vehicle, linkedShops, serviceLog, unlockedHistoryIds } = useStore();
  if (!vehicle) return null;
  const displayVehicles = vehicles.length > 0 ? vehicles : [vehicle];

  return (
    <div className="dv-screen">
      <div style={{ padding: '60px 20px 18px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials="C" size={56}/>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Chiamaka Mbamalu</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 2 }}>
              chiamaka@email.com · Mount Pleasant, BC
            </div>
          </div>
        </div>
      </div>

      <div className="dv-section" style={{ marginTop: 18 }}>
        <h4>
          Garage
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary)', fontWeight: 500, marginLeft: 6 }}>
            {displayVehicles.length} {displayVehicles.length === 1 ? 'car' : 'cars'}
          </span>
        </h4>

        {displayVehicles.map(v => {
          const unlocked = unlockedHistoryIds.includes(v.id ?? '');
          return (
            <div
              key={v.id ?? v.vin}
              className="dv-garage-card"
              onClick={() => go('vehicle-detail', v.id ?? v.vin)}
            >
              <div className="dv-garage-card__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17h14M5 17l-2-6a1 1 0 0 1 .9-1.3l3.6-.5a2 2 0 0 0 1.5-.9L11 6h2l2 2.3a2 2 0 0 0 1.5.9l3.6.5A1 1 0 0 1 21 11l-2 6"/>
                  <circle cx="7.5" cy="17.5" r="1.5"/>
                  <circle cx="16.5" cy="17.5" r="1.5"/>
                </svg>
              </div>
              <div className="dv-garage-card__body">
                <div className="dv-garage-card__top">
                  <div className="nm">{v.year} {v.make} {v.model}</div>
                  {v.primary && <Pill kind="brand">Primary</Pill>}
                  {unlocked && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: 'var(--color-success-50)', color: 'var(--color-success-700)' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
                      Pro
                    </span>
                  )}
                </div>
                {v.nickname && (
                  <div className="dv-garage-card__nick">{v.nickname}{v.trim ? ` · ${v.trim}` : ''}{v.color ? ` · ${v.color}` : ''}</div>
                )}
                <div className="dv-garage-card__meta">
                  <span>{v.plate}</span>
                  <span className="dot"/>
                  <span>{v.mileage.toLocaleString()} km</span>
                </div>
              </div>
              <BackArrow/>
            </div>
          );
        })}

        <div className="dv-garage-add" onClick={() => go('vin')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Add another vehicle</div>
            <div style={{ fontSize: 11.5, marginTop: 2, opacity: .8 }}>Scan VIN or enter manually</div>
          </div>
        </div>
      </div>

      <div className="dv-section">
        <h4>Linked shops<span className="more" onClick={() => go('my-shops')}>See all</span></h4>
        {linkedShops.map(s => (
          <div key={s.id} className="dv-shop-row" style={{ cursor: 'pointer' }} onClick={() => go('shop-detail', s.id)}>
            <div className="av">{s.logo}</div>
            <div className="info" style={{ flex: 1 }}>
              <div className="nm">{s.name}</div>
              <div className="meta">{s.neighborhood}</div>
            </div>
            <BackArrow/>
          </div>
        ))}
        <div
          onClick={() => go('find-shop')}
          style={{ marginTop: 6, padding: 14, border: '1.5px dashed var(--color-brand-200)', borderRadius: 12, background: 'var(--color-brand-50)', textAlign: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-brand-700)' }}
        >
          + Find a new shop
        </div>
      </div>

      <div className="dv-section">
        <h4>Service log<span className="more" onClick={() => go('service-log')}>See all</span></h4>
        {serviceLog.slice(0, 2).map(e => (
          <div key={e.id} className="dv-item" style={{ cursor: 'pointer' }} onClick={() => go('service-log')}>
            <div className="badge" style={{ background: e.via === 'auto' ? 'var(--color-success-50)' : 'var(--color-neutral-100)' }}>
              <img src="/assets/icons/revv/check-circle.svg" style={{ width: 18, opacity: .9 }} alt=""/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="ttl">{e.what}</div>
              <div className="meta">{e.shop ?? 'Self-logged'} · {e.date}</div>
            </div>
            {e.cost != null && <div className="price">${e.cost}</div>}
          </div>
        ))}
      </div>

      <BottomNav active="profile" go={go}/>
    </div>
  );
}

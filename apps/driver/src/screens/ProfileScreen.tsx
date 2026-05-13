import type { GoFn } from '../types';
import { useStore } from '../store';
import { Avatar, BackArrow, BottomNav } from '../components';

export function ProfileScreen({ go }: { go: GoFn }) {
  const { vehicle, linkedShops, serviceLog } = useStore();
  if (!vehicle) return null;

  return (
    <div className="dv-screen">
      <div style={{ padding: '16px 20px 18px', background: '#fff' }}>
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
        <h4>Garage</h4>
        <div className="dv-vincard">
          <div className="nm">{vehicle.year} {vehicle.make} {vehicle.model}</div>
          <div className="meta">{vehicle.plate} · {vehicle.mileage.toLocaleString()} km</div>
          <div style={{ marginTop: 14 }}>
            <div className="info-row">
              <span className="l">VIN</span>
              <span className="v" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{vehicle.vin}</span>
            </div>
            <div className="info-row"><span className="l">Engine</span><span className="v">{vehicle.engine}</span></div>
          </div>
        </div>
      </div>

      <div className="dv-section">
        <h4>
          Linked shops
          <span className="more" onClick={() => go('my-shops')}>See all</span>
        </h4>
        {linkedShops.map(s => (
          <div
            key={s.id}
            className="dv-shop-row"
            style={{ cursor: 'pointer' }}
            onClick={() => go('shop-detail', s.id)}
          >
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
          style={{
            marginTop: 6,
            padding: 14,
            border: '1.5px dashed var(--color-brand-200)',
            borderRadius: 12,
            background: 'var(--color-brand-50)',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-brand-700)',
          }}
        >
          + Find a new shop
        </div>
      </div>

      <div className="dv-section">
        <h4>
          Service log
          <span className="more" onClick={() => go('service-log')}>See all</span>
        </h4>
        {serviceLog.slice(0, 2).map(e => (
          <div key={e.id} className="dv-item" style={{ cursor: 'pointer' }} onClick={() => go('service-log')}>
            <div className="badge" style={{ background: e.via === 'auto' ? 'var(--color-success-50)' : 'var(--color-neutral-100)' }}>
              <img src="/assets/icons/revv/check-circle.svg" style={{ width: 18, opacity: .9 }} alt=""/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="ttl">{e.what}</div>
              <div className="meta">{e.shop ?? 'Self-logged'} · {e.date}</div>
            </div>
            {e.cost && <div className="price">${e.cost}</div>}
          </div>
        ))}
      </div>

      <BottomNav active="profile" go={go}/>
    </div>
  );
}

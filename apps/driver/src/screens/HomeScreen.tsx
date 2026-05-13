import type { GoFn } from '../types';
import { useStore } from '../store';
import { TopBar, DealCard, Pill, BottomNav } from '../components';

export function HomeScreen({ go }: { go: GoFn }) {
  const { vehicle, claims, deals } = useStore();
  const activeClaims = claims.filter(c => c.status === 'awaiting' || c.status === 'contacted').length;

  return (
    <div className="dv-screen">
      <TopBar greet="GOOD MORNING" name="Chiamaka"/>

      <div className="dv-hero">
        <div className="lbl">YOUR CAR</div>
        <div className="nm">{vehicle.year} {vehicle.make} {vehicle.model}</div>
        <span className="plate">{vehicle.plate}</span>
        <div className="stats">
          <div className="stat">
            <div className="v">{vehicle.mileage.toLocaleString()} km</div>
            <div className="l">Mileage</div>
          </div>
          <div className="stat">
            <div className="v">Mar 12</div>
            <div className="l">Last service</div>
          </div>
          <div className="stat">
            <div className="v">{activeClaims}</div>
            <div className="l">Open claims</div>
          </div>
        </div>
      </div>

      <div className="dv-section">
        <div className="dv-actions">
          <div className="dv-action" onClick={() => go('deals')}>
            <div className="ic"><img src="/assets/icons/extra/lightbulb-02.svg" alt=""/></div>
            <div className="lbl">Find deals</div>
          </div>
          <div className="dv-action" onClick={() => go('claims')}>
            <div className="ic"><img src="/assets/icons/revv/check-done-01.svg" alt=""/></div>
            <div className="lbl">My claims</div>
          </div>
          <div className="dv-action" onClick={() => go('service-log')}>
            <div className="ic"><img src="/assets/icons/revv/info-circle.svg" alt=""/></div>
            <div className="lbl">Service log</div>
          </div>
          <div className="dv-action" onClick={() => go('my-shops')}>
            <div className="ic"><img src="/assets/icons/extra/users-01.svg" alt=""/></div>
            <div className="lbl">My shops</div>
          </div>
        </div>
      </div>

      <div className="dv-section">
        <h4>
          Deals near you
          <span className="more" onClick={() => go('deals')}>See all</span>
        </h4>
        <div className="dv-deals">
          {deals.slice(0, 2).map(d => (
            <DealCard key={d.id} deal={d} onTap={deal => go('deal-detail', deal.id)}/>
          ))}
        </div>
      </div>

      <div className="dv-section" style={{ marginBottom: 30 }}>
        <h4>Recent service</h4>
        <div className="dv-item">
          <div className="badge" style={{ background: 'var(--color-success-50)' }}>
            <img src="/assets/icons/revv/check-circle.svg" style={{ width: 18 }} alt=""/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="ttl">Oil change + 25-pt inspection</div>
            <div className="meta">Egban Autos · Mar 12, 2024 · 78,420 km</div>
            <Pill kind="success">Auto-logged from Revv shop</Pill>
          </div>
        </div>
      </div>

      <BottomNav active="home" go={go}/>
    </div>
  );
}

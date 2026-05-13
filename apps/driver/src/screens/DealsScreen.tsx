import { useState, useMemo } from 'react';
import type { GoFn } from '../types';
import { useStore, getClaimForDeal } from '../store';
import { DealCard, BottomNav } from '../components';

const CATS = [
  { id: 'oil',    label: 'Oil change' },
  { id: 'brake',  label: 'Brakes' },
  { id: 'tire',   label: 'Tires' },
  { id: 'ac',     label: 'AC' },
  { id: 'insp',   label: 'Inspection' },
  { id: 'detail', label: 'Detailing' },
];

export function DealsScreen({ go }: { go: GoFn }) {
  const { deals, claims } = useStore();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return deals.filter(d => {
      if (cat && d.category !== cat) return false;
      if (query) {
        const q = query.toLowerCase();
        return d.offer.toLowerCase().includes(q)
            || d.shop.toLowerCase().includes(q)
            || d.categoryLabel.toLowerCase().includes(q);
      }
      return true;
    });
  }, [deals, cat, query]);

  return (
    <div className="dv-screen">
      <div style={{ padding: '16px 20px 12px', background: '#fff' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Deals near you</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-secondary)' }}>
          Within 10 km of Mount Pleasant, Vancouver
        </p>
      </div>

      <div style={{ padding: '14px 0 0', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="dv-searchbar" style={{ marginBottom: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .55 }}>
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            placeholder="Search service, shop name, neighborhood…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="dv-chips">
          <div className={'dv-chip ' + (!cat ? 'on' : '')} onClick={() => setCat(null)}>All</div>
          {CATS.map(c => (
            <div
              key={c.id}
              className={'dv-chip ' + (cat === c.id ? 'on' : '')}
              onClick={() => setCat(cat === c.id ? null : c.id)}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dv-empty">
          <div className="ic">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <h3>{deals.length === 0 ? 'No deals near you yet' : 'No matching deals'}</h3>
          <p>{deals.length === 0
            ? "Revv is launching neighborhood by neighborhood — we'll let you know when shops near you join."
            : 'Try a different search term or category.'}</p>
        </div>
      ) : (
        <div className="dv-deals" style={{ paddingTop: 14, paddingBottom: 20 }}>
          {filtered.map(d => {
            const claimed = !!getClaimForDeal(claims, d.id);
            return <DealCard key={d.id} deal={d} claimed={claimed} onTap={deal => go('deal-detail', deal.id)}/>;
          })}
        </div>
      )}

      <BottomNav active="deals" go={go}/>
    </div>
  );
}

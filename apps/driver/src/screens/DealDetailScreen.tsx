import { useState } from 'react';
import type { GoFn } from '../types';
import { useStore, findDeal, getClaimForDeal, categoryIcon } from '../store';
import { BackArrow } from '../components';

const BG_BY_CAT: Record<string, string> = {
  oil:    'linear-gradient(135deg, #FFF4E5, #FFE4B5)',
  brake:  'linear-gradient(135deg, #FEE4E2, #FECDCA)',
  tire:   'linear-gradient(135deg, #E0EAFF, #C7D7FE)',
  ac:     'linear-gradient(135deg, #E0F2FE, #B9E6FE)',
  insp:   'linear-gradient(135deg, #DCFAE6, #ABEFC6)',
  detail: 'linear-gradient(135deg, #F4EBFF, #E9D7FE)',
};

export function DealDetailScreen({ go, dealId }: { go: GoFn; dealId?: string }) {
  const { deals, claims, claimDeal, vehicle } = useStore();
  const deal = findDeal(deals, dealId ?? '') ?? deals[0];
  const existingClaim = getClaimForDeal(claims, deal.id);

  const pct = deal.priceWas && deal.priceNow
    ? Math.round((1 - deal.priceNow / deal.priceWas) * 100)
    : deal.pct;

  const [claiming, setClaiming] = useState(false);

  const handleClaim = () => {
    setClaiming(true);
    setTimeout(() => {
      const id = claimDeal(deal.id);
      go('claim-confirm', id);
      setClaiming(false);
    }, 600);
  };

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <div className="dv-dethead">
        <button className="back" onClick={() => go('deals')}><BackArrow/></button>
        <h3>Deal</h3>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .65 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z"/><path d="M9 7h6M9 11h6"/>
            </svg>
          </div>
        </div>
      </div>

      <div style={{
        height: 180,
        background: BG_BY_CAT[deal.category] ?? BG_BY_CAT['oil'],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img src={categoryIcon(deal.category)} style={{ width: 48, height: 48, opacity: .55 }} alt=""/>
      </div>

      <div className="dv-detail-content">
        <div className="shop">{deal.shop} · {deal.neighborhood}</div>
        <h2>{deal.offer}</h2>

        {deal.priceNow ? (
          <div className="priceblock">
            <span className="now">${deal.priceNow}</span>
            {deal.priceWas && <span className="was">${deal.priceWas}</span>}
            {pct && <span className="pct">{pct}% off</span>}
          </div>
        ) : pct ? (
          <div className="priceblock"><span className="now">{pct}% off</span></div>
        ) : null}

        <div className="meta-list">
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">LOCATION</div>
              <div className="value">{deal.address}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>{deal.distanceKm} km from you</div>
            </div>
          </div>
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">HOURS</div>
              <div className="value">{deal.hours}</div>
            </div>
          </div>
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">EXPIRES</div>
              <div className="value">In {deal.expiresInDays} days</div>
            </div>
          </div>
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 16H9m10 0h1.5a1.5 1.5 0 0 0 1.5-1.5V13a8 8 0 0 0-8-8H10a8 8 0 0 0-8 8v1.5A1.5 1.5 0 0 0 3.5 16H5"/>
                <circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">FOR YOUR CAR</div>
              <div className="value">{vehicle.year} {vehicle.make} {vehicle.model}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>VIN ending {vehicle.vin.slice(-6)}</div>
            </div>
          </div>
        </div>

        <div className="privacy">
          <div className="ic">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            When you claim this deal, your name, phone, and VIN are shared with the shop. They'll contact you within 24 hours.
          </div>
        </div>
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--ghost-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2"/>
          </svg>
        </button>
        {existingClaim ? (
          <button className="dv-btn dv-btn--primary" disabled>✓ Claimed</button>
        ) : (
          <button className="dv-btn dv-btn--primary" onClick={handleClaim} disabled={claiming}>
            {claiming ? <><div className="dv-spinner"/>Sending claim…</> : 'Claim deal'}
          </button>
        )}
      </div>
    </div>
  );
}

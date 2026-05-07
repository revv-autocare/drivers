/* global React, useStore, findDeal, getClaimForDeal, formatTimeLeft, categoryIcon, SEED_DEALS */
const { useState, useMemo } = React;

// ─── Tiny shared atoms ───────────────────────────────────────────
function Avatar({ initials, size = 38, color = 'var(--color-brand-500)' }) {
  return (
    <div className="dv-av" style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}>
      {initials}
    </div>
  );
}

function Pill({ kind = 'neutral', children }) {
  return <span className={'pill-' + kind} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 5, fontWeight: 500 }}>{children}</span>;
}

function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
}

// ─── Bottom nav (4 tabs) ─────────────────────────────────────────
function BottomNav({ active, go }) {
  const tabs = [
    { id: 'home',     label: 'Home',     icon: '../../assets/icons/revv/home-line.svg' },
    { id: 'deals',    label: 'Deals',    icon: '../../assets/icons/revv/BriefcaseCheck.svg' },
    { id: 'claims',   label: 'Claims',   icon: '../../assets/icons/revv/check-done-01.svg' },
    { id: 'profile',  label: 'Profile',  icon: '../../assets/icons/extra/user-circle.svg' },
  ];
  return (
    <div className="dv-bnav">
      {tabs.map(t => (
        <div key={t.id} className={'nav ' + (active === t.id ? 'on' : '')} onClick={() => go(t.id)}>
          <img src={t.icon}/>
          <span className="lb">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Top bar with notification bell ──────────────────────────────
function TopBar({ greet, name, onBell }) {
  return (
    <div className="dv-tbar">
      <Avatar initials={name.slice(0, 1).toUpperCase()}/>
      <div className="greet">
        <div className="lbl">{greet}</div>
        <div className="name">{name}</div>
      </div>
      <div className="iconbtn" style={{ marginLeft: 'auto' }} onClick={onBell}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .7 }}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        <span className="dot"/>
      </div>
    </div>
  );
}

// ─── Detail head (back + title + status pill) ────────────────────
function DetailHead({ title, onBack, pill, pillKind }) {
  return (
    <div className="dv-dethead">
      <div className="back" onClick={onBack}><BackArrow/></div>
      <h3>{title}</h3>
      {pill && <Pill kind={pillKind || 'neutral'}>{pill}</Pill>}
    </div>
  );
}

// ─── Deal card (compact, used in grid) ───────────────────────────
function DealCard({ deal, claimed, onTap }) {
  const pct = deal.priceWas && deal.priceNow
    ? Math.round((1 - deal.priceNow / deal.priceWas) * 100)
    : deal.pct;
  const endingSoon = deal.expiresInDays <= 2;

  return (
    <div className="dv-deal" onClick={() => onTap(deal)}>
      <div className={'img svc-' + deal.category}>
        <img src={categoryIcon(deal.category)}/>
        <span className="ribbon">{deal.categoryLabel}</span>
        {endingSoon && <span className="ending">Ending</span>}
      </div>
      <div className="body">
        <div className="shop">{deal.shop}</div>
        <div className="offer">{deal.offer}</div>
        {deal.priceNow ? (
          <div className="price-row">
            <span className="price-now">${deal.priceNow}</span>
            {deal.priceWas && <span className="price-was">${deal.priceWas}</span>}
            {pct && <span className="pct">{pct}% off</span>}
          </div>
        ) : pct ? (
          <div className="price-row">
            <span className="price-now">{pct}% off</span>
          </div>
        ) : null}
        <div className="meta-row">
          <span>{deal.distanceKm} km</span>
          <span className="dot"/>
          <span>{claimed ? 'Claimed' : `${deal.expiresInDays}d left`}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Claimed-deal row (in My Claims list) ────────────────────────
function ClaimedRow({ claim, deal, now, onTap }) {
  const status = claim.status;
  const pillMap = {
    awaiting:  { kind: 'warning', label: 'Awaiting response' },
    contacted: { kind: 'brand',   label: 'Shop contacted' },
    confirmed: { kind: 'success', label: 'Confirmed' },
    expired:   { kind: 'error',   label: 'Expired' },
  };
  const pill = pillMap[status] || pillMap.awaiting;

  // Progress bar: hours used out of 24
  const elapsed = now - claim.claimedAt;
  const pctUsed = Math.min(100, Math.max(0, (elapsed / (24 * 60 * 60_000)) * 100));

  return (
    <div className="dv-claim" onClick={() => onTap(claim.id)}>
      <div className="top-row">
        <span className="shop">{deal.shop}</span>
        <Pill kind={pill.kind}>{pill.label}</Pill>
      </div>
      <div className="ttl">{deal.offer}</div>
      <div className="price-row">
        {deal.priceNow && <span className="price">${deal.priceNow}</span>}
        <span>·</span>
        <span>
          {status === 'awaiting' ? formatTimeLeft(claim.claimedAt, now) :
           status === 'contacted' ? 'Shop reached out' :
           status === 'confirmed' ? 'Booking confirmed' :
           'No response within 24h'}
        </span>
      </div>
      {status === 'awaiting' && (
        <div className="progress"><div className="bar" style={{ width: pctUsed + '%' }}/></div>
      )}
    </div>
  );
}

Object.assign(window, {
  Avatar, Pill, BackArrow, BottomNav, TopBar, DetailHead, DealCard, ClaimedRow,
});

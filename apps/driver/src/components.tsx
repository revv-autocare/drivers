import type { PillKind, GoFn, Deal, Claim } from './types';
import { useStore, findDeal, getClaimForDeal, formatTimeLeft, categoryIcon } from './store';

// ─── Tiny shared atoms ───────────────────────────────
export function Avatar({ initials, size = 38, color = 'var(--color-brand-500)' }: {
  initials: string; size?: number; color?: string;
}) {
  return (
    <div className="dv-av" style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}>
      {initials}
    </div>
  );
}

export function Pill({ kind = 'neutral', children }: { kind?: PillKind; children: React.ReactNode }) {
  return (
    <span className={'pill-' + kind} style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 5, fontWeight: 500 }}>
      {children}
    </span>
  );
}

export function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  );
}

// ─── Bottom nav ──────────────────────────────────────
export function BottomNav({ active, go }: { active: string; go: GoFn }) {
  const shopRoutes = ['my-shops', 'find-shop', 'shop-detail', 'book', 'booking-confirm'];
  const visualActive = shopRoutes.includes(active) ? 'my-shops' : active;

  const tabs = [
    { id: 'home',     label: 'Home',     icon: '/assets/icons/revv/home-line.svg' },
    { id: 'deals',    label: 'Deals',    icon: '/assets/icons/revv/BriefcaseCheck.svg' },
    { id: 'my-shops', label: 'Shops',    icon: '/assets/icons/revv/building-08.svg' },
    { id: 'claims',   label: 'Bookings', icon: '/assets/icons/revv/check-done-01.svg' },
    { id: 'profile',  label: 'Profile',  icon: '/assets/icons/extra/user-circle.svg' },
  ] as const;

  return (
    <div className="dv-bnav">
      {tabs.map(t => (
        <button key={t.id} className={'nav ' + (visualActive === t.id ? 'on' : '')} onClick={() => go(t.id)}>
          <img src={t.icon} alt={t.label}/>
          <span className="lb">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Top bar ─────────────────────────────────────────
export function TopBar({ greet, name, onBell, unreadCount = 0 }: {
  greet: string; name: string; onBell?: () => void; unreadCount?: number;
}) {
  return (
    <div className="dv-tbar">
      <Avatar initials={name.slice(0, 1).toUpperCase()}/>
      <div className="greet">
        <div className="lbl">{greet}</div>
        <div className="name">{name}</div>
      </div>
      <button className="iconbtn" style={{ marginLeft: 'auto' }} onClick={onBell}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .7 }}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        {unreadCount > 0 && <span className="dot"/>}
      </button>
    </div>
  );
}

// ─── Detail head ─────────────────────────────────────
export function DetailHead({ title, onBack, pill, pillKind }: {
  title: string; onBack: () => void; pill?: string; pillKind?: PillKind;
}) {
  return (
    <div className="dv-dethead">
      <button className="back" onClick={onBack}><BackArrow/></button>
      <h3>{title}</h3>
      {pill && <Pill kind={pillKind ?? 'neutral'}>{pill}</Pill>}
    </div>
  );
}

// ─── Deal card ───────────────────────────────────────
export function DealCard({ deal, claimed, onTap }: {
  deal: Deal; claimed?: boolean; onTap: (deal: Deal) => void;
}) {
  const pct = deal.priceWas && deal.priceNow
    ? Math.round((1 - deal.priceNow / deal.priceWas) * 100)
    : deal.pct;
  const endingSoon = deal.expiresInDays <= 2;

  return (
    <div className="dv-deal" onClick={() => onTap(deal)}>
      <div className={'img svc-' + deal.category}>
        <img src={categoryIcon(deal.category)} alt={deal.categoryLabel}/>
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

// ─── Claimed-deal row ────────────────────────────────
export function ClaimedRow({ claim, deal, now, onTap }: {
  claim: Claim; deal: Deal; now: number; onTap: (id: string) => void;
}) {
  const status = claim.status;
  const pillMap = {
    awaiting:    { kind: 'warning' as PillKind, label: 'Awaiting response' },
    contacted:   { kind: 'brand'   as PillKind, label: 'Shop contacted' },
    confirmed:   { kind: 'success' as PillKind, label: 'Confirmed' },
    expired:     { kind: 'error'   as PillKind, label: 'Expired' },
    no_response: { kind: 'error'   as PillKind, label: 'No response' },
  };
  const pill = pillMap[status] ?? pillMap.awaiting;

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
          {status === 'awaiting'  ? formatTimeLeft(claim.claimedAt, now) :
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

// Re-export helpers needed in screens
export { useStore, findDeal, findShop, getClaimForDeal, formatTimeLeft, categoryIcon } from './store';

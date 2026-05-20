import { useState, useMemo } from 'react';
import type { GoFn } from '../types';
import { useStore, findDeal, findShop } from '../store';
import { TopBar, DealCard, Pill, BottomNav, BackArrow } from '../components';
import { RoadsideSosCard, FollowUpCard } from './RoadsideComponents';

// ─── Notifications sheet ──────────────────────────────
type NotifTone = 'brand' | 'success' | 'warning' | 'neutral';
type NotifIcon = 'chat' | 'clock' | 'check' | 'calendar' | 'sparkle' | 'wrench';
interface Notif {
  id: string;
  icon: NotifIcon;
  tone: NotifTone;
  ttl: string;
  desc: string;
  when: string;
  unread: boolean;
  tap: () => void;
}

function NotifIcon({ kind }: { kind: NotifIcon }) {
  switch (kind) {
    case 'chat':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'clock':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    case 'check':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
    case 'calendar':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case 'sparkle':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>;
    case 'wrench':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18.5 5.5 21l6.6-6.1a4 4 0 0 0 5.6-5.6l-3 3-2-2 3-3z"/></svg>;
  }
}

function NotificationsSheet({ items, unreadCount, onClose, onTap }: {
  items: Notif[];
  unreadCount: number;
  onClose: () => void;
  onTap: (n: Notif) => void;
}) {
  const toneStyle: Record<NotifTone, { bg: string; fg: string }> = {
    brand:   { bg: 'var(--color-brand-50)',   fg: 'var(--color-brand-600)' },
    success: { bg: 'var(--color-success-50)', fg: 'var(--color-success-700)' },
    warning: { bg: 'var(--color-warning-50)', fg: 'var(--color-warning-700)' },
    neutral: { bg: 'var(--color-neutral-100)', fg: 'var(--fg-secondary)' },
  };

  return (
    <>
      <div className="dv-notif-backdrop" onClick={onClose}/>
      <div className="dv-notif-sheet">
        <div className="dv-notif-head">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <h3>Notifications</h3>
          {unreadCount > 0 && <span className="unread-count">{unreadCount} new</span>}
          <button className="close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="dv-notif-list">
          {items.length === 0 ? (
            <div className="dv-notif-empty">
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h4>You're all caught up</h4>
              <p>No new notifications.</p>
            </div>
          ) : items.map(n => {
            const t = toneStyle[n.tone];
            return (
              <div key={n.id} className="dv-notif-row" onClick={() => onTap(n)}>
                <div className="ic" style={{ background: t.bg, color: t.fg }}><NotifIcon kind={n.icon}/></div>
                <div className="body">
                  <div className="ttl">{n.ttl}</div>
                  <div className="desc">{n.desc}</div>
                  <div className="when">{n.when}</div>
                </div>
                {n.unread && <div className="unread-dot"/>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function HomeScreen({ go }: { go: GoFn }) {
  const { vehicle, claims, deals, appointments, shops, serviceLog, now } = useStore();
  const activeClaims = claims.filter(c => c.status === 'awaiting' || c.status === 'contacted').length;
  const [notifOpen, setNotifOpen] = useState(false);
  if (!vehicle) return null;

  // Next upcoming appointment
  const nextAppt = useMemo(() => {
    const upcoming = appointments
      .filter(a => a.status !== 'completed' && a.status !== 'cancelled')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return upcoming[0] ?? null;
  }, [appointments]);
  const nextApptShop = nextAppt ? findShop(shops, nextAppt.shopId) : null;
  const nextApptDate = nextAppt ? (() => {
    const [y, m, d] = nextAppt.date.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d);
  })() : null;

  // Live notifications
  const notifications = useMemo<Notif[]>(() => {
    const items: Notif[] = [];

    claims.forEach(c => {
      const deal = findDeal(deals, c.dealId);
      if (!deal) return;
      if (c.status === 'contacted') {
        items.push({
          id: 'notif-claim-' + c.id, icon: 'chat', tone: 'brand',
          ttl: `${deal.shop} reached out`,
          desc: `They're following up on your ${deal.categoryLabel.toLowerCase()} claim.`,
          when: 'Active', unread: true,
          tap: () => go('claim-detail', c.id),
        });
      } else if (c.status === 'awaiting') {
        items.push({
          id: 'notif-claim-' + c.id, icon: 'clock', tone: 'warning',
          ttl: `Waiting on ${deal.shop}`,
          desc: `They have time left to respond to your claim.`,
          when: 'Active', unread: false,
          tap: () => go('claim-detail', c.id),
        });
      } else if (c.status === 'confirmed') {
        items.push({
          id: 'notif-claim-' + c.id, icon: 'check', tone: 'success',
          ttl: `Claim confirmed at ${deal.shop}`,
          desc: `Your ${deal.categoryLabel.toLowerCase()} deal is locked in.`,
          when: 'Recent', unread: true,
          tap: () => go('claim-detail', c.id),
        });
      }
    });

    appointments.forEach(a => {
      if (a.status === 'completed' || a.status === 'cancelled') return;
      const shop = findShop(shops, a.shopId);
      if (!shop) return;
      const [y, m, d] = a.date.split('-').map(Number);
      const dt = new Date(y!, (m ?? 1) - 1, d);
      const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      items.push({
        id: 'notif-appt-' + a.id, icon: 'calendar', tone: 'success',
        ttl: `${a.service} at ${shop.name}`,
        desc: `${a.status === 'pending' ? 'Awaiting confirmation' : 'Confirmed'} · ${dateStr} at ${a.time}.`,
        when: 'Booked', unread: true,
        tap: () => go('booking-confirm', a.id),
      });
    });

    const visitedShopIds = new Set(serviceLog.map(s => s.shopId).filter(Boolean));
    deals
      .filter(d => d.expiresInDays <= 3 && visitedShopIds.has(d.shopId))
      .slice(0, 2)
      .forEach(d => {
        items.push({
          id: 'notif-deal-' + d.id, icon: 'sparkle', tone: 'brand',
          ttl: `${d.shop} deal ending`,
          desc: `${d.offer} — expires in ${d.expiresInDays} day${d.expiresInDays === 1 ? '' : 's'}.`,
          when: `${d.expiresInDays}d`, unread: true,
          tap: () => go('deal-detail', d.id),
        });
      });

    items.push({
      id: 'notif-reminder', icon: 'wrench', tone: 'neutral',
      ttl: 'Oil change due soon',
      desc: "You're about 3,400 km past your last oil change — book before 90,000 km.",
      when: 'Reminder', unread: false,
      tap: () => go('deals'),
    });

    return items;
  }, [claims, appointments, deals, shops, serviceLog, now, go]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="dv-screen">
      <TopBar greet="GOOD MORNING" name="Chiamaka" unreadCount={unreadCount} onBell={() => setNotifOpen(true)}/>

      {notifOpen && (
        <NotificationsSheet
          items={notifications}
          unreadCount={unreadCount}
          onClose={() => setNotifOpen(false)}
          onTap={item => { setNotifOpen(false); item.tap(); }}
        />
      )}

      <div className="dv-hero dv-hero--car">
        <div className="lbl">YOUR CAR</div>
        <div className="nm">{vehicle.year} {vehicle.make} {vehicle.model}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span className="plate">{vehicle.plate}</span>
          <span className="dv-hero-health">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/>
            </svg>
            <strong>92</strong>
            <span>· A health</span>
          </span>
        </div>
        <div className="stats">
          <div className="stat"><div className="v">{vehicle.mileage.toLocaleString()} km</div><div className="l">Mileage</div></div>
          <div className="stat"><div className="v">Mar 12</div><div className="l">Last service</div></div>
          <div className="stat"><div className="v">{activeClaims}</div><div className="l">Open claims</div></div>
        </div>

        <div className="dv-hero-scene" aria-hidden="true">
          <div className="dv-hero-track"/>
          <svg className="dv-hero-car-svg" viewBox="0 0 200 80" width="170" height="68">
            <defs>
              <linearGradient id="dvCarBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2F4F8"/>
                <stop offset="60%" stopColor="#D8DDE6"/>
                <stop offset="100%" stopColor="#A8B0BE"/>
              </linearGradient>
              <linearGradient id="dvGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C9BD6"/>
                <stop offset="100%" stopColor="#3E5588"/>
              </linearGradient>
              <linearGradient id="dvGlare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,.55)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
            </defs>
            <ellipse className="dv-car-shadow" cx="100" cy="71" rx="78" ry="3" fill="rgba(0,0,0,.35)"/>
            <path d="M 12 54 L 16 44 Q 26 40 40 38 L 60 28 Q 72 22 88 21 L 122 21 Q 138 23 148 30 L 168 38 Q 184 40 190 46 L 190 54 Z" fill="url(#dvCarBody)" stroke="rgba(0,0,0,.35)" strokeWidth="0.7"/>
            <path d="M 16 44 L 188 46" stroke="rgba(0,0,0,.18)" strokeWidth="0.6" fill="none"/>
            <path d="M 60 30 L 84 30 L 86 39 L 56 39 Z" fill="url(#dvGlass)"/>
            <path d="M 60 30 L 84 30 L 86 39 L 56 39 Z" fill="url(#dvGlare)" opacity=".6"/>
            <path d="M 90 30 L 122 30 L 138 39 L 90 39 Z" fill="url(#dvGlass)"/>
            <path d="M 90 30 L 122 30 L 138 39 L 90 39 Z" fill="url(#dvGlare)" opacity=".35"/>
            <rect x="86.5" y="30" width="3" height="9" fill="#2A3550"/>
            <line x1="100" y1="39" x2="100" y2="54" stroke="rgba(0,0,0,.25)" strokeWidth="0.6"/>
            <rect x="70" y="42" width="9" height="1.4" fill="rgba(0,0,0,.35)" rx="0.7"/>
            <rect x="108" y="42" width="9" height="1.4" fill="rgba(0,0,0,.35)" rx="0.7"/>
            <path d="M 182 43 L 190 46 L 190 50 L 182 49 Z" fill="#FFE48A"/>
            <ellipse cx="186" cy="46.5" rx="4" ry="1.2" fill="#FFF2BE" opacity=".9"/>
            <rect x="12" y="46" width="5.5" height="3.6" fill="#E04D4D" rx="0.8"/>
            <path d="M 40 54 Q 54 40 68 54 Z" fill="#1A1F2E"/>
            <path d="M 140 54 Q 154 40 168 54 Z" fill="#1A1F2E"/>
            <g transform="translate(54, 54)">
              <g className="dv-wheel">
                <circle r="11" fill="#15192A"/>
                <circle r="7.6" fill="#3A4262"/>
                <g stroke="#B6BDD1" strokeWidth="1.2" strokeLinecap="round">
                  <line x1="0" y1="-6.5" x2="0" y2="6.5"/><line x1="-6.5" y1="0" x2="6.5" y2="0"/>
                  <line x1="-4.6" y1="-4.6" x2="4.6" y2="4.6"/><line x1="-4.6" y1="4.6" x2="4.6" y2="-4.6"/>
                </g>
                <circle r="1.8" fill="#D6DBEA"/>
              </g>
            </g>
            <g transform="translate(154, 54)">
              <g className="dv-wheel" style={{ animationDelay: '-0.05s' }}>
                <circle r="11" fill="#15192A"/>
                <circle r="7.6" fill="#3A4262"/>
                <g stroke="#B6BDD1" strokeWidth="1.2" strokeLinecap="round">
                  <line x1="0" y1="-6.5" x2="0" y2="6.5"/><line x1="-6.5" y1="0" x2="6.5" y2="0"/>
                  <line x1="-4.6" y1="-4.6" x2="4.6" y2="4.6"/><line x1="-4.6" y1="4.6" x2="4.6" y2="-4.6"/>
                </g>
                <circle r="1.8" fill="#D6DBEA"/>
              </g>
            </g>
          </svg>
          <div className="dv-hero-xp">
            <div className="lvl">LVL 4</div>
            <div className="streak">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF9F43" aria-hidden="true">
                <path d="M13.5.7c.3 3-1.5 5.4-3 7.2C8.5 10.1 7 12 7 14.8c0 3.4 2.7 6.2 6 6.2s6-2.8 6-6.2c0-2.3-1.1-4.1-2.2-5.7-1.5-2-2.8-3.7-3.3-8.4z"/>
              </svg>
              28d
            </div>
          </div>
        </div>
      </div>

      <div className="dv-section">
        <div className="dv-actions">
          <div className="dv-action" onClick={() => go('add-service')}>
            <div className="ic"><img src="/assets/icons/extra/lightbulb-02.svg" alt=""/></div>
            <div className="lbl">Add service</div>
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

      {nextAppt && nextApptShop && nextApptDate && (
        <div className="dv-upcoming" onClick={() => go('booking-confirm', nextAppt.id)}>
          <div className="date-block">
            <div className="mo">{nextApptDate.toLocaleString('en-US', { month: 'short' })}</div>
            <div className="day">{nextApptDate.getDate()}</div>
          </div>
          <div className="info">
            <div className="lbl">Upcoming appointment · {nextAppt.time}</div>
            <div className="svc">{nextAppt.service}</div>
            <div className="where">{nextApptShop.name} · {nextApptShop.neighborhood}</div>
          </div>
          <div className="arrow"><BackArrow/></div>
        </div>
      )}

      <RoadsideSosCard go={go}/>
      <FollowUpCard go={go}/>

      <div className="dv-section">
        <h4>Deals near you<span className="more" onClick={() => go('deals')}>See all</span></h4>
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

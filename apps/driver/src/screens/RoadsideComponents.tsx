import { useState, type MouseEvent, type ReactNode } from 'react';
import type { GoFn, RoadsideEvent, RoadsideService } from '../types';
import { useStore } from '../store';
import { BackArrow, DetailHead } from '../components';

// ═══════════ ROADSIDE SOS CARD (Home) ═════════════════════════════
export function RoadsideSosCard({ go }: { go: GoFn }) {
  const { roadsideEvent } = useStore();
  const active = !!roadsideEvent && (
    roadsideEvent.status === 'matching' ||
    roadsideEvent.status === 'dispatched' ||
    roadsideEvent.status === 'on-scene' ||
    roadsideEvent.status === 'in-progress'
  );

  if (active && roadsideEvent) {
    return (
      <div className="dv-sos-card dv-sos-card--active" onClick={() => go('roadside-active')}>
        <div className="dv-sos-card__ic">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17h12v-9H3M15 17h4l3-3v-2a2 2 0 0 0-2-2h-5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>
          </svg>
        </div>
        <div className="dv-sos-card__body">
          <div className="dv-sos-card__ttl">{roadsideEvent.serviceLabel} in progress</div>
          <div className="dv-sos-card__sub">{roadsideEvent.provider ? `${roadsideEvent.provider.name} · ${roadsideEvent.provider.eta} min away` : 'Finding your provider…'}</div>
        </div>
        <div className="dv-sos-card__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    );
  }

  return (
    <div className="dv-sos-card" onClick={() => go('roadside')}>
      <div className="dv-sos-card__ic">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
          <path d="M4.6 4.6 7 7M19.4 4.6 17 7M4.6 19.4 7 17M19.4 19.4 17 17" opacity=".5"/>
        </svg>
      </div>
      <div className="dv-sos-card__body">
        <div className="dv-sos-card__ttl">Need roadside help?</div>
        <div className="dv-sos-card__sub">24/7 — jump, tire, lockout, tow. 12–18 min avg.</div>
      </div>
      <div className="dv-sos-card__arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </div>
  );
}

// ─── Follow-up content per service type ────────────────────────────
interface FollowUpContent {
  ttl: string;
  msg: string;
  msgShort: string;
  icon: ReactNode;
  shops: Array<{ id: string; logo: string; logoColor: string; name: string; distanceKm: number; specialty: string }>;
}

export function followUpContent(event: RoadsideEvent): FollowUpContent {
  const SHOPS: Record<string, FollowUpContent['shops']> = {
    'flat-tire': [
      { id: 'marpole', logo: 'MT', logoColor: '#3779C2', name: 'Marpole Tire & Wheel', distanceKm: 6.2, specialty: 'Tire & alignment' },
      { id: 'egban',   logo: 'EA', logoColor: '#3777FF', name: 'Egban Autos',          distanceKm: 1.4, specialty: 'Inspection + balance' },
    ],
    'jump-start': [
      { id: 'egban',    logo: 'EA', logoColor: '#3777FF', name: 'Egban Autos',         distanceKm: 1.4, specialty: 'Battery & charging' },
      { id: 'lonsdale', logo: 'LA', logoColor: '#1F8A5B', name: 'Lonsdale Auto Care',  distanceKm: 4.8, specialty: 'Electrical diagnostic' },
    ],
    lockout: [
      { id: 'egban', logo: 'EA', logoColor: '#3777FF', name: 'Egban Autos', distanceKm: 1.4, specialty: 'Key cutting & locks' },
    ],
    fuel: [
      { id: 'mainst', logo: 'MS', logoColor: '#7C2D92', name: 'Main St Garage', distanceKm: 1.9, specialty: 'Fuel system check' },
    ],
    'ev-charge': [
      { id: 'kits', logo: 'KF', logoColor: '#1B2649', name: 'Kitsilano Foreign', distanceKm: 5.4, specialty: 'EV diagnostic' },
    ],
  };
  const icons: Record<string, ReactNode> = {
    'flat-tire': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>,
    'jump-start': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></svg>,
    lockout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    fuel: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="15" y2="22"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/></svg>,
    'ev-charge': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  };
  const COPY: Record<string, { ttl: string; msg: string; msgShort: string }> = {
    'flat-tire': {
      ttl: 'About your recent flat tire',
      msg: 'Flats often shift wheel alignment — a quick check now can save the tread on your other three tires.',
      msgShort: 'A quick wheel check is a good idea after a flat.',
    },
    'jump-start': {
      ttl: 'About your recent jump start',
      msg: "A battery that needs a jump is usually on the way out. A 5-minute load test at a Revv shop can tell you if it's time for a swap.",
      msgShort: 'A battery test now can prevent another no-start.',
    },
    lockout: {
      ttl: 'About your recent lockout',
      msg: "Want a spare key cut while you're thinking about it? Saves another lockout call.",
      msgShort: 'Get a spare key cut to avoid another lockout.',
    },
    fuel: {
      ttl: 'About your recent fuel run',
      msg: 'Running fully dry can stir up sediment in the tank. A fuel-system check is cheap insurance.',
      msgShort: 'A fuel-system check is worth considering.',
    },
    'ev-charge': {
      ttl: 'About your recent EV charge',
      msg: 'EV battery rescues can mean the cell needs a health check. Tap to see EV-specialist shops near you.',
      msgShort: 'A battery health check is worth it after a rescue.',
    },
  };

  const key: string = event.service in COPY ? event.service : 'flat-tire';
  const copy = COPY[key] ?? COPY['flat-tire']!;
  return {
    ...copy,
    icon: icons[key] ?? icons['flat-tire'],
    shops: SHOPS[key] ?? [],
  };
}

// ═══════════ FOLLOW-UP CARD (Home feed) ═════════════════════════════
export function FollowUpCard({ go }: { go: GoFn }) {
  const { roadsideEvent, setTweak } = useStore();
  const fu = roadsideEvent?.followUp;
  const [dismissed, setDismissed] = useState(false);

  if (!roadsideEvent || !fu || dismissed) return null;

  const content = followUpContent(roadsideEvent);

  const handleDismiss = (e: MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
  };

  if (fu.state === 'booked') {
    return (
      <div className="dv-followup booked" onClick={() => go('claims')}>
        <span className="dv-followup__lbl">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
          Your car
        </span>
        <div className="dv-followup__close" onClick={handleDismiss} title="Dismiss">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </div>
        <div className="dv-followup__head">
          <div className="dv-followup__ic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dv-followup__ttl">Upcoming · {fu.appointmentSummary ?? 'Wheel alignment'}</div>
            <div className="dv-followup__msg">
              Booked from your follow-up. Tap to view appointment details.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fu.state === 'viewed') {
    return (
      <div className="dv-followup viewed" onClick={() => go('roadside-followup')}>
        <span className="dv-followup__lbl">For your car</span>
        <div className="dv-followup__close" onClick={handleDismiss}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </div>
        <div className="dv-followup__head">
          <div className="dv-followup__ic">{content.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dv-followup__ttl">{content.ttl}</div>
            <div className="dv-followup__msg">{content.msgShort}</div>
            <span className="dv-followup__view-link">
              View options
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Initial nudge state
  return (
    <div className="dv-followup" onClick={() => { setTweak('roadsideScenario', 'followup-viewed'); go('roadside-followup'); }}>
      <span className="dv-followup__lbl">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
        For your car
      </span>
      <div className="dv-followup__close" onClick={handleDismiss} title="Dismiss">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </div>
      <div className="dv-followup__head">
        <div className="dv-followup__ic">{content.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="dv-followup__ttl">{content.ttl}</div>
          <div className="dv-followup__msg">{content.msg}</div>
        </div>
      </div>

      <div className="dv-followup__shops">
        {content.shops.map(s => (
          <div key={s.id} className="dv-followup__shop" onClick={(e) => { e.stopPropagation(); go('shop-detail', s.id); }}>
            <div className="av" style={{ background: s.logoColor }}>{s.logo}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="nm">{s.name}</div>
              <div className="sub">{s.distanceKm} km · {s.specialty}</div>
            </div>
            <div className="arrow"><BackArrow/></div>
          </div>
        ))}
      </div>

      <button className="dv-followup__cta" onClick={(e) => { e.stopPropagation(); setTweak('roadsideScenario', 'followup-viewed'); go('roadside-followup'); }}>
        See why we're suggesting this
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}

// ═══════════ FOLLOW-UP — EXPANDED DETAIL ════════════════════════════
const REASONS: Partial<Record<RoadsideService, string[]>> = {
  'flat-tire': [
    'Hitting a curb or pothole hard enough to cause a flat usually knocks one or two wheels out of alignment.',
    'Driving on a misaligned wheel chews through tread fast — you can lose 30–40% tire life in a few months.',
    'An alignment check is ~$50 and 30 min. Cheap if you don\'t need one, cheaper than new tires if you do.',
  ],
  'jump-start': [
    'Batteries that need a jump are usually nearing end of life — the next start might not happen.',
    'A 5-minute load test tells you exactly how much capacity is left, no guesswork.',
    'Replacing a battery before it fully fails costs ~$200. After it fails, you\'re paying for the tow too.',
  ],
  lockout: [
    'A spare key prevents the next lockout call (and the wait that comes with it).',
    'Smart-key fobs can be cut at most Revv shops — typically $80–$180.',
    'Storing a spare with a friend or in your wallet gives you a safety net for less than a tow costs.',
  ],
};

export function RoadsideFollowupScreen({ go }: { go: GoFn }) {
  const { roadsideEvent, setTweak } = useStore();

  if (!roadsideEvent) {
    return (
      <div className="dv-screen">
        <DetailHead title="Follow-up" onBack={() => go('home')}/>
        <div className="dv-empty">
          <h3>Nothing to follow up on</h3>
        </div>
      </div>
    );
  }

  const event = roadsideEvent;
  const content = followUpContent(event);
  const reasons = REASONS[event.service] ?? REASONS['flat-tire']!;
  const fmtDays = (ts: number | null) => {
    if (!ts) return '';
    const days = Math.floor((Date.now() - ts) / (24 * 60 * 60_000));
    if (days < 1) return 'today';
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="From your car" onBack={() => go('home')}/>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: '#FBF7F0', borderBottom: '1px solid #EFE3CC', padding: '20px 18px 22px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 4, background: '#FBE7C2', color: '#8A5A11', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
            About your {event.serviceLabel.toLowerCase()}
          </div>

          <h2 style={{ margin: '10px 0 8px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', color: '#1F1611' }}>
            {content.ttl}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#5A4719', lineHeight: 1.5 }}>{content.msg}</p>

          <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(255,255,255,.6)', border: '1px solid #EFE3CC', borderRadius: 10, fontSize: 11.5, color: '#5A4719', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A5A11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {event.service === 'tow' ? 'Tow' : event.serviceLabel} was completed {fmtDays(event.completedAt)} at {event.destinationManual ?? 'your selected shop'}.
          </div>
        </div>

        <div style={{ padding: '18px 16px 4px' }}>
          <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 12 }}>Why we're suggesting this</div>
          <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: 'var(--fg-primary)', lineHeight: 1.5 }}>
            {reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-warning-50)', color: 'var(--color-warning-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                {r}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '18px 16px 4px' }}>
          <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 12 }}>Shops we'd recommend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {content.shops.map(s => (
              <div key={s.id} className="dv-dest-card" onClick={() => go('shop-detail', s.id)}>
                <div className="dv-dest-card__logo" style={{ background: s.logoColor }}>{s.logo}</div>
                <div className="dv-dest-card__body">
                  <div className="dv-dest-card__name">{s.name}</div>
                  <div className="dv-dest-card__meta">
                    <span>{s.distanceKm} km</span>
                    <span className="dot"/>
                    <span>{s.specialty}</span>
                  </div>
                  <div className="dv-dest-card__eta" style={{ color: 'var(--color-success-700)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
                    Revv-verified · 95%+ honor rate
                  </div>
                </div>
                <BackArrow/>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 16px 24px' }}>
          <button className="dv-btn dv-btn--secondary" style={{ width: '100%', color: 'var(--fg-tertiary)' }}
            onClick={() => { setTweak('roadsideScenario', 'idle'); go('home'); }}>
            Dismiss — I don't need a follow-up
          </button>
        </div>
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--primary" style={{ flex: 1 }}
          onClick={() => content.shops[0] && go('book', content.shops[0].id)}>
          Book a follow-up check
        </button>
      </div>
    </div>
  );
}

// ═══════════ PUSH NOTIFICATION MOCKUP (overlay) ════════════════════
export function PushNotificationMockup() {
  const { tweaks, setTweak } = useStore();
  if (!tweaks.pushNotifPreview) return null;

  const scenario = tweaks.roadsideScenario;
  const isTowOther = scenario === 'completion-tow-other' || scenario === 'followup-initial';

  return (
    <div
      style={{ position: 'absolute', top: 8, left: 8, right: 8, zIndex: 30, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto' }}
      onClick={() => setTweak('pushNotifPreview', false)}
    >
      {!isTowOther && (
        <div className="dv-notif-mock">
          <div className="dv-notif-mock__ic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
          </div>
          <div className="dv-notif-mock__body">
            <div className="dv-notif-mock__head">
              <span className="app">Revv</span>
              <span className="ago">2d ago</span>
            </div>
            <div className="dv-notif-mock__ttl">About your recent jump start</div>
            <div className="dv-notif-mock__msg">Batteries that need a jump often need a check. Want to see shops near you?</div>
          </div>
        </div>
      )}
      {isTowOther && (
        <div className="dv-notif-mock">
          <div className="dv-notif-mock__ic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
          </div>
          <div className="dv-notif-mock__body">
            <div className="dv-notif-mock__head">
              <span className="app">Revv</span>
              <span className="ago">1d ago</span>
            </div>
            <div className="dv-notif-mock__ttl">Heads up — flat tires often need a wheel check</div>
            <div className="dv-notif-mock__msg">Want to see shops near you?</div>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '4px 10px', borderRadius: 12, margin: '4px auto 0', alignSelf: 'center', backdropFilter: 'blur(8px)' }}>
        Tap to dismiss · Preview
      </div>
    </div>
  );
}

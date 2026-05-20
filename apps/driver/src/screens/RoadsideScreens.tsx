import { useState, useEffect, useMemo, type CSSProperties } from 'react';
import type { GoFn, RoadsideService } from '../types';
import { useStore, findShop } from '../store';
import { BackArrow, DetailHead } from '../components';

const rsSectionHeading: CSSProperties = {
  margin: '18px 0 10px', fontSize: 12,
  fontWeight: 600, color: 'var(--fg-tertiary)',
  textTransform: 'uppercase', letterSpacing: '.06em',
};

const destSectionLbl: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  fontSize: 11, color: 'var(--fg-tertiary)',
  textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600,
  marginBottom: 10,
};

const SERVICE_TO_TWEAK: Record<string, 'dispatched-self' | 'dispatched-tow-nodest'> = {
  jump: 'dispatched-self', tire: 'dispatched-self', lockout: 'dispatched-self',
  fuel: 'dispatched-self', ev: 'dispatched-self', tow: 'dispatched-tow-nodest',
};

// ═══════════ ROADSIDE — TRIGGER ══════════════════════════════════
export function RoadsideTriggerScreen({ go }: { go: GoFn }) {
  const services = [
    { id: 'jump',    label: 'Jump start', desc: 'Battery is dead' },
    { id: 'tire',    label: 'Flat tire',  desc: 'Need a spare on' },
    { id: 'lockout', label: 'Locked out', desc: 'Keys inside the car' },
    { id: 'fuel',    label: 'Out of fuel', desc: 'Run a few litres' },
    { id: 'ev',      label: 'EV charge',  desc: 'Battery flat' },
  ];

  const iconFor = (id: string) => {
    switch (id) {
      case 'jump': return <><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/></>;
      case 'tire': return <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/></>;
      case 'lockout': return <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>;
      case 'fuel': return <><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></>;
      case 'ev': return <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>;
      default: return null;
    }
  };

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="Roadside help" onBack={() => go(-1)}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 24px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>
          What's happening?
        </h2>
        <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
          We've got a 24/7 partner network across BC. Pick what's going on and we'll get you sorted.
        </p>

        <div className="dv-rs-services">
          {services.map(s => (
            <button key={s.id} className="dv-rs-service" onClick={() => go('roadside-location', s.id)}>
              <div className="dv-rs-service__ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {iconFor(s.id)}
                </svg>
              </div>
              <div className="dv-rs-service__ttl">{s.label}</div>
              <div className="dv-rs-service__desc">{s.desc}</div>
            </button>
          ))}

          <button className="dv-rs-service tow" onClick={() => go('roadside-location', 'tow')}>
            <div className="dv-rs-service__ic">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17h12v-9H3M15 17h4l3-3v-2a2 2 0 0 0-2-2h-5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="dv-rs-service__ttl">Tow my car</div>
              <div className="dv-rs-service__desc">Get it to a shop — we'll help pick one</div>
            </div>
            <BackArrow/>
          </button>
        </div>

        <div style={{
          marginTop: 20, padding: 14, background: '#fff',
          border: '1px solid var(--border-subtle)', borderRadius: 12,
          display: 'flex', alignItems: 'flex-start', gap: 11,
          fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            Roadside is powered by <strong style={{ color: 'var(--fg-primary)' }}>Nation Safe Drivers</strong>, our vetted partner. You'll never deal with them directly — we handle it.
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════ ROADSIDE — LOCATION CONFIRM ═════════════════════════
export function RoadsideLocationScreen({ go, ctx }: { go: GoFn; ctx?: string }) {
  const serviceId = ctx ?? 'tire';
  const [note, setNote] = useState('');
  const address = '847 W 10th Ave, Vancouver, BC';

  const labelFor: Record<string, string> = {
    jump: 'Jump start', tire: 'Flat tire', lockout: 'Lockout',
    fuel: 'Out of fuel', ev: 'EV charge', tow: 'Tow',
  };
  const needsDestination = serviceId === 'tow';

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title={labelFor[serviceId] ?? 'Roadside help'} onBack={() => go(-1)}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 8 }}>Where are you?</div>

        <div className="dv-rs-mapcard">
          <div className="dv-rs-map">
            <div className="dv-rs-map__roads"/>
            <div className="dv-rs-map__pulse"/>
            <div className="dv-rs-map__pin">
              <svg width="32" height="38" viewBox="0 0 24 28" fill="#C2410C">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 8 12 16 12 16s12-8 12-16C24 5.4 18.6 0 12 0z"/>
                <circle cx="12" cy="12" r="4" fill="#fff"/>
              </svg>
            </div>
          </div>
          <div className="dv-rs-mapcard__body">
            <div className="dv-rs-mapcard__lbl">Detected location</div>
            <div className="dv-rs-mapcard__addr">{address}</div>
            <div className="dv-rs-mapcard__sub">Accurate to within 8m · GPS</div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className="dv-btn dv-btn--secondary" style={{ flex: 1, padding: '10px 14px', fontSize: 13 }}>
                Adjust location
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
            Anything the driver should know? <span style={{ color: 'var(--fg-tertiary)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Parked behind the building, hazards on. White Toyota Corolla."
            style={{ width: '100%', minHeight: 80, padding: '12px 14px', fontSize: 14, border: '1px solid var(--border-default)', borderRadius: 10, outline: 'none', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
          />
        </div>

        <div style={{
          marginTop: 14, padding: 12,
          background: 'var(--color-brand-50)',
          border: '1px solid var(--color-brand-100)',
          borderRadius: 10,
          display: 'flex', gap: 10, fontSize: 12.5,
          color: 'var(--color-brand-800)', lineHeight: 1.5,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <div>
            We'll keep you safe with a tracked ETA and the driver's photo. Average wait is 12–18 min in your area.
          </div>
        </div>
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--primary" style={{ flex: 1 }} onClick={() => go('roadside-matching', serviceId)}>
          {needsDestination ? 'Request tow' : 'Send help'}
        </button>
      </div>
    </div>
  );
}

// ═══════════ ROADSIDE — MATCHING ═════════════════════════════════
export function RoadsideMatchingScreen({ go, ctx }: { go: GoFn; ctx?: string }) {
  const { setTweak } = useStore();
  const serviceId = ctx ?? 'tire';
  const [stage, setStage] = useState(0);
  const stages = [
    'Pinging providers in your area…',
    'Found 3 nearby — picking the closest…',
    'Confirming Marcus T.…',
  ];

  useEffect(() => {
    setTweak('roadsideScenario', 'matching');
    const t1 = setTimeout(() => setStage(1), 900);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => {
      if (serviceId === 'tow') {
        go('roadside-destination', serviceId);
      } else {
        setTweak('roadsideScenario', 'dispatched-self');
        go('roadside-active', serviceId);
      }
    }, 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="Sending help" onBack={() => go('home')}/>

      <div className="dv-rs-match-stage">
        <div className="dv-rs-radar">
          <div className="dv-rs-radar__ring"/>
          <div className="dv-rs-radar__ring"/>
          <div className="dv-rs-radar__ring"/>
          <div className="dv-rs-radar__center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Finding the closest provider
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--fg-secondary)', marginTop: 6, minHeight: 19 }}>
            {stages[stage]}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════ ROADSIDE — TOW DESTINATION SELECTION ═════════════════
export function RoadsideDestinationScreen({ go }: { go: GoFn }) {
  const { shops, serviceLog, setTweak } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');

  const recommended = useMemo(() => shops.filter(s => s.verified).slice(0, 3), [shops]);
  const pastShopIds = useMemo(
    () => [...new Set(serviceLog.map(s => s.shopId).filter((id): id is string => Boolean(id)))],
    [serviceLog],
  );
  const pastShops = useMemo(
    () => pastShopIds.map(id => findShop(shops, id)).filter((s): s is NonNullable<typeof s> => Boolean(s)).slice(0, 2),
    [pastShopIds, shops],
  );

  const handleConfirm = () => {
    if (!selected) return;
    if (selected === 'defer') {
      setTweak('roadsideScenario', 'dispatched-tow-defer');
    } else {
      // Selected a specific shop (Revv or manual) — both route to "dispatched-tow-revv"
      // for the demo, since the active-screen lookup uses the destinationShopId.
      setTweak('roadsideScenario', 'dispatched-tow-revv');
    }
    go('roadside-active');
  };

  const ctaLabel = selected === 'defer' ? 'Continue — decide later' : selected ? 'Confirm destination' : 'Pick a destination';

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="Tow destination" onBack={() => go(-1)}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 24px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Where should we take your car?
        </h2>
        <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
          Pick a shop, or hand it off — we'll handle the rest. You can change your mind before the truck arrives.
        </p>

        <div style={destSectionLbl}>
          <span>Recommended near your breakdown</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--color-brand-600)', fontWeight: 600 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>
            Revv-verified
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          {recommended.map((s, i) => {
            const isOpen = i !== 1;
            const towEta = 14 + i * 3;
            return (
              <div key={s.id}
                   className={'dv-dest-card' + (selected === s.id ? ' selected' : '')}
                   onClick={() => setSelected(s.id)}>
                <div className="dv-dest-card__logo" style={{ background: s.logoColor }}>{s.logo}</div>
                <div className="dv-dest-card__body">
                  <div className="dv-dest-card__name">
                    {s.name}
                    {s.verified && <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-brand-500)"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>}
                  </div>
                  <div className="dv-dest-card__meta">
                    <span>{(s.distanceKm + 1.2).toFixed(1)} km</span>
                    <span className="dot"/>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B"><path d="m12 2 3.1 6.3 7 1-5 4.9 1.1 6.8L12 18l-6.2 3.3 1.2-6.8-5-5 7-1z"/></svg>
                      {s.rating}
                    </span>
                    <span className="dot"/>
                    <span className={isOpen ? 'open' : 'closed'}>{isOpen ? 'Open now' : 'Closed'}</span>
                  </div>
                  <div className="dv-dest-card__eta">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    Tow arrives in ~{towEta} min
                  </div>
                </div>
                <div className="dv-dest-card__check">
                  {selected === s.id && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {pastShops.length > 0 && (
          <>
            <div style={destSectionLbl}>
              <span>Shops you've used before</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              {pastShops.map(s => {
                const visits = serviceLog.filter(e => e.shopId === s.id).length;
                return (
                  <div key={s.id}
                       className={'dv-dest-card' + (selected === s.id ? ' selected' : '')}
                       onClick={() => setSelected(s.id)}>
                    <div className="dv-dest-card__logo" style={{ background: s.logoColor }}>{s.logo}</div>
                    <div className="dv-dest-card__body">
                      <div className="dv-dest-card__name">{s.name}</div>
                      <div className="dv-dest-card__meta">
                        <span>{visits} visit{visits === 1 ? '' : 's'}</span>
                        <span className="dot"/>
                        <span>{s.neighborhood}</span>
                      </div>
                      <div className="dv-dest-card__eta">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        Tow arrives in ~{Math.floor(s.distanceKm * 4)} min
                      </div>
                    </div>
                    <div className="dv-dest-card__check">
                      {selected === s.id && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div style={destSectionLbl}>
          <span>Or hand it off</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <div className={'dv-dest-defer' + (selected === 'defer' ? ' selected' : '')} onClick={() => setSelected('defer')}>
            <div className="dv-dest-defer__ic">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="dv-dest-defer__body">
              <div className="dv-dest-defer__name">Decide later</div>
              <div className="dv-dest-defer__desc">
                We'll route to the nearest Revv shop by default. The driver will check in before the tow, so you can switch.
              </div>
            </div>
            <div className="dv-dest-card__check">
              {selected === 'defer' && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </div>

          <div className={'dv-dest-defer' + (selected === 'manual' ? ' selected' : '')} onClick={() => setSelected('manual')}>
            <div className="dv-dest-defer__ic">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="dv-dest-defer__body">
              <div className="dv-dest-defer__name">A shop I know</div>
              {selected === 'manual' ? (
                <input autoFocus value={manualName} onChange={e => setManualName(e.target.value)}
                  placeholder="Name or address — we'll find it"
                  onClick={e => e.stopPropagation()}
                  style={{ width: '100%', padding: '7px 10px', marginTop: 4, border: '1.5px solid var(--color-brand-300)', borderRadius: 7, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }}/>
              ) : (
                <div className="dv-dest-defer__desc">
                  Type the name or address. Out-of-network shops are fine — we'll just check in with you afterwards.
                </div>
              )}
            </div>
            <div className="dv-dest-card__check">
              {selected === 'manual' && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--fg-secondary)', padding: '10px 16px', lineHeight: 1.5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: -1, marginRight: 4 }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          We'll let the shop know you're coming.
        </div>
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--primary" style={{ flex: 1 }}
          disabled={!selected || (selected === 'manual' && manualName.trim().length < 2)}
          onClick={handleConfirm}>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

// ═══════════ ROADSIDE — ACTIVE REQUEST ════════════════════════════
export function RoadsideActiveScreen({ go }: { go: GoFn }) {
  const { roadsideEvent, shops, setTweak } = useStore();
  const event = roadsideEvent;

  if (!event) {
    return (
      <div className="dv-screen">
        <DetailHead title="Roadside" onBack={() => go('home')}/>
        <div className="dv-empty">
          <h3>No active request</h3>
          <p>You don't have a roadside event in progress.</p>
          <button className="dv-btn dv-btn--primary" style={{ marginTop: 20 }} onClick={() => go('roadside')}>Start a new request</button>
        </div>
      </div>
    );
  }

  const isTow = event.service === 'tow';
  const dest = event.destinationShopId ? findShop(shops, event.destinationShopId) : null;
  const provider = event.provider;

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="dv-rs-status" style={{ paddingTop: 56 }}>
        <span className="dv-rs-status__lbl">
          <span className="dot"/> In progress
        </span>
        <div className="dv-rs-status__ttl">{event.serviceLabel} · help is on the way</div>
        <div className="dv-rs-status__sub">{event.location.address}, {event.location.city}</div>

        <div className="dv-rs-substatus" aria-hidden="true">
          <div className="step done"/>
          <div className="step on"/>
          <div className="step"/>
          <div className="step"/>
        </div>
        <div className="dv-rs-substatus-lbl">Driver en route · arrives in {provider?.eta ?? 12} min</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 24px' }}>
        <div className="dv-rs-mapcard">
          <div className="dv-rs-map" style={{ height: 150 }}>
            <div className="dv-rs-map__roads"/>
            <div className="dv-rs-map__pulse"/>
            <div className="dv-rs-map__pin">
              <svg width="28" height="34" viewBox="0 0 24 28" fill="#C2410C">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 8 12 16 12 16s12-8 12-16C24 5.4 18.6 0 12 0z"/>
                <circle cx="12" cy="12" r="4" fill="#fff"/>
              </svg>
            </div>
            <div style={{ position: 'absolute', left: '20%', top: '32%', zIndex: 2 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '3px solid #C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,.18)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#C2410C">
                  <path d="M3 17h12v-9H3M15 17h4l3-3v-2a2 2 0 0 0-2-2h-5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>
                </svg>
              </div>
            </div>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 20 32 Q 35 50 50 50" fill="none" stroke="#C2410C" strokeWidth="0.8" strokeDasharray="2 2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h4 style={rsSectionHeading}>Your driver</h4>
        {provider && (
          <div className="dv-rs-provider">
            <div className="dv-rs-provider__av">{provider.name.charAt(0)}</div>
            <div className="dv-rs-provider__body">
              <div className="dv-rs-provider__name">
                {provider.name}
                <span className="rating">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.3 7 1-5 4.9 1.1 6.8L12 18l-6.2 3.3 1.2-6.8-5-5 7-1z"/></svg>
                  {provider.rating}
                </span>
              </div>
              <div className="dv-rs-provider__meta">{provider.vehicle} · {provider.plate}</div>
              <div className="dv-rs-provider__powered">{provider.company} · powered by {provider.powered}</div>
            </div>
            <div className="dv-rs-provider__actions">
              <button title="Call">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2"/></svg>
              </button>
              <button title="Message">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
        )}

        {isTow && (
          <>
            <h4 style={rsSectionHeading}>Destination</h4>
            <div className="dv-rs-dest">
              {dest && (
                <div className="dv-rs-dest__card">
                  <div className="dv-rs-dest__logo" style={{ background: dest.logoColor }}>{dest.logo}</div>
                  <div className="dv-rs-dest__body">
                    <div className="dv-rs-dest__lbl">Going to</div>
                    <div className="dv-rs-dest__name">
                      {dest.name}
                      {dest.verified && <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-brand-500)"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>}
                    </div>
                    <div className="dv-rs-dest__sub">{dest.address} · they've been notified</div>
                  </div>
                </div>
              )}
              {!dest && event.destinationDecision === 'deferred' && (
                <div className="dv-rs-dest__card">
                  <div className="dv-rs-dest__logo deferred">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div className="dv-rs-dest__body">
                    <div className="dv-rs-dest__lbl">Decide on arrival</div>
                    <div className="dv-rs-dest__name">Defaulting to nearest Revv shop</div>
                    <div className="dv-rs-dest__sub">The driver will check in before towing.</div>
                  </div>
                  <button className="dv-btn dv-btn--secondary" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => go('roadside-destination', event.service)}>
                    Choose now
                  </button>
                </div>
              )}
              {!dest && !event.destinationDecision && (
                <div className="dv-rs-dest__card" style={{ borderColor: 'var(--color-warning-300)', background: 'var(--color-warning-50)' }}>
                  <div className="dv-rs-dest__logo deferred">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                  </div>
                  <div className="dv-rs-dest__body">
                    <div className="dv-rs-dest__lbl" style={{ color: 'var(--color-warning-700)' }}>Action needed</div>
                    <div className="dv-rs-dest__name">Where should we take your car?</div>
                    <div className="dv-rs-dest__sub" style={{ color: 'var(--color-warning-800)' }}>Pick a shop — the driver is almost here.</div>
                  </div>
                  <button className="dv-btn dv-btn--primary" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => go('roadside-destination', event.service)}>
                    Pick shop
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <h4 style={rsSectionHeading}>What happens next</h4>
        <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '14px 16px' }}>
          <div className="dv-tl">
            <div className="item done">
              <div className="col"><div className="dot"/><div className="ln"/></div>
              <div className="body">
                <div className="ttl">Request sent</div>
                <div className="desc">Matched with {provider?.name ?? 'a provider'} from {provider?.company ?? 'our network'}.</div>
              </div>
            </div>
            <div className="item active">
              <div className="col"><div className="dot"/><div className="ln"/></div>
              <div className="body">
                <div className="ttl">Driver en route</div>
                <div className="desc">Arriving in {provider?.eta ?? 12} min. We'll text you 1 min out.</div>
              </div>
            </div>
            <div className="item future">
              <div className="col"><div className="dot"/><div className="ln"/></div>
              <div className="body">
                <div className="ttl">{isTow ? 'Loading & towing' : 'Service on-site'}</div>
                <div className="desc">{isTow ? 'Driver will safely load your car for the tow.' : 'Most jobs take 10–20 min on the spot.'}</div>
              </div>
            </div>
            <div className="item future">
              <div className="col"><div className="dot"/></div>
              <div className="body">
                <div className="ttl">Logged automatically</div>
                <div className="desc">We'll add this to your service history for you.</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 11, color: 'var(--fg-tertiary)' }}>
          <a onClick={() => setTweak('roadsideScenario', isTow
              ? (dest ? 'completion-tow-revv' : 'completion-tow-other')
              : 'completion-self')}
            style={{ color: 'var(--color-brand-600)', cursor: 'pointer', fontWeight: 600 }}>
            ⓘ Demo: jump to completion
          </a>
        </div>
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }}>Share with someone</button>
        <button className="dv-btn dv-btn--ghost-icon" style={{ background: 'var(--color-error-50)', color: 'var(--color-error-700)' }} title="Cancel"
          onClick={() => { setTweak('roadsideScenario', 'idle'); go('home'); }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ═══════════ ROADSIDE — COMPLETION (3 variants) ═══════════════════
export function RoadsideCompletionScreen({ go }: { go: GoFn }) {
  const { roadsideEvent, shops, setTweak } = useStore();
  const event = roadsideEvent;

  if (!event || event.status !== 'completed') {
    return (
      <div className="dv-screen">
        <DetailHead title="Roadside" onBack={() => go('home')}/>
        <div className="dv-empty">
          <h3>No completed event</h3>
          <button className="dv-btn dv-btn--primary" style={{ marginTop: 20 }} onClick={() => setTweak('roadsideScenario', 'completion-self')}>
            Demo: complete a self-service
          </button>
        </div>
      </div>
    );
  }

  const isTow = event.service === 'tow';
  const dest = event.destinationShopId ? findShop(shops, event.destinationShopId) : null;
  const toRevv = isTow && !!dest;
  const toOther = isTow && !dest;
  const selfResolving = !isTow;

  if (selfResolving) return <CompletionSelf go={go}/>;
  if (toRevv)        return <CompletionTowRevv go={go} shop={dest!}/>;
  if (toOther)       return <CompletionTowOther go={go}/>;
  return null;
}

function CompletionSelf({ go }: { go: GoFn }) {
  const { roadsideEvent, vehicle, addServiceEntry, setTweak } = useStore();
  const event = roadsideEvent!;
  const [saved, setSaved] = useState(false);

  const SVC_CAT: Record<RoadsideService, string> = {
    'jump-start': 'other', 'flat-tire': 'tire', lockout: 'other', fuel: 'other', 'ev-charge': 'other', tow: 'other',
  };

  const handleAdd = () => {
    if (!vehicle || !event.provider) return;
    const id = addServiceEntry({
      date: new Date().toISOString().slice(0, 10),
      shop: event.provider.company,
      shopId: null,
      what: `${event.serviceLabel} (roadside)`,
      category: SVC_CAT[event.service] ?? 'other',
      mileage: vehicle.mileage,
      cost: event.cost,
      notes: `Roadside assistance by ${event.provider.name} (${event.provider.company}). ${event.provider.powered}.`,
      via: 'auto',
    });
    setSaved(true);
    setTimeout(() => { setTweak('roadsideScenario', 'idle'); go('service-detail', id); }, 600);
  };

  if (!vehicle) return null;

  return (
    <div className="dv-screen">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, var(--color-success-50) 0%, #fff 50%)', padding: '60px 24px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-success-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(16,164,99,.32)', animation: 'confirmPop .4s ease both' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>Done!</h2>
          <p style={{ margin: '8px 0 22px', fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
            {event.serviceLabel} complete. {event.provider?.name ?? 'Your driver'} has wrapped up — drive safe.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Ready to add to your service log</div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <PreviewRow label="Service" value={`${event.serviceLabel} (roadside)`}/>
            <PreviewRow label="Date" value={new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}/>
            <PreviewRow label="Provider" value={`${event.provider?.name ?? '—'} · ${event.provider?.company ?? ''}`}/>
            <PreviewRow label="Cost" value={`$${event.cost}`}/>
            <PreviewRow label="Mileage" value={`${vehicle.mileage.toLocaleString()} km (current)`} last/>
          </div>
        </div>

        <button className="dv-btn dv-btn--primary" style={{ width: '100%', marginBottom: 8 }} disabled={saved} onClick={handleAdd}>
          {saved ? '✓ Added' : "Add to my car's history"}
        </button>
        <button className="dv-btn dv-btn--secondary" style={{ width: '100%' }} onClick={() => { setTweak('roadsideScenario', 'idle'); go('home'); }}>
          Skip
        </button>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-tertiary)', marginTop: 14, lineHeight: 1.5 }}>
          Keeping your service history complete helps when you sell.
        </div>
      </div>
    </div>
  );
}

function CompletionTowRevv({ go, shop }: { go: GoFn; shop: NonNullable<ReturnType<typeof findShop>> }) {
  const { setTweak } = useStore();
  return (
    <div className="dv-screen">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, var(--color-brand-50) 0%, #fff 50%)', padding: '60px 24px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-brand-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(55,119,255,.32)', animation: 'confirmPop .4s ease both' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17h12v-9H3M15 17h4l3-3v-2a2 2 0 0 0-2-2h-5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Your car's at {shop.name}</h2>
          <p style={{ margin: '8px 0 22px', fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.5, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
            We've handed off to the shop. They've been notified and will reach out today.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: shop.logoColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{shop.logo}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{shop.name}</div>
              {shop.verified && <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--color-brand-500)"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>{shop.address}</div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 12 }}>What happens next</div>
          <NextStep done ttl="Tow complete" desc="Your car is safely at the shop."/>
          <NextStep active ttl={`${shop.name} reaches out`} desc="They'll call or message to diagnose and quote."/>
          <NextStep ttl="Service auto-logs" desc="When work is complete, it appears on your timeline — no action needed." last/>
        </div>

        <button className="dv-btn dv-btn--primary" style={{ width: '100%', marginBottom: 8 }} onClick={() => go('shop-detail', shop.id)}>
          View shop
        </button>
        <button className="dv-btn dv-btn--secondary" style={{ width: '100%' }} onClick={() => { setTweak('roadsideScenario', 'idle'); go('home'); }}>
          Back to home
        </button>
      </div>
    </div>
  );
}

function CompletionTowOther({ go }: { go: GoFn }) {
  const { roadsideEvent, setTweak } = useStore();
  const event = roadsideEvent!;
  const shopName = event.destinationManual ?? 'the shop you chose';
  return (
    <div className="dv-screen">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, var(--color-neutral-50) 0%, #fff 50%)', padding: '60px 24px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#1B2649', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(27,38,73,.24)', animation: 'confirmPop .4s ease both' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17h12v-9H3M15 17h4l3-3v-2a2 2 0 0 0-2-2h-5"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Dropped off at {shopName}</h2>
          <p style={{ margin: '8px 0 22px', fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.5, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
            Since they're not on Revv yet, we'll check in with you in a couple days to log what they did.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 12 }}>What happens next</div>
          <NextStep done ttl="Tow complete" desc={`Your car is at ${shopName}.`}/>
          <NextStep active ttl="Work happens off-platform" desc="They'll service your car directly with you."/>
          <NextStep ttl="We'll check in" desc="In 1–2 days, we'll prompt you to log what they did. Takes 30 seconds." last/>
        </div>

        <div style={{ padding: 12, background: 'var(--color-brand-50)', border: '1px solid var(--color-brand-100)', borderRadius: 12, marginBottom: 16, fontSize: 12.5, color: 'var(--color-brand-800)', lineHeight: 1.5, display: 'flex', gap: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <div>
            <strong style={{ fontWeight: 600 }}>Heads up:</strong> tow-related issues often need a follow-up check. We'll suggest options in a couple days.
          </div>
        </div>

        <button className="dv-btn dv-btn--primary" style={{ width: '100%' }} onClick={() => { setTweak('roadsideScenario', 'idle'); go('home'); }}>
          Back to home
        </button>
      </div>
    </div>
  );
}

function PreviewRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--border-subtle)', fontSize: 13 }}>
      <span style={{ color: 'var(--fg-tertiary)' }}>{label}</span>
      <span style={{ color: 'var(--fg-primary)', fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function NextStep({ ttl, desc, done, active, last }: { ttl: string; desc: string; done?: boolean; active?: boolean; last?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: last ? 0 : 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%',
          background: done ? 'var(--color-success-500)' : active ? 'var(--color-brand-500)' : 'var(--color-neutral-200)',
          border: '3px solid #fff',
          boxShadow: `0 0 0 1px ${done ? 'var(--color-success-200)' : active ? 'var(--color-brand-200)' : 'var(--color-neutral-300)'}`,
        }}/>
        {!last && <div style={{ flex: 1, width: 2, background: 'var(--border-subtle)', marginTop: 4 }}/>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: done || active ? 'var(--fg-primary)' : 'var(--fg-tertiary)' }}>{ttl}</div>
        <div style={{ fontSize: 12, color: done || active ? 'var(--fg-secondary)' : 'var(--fg-tertiary)', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  );
}

/* global React, useStore, findDeal, getClaimForDeal, formatTimeLeft, categoryIcon,
          Avatar, Pill, BackArrow, BottomNav, TopBar, DetailHead, DealCard, ClaimedRow */
const { useState: useS, useMemo: useM } = React;

// ═══════════ WELCOME / SIGN-IN ════════════════════════════════════
function WelcomeScreen({ go }) {
  const [email, setEmail] = useS('chiamaka@email.com');
  return (
    <div className="dv-screen">
      <div className="dv-auth">
        <div className="logo"><img src="../../assets/brand/logo-revv.svg" /></div>
        <h1>Welcome to Revv</h1>
        <p className="lead">Track your car, find honest deals from BC shops near you, and never miss maintenance.</p>
        <div className="dv-field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="dv-field">
          <label>Password</label>
          <input type="password" defaultValue="••••••••" />
        </div>
        <button className="dv-btn dv-btn--primary" style={{ marginTop: 8, width: '100%' }} onClick={() => go('vin')}>
          Sign in
        </button>
        <div className="dv-divider"><div className="line" /><span className="text">OR</span><div className="line" /></div>
        <div className="dv-social">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8.1z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7a6.6 6.6 0 0 1-9.9-3.5H2.3v2.8A11 11 0 0 0 12 23z" /><path fill="#FBBC04" d="M5.9 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.3a11 11 0 0 0 0 9.8l3.6-2.8z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.7l3.1-3.1A11 11 0 0 0 12 1a11 11 0 0 0-9.8 6L5.9 9.9A6.6 6.6 0 0 1 12 5.4z" /></svg>
          Continue with Google
        </div>
        <div className="dv-social">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 12.5c0-3 2.4-4.4 2.5-4.5-1.4-2-3.5-2.3-4.3-2.3-1.8-.2-3.5 1.1-4.4 1.1-.9 0-2.3-1-3.8-1-2 0-3.8 1.1-4.8 2.9-2 3.5-.5 8.7 1.5 11.5 1 1.4 2.1 2.9 3.6 2.8 1.5-.1 2-.9 3.7-.9 1.7 0 2.2.9 3.7.9 1.5 0 2.5-1.4 3.4-2.7 1.1-1.6 1.5-3.1 1.5-3.2-.1 0-3-1.1-3-4.6zM14.7 4c.8-1 1.4-2.3 1.2-3.7-1.2.1-2.6.8-3.4 1.7-.7.8-1.4 2.2-1.2 3.5 1.3.1 2.7-.6 3.4-1.5z" /></svg>
          Continue with Apple
        </div>
        <div className="dv-foot">New to Revv? <a>Create an account</a></div>
      </div>
    </div>);

}

// ═══════════ VIN ONBOARDING ═══════════════════════════════════════
function VinOnboardingScreen({ go }) {
  const { tweaks, setVehicle } = useStore();
  const invited = tweaks.invitedFlow;

  const [step, setStep] = useS(invited ? 'confirm' : 'enter');
  const [vin, setVin] = useS('');
  const [decoding, setDecoding] = useS(false);

  const handleDecode = () => {
    if (vin.length < 17 && !invited) {
      setVin('1HGCM82633A004352');
    }
    setDecoding(true);
    setTimeout(() => {setDecoding(false);setStep('confirm');}, 800);
  };

  return (
    <div className="dv-screen">
      <div className="dv-dethead">
        <div className="back" onClick={() => go('welcome')}><BackArrow /></div>
        <h3>Add your car</h3>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--fg-tertiary)' }}>Step {step === 'enter' ? '1' : '2'} of 2</span>
      </div>

      <div style={{ padding: '20px 16px', flex: 1 }}>
        {step === 'enter' &&
        <div>
            <h2 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Find your VIN</h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', margin: '0 0 22px', lineHeight: 1.5 }}>
              The 17-character vehicle ID is on your dashboard, door jamb, or registration.
            </p>

            <div className="dv-vinscan" onClick={handleDecode}>
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="3" height="3" />
                  <path d="M14 19h3M19 14v3" />
                </svg>
              </div>
              <div className="ttl">Scan VIN with camera</div>
              <div className="meta">Point at your dashboard or door jamb</div>
            </div>

            <div className="dv-divider"><div className="line" /><span className="text">OR ENTER MANUALLY</span><div className="line" /></div>

            <div className="dv-field">
              <label>17-character VIN</label>
              <input value={vin} onChange={(e) => setVin(e.target.value.toUpperCase().slice(0, 17))} placeholder="e.g. 1HGCM82633A004352" maxLength={17} />
              <span className="helper">{vin.length}/17 characters</span>
            </div>

            <button className="dv-btn dv-btn--primary" style={{ width: '100%', marginTop: 12 }} onClick={handleDecode} disabled={decoding}>
              {decoding ? <><div className="dv-spinner" />Decoding…</> : 'Continue'}
            </button>
          </div>
        }

        {step === 'confirm' &&
        <div>
            <h2 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              {invited ? 'Is this your car?' : 'We found your car'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', margin: '0 0 22px', lineHeight: 1.5 }}>
              {invited ?
            "Egban Autos invited you to Revv. We've pre-filled your vehicle from their records." :
            "Decoded from your VIN via NHTSA. Confirm and we'll add it to your garage."}
            </p>

            <div className="dv-vincard">
              <div className="car-icon">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 16H9m10 0h1.5a1.5 1.5 0 0 0 1.5-1.5V13a8 8 0 0 0-8-8H10a8 8 0 0 0-8 8v1.5A1.5 1.5 0 0 0 3.5 16H5" />
                  <circle cx="7" cy="16" r="2" /><circle cx="17" cy="16" r="2" />
                </svg>
              </div>
              <div className="nm">2018 Toyota Corolla</div>
              <div className="meta">1.8L Inline-4 · BC RVV-204</div>
              <div style={{ marginTop: 14 }}>
                <div className="info-row"><span className="l">VIN</span><span className="v" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>1HGCM82633A004352</span></div>
                <div className="info-row"><span className="l">Body</span><span className="v">Sedan</span></div>
                <div className="info-row"><span className="l">Engine</span><span className="v">1.8L I4 · 132 hp</span></div>
              </div>
            </div>

            {invited &&
          <div className="dv-shop-row" style={{ marginTop: 16 }}>
                <div className="av">EA</div>
                <div className="info" style={{ flex: 1 }}>
                  <div className="nm">Egban Autos · Mount Pleasant</div>
                  <div className="meta">Linked from your customer record · 3 prior services on file</div>
                </div>
              </div>
          }

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => setStep('enter')}>Not my car</button>
              <button className="dv-btn dv-btn--primary" style={{ flex: 2 }} onClick={() => go('home')}>Yes, add to garage</button>
            </div>
          </div>
        }
      </div>
    </div>);

}

// ═══════════ HOME ═════════════════════════════════════════════════
function HomeScreen({ go }) {
  const { vehicle, claims, deals } = useStore();
  const activeClaims = claims.filter((c) => c.status === 'awaiting' || c.status === 'contacted').length;

  return (
    <div className="dv-screen">
      <TopBar greet="GOOD MORNING" name="Chiamaka" />

      <div className="dv-hero" data-comment-anchor="f32fa03d45-div-156-7">
        <div className="lbl">YOUR CAR</div>
        <div className="nm">{vehicle.year} {vehicle.make} {vehicle.model}</div>
        <span className="plate">{vehicle.plate}</span>
        <div className="stats">
          <div className="stat"><div className="v">{vehicle.mileage.toLocaleString()} km</div><div className="l">Mileage</div></div>
          <div className="stat"><div className="v">Mar 12</div><div className="l">Last service</div></div>
          <div className="stat"><div className="v">{activeClaims}</div><div className="l">Open claims</div></div>
        </div>
      </div>

      <div className="dv-section">
        <div className="dv-actions">
          <div className="dv-action" onClick={() => go('deals')}>
            <div className="ic"><img src="../../assets/icons/extra/lightbulb-02.svg" /></div>
            <div className="lbl">Find deals</div>
          </div>
          <div className="dv-action" onClick={() => go('claims')}>
            <div className="ic"><img src="../../assets/icons/revv/check-done-01.svg" /></div>
            <div className="lbl">My claims</div>
          </div>
          <div className="dv-action">
            <div className="ic"><img src="../../assets/icons/revv/info-circle.svg" /></div>
            <div className="lbl">Service log</div>
          </div>
          <div className="dv-action">
            <div className="ic"><img src="../../assets/icons/extra/users-01.svg" /></div>
            <div className="lbl">My shops</div>
          </div>
        </div>
      </div>

      <div className="dv-section">
        <h4>Deals near you<span className="more" onClick={() => go('deals')}>See all</span></h4>
        <div className="dv-deals">
          {deals.slice(0, 2).map((d) => <DealCard key={d.id} deal={d} onTap={(deal) => go('deal-detail', deal.id)} />)}
        </div>
      </div>

      <div className="dv-section" style={{ marginBottom: 30 }}>
        <h4>Recent service</h4>
        <div className="dv-item">
          <div className="badge" style={{ background: 'var(--color-success-50)' }}>
            <img src="../../assets/icons/revv/check-circle.svg" style={{ width: 18 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="ttl">Oil change + 25-pt inspection</div>
            <div className="meta">Egban Autos · Mar 12, 2024 · 78,420 km</div>
            <Pill kind="success">Auto-logged from Revv shop</Pill>
          </div>
        </div>
      </div>

      <BottomNav active="home" go={go} />
    </div>);

}

// ═══════════ DEALS DISCOVERY ══════════════════════════════════════
function DealsScreen({ go }) {
  const { deals, claims } = useStore();
  const [query, setQuery] = useS('');
  const [cat, setCat] = useS(null);

  const cats = [
  { id: 'oil', label: 'Oil change' },
  { id: 'brake', label: 'Brakes' },
  { id: 'tire', label: 'Tires' },
  { id: 'ac', label: 'AC' },
  { id: 'insp', label: 'Inspection' },
  { id: 'detail', label: 'Detailing' }];


  const filtered = useM(() => {
    return deals.filter((d) => {
      if (cat && d.category !== cat) return false;
      if (query) {
        const q = query.toLowerCase();
        return d.offer.toLowerCase().includes(q) ||
        d.shop.toLowerCase().includes(q) ||
        d.categoryLabel.toLowerCase().includes(q);
      }
      return true;
    });
  }, [deals, cat, query]);

  return (
    <div className="dv-screen">
      <div style={{ padding: '60px 20px 12px', background: '#fff' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Deals near you</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-secondary)' }}>
          Within 10 km of Mount Pleasant, Vancouver
        </p>
      </div>

      <div style={{ padding: '14px 0 0', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="dv-searchbar" style={{ marginBottom: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .55 }}>
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input placeholder="Search service, shop name, neighborhood…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="dv-chips">
          <div className={'dv-chip ' + (!cat ? 'on' : '')} onClick={() => setCat(null)}>All</div>
          {cats.map((c) =>
          <div key={c.id} className={'dv-chip ' + (cat === c.id ? 'on' : '')} onClick={() => setCat(cat === c.id ? null : c.id)}>
              {c.label}
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ?
      <div className="dv-empty">
          <div className="ic">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3>{deals.length === 0 ? "No deals near you yet" : "No matching deals"}</h3>
          <p>{deals.length === 0 ?
          "Revv is launching neighborhood by neighborhood — we'll let you know when shops near you join." :
          "Try a different search term or category."}</p>
        </div> :

      <div className="dv-deals" style={{ paddingTop: 14, paddingBottom: 20 }}>
          {filtered.map((d) => {
          const claimed = !!getClaimForDeal(claims, d.id);
          return <DealCard key={d.id} deal={d} claimed={claimed} onTap={(deal) => go('deal-detail', deal.id)} />;
        })}
        </div>
      }

      <BottomNav active="deals" go={go} />
    </div>);

}

Object.assign(window, {
  WelcomeScreen, VinOnboardingScreen, HomeScreen, DealsScreen
});
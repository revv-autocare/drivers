/* global React, useStore, findDeal, getClaimForDeal, formatTimeLeft, categoryIcon,
          Avatar, Pill, BackArrow, BottomNav, TopBar, DetailHead, DealCard, ClaimedRow */
const { useState: useSt, useEffect: useEf } = React;

// ═══════════ DEAL DETAIL ══════════════════════════════════════════
function DealDetailScreen({ go, dealId }) {
  const { deals, claims, claimDeal, vehicle } = useStore();
  const deal = findDeal(deals, dealId) || deals[0];
  const existingClaim = getClaimForDeal(claims, deal.id);

  const pct = deal.priceWas && deal.priceNow
    ? Math.round((1 - deal.priceNow / deal.priceWas) * 100)
    : deal.pct;

  const [claiming, setClaiming] = useSt(false);

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
        <div className="back" onClick={() => go('deals')}><BackArrow/></div>
        <h3>Deal</h3>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div className="iconbtn" style={{ width: 36, height: 36, background: 'var(--color-neutral-50)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .65 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z"/><path d="M9 7h6M9 11h6"/>
            </svg>
          </div>
        </div>
      </div>

      <div className={'dv-detail-img svc-' + deal.category} style={{
        background: ({
          oil:    'linear-gradient(135deg, #FFF4E5, #FFE4B5)',
          brake:  'linear-gradient(135deg, #FEE4E2, #FECDCA)',
          tire:   'linear-gradient(135deg, #E0EAFF, #C7D7FE)',
          ac:     'linear-gradient(135deg, #E0F2FE, #B9E6FE)',
          insp:   'linear-gradient(135deg, #DCFAE6, #ABEFC6)',
          detail: 'linear-gradient(135deg, #F4EBFF, #E9D7FE)',
        })[deal.category],
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <img src={categoryIcon(deal.category)} style={{ width: 48, height: 48, opacity: .55 }}/>
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
          <div className="priceblock">
            <span className="now">{pct}% off</span>
          </div>
        ) : null}

        <div className="meta-list">
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">LOCATION</div>
              <div className="value">{deal.address}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>{deal.distanceKm} km from you</div>
            </div>
          </div>
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">HOURS</div>
              <div className="value">{deal.hours}</div>
            </div>
          </div>
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label">EXPIRES</div>
              <div className="value">In {deal.expiresInDays} days</div>
            </div>
          </div>
          <div className="meta-row">
            <div className="ic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h1.5a1.5 1.5 0 0 0 1.5-1.5V13a8 8 0 0 0-8-8H10a8 8 0 0 0-8 8v1.5A1.5 1.5 0 0 0 3.5 16H5"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/></svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            When you claim this deal, your name, phone, and VIN are shared with the shop. They'll contact you within 24 hours.
          </div>
        </div>
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--ghost-icon" onClick={() => alert('Calls fallback — primary path is Claim')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2"/></svg>
        </button>
        {existingClaim ? (
          <button className="dv-btn dv-btn--primary" disabled>
            ✓ Claimed
          </button>
        ) : (
          <button className="dv-btn dv-btn--primary" onClick={handleClaim} disabled={claiming}>
            {claiming ? <><div className="dv-spinner"/>Sending claim…</> : 'Claim deal'}
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════ CLAIM CONFIRMATION ═══════════════════════════════════
function ClaimConfirmScreen({ go, claimId }) {
  const { claims, deals } = useStore();
  const claim = claims.find(c => c.id === claimId) || claims[claims.length - 1];
  const deal = claim ? findDeal(deals, claim.dealId) : null;

  if (!claim || !deal) {
    return <div className="dv-screen"><div className="dv-empty"><h3>No claim found</h3></div></div>;
  }

  return (
    <div className="dv-screen">
      <div className="dv-confirm">
        <div className="badge">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>
        <h2>Claim sent</h2>
        <p>{deal.shop} has 24 hours to reach out. We'll notify you the moment they do.</p>

        <div className="dv-handshake-card">
          <div className="step done">
            <span className="num">✓</span>
            <div className="body">
              <div className="ttl">You claimed the deal</div>
              <div className="desc">Just now · Sent to {deal.shop}</div>
            </div>
          </div>
          <div className="step active">
            <span className="num">2</span>
            <div className="body">
              <div className="ttl">{deal.shop} reaches out</div>
              <div className="desc">Within 24 hours, by call or WhatsApp</div>
            </div>
          </div>
          <div className="step">
            <span className="num">3</span>
            <div className="body">
              <div className="ttl">You agree on a time</div>
              <div className="desc">Then drop in for service when ready</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 24 }}>
          <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => go('deals')}>Back to deals</button>
          <button className="dv-btn dv-btn--primary" style={{ flex: 1 }} onClick={() => go('claim-detail', claim.id)}>Track claim</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════ MY CLAIMS LIST ═══════════════════════════════════════
function ClaimsScreen({ go }) {
  const { claims, deals, now } = useStore();
  // Reverse chrono
  const sorted = [...claims].sort((a, b) => b.claimedAt - a.claimedAt);

  const active = sorted.filter(c => c.status === 'awaiting' || c.status === 'contacted' || c.status === 'confirmed');
  const past = sorted.filter(c => c.status === 'expired' || c.status === 'no_response');

  return (
    <div className="dv-screen">
      <div style={{ padding: '60px 20px 14px', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>My claims</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-secondary)' }}>Track shops responding to your claimed deals</p>
      </div>

      {claims.length === 0 ? (
        <div className="dv-empty">
          <div className="ic">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3>No claims yet</h3>
          <p>When you claim a deal, it'll show here. Shops have 24 hours to reach out.</p>
          <button className="dv-btn dv-btn--primary" style={{ marginTop: 20 }} onClick={() => go('deals')}>Browse deals</button>
        </div>
      ) : (
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          {active.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 10 }}>ACTIVE · {active.length}</div>
              {active.map(c => {
                const deal = findDeal(deals, c.dealId);
                return <ClaimedRow key={c.id} claim={c} deal={deal} now={now} onTap={(id) => go('claim-detail', id)}/>;
              })}
            </>
          )}
          {past.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, margin: '20px 0 10px' }}>PAST</div>
              {past.map(c => {
                const deal = findDeal(deals, c.dealId);
                return <ClaimedRow key={c.id} claim={c} deal={deal} now={now} onTap={(id) => go('claim-detail', id)}/>;
              })}
            </>
          )}
        </div>
      )}

      <BottomNav active="claims" go={go}/>
    </div>
  );
}

// ═══════════ CLAIM DETAIL (timeline) ══════════════════════════════
function ClaimDetailScreen({ go, claimId }) {
  const { claims, deals, now, advanceClaim, cancelClaim } = useStore();
  const claim = claims.find(c => c.id === claimId);
  if (!claim) {
    return <div className="dv-screen"><div className="dv-empty"><h3>Claim not found</h3></div></div>;
  }
  const deal = findDeal(deals, claim.dealId);
  const status = claim.status;

  const fmtTime = (ts) => {
    if (!ts) return '';
    const diffMin = Math.floor((now - ts) / 60_000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const hrs = Math.floor(diffMin / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const pillMap = {
    awaiting:  { kind: 'warning', label: 'Awaiting response' },
    contacted: { kind: 'brand',   label: 'Shop contacted you' },
    confirmed: { kind: 'success', label: 'Confirmed' },
    expired:   { kind: 'error',   label: 'Expired' },
  }[status];

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <DetailHead title="Claim status" onBack={() => go('claims')} pill={pillMap.label} pillKind={pillMap.kind}/>

      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{deal.shop} · {deal.neighborhood}</div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{deal.offer}</div>
        {deal.priceNow && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-brand-600)' }}>${deal.priceNow}</span>
            {deal.priceWas && <span style={{ fontSize: 13, color: 'var(--fg-tertiary)', textDecoration: 'line-through' }}>${deal.priceWas}</span>}
          </div>
        )}
        {status === 'awaiting' && (
          <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--color-warning-50)', borderRadius: 10, fontSize: 13, color: 'var(--color-warning-800)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <strong style={{ fontWeight: 600 }}>{formatTimeLeft(claim.claimedAt, now)}</strong>
            <span style={{ opacity: .85 }}>· response window</span>
          </div>
        )}
      </div>

      <div className="dv-section" style={{ paddingTop: 18 }}>
        <h4>Timeline</h4>
        <div className="dv-tl">
          <div className="item done">
            <div className="col"><div className="dot"/><div className="ln"/></div>
            <div className="body">
              <div className="when">{fmtTime(claim.claimedAt)}</div>
              <div className="ttl">You claimed the deal</div>
              <div className="desc">Your name, phone, and VIN were shared with {deal.shop}.</div>
            </div>
          </div>

          <div className={'item ' + (status === 'contacted' ? 'active' : (status === 'confirmed' ? 'done' : status === 'expired' ? 'future' : 'active'))}>
            <div className="col"><div className="dot"/><div className="ln"/></div>
            <div className="body">
              <div className="when">{
                status === 'awaiting' ? 'WAITING' :
                status === 'expired' ? 'DID NOT HAPPEN' :
                fmtTime(claim.contactedAt)
              }</div>
              <div className="ttl">{deal.shop} reaches out</div>
              <div className="desc">{
                status === 'awaiting' ? 'They have 24 hours from your claim. Watch for a call or WhatsApp message.' :
                status === 'expired'  ? "We didn't hear back from the shop within 24 hours." :
                "They've reached out — check your messages or call log."
              }</div>
            </div>
          </div>

          <div className={'item ' + (status === 'confirmed' ? 'done' : 'future')}>
            <div className="col"><div className="dot"/></div>
            <div className="body">
              <div className="when">{status === 'confirmed' ? fmtTime(claim.confirmedAt) : 'NEXT'}</div>
              <div className="ttl">You agree on a time</div>
              <div className="desc">Then drop in for service when ready.</div>
            </div>
          </div>
        </div>
      </div>

      {status === 'expired' && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ padding: 14, background: 'var(--color-error-50)', borderRadius: 10, fontSize: 13, color: 'var(--color-error-700)' }}>
            <strong style={{ fontWeight: 600 }}>The shop didn't respond.</strong>{' '}
            This counts against their honor rate on Revv. Want to look at other deals?
          </div>
        </div>
      )}

      <div className="dv-actbar">
        {(status === 'awaiting') && (
          <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => { cancelClaim(claim.id); go('claims'); }}>Cancel claim</button>
        )}
        {status === 'contacted' && (
          <>
            <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }}>Message shop</button>
            <button className="dv-btn dv-btn--primary" style={{ flex: 1 }} onClick={() => advanceClaim(claim.id, 'confirmed')}>Confirm booking</button>
          </>
        )}
        {status === 'confirmed' && (
          <button className="dv-btn dv-btn--primary" style={{ flex: 1 }}>View directions</button>
        )}
        {status === 'expired' && (
          <button className="dv-btn dv-btn--primary" style={{ flex: 1 }} onClick={() => go('deals')}>Find another deal</button>
        )}
      </div>
    </div>
  );
}

// ═══════════ PROFILE ══════════════════════════════════════════════
function ProfileScreen({ go }) {
  const { vehicle, linkedShops, serviceLog } = useStore();

  return (
    <div className="dv-screen">
      <div style={{ padding: '60px 20px 18px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials="C" size={56}/>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Chiamaka Mbamalu</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 2 }}>chiamaka@email.com · Mount Pleasant, BC</div>
          </div>
        </div>
      </div>

      <div className="dv-section" style={{ marginTop: 18 }}>
        <h4>Garage</h4>
        <div className="dv-vincard">
          <div className="nm">{vehicle.year} {vehicle.make} {vehicle.model}</div>
          <div className="meta">{vehicle.plate} · {vehicle.mileage.toLocaleString()} km</div>
          <div style={{ marginTop: 14 }}>
            <div className="info-row"><span className="l">VIN</span><span className="v" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{vehicle.vin}</span></div>
            <div className="info-row"><span className="l">Engine</span><span className="v">{vehicle.engine}</span></div>
          </div>
        </div>
      </div>

      <div className="dv-section">
        <h4>Linked shops<span className="more" onClick={() => go('my-shops')}>See all</span></h4>
        {linkedShops.map(s => (
          <div key={s.id} className="dv-shop-row" onClick={() => go('shop-detail', s.id)} style={{ cursor: 'pointer' }}>
            <div className="av">{s.logo}</div>
            <div className="info" style={{ flex: 1 }}>
              <div className="nm">{s.name}</div>
              <div className="meta">{s.neighborhood}</div>
            </div>
            <BackArrow/>
          </div>
        ))}
        <div onClick={() => go('find-shop')} style={{
          marginTop: 6, padding: 14, border: '1.5px dashed var(--color-brand-200)',
          borderRadius: 12, background: 'var(--color-brand-50)', textAlign: 'center', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--color-brand-700)',
        }}>+ Find a new shop</div>
      </div>

      <div className="dv-section">
        <h4>Service log<span className="more" onClick={() => go('service-log')}>See all</span></h4>
        {serviceLog.slice(0, 2).map(e => (
          <div key={e.id} className="dv-item" onClick={() => go('service-log')} style={{ cursor: 'pointer' }}>
            <div className="badge" style={{ background: e.via === 'auto' ? 'var(--color-success-50)' : 'var(--color-neutral-100)' }}>
              <img src="../../assets/icons/revv/check-circle.svg" style={{ width: 18, opacity: .9 }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="ttl">{e.what}</div>
              <div className="meta">{e.shop || 'Self-logged'} · {e.date}</div>
            </div>
            {e.cost && <div className="price">${e.cost}</div>}
          </div>
        ))}
      </div>



      <BottomNav active="profile" go={go}/>
    </div>
  );
}

Object.assign(window, {
  DealDetailScreen, ClaimConfirmScreen, ClaimsScreen, ClaimDetailScreen, ProfileScreen,
});

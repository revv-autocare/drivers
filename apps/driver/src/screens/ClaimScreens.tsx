import { useState } from 'react';
import type { GoFn } from '../types';
import { useStore, findDeal, findShop, formatTimeLeft } from '../store';
import { DetailHead, ClaimedRow, Pill, BottomNav } from '../components';

// ─── Claim Confirm ───────────────────────────────────
export function ClaimConfirmScreen({ go, claimId }: { go: GoFn; claimId?: string }) {
  const { claims, deals } = useStore();
  const claim = claims.find(c => c.id === claimId) ?? claims[claims.length - 1];
  const deal = claim ? findDeal(deals, claim.dealId) : undefined;

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
          <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => go('deals')}>
            Back to deals
          </button>
          <button className="dv-btn dv-btn--primary" style={{ flex: 1 }} onClick={() => go('claim-detail', claim.id)}>
            Track claim
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── My Bookings (Claims + Appointments) ─────────────
export function ClaimsScreen({ go }: { go: GoFn }) {
  const { claims, deals, appointments, shops, now } = useStore();
  const [tab, setTab] = useState<'appointments' | 'claims'>('appointments');

  const sorted = [...claims].sort((a, b) => b.claimedAt - a.claimedAt);
  const active = sorted.filter(c => c.status === 'awaiting' || c.status === 'contacted' || c.status === 'confirmed');
  const past   = sorted.filter(c => c.status === 'expired' || c.status === 'no_response');

  const sortedAppts = [...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = sortedAppts.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
  const totalBookings = appointments.length + claims.length;

  const pillMap: Record<string, { kind: 'warning' | 'success' | 'neutral'; label: string }> = {
    pending:   { kind: 'warning', label: 'Awaiting confirmation' },
    confirmed: { kind: 'success', label: 'Confirmed' },
    completed: { kind: 'neutral', label: 'Completed' },
  };

  return (
    <div className="dv-screen">
      <div style={{ padding: '60px 20px 14px', background: '#fff', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>My bookings</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-secondary)' }}>
          Appointments you've booked and deals you've claimed
        </p>
      </div>

      {totalBookings === 0 ? (
        <div className="dv-empty">
          <div className="ic">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--fg-tertiary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <h3>Nothing booked yet</h3>
          <p>Book an appointment with a shop, or claim a deal — both will land here.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button className="dv-btn dv-btn--secondary" onClick={() => go('my-shops')}>Find a shop</button>
            <button className="dv-btn dv-btn--primary" onClick={() => go('deals')}>Browse deals</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '14px 16px 16px', flex: 1, overflowY: 'auto' }}>
          <div className="dv-segments">
            <div className={'seg' + (tab === 'appointments' ? ' on' : '')} onClick={() => setTab('appointments')}>
              Appointments
              <span className="count">{appointments.length}</span>
            </div>
            <div className={'seg' + (tab === 'claims' ? ' on' : '')} onClick={() => setTab('claims')}>
              Deal claims
              <span className="count">{claims.length}</span>
            </div>
          </div>

          {tab === 'appointments' && (
            appointments.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                  You haven't booked any appointments yet.
                </p>
                <button className="dv-btn dv-btn--primary" onClick={() => go('my-shops')}>Find a shop</button>
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 10 }}>
                      Upcoming · {upcoming.length}
                    </div>
                    {upcoming.map(a => {
                      const shop = findShop(shops, a.shopId);
                      if (!shop) return null;
                      const [y, m, d] = a.date.split('-').map(Number);
                      const dt = new Date(y!, (m ?? 1) - 1, d);
                      const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                      const pill = pillMap[a.status] ?? pillMap['pending']!;
                      return (
                        <div key={a.id} className="dv-claim" onClick={() => go('booking-confirm', a.id)}>
                          <div className="top-row">
                            <span className="shop">{shop.name}</span>
                            <Pill kind={pill.kind}>{pill.label}</Pill>
                          </div>
                          <div className="ttl">{a.service}</div>
                          <div className="price-row">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .7 }}>
                              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                            <span>{dateStr}</span>
                            <span>·</span>
                            <span>{a.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
                {sortedAppts.filter(a => !upcoming.includes(a)).length > 0 && (
                  <>
                    <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, margin: '20px 0 10px' }}>Past</div>
                    {sortedAppts.filter(a => !upcoming.includes(a)).map(a => {
                      const shop = findShop(shops, a.shopId);
                      if (!shop) return null;
                      const [y, m, d] = a.date.split('-').map(Number);
                      const dt = new Date(y!, (m ?? 1) - 1, d);
                      const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                      const pill = pillMap[a.status] ?? pillMap['pending']!;
                      return (
                        <div key={a.id} className="dv-claim" onClick={() => go('booking-confirm', a.id)}>
                          <div className="top-row">
                            <span className="shop">{shop.name}</span>
                            <Pill kind={pill.kind}>{pill.label}</Pill>
                          </div>
                          <div className="ttl">{a.service}</div>
                          <div className="price-row"><span>{dateStr} · {a.time}</span></div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )
          )}

          {tab === 'claims' && (
            claims.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                  You haven't claimed any deals yet.
                </p>
                <button className="dv-btn dv-btn--primary" onClick={() => go('deals')}>Browse deals</button>
              </div>
            ) : (
              <>
                {active.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 10 }}>Active · {active.length}</div>
                    {active.map(c => {
                      const deal = findDeal(deals, c.dealId);
                      if (!deal) return null;
                      return <ClaimedRow key={c.id} claim={c} deal={deal} now={now} onTap={id => go('claim-detail', id)}/>;
                    })}
                  </>
                )}
                {past.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, margin: '20px 0 10px' }}>Past</div>
                    {past.map(c => {
                      const deal = findDeal(deals, c.dealId);
                      if (!deal) return null;
                      return <ClaimedRow key={c.id} claim={c} deal={deal} now={now} onTap={id => go('claim-detail', id)}/>;
                    })}
                  </>
                )}
              </>
            )
          )}
        </div>
      )}

      <BottomNav active="claims" go={go}/>
    </div>
  );
}

// ─── Claim Detail ─────────────────────────────────────
export function ClaimDetailScreen({ go, claimId }: { go: GoFn; claimId?: string }) {
  const { claims, deals, now, advanceClaim, cancelClaim } = useStore();
  const claim = claims.find(c => c.id === claimId);
  if (!claim) {
    return <div className="dv-screen"><div className="dv-empty"><h3>Claim not found</h3></div></div>;
  }
  const deal = findDeal(deals, claim.dealId)!;
  const status = claim.status;

  const fmtTime = (ts?: number) => {
    if (!ts) return '';
    const diffMin = Math.floor((now - ts) / 60_000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const hrs = Math.floor(diffMin / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const pillMap = {
    awaiting:    { kind: 'warning'  as const, label: 'Awaiting response' },
    contacted:   { kind: 'brand'    as const, label: 'Shop contacted you' },
    confirmed:   { kind: 'success'  as const, label: 'Confirmed' },
    expired:     { kind: 'error'    as const, label: 'Expired' },
    no_response: { kind: 'error'    as const, label: 'No response' },
  }[status];

  const step2Class = status === 'contacted' ? 'active' : status === 'confirmed' ? 'done' : status === 'expired' ? 'future' : 'active';

  return (
    <div className="dv-screen" style={{ background: '#fff' }}>
      <DetailHead title="Claim status" onBack={() => go('claims')} pill={pillMap.label} pillKind={pillMap.kind}/>

      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
          {deal.shop} · {deal.neighborhood}
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{deal.offer}</div>
        {deal.priceNow && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-brand-600)' }}>${deal.priceNow}</span>
            {deal.priceWas && <span style={{ fontSize: 13, color: 'var(--fg-tertiary)', textDecoration: 'line-through' }}>${deal.priceWas}</span>}
          </div>
        )}
        {status === 'awaiting' && (
          <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--color-warning-50)', borderRadius: 10, fontSize: 13, color: 'var(--color-warning-800)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
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

          <div className={'item ' + step2Class}>
            <div className="col"><div className="dot"/><div className="ln"/></div>
            <div className="body">
              <div className="when">{
                status === 'awaiting' ? 'WAITING' :
                status === 'expired'  ? 'DID NOT HAPPEN' :
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
        {status === 'awaiting' && (
          <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={async () => { await cancelClaim(claim.id); go('claims'); }}>
            Cancel claim
          </button>
        )}
        {status === 'contacted' && (
          <>
            <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }}>Message shop</button>
            <button className="dv-btn dv-btn--primary"   style={{ flex: 1 }} onClick={() => advanceClaim(claim.id, 'confirmed')}>
              Confirm booking
            </button>
          </>
        )}
        {status === 'confirmed' && (
          <button className="dv-btn dv-btn--primary" style={{ flex: 1 }}>View directions</button>
        )}
        {status === 'expired' && (
          <button className="dv-btn dv-btn--primary" style={{ flex: 1 }} onClick={() => go('deals')}>
            Find another deal
          </button>
        )}
      </div>
    </div>
  );
}

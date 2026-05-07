/* global React, ReactDOM, IOSDevice, useStore, StoreProvider,
          TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakButton, TweakSelect,
          WelcomeScreen, VinOnboardingScreen, HomeScreen, DealsScreen,
          DealDetailScreen, ClaimConfirmScreen, ClaimsScreen, ClaimDetailScreen, ProfileScreen,
          ServiceLogScreen, MyShopsScreen, FindShopScreen, ShopDetailScreen, BookAppointmentScreen, BookingConfirmScreen */

const { useState, useEffect, useCallback } = React;

// ─── Default tweak knobs ──────────────────────────────────────────
const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "startScreen": "welcome",
  "invitedFlow": false,
  "emptyMarket": false
}/*EDITMODE-END*/;

// ─── Router ───────────────────────────────────────────────────────
function Router({ tweaks }) {
  // Stack-based nav: each entry { screen, ctx }
  const initial = { screen: tweaks.startScreen || 'welcome', ctx: null };
  const [stack, setStack] = useState([initial]);

  // Reset stack when startScreen tweak changes
  useEffect(() => {
    setStack([{ screen: tweaks.startScreen || 'welcome', ctx: null }]);
  }, [tweaks.startScreen]);

  const cur = stack[stack.length - 1];

  const go = useCallback((screen, ctx) => {
    setStack(prev => {
      // Back button
      if (screen === -1) return prev.length > 1 ? prev.slice(0, -1) : prev;
      // Tab-level screens reset the stack to that tab
      const tabs = ['home', 'deals', 'claims', 'profile'];
      if (tabs.includes(screen)) {
        return [{ screen, ctx }];
      }
      // Otherwise push
      return [...prev, { screen, ctx }];
    });
  }, []);

  const props = { go, key: cur.screen + (cur.ctx || '') };

  const screen = (() => {
    switch (cur.screen) {
      case 'welcome':       return <WelcomeScreen {...props}/>;
      case 'vin':           return <VinOnboardingScreen {...props}/>;
      case 'home':          return <HomeScreen {...props}/>;
      case 'deals':         return <DealsScreen {...props}/>;
      case 'deal-detail':   return <DealDetailScreen {...props} dealId={cur.ctx}/>;
      case 'claim-confirm': return <ClaimConfirmScreen {...props} claimId={cur.ctx}/>;
      case 'claims':        return <ClaimsScreen {...props}/>;
      case 'claim-detail':  return <ClaimDetailScreen {...props} claimId={cur.ctx}/>;
      case 'profile':       return <ProfileScreen {...props}/>;
      case 'service-log':   return <ServiceLogScreen {...props}/>;
      case 'my-shops':      return <MyShopsScreen {...props}/>;
      case 'find-shop':     return <FindShopScreen {...props}/>;
      case 'shop-detail':   return <ShopDetailScreen {...props} shopId={cur.ctx}/>;
      case 'book':          return <BookAppointmentScreen {...props} shopId={cur.ctx}/>;
      case 'booking-confirm': return <BookingConfirmScreen {...props} apptId={cur.ctx}/>;
      default:              return <WelcomeScreen {...props}/>;
    }
  })();

  return screen;
}

// ─── Tweaks panel ─────────────────────────────────────────────────
function DriverTweaks({ tweaks, setTweak }) {
  const { claims, advanceClaim, resetAll, simMinutes, setSimMinutes } = useStore();
  const liveClaims = claims.filter(c => c.status === 'awaiting' || c.status === 'contacted');

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Demo flow">
        <TweakSelect
          label="Start at"
          value={tweaks.startScreen}
          onChange={v => setTweak('startScreen', v)}
          options={[
            { value: 'welcome',     label: 'Welcome (sign-in)' },
            { value: 'vin',         label: 'VIN onboarding' },
            { value: 'home',        label: 'Home (signed in)' },
            { value: 'deals',       label: 'Deals discovery' },
            { value: 'claims',      label: 'My claims' },
            { value: 'service-log', label: 'Service log' },
            { value: 'my-shops',    label: 'My shops' },
            { value: 'find-shop',   label: 'Find a shop' },
            { value: 'profile',     label: 'Profile' },
          ]}
        />
        <TweakToggle
          label="Shop-invited onboarding"
          help="Pre-fills VIN as if invited by Egban Autos"
          value={tweaks.invitedFlow}
          onChange={v => setTweak('invitedFlow', v)}
        />
        <TweakToggle
          label="Empty market (no deals)"
          help="Driver in a neighborhood with no Revv shops yet"
          value={tweaks.emptyMarket}
          onChange={v => setTweak('emptyMarket', v)}
        />
      </TweakSection>

      <TweakSection label="Simulate shop response">
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary, #6c6f78)', marginBottom: 8, lineHeight: 1.5 }}>
          {liveClaims.length === 0 ? 'Claim a deal first — then return here to simulate the shop responding.' : `${liveClaims.length} live claim${liveClaims.length > 1 ? 's' : ''}.`}
        </div>
        {liveClaims.map(c => (
          <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10, padding: 8, background: '#f6f7fa', borderRadius: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{c.id.slice(-4)} · {c.status}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {c.status === 'awaiting' && (
                <>
                  <button className="tw-btn" style={tinyBtn} onClick={() => advanceClaim(c.id, 'contacted')}>→ Contacted</button>
                  <button className="tw-btn" style={tinyBtn} onClick={() => advanceClaim(c.id, 'expired')}>→ Expire</button>
                </>
              )}
              {c.status === 'contacted' && (
                <button className="tw-btn" style={tinyBtn} onClick={() => advanceClaim(c.id, 'confirmed')}>→ Confirmed</button>
              )}
            </div>
          </div>
        ))}
      </TweakSection>

      <TweakSection label="Time">
        <div style={{ fontSize: 11, color: 'var(--fg-tertiary, #6c6f78)', marginBottom: 8 }}>
          {simMinutes === 0 ? 'Real time.' : `Fast-forwarded ${formatMin(simMinutes)}.`}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button style={tinyBtn} onClick={() => setSimMinutes(simMinutes + 60)}>+1h</button>
          <button style={tinyBtn} onClick={() => setSimMinutes(simMinutes + 6 * 60)}>+6h</button>
          <button style={tinyBtn} onClick={() => setSimMinutes(simMinutes + 24 * 60)}>+24h</button>
          <button style={tinyBtn} onClick={() => setSimMinutes(0)}>Reset</button>
        </div>
      </TweakSection>

      <TweakSection label="Reset">
        <TweakButton label="Clear all claims" onClick={resetAll}/>
      </TweakSection>
    </TweaksPanel>
  );
}

const tinyBtn = {
  fontSize: 11, fontWeight: 500, padding: '5px 10px',
  background: '#fff', border: '1px solid #d8dae0', borderRadius: 6,
  cursor: 'pointer', color: '#1f2024',
};

function formatMin(m) {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}

// ─── Root ─────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULT_TWEAKS);

  return (
    <StoreProvider tweaks={tweaks} setTweak={setTweak}>
      <div style={{ minHeight: '100vh', background: '#0E1530', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <IOSDevice width={390} height={820}>
          <Router tweaks={tweaks}/>
        </IOSDevice>
      </div>
      <DriverTweaks tweaks={tweaks} setTweak={setTweak}/>
    </StoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

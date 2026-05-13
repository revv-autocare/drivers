import { useState, useCallback, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import './driver.css';

import type { ScreenName, GoFn } from './types';
import { StoreProvider, useStore } from './store';

import { VinOnboardingScreen }  from './screens/VinOnboardingScreen';
import { HomeScreen }           from './screens/HomeScreen';
import { DealsScreen }          from './screens/DealsScreen';
import { DealDetailScreen }     from './screens/DealDetailScreen';
import {
  ClaimConfirmScreen,
  ClaimsScreen,
  ClaimDetailScreen,
} from './screens/ClaimScreens';
import { ProfileScreen }        from './screens/ProfileScreen';
import { ServiceLogScreen }     from './screens/ServiceLogScreen';
import { MyShopsScreen }        from './screens/MyShopsScreen';
import {
  FindShopScreen,
  ShopDetailScreen,
  BookAppointmentScreen,
  BookingConfirmScreen,
} from './screens/ShopScreens';

// ─── Stack-based router ───────────────────────────────────────────
const TABS = new Set<ScreenName>(['home', 'deals', 'claims', 'profile']);

function Router() {
  const { loaded, vehicle } = useStore();
  const [stack, setStack] = useState<Array<{ screen: ScreenName; ctx?: string }>>([]);

  // Set the initial screen once the store has loaded
  useEffect(() => {
    if (!loaded) return;
    if (stack.length === 0) {
      setStack([{ screen: vehicle ? 'home' : 'vin' }]);
    }
  }, [loaded, vehicle]);

  const go: GoFn = useCallback((screen, ctx) => {
    setStack(prev => {
      if (screen === -1) return prev.length > 1 ? prev.slice(0, -1) : prev;
      if (TABS.has(screen as ScreenName)) return [{ screen: screen as ScreenName, ...(ctx ? { ctx } : {}) }];
      return [...prev, { screen: screen as ScreenName, ...(ctx ? { ctx } : {}) }];
    });
  }, []);

  if (!loaded || stack.length === 0) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', background: 'var(--bg-canvas)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/assets/brand/logo-mark.svg" style={{ width: 40, marginBottom: 20, opacity: .7 }} alt=""/>
          <div className="dv-spinner" style={{ margin: '0 auto', borderColor: 'rgba(55,119,255,.3)', borderTopColor: 'var(--color-brand-500)' }}/>
        </div>
      </div>
    );
  }

  const cur = stack[stack.length - 1];
  if (!cur) return null;

  const ctx  = cur.ctx;
  const base = { go, key: cur.screen + (ctx ?? '') };

  switch (cur.screen) {
    case 'vin':             return <VinOnboardingScreen {...base}/>;
    case 'home':            return <HomeScreen {...base}/>;
    case 'deals':           return <DealsScreen {...base}/>;
    case 'deal-detail':     return <DealDetailScreen {...base} {...(ctx ? { dealId: ctx } : {})}/>;
    case 'claim-confirm':   return <ClaimConfirmScreen {...base} {...(ctx ? { claimId: ctx } : {})}/>;
    case 'claims':          return <ClaimsScreen {...base}/>;
    case 'claim-detail':    return <ClaimDetailScreen {...base} {...(ctx ? { claimId: ctx } : {})}/>;
    case 'profile':         return <ProfileScreen {...base}/>;
    case 'service-log':     return <ServiceLogScreen {...base}/>;
    case 'my-shops':        return <MyShopsScreen {...base}/>;
    case 'find-shop':       return <FindShopScreen {...base}/>;
    case 'shop-detail':     return <ShopDetailScreen {...base} {...(ctx ? { shopId: ctx } : {})}/>;
    case 'book':            return <BookAppointmentScreen {...base} {...(ctx ? { shopId: ctx } : {})}/>;
    case 'booking-confirm': return <BookingConfirmScreen {...base} {...(ctx ? { apptId: ctx } : {})}/>;
    default:                return <HomeScreen {...base}/>;
  }
}

// ─── App shell ────────────────────────────────────────────────────
export function App() {
  return (
    <Authenticator
      signUpAttributes={['email', 'name', 'phone_number']}
      loginMechanisms={['email']}
    >
      {() => (
        <StoreProvider>
          <div style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-canvas)',
            fontFamily: 'var(--font-sans)',
          }}>
            <Router/>
          </div>
        </StoreProvider>
      )}
    </Authenticator>
  );
}

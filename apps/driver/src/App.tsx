import { useState, useCallback, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import './driver.css';

import type { ScreenName, GoFn } from './types';
import { StoreProvider } from './store';

import { VinOnboardingScreen } from './screens/VinOnboardingScreen';
import { HomeScreen }          from './screens/HomeScreen';
import { DealsScreen }         from './screens/DealsScreen';
import { DealDetailScreen }    from './screens/DealDetailScreen';
import {
  ClaimConfirmScreen,
  ClaimsScreen,
  ClaimDetailScreen,
} from './screens/ClaimScreens';
import { ProfileScreen }       from './screens/ProfileScreen';
import { ServiceLogScreen }    from './screens/ServiceLogScreen';
import { MyShopsScreen }       from './screens/MyShopsScreen';
import {
  FindShopScreen,
  ShopDetailScreen,
  BookAppointmentScreen,
  BookingConfirmScreen,
} from './screens/ShopScreens';

// ─── Stack-based router ──────────────────────────────
const TABS = new Set<ScreenName>(['home', 'deals', 'claims', 'profile']);

function Router() {
  const [stack, setStack] = useState<Array<{ screen: ScreenName; ctx?: string }>>([
    { screen: 'vin' },
  ]);

  const go: GoFn = useCallback((screen, ctx) => {
    setStack(prev => {
      if (screen === -1) return prev.length > 1 ? prev.slice(0, -1) : prev;
      if (TABS.has(screen as ScreenName)) return [{ screen: screen as ScreenName, ctx }];
      return [...prev, { screen: screen as ScreenName, ctx }];
    });
  }, []);

  const cur = stack[stack.length - 1];
  const props = { go, key: cur.screen + (cur.ctx ?? '') };

  switch (cur.screen) {
    case 'vin':             return <VinOnboardingScreen {...props}/>;
    case 'home':            return <HomeScreen {...props}/>;
    case 'deals':           return <DealsScreen {...props}/>;
    case 'deal-detail':     return <DealDetailScreen {...props} dealId={cur.ctx}/>;
    case 'claim-confirm':   return <ClaimConfirmScreen {...props} claimId={cur.ctx}/>;
    case 'claims':          return <ClaimsScreen {...props}/>;
    case 'claim-detail':    return <ClaimDetailScreen {...props} claimId={cur.ctx}/>;
    case 'profile':         return <ProfileScreen {...props}/>;
    case 'service-log':     return <ServiceLogScreen {...props}/>;
    case 'my-shops':        return <MyShopsScreen {...props}/>;
    case 'find-shop':       return <FindShopScreen {...props}/>;
    case 'shop-detail':     return <ShopDetailScreen {...props} shopId={cur.ctx}/>;
    case 'book':            return <BookAppointmentScreen {...props} shopId={cur.ctx}/>;
    case 'booking-confirm': return <BookingConfirmScreen {...props} apptId={cur.ctx}/>;
    default:                return <HomeScreen {...props}/>;
  }
}

// ─── App shell ───────────────────────────────────────
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

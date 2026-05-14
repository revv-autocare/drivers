export interface Vehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  engine: string;
  plate: string;
  mileage: number;
  // Extended fields for vehicle detail screen
  id?: string;
  nickname?: string;
  trim?: string;
  color?: string;
  drivetrain?: string;
  transmission?: string;
  owners?: number;
  nextServiceKm?: number;
  purchasedYear?: number;
  primary?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  logo: string;
  logoColor: string;
  rating: number;
  reviews: number;
  distanceKm: number;
  hours: string;
  specialties: string[];
  linked: boolean;
  visits?: number;
  lastVisit?: string;
  verified: boolean;
  honorRate: number;
  contactPhone?: string;
}

export interface ServiceEntry {
  id: string;
  date: string;
  mileage: number;
  what: string;
  cost: number | null;
  shop: string | null;
  shopId: string | null;
  via: 'auto' | 'manual';
  notes: string;
  category: string;
}

export interface Deal {
  id: string;
  shopId: string;
  shop: string;
  neighborhood: string;
  category: string;
  categoryLabel: string;
  offer: string;
  priceNow: number | null;
  priceWas: number | null;
  pct?: number;
  distanceKm: number;
  expiresInDays: number;
  hours: string;
  address: string;
}

export type ClaimStatus = 'awaiting' | 'contacted' | 'confirmed' | 'expired' | 'no_response';

export interface Claim {
  id: string;
  dealId: string;
  claimedAt: number;
  status: ClaimStatus;
  contactedAt?: number;
  confirmedAt?: number;
  expiredAt?: number;
}

export interface Appointment {
  id: string;
  shopId: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  bookedAt: number;
  status: string;
}

export type ScreenName =
  | 'welcome'
  | 'vin'
  | 'home'
  | 'deals'
  | 'deal-detail'
  | 'claim-confirm'
  | 'claims'
  | 'claim-detail'
  | 'profile'
  | 'service-log'
  | 'service-detail'
  | 'my-shops'
  | 'find-shop'
  | 'shop-detail'
  | 'book'
  | 'booking-confirm'
  | 'vehicle-detail';

export type GoFn = (screen: ScreenName | -1, ctx?: string) => void;

export type PillKind = 'neutral' | 'warning' | 'brand' | 'success' | 'error';

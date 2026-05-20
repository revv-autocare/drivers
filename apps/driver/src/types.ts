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
  | 'vehicle-detail'
  | 'edit-vehicle'
  | 'add-service'
  | 'add-service-processing'
  | 'add-service-confirm'
  | 'add-service-manual'
  | 'add-service-saved'
  | 'roadside'
  | 'roadside-location'
  | 'roadside-matching'
  | 'roadside-active'
  | 'roadside-destination'
  | 'roadside-completion'
  | 'roadside-followup';

export type ExtractionConfidence = 'high' | 'low' | 'fail';

export type ServiceDraftMode = 'photo' | 'gallery' | 'text' | 'voice' | 'manual';

export interface ServiceDraftFields {
  date: string;
  shop: string;
  shopId: string | null;
  what: string;
  category: string;
  mileage: number;
  cost: number;
  notes: string;
  lineItems: Array<{ label: string; price: number }>;
}

export interface ServiceDraft {
  mode: ServiceDraftMode;
  sourcePreview: string | null;
  rawInput: string | null;
  confidence?: ExtractionConfidence;
  missingFields?: string[];
  fields?: ServiceDraftFields;
  failed?: boolean;
}

export type RoadsideService = 'jump-start' | 'flat-tire' | 'lockout' | 'fuel' | 'ev-charge' | 'tow';

export type RoadsideStatus = 'idle' | 'matching' | 'dispatched' | 'on-scene' | 'in-progress' | 'completed';

export type RoadsideScenario =
  | 'idle'
  | 'matching'
  | 'dispatched-self'
  | 'dispatched-tow-nodest'
  | 'dispatched-tow-revv'
  | 'dispatched-tow-defer'
  | 'completion-self'
  | 'completion-tow-revv'
  | 'completion-tow-other'
  | 'followup-initial'
  | 'followup-viewed'
  | 'followup-booked';

export interface RoadsideProvider {
  name: string;
  company: string;
  powered: string;
  vehicle: string;
  plate: string;
  rating: number;
  completedJobs: number;
  eta: number;
}

export interface RoadsideFollowUp {
  state: 'pending' | 'initial' | 'viewed' | 'booked' | 'dismissed';
  triggerAt: number;
  viewedAt?: number;
  dismissedAt?: number;
  appointmentId?: string;
  appointmentSummary?: string;
}

export interface RoadsideEvent {
  id: string;
  service: RoadsideService;
  serviceLabel: string;
  status: RoadsideStatus;
  requestedAt: number;
  dispatchedAt: number | null;
  arrivedAt: number | null;
  completedAt: number | null;
  location: { address: string; city: string; note: string };
  provider: RoadsideProvider | null;
  destinationShopId: string | null;
  destinationDecision: 'selected' | 'deferred' | 'manual' | null;
  destinationManual?: string;
  cost: number;
  followUp: RoadsideFollowUp | null;
}

export interface Tweaks {
  extractionConfidence: ExtractionConfidence;
  roadsideScenario: RoadsideScenario;
  pushNotifPreview: boolean;
}

export type GoFn = (screen: ScreenName | -1, ctx?: string) => void;

export type PillKind = 'neutral' | 'warning' | 'brand' | 'success' | 'error';

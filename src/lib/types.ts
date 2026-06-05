export type ISODateTime = string;
export type ISODate = string;
export type CurrencyCode = "EUR" | (string & {});

export type PlanCode = "starter" | "growth" | "pro";
export type PriceBand = 1 | 2 | 3 | 4;
export type BudgetPreference = "$" | "$$" | "$$$" | "$$$$";
export type Language = "en" | "pt" | "fr" | "es" | (string & {});
export type AgeBand = "18-24" | "25-34" | "35-44" | "45+";
export type LoyaltyTier = "new" | "regular" | "vip";

export type ServiceShift = "lunch" | "dinner";
export type BookingChannel =
  | "couvert_app"
  | "couvert_web"
  | "restaurant_widget"
  | "phone";
export type BookingStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "walked_in";
export type Occasion =
  | "casual"
  | "anniversary"
  | "business"
  | "date"
  | "birthday";

export type InvoiceStatus = "paid" | "pending";

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  currency: CurrencyCode;
  timezone: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cityId: string;
  planId: string;
  cuisine: string;
  priceBand: PriceBand;
  capacity: number;
  address: string;
  zone: string;
  phone: string;
  website: string;
  photoUrl: string;
  description: string;
  hours: Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", string | null>;
  ratingOverall: number;
  ratingCount: number;
  ratingFood: number;
  ratingService: number;
  ratingAmbiance: number;
  ratingValue: number;
}

export interface Diner {
  id: string;
  fullName: string;
  email: string;
  cityId: string;
  language: Language;
  ageBand: AgeBand;
  loyaltyTier: LoyaltyTier;
  budgetPreference: BudgetPreference;
  dietaryTags: string[];
  totalVisits: number;
  totalSpend: number;
}

export interface Booking {
  id: string;
  restaurantId: string;
  dinerId: string;
  tableId: string | null;
  reservedFor: ISODateTime;
  partySize: number;
  serviceShift: ServiceShift;
  status: BookingStatus;
  channel: BookingChannel;
  isNewGuest: boolean;
  occasion: Occasion | null;
  promoCode: string | null;
  discountPct: number | null;
  billTotal: number | null;
  specialRequest: string | null;
  seatedAt: ISODateTime | null;
  cancelledAt: ISODateTime | null;
  createdAt: ISODateTime;
}

export interface Invoice {
  id: string;
  restaurantId: string;
  invoiceNumber: string;
  periodStart: ISODate;
  periodEnd: ISODate;
  subscriptionFee: number;
  coverFee: number;
  coverFeesTotal: number;
  totalBookings: number;
  coversBilled: number;
  noShowsNotCharged: number;
  totalDue: number;
  currency: CurrencyCode;
  issuedAt: ISODate;
  dueAt: ISODate;
  status: InvoiceStatus;
}

export interface MarketBenchmark {
  id: string;
  city: string;
  cuisine: string;
  avgRating: number;
  avgFood: number;
  avgAmbiance: number;
  avgService: number;
  avgFillRate: number;
  medianSpendPerCover: number;
  sampleSize: number;
}

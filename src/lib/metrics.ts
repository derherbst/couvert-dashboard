import type {
  Booking,
  BookingChannel,
  Invoice,
  MarketBenchmark,
  Restaurant,
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const COUVERT_CHANNELS: BookingChannel[] = ["couvert_app", "couvert_web"];
const SHIFTS_PER_DAY = 2;

export interface PeriodKpis {
  coversSeated: number;
  newGuests: number;
  revenue: number;
  coversDelta: number;
  newGuestsDelta: number;
  revenueDelta: number;
}

export interface ChannelRow {
  channel: BookingChannel;
  label: string;
  count: number;
  share: number;
  isCouvert: boolean;
}

export interface BenchRow {
  label: string;
  you: number;
  market: number;
  format: "rating" | "percent";
}

const CHANNEL_LABEL: Record<BookingChannel, string> = {
  couvert_app: "Couvert app",
  couvert_web: "Couvert web",
  restaurant_widget: "Your website widget",
  phone: "Phone",
};

function inWindow(iso: string, from: number, to: number): boolean {
  const t = new Date(iso).getTime();
  return t >= from && t < to;
}

function sumCoversSeated(bookings: Booking[], from: number, to: number): number {
  return bookings
    .filter(
      (b) =>
        (b.status === "completed" || b.status === "walked_in") &&
        inWindow(b.reservedFor, from, to),
    )
    .reduce((s, b) => s + (Number.isFinite(b.partySize) ? b.partySize : 0), 0);
}

function countNewGuests(bookings: Booking[], from: number, to: number): number {
  return bookings.filter(
    (b) => b.isNewGuest && inWindow(b.reservedFor, from, to),
  ).length;
}

function sumCouvertRevenue(bookings: Booking[], from: number, to: number): number {
  return bookings
    .filter(
      (b) =>
        b.status === "completed" &&
        COUVERT_CHANNELS.includes(b.channel) &&
        b.billTotal !== null &&
        inWindow(b.reservedFor, from, to),
    )
    .reduce((s, b) => s + (b.billTotal ?? 0), 0);
}

function pctDelta(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

export function computeKpis(
  bookings: Booking[],
  now: number,
  periodDays: number,
): PeriodKpis {
  const currentFrom = now - periodDays * DAY_MS;
  const prevFrom = currentFrom - periodDays * DAY_MS;

  const coversSeated = sumCoversSeated(bookings, currentFrom, now);
  const coversPrev = sumCoversSeated(bookings, prevFrom, currentFrom);

  const newGuests = countNewGuests(bookings, currentFrom, now);
  const newGuestsPrev = countNewGuests(bookings, prevFrom, currentFrom);

  const revenue = sumCouvertRevenue(bookings, currentFrom, now);
  const revenuePrev = sumCouvertRevenue(bookings, prevFrom, currentFrom);

  return {
    coversSeated,
    newGuests,
    revenue: Math.round(revenue),
    coversDelta: pctDelta(coversSeated, coversPrev),
    newGuestsDelta: pctDelta(newGuests, newGuestsPrev),
    revenueDelta: pctDelta(revenue, revenuePrev),
  };
}

export function computeChannelMix(
  bookings: Booking[],
  now: number,
  periodDays: number,
): ChannelRow[] {
  const from = now - periodDays * DAY_MS;
  const inRange = bookings.filter((b) => inWindow(b.reservedFor, from, now));
  const total = inRange.length;

  const order: BookingChannel[] = [
    "couvert_app",
    "couvert_web",
    "restaurant_widget",
    "phone",
  ];

  return order.map((channel) => {
    const count = inRange.filter((b) => b.channel === channel).length;
    return {
      channel,
      label: CHANNEL_LABEL[channel],
      count,
      share: total === 0 ? 0 : count / total,
      isCouvert: COUVERT_CHANNELS.includes(channel),
    };
  });
}

export function matchBenchmark(
  restaurant: Restaurant,
  cityName: string,
  benchmarks: MarketBenchmark[],
): MarketBenchmark | null {
  return (
    benchmarks.find(
      (b) => b.city === cityName && b.cuisine === restaurant.cuisine,
    ) ?? null
  );
}

export function computeBenchRows(
  restaurant: Restaurant,
  bookings: Booking[],
  benchmark: MarketBenchmark | null,
  now: number,
  periodDays: number,
): BenchRow[] {
  if (!benchmark) return [];

  const from = now - periodDays * DAY_MS;
  const coversSeated = sumCoversSeated(bookings, from, now);
  const capacityForPeriod = restaurant.capacity * periodDays * SHIFTS_PER_DAY;
  const fillRate = capacityForPeriod === 0 ? 0 : coversSeated / capacityForPeriod;

  return [
    { label: "Overall rating", you: restaurant.ratingOverall,  market: benchmark.avgRating,    format: "rating" },
    { label: "Food",           you: restaurant.ratingFood,     market: benchmark.avgFood,      format: "rating" },
    { label: "Service",        you: restaurant.ratingService,  market: benchmark.avgService,   format: "rating" },
    { label: "Ambiance",       you: restaurant.ratingAmbiance, market: benchmark.avgAmbiance,  format: "rating" },
    { label: "Fill rate",      you: fillRate,                  market: benchmark.avgFillRate,  format: "percent" },
  ];
}

export function pickCurrentInvoice(invoices: Invoice[]): Invoice | null {
  if (invoices.length === 0) return null;
  return [...invoices].sort((a, b) =>
    b.periodEnd.localeCompare(a.periodEnd),
  )[0];
}

export function pickUpcoming(
  bookings: Booking[],
  now: number,
  limit: number = 10,
): Booking[] {
  return bookings
    .filter(
      (b) =>
        b.status === "confirmed" &&
        new Date(b.reservedFor).getTime() >= now,
    )
    .sort((a, b) => a.reservedFor.localeCompare(b.reservedFor))
    .slice(0, limit);
}

import type { CurrencyCode } from "./types";

const DEFAULT_LOCALE = "en-IE";

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "EUR",
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatInteger(n: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(n);
}

export function formatPercent(
  fraction: number,
  decimals: number = 0,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(fraction);
}

export function formatSignedPercent(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

export function formatRating(n: number, decimals: number = 2): string {
  return n.toFixed(decimals);
}

export function formatRatingDelta(d: number): string {
  return Math.abs(d).toFixed(2);
}

export function formatDateTime(
  iso: string,
  timezone: string = "Europe/Lisbon",
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

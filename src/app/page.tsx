"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChannelMix } from "@/components/channel-mix";
import { InvoiceSummary } from "@/components/invoice-summary";
import { KpiSection } from "@/components/kpi-section";
import { PeriodSelector, type Period } from "@/components/period-selector";
import { RestaurantHeader } from "@/components/restaurant-header";
import { UpcomingBookings } from "@/components/upcoming-bookings";
import { VsMarket } from "@/components/vs-market";
import {
  getBookings,
  getCity,
  getInvoices,
  getMarketBenchmarks,
  getRestaurant,
  patchBookingStatus,
} from "@/lib/api";
import { CURRENT_RESTAURANT_ID } from "@/lib/constants";
import {
  computeBenchRows,
  computeChannelMix,
  computeKpis,
  matchBenchmark,
  pickCurrentInvoice,
  pickUpcoming,
} from "@/lib/metrics";
import type {
  Booking,
  BookingStatus,
  City,
  Invoice,
  MarketBenchmark,
  Restaurant,
} from "@/lib/types";

interface LoadedData {
  restaurant: Restaurant;
  city: City;
  invoices: Invoice[];
  benchmarks: MarketBenchmark[];
}

const PERIOD_DAYS: Record<Period, 30 | 90> = { "30d": 30, "90d": 90 };

export default function HomePage() {
  const [data, setData] = useState<LoadedData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [period, setPeriod] = useState<Period>("30d");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const restaurant = await getRestaurant(CURRENT_RESTAURANT_ID);
        const [city, loadedBookings, invoices, benchmarks] = await Promise.all([
          getCity(restaurant.cityId),
          getBookings(restaurant.id),
          getInvoices(restaurant.id),
          getMarketBenchmarks(),
        ]);
        if (cancelled) return;
        setData({ restaurant, city, invoices, benchmarks });
        setBookings(loadedBookings);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const periodDays = PERIOD_DAYS[period];

  const view = useMemo(() => {
    if (!data) return null;
    const now = Date.now();
    const benchmark = matchBenchmark(data.restaurant, data.city.name, data.benchmarks);
    return {
      kpis: computeKpis(bookings, now, periodDays),
      channels: computeChannelMix(bookings, now, periodDays),
      benchRows: computeBenchRows(data.restaurant, bookings, benchmark, now, periodDays),
      benchmark,
      invoice: pickCurrentInvoice(data.invoices),
      upcoming: pickUpcoming(bookings, now),
    };
  }, [data, bookings, periodDays]);

  const patchBookingInState = useCallback(
    async (id: string, next: BookingStatus) => {
      let previous: BookingStatus | null = null;
      setBookings((rows) => {
        previous = rows.find((r) => r.id === id)?.status ?? null;
        return rows.map((r) => (r.id === id ? { ...r, status: next } : r));
      });
      try {
        await patchBookingStatus(id, next);
      } catch (e) {
        setBookings((rows) =>
          rows.map((r) =>
            r.id === id && previous !== null ? { ...r, status: previous } : r,
          ),
        );
        throw e;
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Couvert — Owner Dashboard
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-medium">Could not load dashboard data.</p>
            <p className="mt-1">
              Is json-server running on port 4000? Try{" "}
              <code className="rounded bg-red-100 px-1">npm run dev:api</code>.
            </p>
            <p className="mt-1 text-xs text-red-700">{error}</p>
          </div>
        )}

        {!data && !error && (
          <p className="py-16 text-center text-sm text-gray-500">Loading…</p>
        )}

        {data && view && (
          <>
            <RestaurantHeader restaurant={data.restaurant} />

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                How Couvert is performing for you
              </p>
              <PeriodSelector value={period} onChange={setPeriod} />
            </div>

            <KpiSection kpis={view.kpis} currency={data.city.currency} />

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChannelMix rows={view.channels} />
              <VsMarket rows={view.benchRows} benchmark={view.benchmark} />
            </section>

            <InvoiceSummary invoice={view.invoice} />

            <UpcomingBookings rows={view.upcoming} onPatched={patchBookingInState} />
          </>
        )}
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { KpiCard } from "./kpi-card";
import { PeriodSelector, type Period } from "./period-selector";
import { formatCurrency, formatInteger } from "@/lib/format";

interface PeriodKpis {
  coversSeated: number;
  newGuests: number;
  revenue: number;
  coversDelta: number;
  newGuestsDelta: number;
  revenueDelta: number;
}

const DATA: Record<Period, PeriodKpis> = {
  "30d": {
    coversSeated: 412,
    newGuests: 87,
    revenue: 18340,
    coversDelta: 14,
    newGuestsDelta: 8,
    revenueDelta: 11,
  },
  "90d": {
    coversSeated: 1184,
    newGuests: 241,
    revenue: 52800,
    coversDelta: 6,
    newGuestsDelta: -3,
    revenueDelta: 9,
  },
};

export function KpiSection() {
  const [period, setPeriod] = useState<Period>("30d");
  const kpis = DATA[period];

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">How Couvert is performing for you</p>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Covers seated"
          value={formatInteger(kpis.coversSeated)}
          subtitle="completed bookings, this period"
          deltaPct={kpis.coversDelta}
        />
        <KpiCard
          label="New guests acquired"
          value={formatInteger(kpis.newGuests)}
          subtitle="first-time diners, this period"
          deltaPct={kpis.newGuestsDelta}
        />
        <KpiCard
          label="Revenue from Couvert"
          value={formatCurrency(kpis.revenue)}
          subtitle="bills from Couvert-sourced bookings"
          deltaPct={kpis.revenueDelta}
        />
      </section>
    </>
  );
}

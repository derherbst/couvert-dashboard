import { KpiCard } from "./kpi-card";
import { formatCurrency, formatInteger } from "@/lib/format";
import type { PeriodKpis } from "@/lib/metrics";

interface KpiSectionProps {
  kpis: PeriodKpis;
  currency?: string;
}

export function KpiSection({ kpis, currency = "EUR" }: KpiSectionProps) {
  return (
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
        value={formatCurrency(kpis.revenue, currency)}
        subtitle="bills from Couvert-sourced bookings"
        deltaPct={kpis.revenueDelta}
      />
    </section>
  );
}

import { formatSignedPercent } from "@/lib/format";

interface KpiCardProps {
  label: string;
  value: string;
  subtitle: string;
  deltaPct?: number;
}

export function KpiCard({ label, value, subtitle, deltaPct }: KpiCardProps) {
  const up = deltaPct !== undefined && deltaPct >= 0;
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      {deltaPct !== undefined && (
        <p
          className={
            "mt-4 border-t pt-3 text-sm font-medium " +
            (up
              ? "border-emerald-100 text-emerald-700"
              : "border-red-100 text-red-700")
          }
        >
          {formatSignedPercent(deltaPct)} vs previous period
        </p>
      )}
    </div>
  );
}

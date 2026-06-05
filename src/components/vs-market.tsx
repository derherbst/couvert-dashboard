import { formatPercent, formatRating, formatRatingDelta } from "@/lib/format";

type Format = "rating" | "percent";

interface MetricRow {
  label: string;
  you: number;
  market: number;
  format: Format;
}

const rows: MetricRow[] = [
  { label: "Overall rating", you: 4.31, market: 4.2, format: "rating" },
  { label: "Food", you: 4.34, market: 4.1, format: "rating" },
  { label: "Service", you: 4.15, market: 3.98, format: "rating" },
  { label: "Ambiance", you: 4.27, market: 4.02, format: "rating" },
  { label: "Fill rate", you: 0.62, market: 0.71, format: "percent" },
];

function formatValue(n: number, format: Format) {
  return format === "rating" ? formatRating(n) : formatPercent(n);
}

function formatDelta(delta: number, format: Format) {
  if (format === "rating") return formatRatingDelta(delta);
  return formatPercent(Math.abs(delta));
}

export function VsMarket() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">vs market</h2>
        <span className="text-sm text-gray-500">
          Lisbon · Portuguese · Seafood · n=42
        </span>
      </header>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <th className="pb-2">Metric</th>
            <th className="pb-2 text-right">You</th>
            <th className="pb-2 text-right">Market</th>
            <th className="pb-2 text-right">Δ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => {
            const delta = r.you - r.market;
            const up = delta >= 0;
            return (
              <tr key={r.label}>
                <td className="py-2 text-gray-900">{r.label}</td>
                <td className="py-2 text-right tabular-nums text-gray-900">
                  {formatValue(r.you, r.format)}
                </td>
                <td className="py-2 text-right tabular-nums text-gray-500">
                  {formatValue(r.market, r.format)}
                </td>
                <td
                  className={
                    "py-2 text-right tabular-nums font-medium " +
                    (up ? "text-emerald-700" : "text-red-700")
                  }
                >
                  {up ? "▲" : "▼"} {formatDelta(delta, r.format)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

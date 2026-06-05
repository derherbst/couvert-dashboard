import { formatPercent, formatRating, formatRatingDelta } from "@/lib/format";
import type { BenchRow } from "@/lib/metrics";
import type { MarketBenchmark } from "@/lib/types";

interface VsMarketProps {
  rows: BenchRow[];
  benchmark: MarketBenchmark | null;
}

function formatValue(n: number, format: BenchRow["format"]) {
  return format === "rating" ? formatRating(n) : formatPercent(n);
}

function formatDelta(delta: number, format: BenchRow["format"]) {
  if (format === "rating") return formatRatingDelta(delta);
  return formatPercent(Math.abs(delta));
}

export function VsMarket({ rows, benchmark }: VsMarketProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">vs market</h2>
        <span className="text-sm text-gray-500">
          {benchmark
            ? `${benchmark.city} · ${benchmark.cuisine} · n=${benchmark.sampleSize}`
            : "no peer data"}
        </span>
      </header>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">
          No matching city × cuisine benchmark.
        </p>
      ) : (
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
      )}
    </section>
  );
}

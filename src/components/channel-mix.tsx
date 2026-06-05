import { formatInteger, formatPercent } from "@/lib/format";
import type { ChannelRow } from "@/lib/metrics";

interface ChannelMixProps {
  rows: ChannelRow[];
}

export function ChannelMix({ rows }: ChannelMixProps) {
  const couvertShare = rows
    .filter((r) => r.isCouvert)
    .reduce((sum, r) => sum + r.share, 0);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Where bookings come from
        </h2>
        <span className="text-sm text-gray-500">
          {formatPercent(couvertShare)} via Couvert
        </span>
      </header>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.channel}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-gray-900">{r.label}</span>
              <span className="tabular-nums text-gray-500">
                {formatInteger(r.count)} · {formatPercent(r.share)}
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={
                  "h-full rounded-full " +
                  (r.isCouvert ? "bg-gray-900" : "bg-gray-300")
                }
                style={{ width: `${r.share * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

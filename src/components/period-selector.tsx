"use client";

export type Period = "30d" | "90d";

interface PeriodSelectorProps {
  value: Period;
  onChange: (next: Period) => void;
}

const options: { value: Period; label: string }[] = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-md border border-gray-300 bg-white p-0.5 text-sm">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={
              "rounded px-3 py-1 transition-colors " +
              (active
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

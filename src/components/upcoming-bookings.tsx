"use client";

import { useState, useTransition } from "react";
import { formatDateTime } from "@/lib/format";
import type { Booking, BookingChannel, BookingStatus } from "@/lib/types";

interface UpcomingBookingsProps {
  rows: Booking[];
  onPatched: (id: string, next: BookingStatus) => Promise<void>;
}

const channelLabel: Record<BookingChannel, string> = {
  couvert_app: "Couvert app",
  couvert_web: "Couvert web",
  restaurant_widget: "Widget",
  phone: "Phone",
};

const statusLabel: Record<Exclude<BookingStatus, "confirmed">, string> = {
  completed: "Seated",
  walked_in: "Walked in",
  no_show: "No-show",
  cancelled: "Cancelled",
};

const statusTone: Record<Exclude<BookingStatus, "confirmed">, string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  walked_in: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  no_show: "bg-amber-50 text-amber-700 ring-amber-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export function UpcomingBookings({ rows, onPatched }: UpcomingBookingsProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const confirmedCount = rows.filter((r) => r.status === "confirmed").length;

  function handle(id: string, next: BookingStatus) {
    setPendingId(id);
    startTransition(async () => {
      try {
        await onPatched(id, next);
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">Upcoming bookings</h2>
        <span className="text-sm text-gray-500">
          {confirmedCount} confirmed, awaiting service
        </span>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="pb-2">When</th>
              <th className="pb-2">Party</th>
              <th className="pb-2">Occasion</th>
              <th className="pb-2">Channel</th>
              <th className="pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => {
              const isPending = pendingId === r.id;
              const isConfirmed = r.status === "confirmed";
              return (
                <tr key={r.id} className={isPending ? "opacity-50" : ""}>
                  <td className="py-3 text-gray-900">{formatDateTime(r.reservedFor)}</td>
                  <td className="py-3 tabular-nums text-gray-900">{r.partySize}</td>
                  <td className="py-3 text-gray-600">{r.occasion ?? "—"}</td>
                  <td className="py-3 text-gray-600">{channelLabel[r.channel]}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      {isConfirmed ? (
                        <>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handle(r.id, "completed")}
                            className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Mark seated
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handle(r.id, "no_show")}
                            className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            No-show
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handle(r.id, "cancelled")}
                            className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset " +
                            statusTone[r.status as Exclude<BookingStatus, "confirmed">]
                          }
                        >
                          {statusLabel[r.status as Exclude<BookingStatus, "confirmed">]}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

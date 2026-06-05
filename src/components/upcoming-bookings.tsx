"use client";

import { useState, useTransition } from "react";
import { patchBookingStatus } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { BookingChannel, BookingStatus, Occasion } from "@/lib/types";

interface Row {
  id: string;
  reservedFor: string;
  party: number;
  occasion: Occasion | null;
  channel: BookingChannel;
  status: BookingStatus;
}

const initialRows: Row[] = [
  { id: "bk_1346", reservedFor: "2026-06-03T20:15:00.000Z", party: 3, occasion: null,          channel: "couvert_app",       status: "confirmed" },
  { id: "bk_1347", reservedFor: "2026-06-03T20:45:00.000Z", party: 4, occasion: null,          channel: "restaurant_widget", status: "confirmed" },
  { id: "bk_1348", reservedFor: "2026-06-03T21:45:00.000Z", party: 3, occasion: "birthday",    channel: "restaurant_widget", status: "confirmed" },
  { id: "bk_1349", reservedFor: "2026-06-03T20:45:00.000Z", party: 2, occasion: null,          channel: "couvert_web",       status: "confirmed" },
  { id: "bk_1350", reservedFor: "2026-06-04T12:00:00.000Z", party: 8, occasion: "anniversary", channel: "couvert_app",       status: "confirmed" },
  { id: "bk_1351", reservedFor: "2026-06-04T19:45:00.000Z", party: 2, occasion: null,          channel: "restaurant_widget", status: "confirmed" },
  { id: "bk_1352", reservedFor: "2026-06-04T19:00:00.000Z", party: 5, occasion: null,          channel: "couvert_app",       status: "confirmed" },
  { id: "bk_1353", reservedFor: "2026-06-04T19:00:00.000Z", party: 5, occasion: null,          channel: "restaurant_widget", status: "confirmed" },
  { id: "bk_1354", reservedFor: "2026-06-04T12:30:00.000Z", party: 1, occasion: null,          channel: "couvert_app",       status: "confirmed" },
  { id: "bk_1355", reservedFor: "2026-06-05T21:15:00.000Z", party: 3, occasion: null,          channel: "couvert_app",       status: "confirmed" },
];

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

export function UpcomingBookings() {
  const [rows, setRows] = useState(initialRows);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const confirmedCount = rows.filter((r) => r.status === "confirmed").length;

  function mutate(id: string, next: BookingStatus) {
    const prev = rows;
    setRows(prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
    setPendingId(id);

    startTransition(async () => {
      try {
        await patchBookingStatus(id, next);
      } catch {
        setRows(prev);
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
                  <td className="py-3 tabular-nums text-gray-900">{r.party}</td>
                  <td className="py-3 text-gray-600">{r.occasion ?? "—"}</td>
                  <td className="py-3 text-gray-600">{channelLabel[r.channel]}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      {isConfirmed ? (
                        <>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => mutate(r.id, "completed")}
                            className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Mark seated
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => mutate(r.id, "no_show")}
                            className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            No-show
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => mutate(r.id, "cancelled")}
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

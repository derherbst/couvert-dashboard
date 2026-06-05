"use client";

import type { BookingChannel, Occasion } from "@/lib/types";

interface Row {
  id: string;
  when: string;
  party: number;
  occasion: Occasion | null;
  channel: BookingChannel;
}

const rows: Row[] = [
  { id: "1", when: "Today · 13:00", party: 2, occasion: "casual", channel: "couvert_app" },
  { id: "2", when: "Today · 14:15", party: 4, occasion: "business", channel: "couvert_web" },
  { id: "3", when: "Today · 20:00", party: 6, occasion: "anniversary", channel: "restaurant_widget" },
  { id: "4", when: "Today · 21:30", party: 3, occasion: null, channel: "phone" },
  { id: "5", when: "Tomorrow · 12:45", party: 2, occasion: "date", channel: "couvert_app" },
  { id: "6", when: "Tomorrow · 13:30", party: 5, occasion: "birthday", channel: "couvert_app" },
  { id: "7", when: "Tomorrow · 19:15", party: 4, occasion: "casual", channel: "couvert_web" },
  { id: "8", when: "Tomorrow · 20:00", party: 2, occasion: null, channel: "couvert_web" },
  { id: "9", when: "Tomorrow · 20:30", party: 3, occasion: "casual", channel: "restaurant_widget" },
  { id: "10", when: "Tomorrow · 21:45", party: 4, occasion: "business", channel: "phone" },
];

const channelLabel: Record<BookingChannel, string> = {
  couvert_app: "Couvert app",
  couvert_web: "Couvert web",
  restaurant_widget: "Widget",
  phone: "Phone",
};

export function UpcomingBookings() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">Upcoming bookings</h2>
        <span className="text-sm text-gray-500">
          {rows.length} confirmed, awaiting service
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
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="py-3 text-gray-900">{r.when}</td>
                <td className="py-3 tabular-nums text-gray-900">{r.party}</td>
                <td className="py-3 text-gray-600">{r.occasion ?? "—"}</td>
                <td className="py-3 text-gray-600">{channelLabel[r.channel]}</td>
                <td className="py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {}}
                      className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      Mark seated
                    </button>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-600"
                    >
                      No-show
                    </button>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

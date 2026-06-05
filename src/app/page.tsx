import { ChannelMix } from "@/components/channel-mix";
import { KpiSection } from "@/components/kpi-section";
import { RestaurantHeader } from "@/components/restaurant-header";
import { UpcomingBookings } from "@/components/upcoming-bookings";
import { VsMarket } from "@/components/vs-market";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Couvert — Owner Dashboard
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <RestaurantHeader />

        <KpiSection />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChannelMix />
          <VsMarket />
        </section>

        <UpcomingBookings />
      </main>
    </div>
  );
}

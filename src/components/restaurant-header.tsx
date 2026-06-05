import { formatInteger, formatRating } from "@/lib/format";
import type { Restaurant } from "@/lib/types";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const priceBand = "$".repeat(restaurant.priceBand);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{restaurant.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {restaurant.cuisine} · {priceBand} · {restaurant.zone}
          </p>
          <p className="mt-0.5 text-sm text-gray-500">{restaurant.address}</p>
        </div>

        <div className="flex shrink-0 items-center gap-6 text-right">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Rating</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              ★ {formatRating(restaurant.ratingOverall)}
            </p>
            <p className="text-xs text-gray-500">
              {formatInteger(restaurant.ratingCount)} reviews
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Capacity</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{restaurant.capacity}</p>
            <p className="text-xs text-gray-500">seats</p>
          </div>
        </div>
      </div>
    </section>
  );
}

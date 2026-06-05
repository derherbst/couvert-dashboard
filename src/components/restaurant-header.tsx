import { formatInteger, formatRating } from "@/lib/format";

interface RestaurantSummary {
  name: string;
  cuisine: string;
  zone: string;
  address: string;
  priceBand: 1 | 2 | 3 | 4;
  capacity: number;
  ratingOverall: number;
  ratingCount: number;
}

const restaurant: RestaurantSummary = {
  name: "Taberna Azul",
  cuisine: "Portuguese · Seafood",
  zone: "Chiado",
  address: "Rua do Alecrim 47, 1200-016 Lisboa",
  priceBand: 3,
  capacity: 64,
  ratingOverall: 4.31,
  ratingCount: 514,
};

export function RestaurantHeader() {
  const priceBand = "$".repeat(restaurant.priceBand);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {restaurant.name}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {restaurant.cuisine} · {priceBand} · {restaurant.zone}
          </p>
          <p className="mt-0.5 text-sm text-gray-500">{restaurant.address}</p>
        </div>

        <div className="flex shrink-0 items-center gap-6 text-right">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Rating
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              ★ {formatRating(restaurant.ratingOverall)}
            </p>
            <p className="text-xs text-gray-500">
              {formatInteger(restaurant.ratingCount)} reviews
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Capacity
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {restaurant.capacity}
            </p>
            <p className="text-xs text-gray-500">seats</p>
          </div>
        </div>
      </div>
    </section>
  );
}

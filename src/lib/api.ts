import type {
	Booking,
	BookingStatus,
	City,
	Invoice,
	MarketBenchmark,
	Restaurant,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getData<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...init,
		headers: { "Content-Type": "application/json", ...init?.headers },
		cache: "no-store",
	});
	if (!res.ok)
		throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}`);
	return res.json() as Promise<T>;
}

function normalizeBooking(b: Booking & { status: string }): Booking {
	return { ...b, status: b.status.toLowerCase() as BookingStatus };
}

export function getRestaurant(id: string): Promise<Restaurant> {
	return getData<Restaurant>(`/restaurants/${id}`);
}

export function getCity(id: string): Promise<City> {
	return getData<City>(`/cities/${id}`);
}

export async function getBookings(restaurantId: string): Promise<Booking[]> {
	const rows = await getData<(Booking & { status: string })[]>(
		`/bookings?restaurantId=${encodeURIComponent(restaurantId)}`,
	);
	return rows.map(normalizeBooking);
}

export function getInvoices(restaurantId: string): Promise<Invoice[]> {
	return getData<Invoice[]>(
		`/invoices?restaurantId=${encodeURIComponent(restaurantId)}`,
	);
}

export function getMarketBenchmarks(): Promise<MarketBenchmark[]> {
	return getData<MarketBenchmark[]>(`/marketBenchmarks`);
}

export async function patchBookingStatus(
	id: string,
	status: BookingStatus,
): Promise<Booking> {
	const updated = await getData<Booking & { status: string }>(
		`/bookings/${id}`,
		{
			method: "PATCH",
			body: JSON.stringify({ status }),
		},
	);
	return normalizeBooking(updated);
}

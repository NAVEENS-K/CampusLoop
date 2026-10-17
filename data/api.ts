import { Listing } from "@/data/listings";

type ApiListing = {
  id: number | string;
  title: string;
  category: string;
  priceInPaise: number;
  conditionLabel: string;
  description: string;
  sellerDisplayName: string;
  campusLocation: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export function isApiConfigured() {
  return Boolean(API_URL);
}

export async function fetchListingsFromApi(): Promise<Listing[] | null> {
  if (!API_URL) return null;
  const response = await fetch(`${API_URL}/api/listings`);
  if (!response.ok) throw new Error(`CampusLoop API returned ${response.status}`);
  const rows = (await response.json()) as ApiListing[];
  return rows.map(row => ({
    id: String(row.id),
    title: row.title,
    category: row.category,
    price: Math.round(row.priceInPaise / 100),
    condition: row.conditionLabel,
    description: row.description,
    seller: row.sellerDisplayName,
    emoji: row.category === "Books" ? "📘" : row.category === "Electronics" ? "🔌" : row.category === "Hostel" ? "💡" : "📐",
    accent: "#E7EEFF",
    location: row.campusLocation,
  }));
}
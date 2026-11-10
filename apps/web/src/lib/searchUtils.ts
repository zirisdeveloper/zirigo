import { Property } from "./types";

const COUNTRY_ALIASES: Record<string, string[]> = {
  france: ["france", "فرنسا"],
  morocco: ["morocco", "maroc", "المغرب"],
  maroc: ["morocco", "maroc", "المغرب"],
  italy: ["italy", "italie", "إيطاليا"],
  italie: ["italy", "italie", "إيطاليا"],
  algeria: ["algeria", "algerie", "algérie", "الجزائر"],
  algerie: ["algeria", "algerie", "algérie", "الجزائر"],
};

const CITY_ALIASES: Record<string, string[]> = {
  cassis: ["cassis", "كاسيس"],
  paris: ["paris", "باريس"],
  "chamonix-mont-blanc": ["chamonix-mont-blanc", "chamonix", "mont blanc", "شاموني", "مون بلان"],
  chamonix: ["chamonix-mont-blanc", "chamonix", "شاموني"],
  marrakech: ["marrakech", "marrakesh", "مراكش"],
  positano: ["positano", "amalfi", "بوسيتانو", "أمالفي"],
  algiers: ["algiers", "alger", "الجزائر", "الجزائر العاصمة"],
  alger: ["algiers", "alger", "الجزائر", "الجزائر العاصمة"],
};

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Matches single-term and compound location queries (e.g. "Paris, France",
 * "Alger, Algérie", "باريس، فرنسا") cleanly against title, city, country,
 * address, description and multilingual destination aliases.
 */
export function matchesPropertyQuery(property: Property, rawQuery: string): boolean {
  const normalizedQuery = normalizeSearchText(rawQuery);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery
    .split(/[\s,;،•·|/-]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const cityKey = normalizeSearchText(property.city || "");
  const countryKey = normalizeSearchText(property.country || "");

  const nonCountryParts = [
    property.title || "",
    property.city || "",
    property.address || "",
    property.description || "",
    property.type || "",
    ...(CITY_ALIASES[cityKey] || []),
  ];

  const countryWords = normalizeSearchText(
    [property.country || "", ...(COUNTRY_ALIASES[countryKey] || [])].join(" ")
  )
    .split(/[\s,;،•·|/()-]+/)
    .filter(Boolean);

  const nonCountryHaystack = normalizeSearchText(nonCountryParts.join(" "));
  return tokens.every(
    (token) => nonCountryHaystack.includes(token) || countryWords.includes(token)
  );
}

/**
 * Matches single or multi-selected property category filters consistently
 * across client, server API, and alerts.
 */
export function matchesPropertyCategory(
  property: Property,
  activeType: string | string[]
): boolean {
  if (Array.isArray(activeType)) {
    if (activeType.length === 0 || activeType.includes("all")) return true;
    return activeType.includes(property.type);
  }
  if (!activeType || activeType === "all") return true;
  return property.type === activeType;
}


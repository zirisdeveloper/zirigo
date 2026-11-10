import fs from "fs";
import path from "path";
import { AdBanner } from "./types";

const INITIAL_ADS: AdBanner[] = [
  {
    id: "ad-main-1",
    placement: "main",
    brandName: "Zirigo Prestige",
    badgeText: {
      fr: "Sponsorisé · Offre Directe",
      en: "Sponsored · Direct Deal",
      ar: "إعلان ممول · عرض مباشر",
    },
    title: {
      fr: "Villas & Séjours d'Exception sans commission cachée",
      en: "Luxury Villas & Stays with Zero Hidden Commission",
      ar: "فيلات وإقامات فاخرة بدون عمولات خفية",
    },
    subtitle: {
      fr: "Comparez Booking, Airbnb et réservez directement en Dinar Algérien (DZD).",
      en: "Compare Booking, Airbnb and book direct with transparent pricing in DZD.",
      ar: "قارن الأسعار واحجز مباشرة بالدينار الجزائري بأفضل سعر مضمون.",
    },
    ctaText: {
      fr: "Découvrir les Villas",
      en: "Explore Villas",
      ar: "استكشف الفيلات",
    },
    contactOrPromo: "PROMO ZIRIGO25 · 0550 77 48 55",
    imageUrl: "/images/ads/ad-villa-escape.jpg",
    targetUrl: "/?type=villa#catalog",
    filterType: "villa",
    accentColor: "#0d9488",
    isFullArtwork: false,
    isActive: true,
    order: 1,
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "ad-main-2",
    placement: "main",
    brandName: "Azur Hôtels & Resorts",
    badgeText: {
      fr: "Publicité · Saison 2026",
      en: "Sponsored · 2026 Season",
      ar: "إعلان · موسم 2026",
    },
    title: {
      fr: "Jusqu'à -25% sur les meilleurs Hôtels & Resorts",
      en: "Save up to 25% on Top Rated Hotels & Resorts",
      ar: "خصم يصل إلى 25% على أفضل الفنادق والمنتجعات",
    },
    subtitle: {
      fr: "Petit-déjeuner offert et annulation flexible incluse sur votre réservation directe.",
      en: "Complimentary breakfast and flexible cancellation when booking direct.",
      ar: "فطور مجاني وإلغاء مرن مشمول عند الحجز المباشر.",
    },
    ctaText: {
      fr: "Voir les Hôtels",
      en: "Browse Hotels",
      ar: "تصفح الفنادق",
    },
    contactOrPromo: "TARIF DIRECT GARANTI",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80",
    targetUrl: "/?type=hotel#catalog",
    filterType: "hotel",
    accentColor: "#0284c7",
    isFullArtwork: false,
    isActive: true,
    order: 2,
    createdAt: "2026-06-02T10:00:00Z",
  },
  {
    id: "ad-main-3",
    placement: "main",
    brandName: "Collection Chalets & Montagne",
    badgeText: {
      fr: "Publicité · Escapades",
      en: "Sponsored · Escapes",
      ar: "إعلان · رحلات جبلية",
    },
    title: {
      fr: "Chalets panoramiques & Appartements de charme",
      en: "Panoramic Mountain Chalets & Designer Apartments",
      ar: "شاليهات بانورامية وشقق مصممة للإيجار",
    },
    subtitle: {
      fr: "Des hébergements vérifiés en Algérie, France et Méditerranée au meilleur tarif.",
      en: "Verified properties across Algeria, Europe & the Mediterranean at direct rates.",
      ar: "عقارات موثوقة في الجزائر وأوروبا والمتوسط بأفضل الأسعار المباشرة.",
    },
    ctaText: {
      fr: "Explorer les Chalets",
      en: "Explore Chalets",
      ar: "استكشف الشاليهات",
    },
    contactOrPromo: "MEILLEUR PRIX VÉRIFIÉ",
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80",
    targetUrl: "/?type=chalet#catalog",
    filterType: "chalet",
    accentColor: "#d97706",
    isFullArtwork: false,
    isActive: true,
    order: 3,
    createdAt: "2026-06-03T10:00:00Z",
  },
  {
    id: "ad-side-1",
    placement: "side",
    brandName: "Zirigo Store",
    badgeText: {
      fr: "Espace Hôtes",
      en: "Partner Hub",
      ar: "فضاء المعلنين",
    },
    title: {
      fr: "Votre hébergement en ligne. Dès maintenant.",
      en: "List your property online. Today.",
      ar: "منشأتك الفندقية على الإنترنت. الآن.",
    },
    subtitle: {
      fr: "Publiez vos hôtels, villas, appartements ou chalets en quelques clics.",
      en: "Publish hotels, villas, apartments or chalets in minutes.",
      ar: "أضف فندقك أو شقتك أو فيلتك في دقائق.",
    },
    ctaText: {
      fr: "Publier une annonce",
      en: "Publish listing",
      ar: "أضف إعلانك الآن",
    },
    contactOrPromo: "ZIRIGO PRO",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    targetUrl: "/espace-perso/ajouter",
    accentColor: "#1d4ed8",
    isFullArtwork: false,
    isActive: true,
    order: 1,
    createdAt: "2026-06-01T10:00:00Z",
  },
];

function getDataDirectory(): string {
  const possiblePaths = [
    path.join(process.cwd(), "data"),
    path.join(process.cwd(), "apps", "web", "data"),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  const defaultPath = fs.existsSync(path.join(process.cwd(), "package.json"))
    ? path.join(process.cwd(), "data")
    : path.join(process.cwd(), "apps", "web", "data");
  if (!fs.existsSync(defaultPath)) {
    try {
      fs.mkdirSync(defaultPath, { recursive: true });
    } catch {
      // ignore
    }
  }
  return defaultPath;
}

function getAdsFilePath(): string {
  return path.join(getDataDirectory(), "ads.json");
}

function readAds(): AdBanner[] {
  const filePath = getAdsFilePath();
  if (!fs.existsSync(filePath)) {
    writeAds(INITIAL_ADS);
    return INITIAL_ADS;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Failed to read ads.json:", err);
  }
  writeAds(INITIAL_ADS);
  return INITIAL_ADS;
}

function writeAds(ads: AdBanner[]): void {
  try {
    const filePath = getAdsFilePath();
    fs.writeFileSync(filePath, JSON.stringify(ads, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write ads.json:", err);
  }
}

export function getAllAds(activeOnly = false): AdBanner[] {
  const ads = readAds().sort((a, b) => a.order - b.order);
  return activeOnly ? ads.filter((ad) => ad.isActive) : ads;
}

export function getAdById(id: string): AdBanner | undefined {
  return readAds().find((ad) => ad.id === id);
}

export function createAd(input: Partial<AdBanner>): AdBanner {
  const ads = readAds();
  const titleFr = input.title?.fr || input.brandName || "Nouvelle Publicité";
  const newAd: AdBanner = {
    id: `ad-${Date.now()}`,
    placement: input.placement === "side" ? "side" : "main",
    brandName: input.brandName || "Zirigo Partner",
    badgeText: input.badgeText || {
      fr: "Publicité",
      en: "Sponsored",
      ar: "إعلان",
    },
    title: {
      fr: titleFr,
      en: input.title?.en || titleFr,
      ar: input.title?.ar || titleFr,
    },
    subtitle: input.subtitle || {
      fr: "",
      en: "",
      ar: "",
    },
    ctaText: input.ctaText || {
      fr: "Découvrir",
      en: "Explore",
      ar: "اكتشف",
    },
    contactOrPromo: input.contactOrPromo || "",
    imageUrl: input.imageUrl || "/images/ads/ad-villa-escape.jpg",
    targetUrl: input.targetUrl || "#catalog",
    filterType: input.filterType,
    accentColor: input.accentColor || "#0d9488",
    isFullArtwork: Boolean(input.isFullArtwork),
    isActive: input.isActive ?? true,
    order: typeof input.order === "number" ? input.order : ads.length + 1,
    createdAt: new Date().toISOString(),
  };
  ads.push(newAd);
  writeAds(ads);
  return newAd;
}

export function updateAd(id: string, updates: Partial<AdBanner>): AdBanner | null {
  const ads = readAds();
  const index = ads.findIndex((a) => a.id === id);
  if (index === -1) return null;
  ads[index] = { ...ads[index], ...updates, id };
  writeAds(ads);
  return ads[index];
}

export function deleteAd(id: string): boolean {
  const ads = readAds();
  const next = ads.filter((a) => a.id !== id);
  if (next.length === ads.length) return false;
  writeAds(next);
  return true;
}

export function resetAds(): AdBanner[] {
  writeAds(INITIAL_ADS);
  return INITIAL_ADS;
}


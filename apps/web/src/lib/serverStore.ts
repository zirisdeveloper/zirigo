import fs from "fs";
import path from "path";
import { Property, RoomUnit, PlatformRate } from "./types";
import { PROPERTIES } from "./data";

export interface BookingRecord {
  id: string;
  bookingReference: string;
  propertyId: string;
  propertyTitle: string;
  roomTitle?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  specialRequests?: string;
}

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "book-1",
    bookingReference: "ZIR-849201",
    propertyId: "prop-1",
    propertyTitle: "Villa Luminescence & Infinity Pool",
    roomTitle: "Master Sea-View Suite",
    guestName: "Sophie Martin",
    guestEmail: "sophie.martin@example.fr",
    guestPhone: "+33 6 12 34 56 78",
    checkInDate: "2026-07-10",
    checkOutDate: "2026-07-17",
    guestsCount: 2,
    totalAmount: 2723,
    currency: "EUR",
    status: "confirmed",
    createdAt: "2026-05-12T14:30:00Z",
    specialRequests: "Arrivée tardive vers 19h. Bouteille de champagne si possible.",
  },
  {
    id: "book-2",
    bookingReference: "ZIR-739102",
    propertyId: "prop-2",
    propertyTitle: "Le Petit Marais Atelier & Rooftop",
    roomTitle: "Entire Loft Atelier",
    guestName: "Marc Dupont",
    guestEmail: "m.dupont@business.com",
    guestPhone: "+33 6 98 76 54 32",
    checkInDate: "2026-06-20",
    checkOutDate: "2026-06-23",
    guestsCount: 2,
    totalAmount: 940,
    currency: "EUR",
    status: "pending",
    createdAt: "2026-05-18T09:15:00Z",
    specialRequests: "Besoin de facture professionnelle.",
  },
  {
    id: "book-3",
    bookingReference: "ZIR-658291",
    propertyId: "prop-3",
    propertyTitle: "Chalet Mont-Blanc Glacier Lodge",
    roomTitle: "Glacier Panoramic Suite",
    guestName: "Sarah Alami",
    guestEmail: "sarah.alami@travel.com",
    guestPhone: "+44 7700 900077",
    checkInDate: "2026-12-22",
    checkOutDate: "2026-12-29",
    guestsCount: 4,
    totalAmount: 4340,
    currency: "EUR",
    status: "confirmed",
    createdAt: "2026-04-02T11:20:00Z",
    specialRequests: "Location matériel de ski souhaitée.",
  },
];

function getDataDirectory(): string {
  // Check common base paths
  const possiblePaths = [
    path.join(process.cwd(), "data"),
    path.join(process.cwd(), "apps", "web", "data"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // If not found, create in process.cwd()/data or apps/web/data
  const defaultPath = fs.existsSync(path.join(process.cwd(), "package.json"))
    ? path.join(process.cwd(), "data")
    : path.join(process.cwd(), "apps", "web", "data");

  if (!fs.existsSync(defaultPath)) {
    try {
      fs.mkdirSync(defaultPath, { recursive: true });
    } catch {
      // fallback
    }
  }
  return defaultPath;
}

function getPropertiesFilePath(): string {
  const dir = getDataDirectory();
  return path.join(dir, "properties.json");
}

function getBookingsFilePath(): string {
  const dir = getDataDirectory();
  return path.join(dir, "bookings.json");
}

// In-memory fallback cache
let memoryProperties: Property[] = [...PROPERTIES];
let memoryBookings: BookingRecord[] = [...INITIAL_BOOKINGS];

export function getAllProperties(): Property[] {
  try {
    const filePath = getPropertiesFilePath();
    if (!fs.existsSync(filePath)) {
      saveAllProperties(PROPERTIES);
      return PROPERTIES;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryProperties = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("Error reading properties.json, using in-memory cache:", err);
  }
  return memoryProperties;
}

export function saveAllProperties(propertiesList: Property[]): boolean {
  memoryProperties = propertiesList;
  try {
    const filePath = getPropertiesFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(propertiesList, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing properties.json:", err);
    return false;
  }
}

export function getPropertyById(id: string): Property | undefined {
  const list = getAllProperties();
  return list.find((p) => p.id === id || p.slug === id);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const list = getAllProperties();
  return list.find((p) => p.slug === slug);
}

export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return base || `prop-${Date.now()}`;
}

export function createProperty(data: Partial<Property>): Property {
  const list = getAllProperties();
  const id = data.id || `prop-${Date.now()}`;
  let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || "nouvelle-propriete");

  // Ensure unique slug
  let counter = 1;
  const originalSlug = slug;
  while (list.some((p) => p.slug === slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  const defaultRooms: RoomUnit[] = [
    {
      id: `room-${Date.now()}-1`,
      title: "Suite Principale",
      description: "Chambre avec lit Queen Size et salle de bain privative.",
      capacityGuests: 2,
      capacityBedrooms: 1,
      capacityBeds: 1,
      capacityBathrooms: 1,
      basePricePerNight: 150,
      cleaningFee: 30,
      images: [data.featuredImage || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"],
      amenities: ["Lit Queen", "Salle de bain privée", "Wifi"],
    },
  ];

  const defaultRates: PlatformRate[] = [
    {
      platformName: "Zirigo Direct",
      pricePerNight: 150,
      perks: ["Meilleur tarif garanti", "Annulation flexible", "Service VIP"],
      isBestPrice: true,
      bookingUrl: "",
    },
    {
      platformName: "Booking.com",
      pricePerNight: 185,
      perks: ["Tarif standard", "Paiement sur place"],
      isBestPrice: false,
      bookingUrl: "https://booking.com",
    },
    {
      platformName: "Airbnb",
      pricePerNight: 195,
      perks: ["Frais de service inclus"],
      isBestPrice: false,
      bookingUrl: "https://airbnb.com",
    },
  ];

  const newProperty: Property = {
    id,
    slug,
    title: data.title || "Nouvelle annonce Zirigo",
    description: data.description || "Description de la propriété.",
    type: (data.type as any) || "apartment",
    stars: data.stars ?? 4,
    rating: data.rating ?? 4.8,
    reviewCount: data.reviewCount ?? 0,
    city: data.city || "Paris",
    country: data.country || "France",
    address: data.address || "Adresse complète",
    latitude: data.latitude ?? 48.8566,
    longitude: data.longitude ?? 2.3522,
    featuredImage:
      data.featuredImage ||
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    images:
      data.images && data.images.length > 0
        ? data.images
        : [
            data.featuredImage ||
              "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
          ],
    amenities: data.amenities || ["wifi", "air_conditioning"],
    cancellationPolicy: data.cancellationPolicy || "flexible",
    checkInTime: data.checkInTime || "15:00",
    checkOutTime: data.checkOutTime || "11:00",
    isFeatured: !!data.isFeatured,
    rooms: data.rooms && data.rooms.length > 0 ? data.rooms : defaultRooms,
    rates: data.rates && data.rates.length > 0 ? data.rates : defaultRates,
    reviews: data.reviews || [],
  };

  const updatedList = [newProperty, ...list];
  saveAllProperties(updatedList);
  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const list = getAllProperties();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = list[index];

  // If slug is changed, ensure uniqueness
  let newSlug = current.slug;
  if (updates.slug && updates.slug !== current.slug) {
    newSlug = generateSlug(updates.slug);
    let counter = 1;
    const baseSlug = newSlug;
    while (list.some((p) => p.id !== id && p.slug === newSlug)) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const updatedProperty: Property = {
    ...current,
    ...updates,
    id: current.id,
    slug: newSlug,
  };

  list[index] = updatedProperty;
  saveAllProperties(list);
  return updatedProperty;
}

export function deleteProperty(id: string): boolean {
  const list = getAllProperties();
  const filtered = list.filter((p) => p.id !== id);
  if (filtered.length === list.length) return false;
  saveAllProperties(filtered);
  return true;
}

export function duplicateProperty(id: string): Property | null {
  const target = getPropertyById(id);
  if (!target) return null;

  const cloned: Partial<Property> = {
    ...target,
    id: `prop-${Date.now()}`,
    slug: `${target.slug}-copie-${Date.now().toString().slice(-4)}`,
    title: `${target.title} (Copie)`,
    isFeatured: false,
    reviewCount: 0,
    reviews: [],
  };

  return createProperty(cloned);
}

export function toggleFeatured(id: string): Property | null {
  const target = getPropertyById(id);
  if (!target) return null;
  return updateProperty(id, { isFeatured: !target.isFeatured });
}

export function resetPropertiesToDefault(): Property[] {
  saveAllProperties(PROPERTIES);
  return PROPERTIES;
}

// Bookings store
export function getAllBookings(): BookingRecord[] {
  try {
    const filePath = getBookingsFilePath();
    if (!fs.existsSync(filePath)) {
      saveAllBookings(INITIAL_BOOKINGS);
      return INITIAL_BOOKINGS;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryBookings = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("Error reading bookings.json:", err);
  }
  return memoryBookings;
}

export function saveAllBookings(bookingsList: BookingRecord[]): boolean {
  memoryBookings = bookingsList;
  try {
    const filePath = getBookingsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(bookingsList, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing bookings.json:", err);
    return false;
  }
}

export function createBooking(data: Omit<BookingRecord, "id" | "bookingReference" | "createdAt">): BookingRecord {
  const list = getAllBookings();
  const newBooking: BookingRecord = {
    ...data,
    id: `book-${Date.now()}`,
    bookingReference: `ZIR-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newBooking, ...list];
  saveAllBookings(updated);
  return newBooking;
}

export function updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled"): BookingRecord | null {
  const list = getAllBookings();
  const index = list.findIndex((b) => b.id === id);
  if (index === -1) return null;
  list[index].status = status;
  saveAllBookings(list);
  return list[index];
}

// Admin Statistics
export function getAdminStats() {
  const properties = getAllProperties();
  const bookings = getAllBookings();

  const totalProperties = properties.length;
  const featuredCount = properties.filter((p) => p.isFeatured).length;

  let totalPrices = 0;
  let priceCount = 0;
  let totalRating = 0;
  let totalReviews = 0;
  const cities = new Set<string>();
  const typeCounts: Record<string, number> = {
    villa: 0,
    hotel: 0,
    apartment: 0,
    chalet: 0,
    resort: 0,
  };

  properties.forEach((p) => {
    cities.add(`${p.city}, ${p.country}`);
    if (typeCounts[p.type] !== undefined) {
      typeCounts[p.type]++;
    } else {
      typeCounts[p.type] = 1;
    }

    totalRating += p.rating;
    totalReviews += p.reviewCount;

    const directRate = p.rates?.find((r) => r.platformName.toLowerCase().includes("direct"))?.pricePerNight;
    const lowestRate = p.rates?.[0]?.pricePerNight || p.rooms?.[0]?.basePricePerNight || 0;
    const finalPrice = directRate || lowestRate;
    if (finalPrice > 0) {
      totalPrices += finalPrice;
      priceCount++;
    }
  });

  const avgPrice = priceCount > 0 ? Math.round(totalPrices / priceCount) : 0;
  const avgRating = totalProperties > 0 ? Number((totalRating / totalProperties).toFixed(2)) : 0;

  return {
    totalProperties,
    featuredCount,
    avgPrice,
    avgRating,
    totalReviews,
    citiesCount: cities.size,
    typeCounts,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    recentProperties: properties.slice(0, 5),
  };
}

export interface PlatformRate {
  platformName: string;
  pricePerNight: number;
  perks: string[];
  isBestPrice: boolean;
  bookingUrl: string;
}

export interface RoomUnit {
  id: string;
  title: string;
  description: string;
  capacityGuests: number;
  capacityBedrooms: number;
  capacityBeds: number;
  capacityBathrooms: number;
  basePricePerNight: number;
  cleaningFee: number;
  images: string[];
  amenities: string[];
}

export interface PropertyReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorCountry: string;
  rating: number;
  comment: string;
  date: string;
}

export type PropertyType = "hotel" | "apartment" | "villa" | "chalet" | "resort" | "dormitory";

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  stars: number;
  rating: number;
  reviewCount: number;
  city: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  featuredImage: string;
  images: string[];
  amenities: string[];
  cancellationPolicy: "flexible" | "moderate" | "strict";
  checkInTime: string;
  checkOutTime: string;
  isFeatured: boolean;
  autoBlockOnAccept?: boolean;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  rooms: RoomUnit[];
  rates: PlatformRate[];
  reviews: PropertyReview[];
}

export interface BookingSubmission {
  propertyId: string;
  roomId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  specialRequests?: string;
  totalAmount: number;
}

export type AuthProviderType = "email" | "google" | "facebook" | "apple";
export type CurrencyCode = "DZD" | "EUR" | "USD" | "GBP";
export type LanguageCode = "fr" | "en" | "ar";
export type ThemeMode = "light" | "dark";

export interface UserPreferences {
  preferredCurrency: CurrencyCode;
  preferredLanguage: LanguageCode;
  preferredTheme: ThemeMode;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "user" | "admin";
  provider: AuthProviderType;
  isVerified: boolean;
  preferredCurrency?: CurrencyCode;
  preferredLanguage?: LanguageCode;
  preferredTheme?: ThemeMode;
  createdAt: string;
}

export interface SearchAlert {
  id: string;
  userId: string;
  name: string;
  query?: string;
  propertyType: "all" | PropertyType;
  maxPricePerNight?: number;
  minRating?: number;
  minGuests?: number;
  amenities: string[];
  frequency: "instant" | "daily" | "weekly";
  channel: "email" | "in_app" | "both";
  isActive: boolean;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  alertId: string;
  alertName: string;
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  propertyCity: string;
  pricePerNight: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type AdPlacement = "main" | "side";

export interface LocalizedText {
  fr: string;
  en: string;
  ar: string;
}

export type AvailabilityBlockReason =
  | "accepted_booking"
  | "external_offer"
  | "maintenance"
  | "owner_block";

export interface AvailabilityBlock {
  id: string;
  propertyId: string;
  startDate: string; // YYYY-MM-DD (inclusive start/check-in)
  endDate: string;   // YYYY-MM-DD (exclusive checkout)
  reason: AvailabilityBlockReason;
  source: "zirigo_booking" | "manual_owner" | "manual_admin";
  bookingId?: string;
  note?: string;
  createdBy?: string;
  createdAt: string;
}

export interface AdBanner {
  id: string;
  placement: AdPlacement;
  brandName: string;
  badgeText: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  ctaText: LocalizedText;
  contactOrPromo?: string;
  imageUrl: string;
  targetUrl: string;
  filterType?: "all" | PropertyType;
  accentColor?: string;
  isFullArtwork?: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
}

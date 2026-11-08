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

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: "hotel" | "apartment" | "villa" | "chalet" | "resort";
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

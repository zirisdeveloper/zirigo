import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  doublePrecision,
  jsonb,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  role: varchar("role", { length: 50 }).default("guest").notNull(), // 'guest' | 'host' | 'admin'
  avatarUrl: text("avatar_url"),
  phone: varchar("phone", { length: 50 }),
  preferredCurrency: varchar("preferred_currency", { length: 10 }).default("DZD").notNull(),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("fr").notNull(),
  preferredTheme: varchar("preferred_theme", { length: 20 }).default("light").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Properties (Accommodations) Table
export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 100 }).notNull(), // 'hotel' | 'apartment' | 'villa' | 'chalet' | 'resort'
  stars: integer("stars").default(4),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.80").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  featuredImage: text("featured_image").notNull(),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
  cancellationPolicy: varchar("cancellation_policy", { length: 100 }).default("flexible").notNull(),
  checkInTime: varchar("check_in_time", { length: 20 }).default("15:00").notNull(),
  checkOutTime: varchar("check_out_time", { length: 20 }).default("11:00").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  autoBlockOnAccept: boolean("auto_block_on_accept").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Rooms / Units Table
export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  capacityGuests: integer("capacity_guests").default(2).notNull(),
  capacityBedrooms: integer("capacity_bedrooms").default(1).notNull(),
  capacityBeds: integer("capacity_beds").default(1).notNull(),
  capacityBathrooms: integer("capacity_bathrooms").default(1).notNull(),
  basePricePerNight: numeric("base_price_per_night", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EUR").notNull(),
  cleaningFee: numeric("cleaning_fee", { precision: 10, scale: 2 }).default("0.00").notNull(),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Platform Rates (Comparison Matrix Table)
export const platformRates = pgTable("platform_rates", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "set null" }),
  platformName: varchar("platform_name", { length: 100 }).notNull(), // 'Zirigo Direct', 'Booking.com', 'Airbnb', 'Agoda', 'Expedia'
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EUR").notNull(),
  bookingUrl: text("booking_url"),
  perks: jsonb("perks").$type<string[]>().default([]).notNull(),
  isBestPrice: boolean("is_best_price").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Bookings / Reservations Table
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingReference: varchar("booking_reference", { length: 50 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "set null" }),
  guestName: varchar("guest_name", { length: 255 }).notNull(),
  guestEmail: varchar("guest_email", { length: 255 }).notNull(),
  guestPhone: varchar("guest_phone", { length: 50 }),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  guestsCount: integer("guests_count").default(1).notNull(),
  nightsCount: integer("nights_count").notNull(),
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }).notNull(),
  serviceFee: numeric("service_fee", { precision: 10, scale: 2 }).default("0.00").notNull(),
  taxes: numeric("taxes", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EUR").notNull(),
  status: varchar("status", { length: 50 }).default("confirmed").notNull(), // 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: varchar("payment_status", { length: 50 }).default("paid").notNull(), // 'unpaid' | 'paid' | 'refunded'
  platformSource: varchar("platform_source", { length: 100 }).default("Zirigo Direct").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Reviews Table
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorAvatar: text("author_avatar"),
  authorCountry: varchar("author_country", { length: 100 }),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull(),
  cleanlinessRating: numeric("cleanliness_rating", { precision: 3, scale: 2 }),
  locationRating: numeric("location_rating", { precision: 3, scale: 2 }),
  valueRating: numeric("value_rating", { precision: 3, scale: 2 }),
  serviceRating: numeric("service_rating", { precision: 3, scale: 2 }),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Property Availability Blocks Table
export const availabilityBlocks = pgTable("availability_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  startDate: varchar("start_date", { length: 10 }).notNull(),
  endDate: varchar("end_date", { length: 10 }).notNull(),
  reason: varchar("reason", { length: 50 }).default("external_offer").notNull(),
  source: varchar("source", { length: 50 }).default("manual_owner").notNull(),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  note: text("note"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const propertiesRelations = relations(properties, ({ many }) => ({
  rooms: many(rooms),
  platformRates: many(platformRates),
  bookings: many(bookings),
  reviews: many(reviews),
  availabilityBlocks: many(availabilityBlocks),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  property: one(properties, {
    fields: [rooms.propertyId],
    references: [properties.id],
  }),
  rates: many(platformRates),
  bookings: many(bookings),
}));

export const platformRatesRelations = relations(platformRates, ({ one }) => ({
  property: one(properties, {
    fields: [platformRates.propertyId],
    references: [properties.id],
  }),
  room: one(rooms, {
    fields: [platformRates.roomId],
    references: [rooms.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  property: one(properties, {
    fields: [bookings.propertyId],
    references: [properties.id],
  }),
  room: one(rooms, {
    fields: [bookings.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const availabilityBlocksRelations = relations(availabilityBlocks, ({ one }) => ({
  property: one(properties, {
    fields: [availabilityBlocks.propertyId],
    references: [properties.id],
  }),
  booking: one(bookings, {
    fields: [availabilityBlocks.bookingId],
    references: [bookings.id],
  }),
}));

// 8. Site Homepage Display Settings Table
export const siteDisplaySettings = pgTable("site_display_settings", {
  id: varchar("id", { length: 50 }).default("default").primaryKey(),
  showHeaderMenuButton: boolean("show_header_menu_button").default(true).notNull(),
  showAdsSection: boolean("show_ads_section").default(true).notNull(),
  showCategoryIconsSection: boolean("show_category_icons_section").default(true).notNull(),
  showHeroHeader: boolean("show_hero_header").default(true).notNull(),
  showTypeTabs: boolean("show_type_tabs").default(true).notNull(),
  showTrustBanner: boolean("show_trust_banner").default(true).notNull(),
  socialFacebookUrl: varchar("social_facebook_url", { length: 500 }).default("https://facebook.com").notNull(),
  socialInstagramUrl: varchar("social_instagram_url", { length: 500 }).default("https://instagram.com").notNull(),
  socialLinkedInUrl: varchar("social_linkedin_url", { length: 500 }).default("https://linkedin.com").notNull(),
  customTextsJson: jsonb("custom_texts_json"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 9. Site Contact Page Settings Table
export const siteContactSettings = pgTable("site_contact_settings", {
  id: varchar("id", { length: 50 }).default("default").primaryKey(),
  phoneValue: varchar("phone_value", { length: 100 }).notNull(),
  emailValue: varchar("email_value", { length: 150 }).notNull(),
  showMap: boolean("show_map").default(true).notNull(),
  mapProvider: varchar("map_provider", { length: 30 }).default("openstreetmap").notNull(),
  mapAddressQuery: varchar("map_address_query", { length: 255 }).notNull(),
  mapLat: doublePrecision("map_lat").notNull(),
  mapLng: doublePrecision("map_lng").notNull(),
  mapZoom: integer("map_zoom").default(14).notNull(),
  mapExternalUrl: text("map_external_url").default("").notNull(),
  customTextsJson: jsonb("custom_texts_json"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

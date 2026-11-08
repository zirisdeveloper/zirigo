import { db } from "./index.js";
import { users, properties, rooms, platformRates, reviews } from "./schema/index.js";

export const mockPropertiesData = [
  {
    title: "Villa Luminescence & Infinity Pool",
    slug: "villa-luminescence-cassis",
    type: "villa",
    stars: 5,
    rating: "4.96",
    reviewCount: 142,
    city: "Cassis",
    country: "France",
    address: "Route des Crêtes, 13260 Cassis",
    latitude: 43.214,
    longitude: 5.539,
    description: "Suspended above the Mediterranean azure cliffs, Villa Luminescence combines panoramic calanque sea views, private heated infinity pool, expansive teak decks, and minimalist French Riviera architectural refinement.",
    featuredImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["ocean_view", "pool", "wifi", "air_conditioning", "free_parking", "kitchen", "terrace", "bbq", "concierge"],
    cancellationPolicy: "flexible",
    checkInTime: "16:00",
    checkOutTime: "11:00",
    isFeatured: true,
    rooms: [
      {
        title: "Master Sea-View Suite",
        description: "King bed, private terrace, freestanding soaking tub overlooking the Mediterranean.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: "420.00",
        cleaningFee: "60.00",
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["King Bed", "Sea View", "Private Bath", "Balcony"]
      },
      {
        title: "Entire Private Luxury Estate (4 Bedrooms)",
        description: "Full private access to the 4-bedroom villa, heated infinity pool, private cinema and garden.",
        capacityGuests: 8,
        capacityBedrooms: 4,
        capacityBeds: 5,
        capacityBathrooms: 4,
        basePricePerNight: "1150.00",
        cleaningFee: "180.00",
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Heated Pool", "Chef Kitchen", "Private Garden", "Cinema Room"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: "389.00",
        perks: ["Best Price Guarantee", "Free Welcome Champagne", "No Booking Fees", "Free Cancellation up to 48h"],
        isBestPrice: true,
        bookingUrl: "#"
      },
      {
        platformName: "Booking.com",
        pricePerNight: "445.00",
        perks: ["Genius Discount", "Free Cancellation"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Airbnb",
        pricePerNight: "462.00",
        perks: ["AirCover Included", "Superhost"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      },
      {
        platformName: "Expedia",
        pricePerNight: "450.00",
        perks: ["Member Points", "Standard Cancellation"],
        isBestPrice: false,
        bookingUrl: "https://expedia.com"
      }
    ]
  },
  {
    title: "Le Marais Designer Loft & Rooftop",
    slug: "le-marais-designer-loft-paris",
    type: "apartment",
    stars: 4,
    rating: "4.89",
    reviewCount: 98,
    city: "Paris",
    country: "France",
    address: "Rue des Francs-Bourgeois, 75004 Paris",
    latitude: 48.857,
    longitude: 2.362,
    description: "Centrally located in the historic heart of Le Marais. Featuring soaring exposed beam ceilings, contemporary curated artwork, custom Italian kitchen, and a private zinc rooftop terrace overlooking Parisian chimneys.",
    featuredImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["wifi", "air_conditioning", "kitchen", "elevator", "terrace", "coffee_machine", "workspace"],
    cancellationPolicy: "flexible",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    isFeatured: true,
    rooms: [
      {
        title: "Penthouse Loft with Rooftop",
        description: "Entire 85m² Parisian loft with mezzanine master bedroom and sunny private terrace.",
        capacityGuests: 3,
        capacityBedrooms: 1,
        capacityBeds: 2,
        capacityBathrooms: 1,
        basePricePerNight: "245.00",
        cleaningFee: "45.00",
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Rooftop Access", "High-speed Fiber", "Espresso Bar"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: "229.00",
        perks: ["Direct Host Contact", "Zero Service Fees", "Free Late Checkout upon availability"],
        isBestPrice: true,
        bookingUrl: "#"
      },
      {
        platformName: "Airbnb",
        pricePerNight: "278.00",
        perks: ["Self check-in"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      },
      {
        platformName: "Booking.com",
        pricePerNight: "265.00",
        perks: ["Instant Confirmation"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      }
    ]
  },
  {
    title: "Chalet Mont-Blanc Alpine Lodge & Spa",
    slug: "chalet-mont-blanc-chamonix",
    type: "chalet",
    stars: 5,
    rating: "4.98",
    reviewCount: 76,
    city: "Chamonix-Mont-Blanc",
    country: "France",
    address: "Chemin des Gravelles, 74400 Chamonix",
    latitude: 45.923,
    longitude: 6.869,
    description: "Ski-in / ski-out luxury timber sanctuary nestled at the foot of Mont Blanc. Boasts an outdoor cedar hot tub, Finnish sauna, roaring central fireplace, and unobstructed views of the Aiguille du Midi.",
    featuredImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["spa", "ski_in_out", "fireplace", "wifi", "free_parking", "hot_tub", "breakfast", "mountain_view"],
    cancellationPolicy: "moderate",
    checkInTime: "16:00",
    checkOutTime: "10:00",
    isFeatured: true,
    rooms: [
      {
        title: "Glacier Deluxe Chalet Suite",
        description: "Cedar-clad bedroom with direct panoramic mountain balcony, private sauna and fire stove.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: "390.00",
        cleaningFee: "50.00",
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Private Sauna", "Mountain View", "Fireplace"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: "349.00",
        perks: ["Best Price Guaranteed", "Complimentary Mountain Breakfast", "Ski Storage Pass"],
        isBestPrice: true,
        bookingUrl: "#"
      },
      {
        platformName: "Agoda",
        pricePerNight: "398.00",
        perks: ["Agoda Cash Points"],
        isBestPrice: false,
        bookingUrl: "https://agoda.com"
      },
      {
        platformName: "Booking.com",
        pricePerNight: "410.00",
        perks: ["Genius discount"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      }
    ]
  },
  {
    title: "The Grand Royal Palace & Botanical Gardens",
    slug: "grand-royal-palace-marrakech",
    type: "resort",
    stars: 5,
    rating: "4.92",
    reviewCount: 310,
    city: "Marrakech",
    country: "Morocco",
    address: "Palmeraie Ouest, 40000 Marrakech",
    latitude: 31.652,
    longitude: -7.981,
    description: "An authentic oasis of peace set in a 5-hectare palm grove. Traditional Moorish architecture, artisan zellige tilework, two heated lap pools, Michelin-inspired dining, and a world-class hammam spa.",
    featuredImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["pool", "spa", "restaurant", "breakfast", "wifi", "free_parking", "air_conditioning", "fitness_center"],
    cancellationPolicy: "flexible",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    isFeatured: true,
    rooms: [
      {
        title: "Royal Palm Pavilion",
        description: "Spacious private villa pavilion with enclosed courtyard, plunge pool and marble bathroom.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: "310.00",
        cleaningFee: "0.00",
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Plunge Pool", "Gourmet Breakfast", "Courtyard"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: "285.00",
        perks: ["Best Price Guaranteed", "Complimentary Traditional Hammam Session", "Free Airport Transfer"],
        isBestPrice: true,
        bookingUrl: "#"
      },
      {
        platformName: "Booking.com",
        pricePerNight: "320.00",
        perks: ["Free Breakfast"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Expedia",
        pricePerNight: "335.00",
        perks: ["VIP Access"],
        isBestPrice: false,
        bookingUrl: "https://expedia.com"
      }
    ]
  },
  {
    title: "Amalfi Coastline Cliffside Haven",
    slug: "amalfi-coastline-haven-positano",
    type: "hotel",
    stars: 5,
    rating: "4.94",
    reviewCount: 185,
    city: "Positano",
    country: "Italy",
    address: "Via Cristoforo Colombo, 84017 Positano",
    latitude: 40.628,
    longitude: 14.485,
    description: "Carved into Positano’s iconic sheer cliffs. Every terrace delivers uninterrupted views of colorful cascading villas and the turquoise Tyrrhenian Sea. Direct private cliff elevator to beach.",
    featuredImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["ocean_view", "restaurant", "breakfast", "bar", "wifi", "air_conditioning", "beach_access"],
    cancellationPolicy: "moderate",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    isFeatured: true,
    rooms: [
      {
        title: "Superior Cliff Balcony Room",
        description: "Hand-painted ceramic tiles, king bed and bougainvillea-framed balcony directly over the sea.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: "460.00",
        cleaningFee: "0.00",
        images: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Panoramic Balcony", "Italian Breakfast", "Beach Club Access"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: "415.00",
        perks: ["Best Price Guarantee", "Free Sunset Spritz & Tapas", "Flexible Check-in"],
        isBestPrice: true,
        bookingUrl: "#"
      },
      {
        platformName: "Booking.com",
        pricePerNight: "480.00",
        perks: ["Genius discount"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Airbnb",
        pricePerNight: "495.00",
        perks: ["Standard rate"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      }
    ]
  },
  {
    title: "Algiers Bay Panoramic Waterfront Residence",
    slug: "algiers-bay-waterfront-residence",
    type: "apartment",
    stars: 4,
    rating: "4.86",
    reviewCount: 64,
    city: "Algiers",
    country: "Algeria",
    address: "Boulevard Che Guevara, 16000 Alger",
    latitude: 36.775,
    longitude: 3.060,
    description: "Haussmannian style high-ceiling residence overlooking the glistening Bay of Algiers and the port. Minutes from the historical Casbah, offering contemporary amenities and sea breeze.",
    featuredImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["ocean_view", "wifi", "air_conditioning", "kitchen", "workspace", "elevator", "free_parking"],
    cancellationPolicy: "flexible",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    isFeatured: true,
    rooms: [
      {
        title: "Bay View Executive Suite",
        description: "2 bedrooms, grand salon with French windows, full kitchen, high-speed fiber internet.",
        capacityGuests: 4,
        capacityBedrooms: 2,
        capacityBeds: 3,
        capacityBathrooms: 2,
        basePricePerNight: "120.00",
        cleaningFee: "25.00",
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Sea View", "Full Kitchen", "High-speed WiFi"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: "105.00",
        perks: ["Best Price Guarantee", "Free Traditional Pastries & Mint Tea", "Zero Fees"],
        isBestPrice: true,
        bookingUrl: "#"
      },
      {
        platformName: "Booking.com",
        pricePerNight: "129.00",
        perks: ["Free cancellation"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Airbnb",
        pricePerNight: "135.00",
        perks: ["Superhost"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      }
    ]
  }
];

export async function seed() {
  console.log("🌱 Starting Zirigo database seed...");

  for (const item of mockPropertiesData) {
    const { rooms: propRooms, rates: propRates, ...propData } = item;

    // Insert property
    const [insertedProp] = await db.insert(properties).values(propData).returning();

    // Insert rooms
    for (const r of propRooms) {
      await db.insert(rooms).values({
        propertyId: insertedProp.id,
        ...r,
      });
    }

    // Insert comparison rates
    for (const rate of propRates) {
      await db.insert(platformRates).values({
        propertyId: insertedProp.id,
        ...rate,
      });
    }

    // Insert a sample review
    await db.insert(reviews).values({
      propertyId: insertedProp.id,
      authorName: "Sophie Laurent",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      authorCountry: "France",
      rating: "5.00",
      cleanlinessRating: "5.00",
      locationRating: "5.00",
      valueRating: "4.90",
      serviceRating: "5.00",
      comment: "An exceptional stay! We compared prices on Zirigo and saved over 15% compared to other platforms. The place was spotless, check-in was seamless, and the views were breathtaking.",
    });
  }

  console.log("✅ Seed completed successfully!");
}

if (process.argv[1]?.endsWith("seed.ts")) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}

import { Property } from "./types";
import { matchesPropertyQuery, matchesPropertyCategory } from "./searchUtils";

export const PROPERTIES: Property[] = [
  {
    id: "prop-1",
    slug: "villa-luminescence-cassis",
    title: "Villa Luminescence & Infinity Pool",
    description: "Suspended above the Mediterranean azure cliffs, Villa Luminescence combines panoramic calanque sea views, private heated infinity pool, expansive teak decks, and minimalist French Riviera architectural refinement.",
    type: "villa",
    stars: 5,
    rating: 4.96,
    reviewCount: 142,
    city: "Cassis",
    country: "France",
    address: "Route des Crêtes, 13260 Cassis",
    latitude: 43.214,
    longitude: 5.539,
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
        id: "room-1-1",
        title: "Master Sea-View Suite",
        description: "King bed, private terrace, freestanding soaking tub overlooking the Mediterranean.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: 389,
        cleaningFee: 60,
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["King Bed", "Sea View", "Private Bath", "Balcony"]
      },
      {
        id: "room-1-2",
        title: "Entire Private Luxury Estate (4 Bedrooms)",
        description: "Full private access to the 4-bedroom villa, heated infinity pool, private cinema and garden.",
        capacityGuests: 8,
        capacityBedrooms: 4,
        capacityBeds: 5,
        capacityBathrooms: 4,
        basePricePerNight: 1150,
        cleaningFee: 180,
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Heated Pool", "Chef Kitchen", "Private Garden", "Cinema Room"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: 389,
        perks: ["Best Price Guarantee", "Free Welcome Champagne", "No Booking Fees", "Free Cancellation up to 48h"],
        isBestPrice: true,
        bookingUrl: "#book"
      },
      {
        platformName: "Booking.com",
        pricePerNight: 445,
        perks: ["Genius Discount", "Free Cancellation"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Airbnb",
        pricePerNight: 462,
        perks: ["AirCover Included", "Superhost"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      },
      {
        platformName: "Expedia",
        pricePerNight: 450,
        perks: ["Member Points", "Standard Cancellation"],
        isBestPrice: false,
        bookingUrl: "https://expedia.com"
      }
    ],
    reviews: [
      {
        id: "rev-1",
        authorName: "Éléonore de Montmirail",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        authorCountry: "France",
        rating: 5,
        comment: "Un séjour inoubliable ! Les calanques sous nos yeux au coucher du soleil depuis la piscine à débordement. La réservation sur Zirigo nous a fait économiser plus de 150€ par rapport à Airbnb.",
        date: "Mai 2026"
      },
      {
        id: "rev-2",
        authorName: "Marcus Sterling",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        authorCountry: "United Kingdom",
        rating: 5,
        comment: "Flawless hospitality. The comparison matrix was spot on — booked direct through Zirigo and got free champagne and late checkout.",
        date: "Avril 2026"
      }
    ]
  },
  {
    id: "prop-2",
    slug: "le-marais-designer-loft-paris",
    title: "Le Marais Designer Loft & Rooftop",
    description: "Centrally located in the historic heart of Le Marais. Featuring soaring exposed beam ceilings, contemporary curated artwork, custom Italian kitchen, and a private zinc rooftop terrace overlooking Parisian chimneys.",
    type: "apartment",
    stars: 4,
    rating: 4.89,
    reviewCount: 98,
    city: "Paris",
    country: "France",
    address: "Rue des Francs-Bourgeois, 75004 Paris",
    latitude: 48.857,
    longitude: 2.362,
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
        id: "room-2-1",
        title: "Penthouse Loft with Rooftop",
        description: "Entire 85m² Parisian loft with mezzanine master bedroom and sunny private terrace.",
        capacityGuests: 3,
        capacityBedrooms: 1,
        capacityBeds: 2,
        capacityBathrooms: 1,
        basePricePerNight: 229,
        cleaningFee: 45,
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Rooftop Access", "High-speed Fiber", "Espresso Bar"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: 229,
        perks: ["Direct Host Contact", "Zero Service Fees", "Free Late Checkout upon availability"],
        isBestPrice: true,
        bookingUrl: "#book"
      },
      {
        platformName: "Booking.com",
        pricePerNight: 265,
        perks: ["Instant Confirmation"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Airbnb",
        pricePerNight: 278,
        perks: ["Self check-in"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      }
    ],
    reviews: [
      {
        id: "rev-3",
        authorName: "Camille V.",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        authorCountry: "Belgique",
        rating: 5,
        comment: "Idéal pour un week-end parisien raffiné. Tout est à deux pas des galeries et cafés. Literie d'un confort absolu.",
        date: "Juin 2026"
      }
    ]
  },
  {
    id: "prop-3",
    slug: "chalet-mont-blanc-chamonix",
    title: "Chalet Mont-Blanc Alpine Lodge & Spa",
    description: "Ski-in / ski-out luxury timber sanctuary nestled at the foot of Mont Blanc. Boasts an outdoor cedar hot tub, Finnish sauna, roaring central fireplace, and unobstructed views of the Aiguille du Midi.",
    type: "chalet",
    stars: 5,
    rating: 4.98,
    reviewCount: 76,
    city: "Chamonix-Mont-Blanc",
    country: "France",
    address: "Chemin des Gravelles, 74400 Chamonix",
    latitude: 45.923,
    longitude: 6.869,
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
        id: "room-3-1",
        title: "Glacier Deluxe Chalet Suite",
        description: "Cedar-clad bedroom with direct panoramic mountain balcony, private sauna and fire stove.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: 349,
        cleaningFee: 50,
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Private Sauna", "Mountain View", "Fireplace"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: 349,
        perks: ["Best Price Guaranteed", "Complimentary Mountain Breakfast", "Ski Storage Pass"],
        isBestPrice: true,
        bookingUrl: "#book"
      },
      {
        platformName: "Agoda",
        pricePerNight: 398,
        perks: ["Agoda Cash Points"],
        isBestPrice: false,
        bookingUrl: "https://agoda.com"
      },
      {
        platformName: "Booking.com",
        pricePerNight: 410,
        perks: ["Genius discount"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      }
    ],
    reviews: [
      {
        id: "rev-4",
        authorName: "Hans Zimmerli",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        authorCountry: "Suisse",
        rating: 5,
        comment: "Bain norvégien avec vue sur le Mont-Blanc après une journée de ski, c'était tout simplement magique.",
        date: "Février 2026"
      }
    ]
  },
  {
    id: "prop-4",
    slug: "grand-royal-palace-marrakech",
    title: "The Grand Royal Palace & Botanical Gardens",
    description: "An authentic oasis of peace set in a 5-hectare palm grove. Traditional Moorish architecture, artisan zellige tilework, two heated lap pools, Michelin-inspired dining, and a world-class hammam spa.",
    type: "resort",
    stars: 5,
    rating: 4.92,
    reviewCount: 310,
    city: "Marrakech",
    country: "Morocco",
    address: "Palmeraie Ouest, 40000 Marrakech",
    latitude: 31.652,
    longitude: -7.981,
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
        id: "room-4-1",
        title: "Royal Palm Pavilion",
        description: "Spacious private villa pavilion with enclosed courtyard, plunge pool and marble bathroom.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: 285,
        cleaningFee: 0,
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Plunge Pool", "Gourmet Breakfast", "Courtyard"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: 285,
        perks: ["Best Price Guaranteed", "Complimentary Traditional Hammam Session", "Free Airport Transfer"],
        isBestPrice: true,
        bookingUrl: "#book"
      },
      {
        platformName: "Booking.com",
        pricePerNight: 320,
        perks: ["Free Breakfast"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Expedia",
        pricePerNight: 335,
        perks: ["VIP Access"],
        isBestPrice: false,
        bookingUrl: "https://expedia.com"
      }
    ],
    reviews: [
      {
        id: "rev-5",
        authorName: "Nadia Benali",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        authorCountry: "Algérie",
        rating: 5,
        comment: "Un havre de paix extraordinaire dans la palmeraie. Le service est aux petits soins, et les tarifs Zirigo nous ont offert le transfert aéroport gratuit.",
        date: "Mars 2026"
      }
    ]
  },
  {
    id: "prop-5",
    slug: "amalfi-coastline-haven-positano",
    title: "Amalfi Coastline Cliffside Haven",
    description: "Carved into Positano’s iconic sheer cliffs. Every terrace delivers uninterrupted views of colorful cascading villas and the turquoise Tyrrhenian Sea. Direct private cliff elevator to beach.",
    type: "hotel",
    stars: 5,
    rating: 4.94,
    reviewCount: 185,
    city: "Positano",
    country: "Italy",
    address: "Via Cristoforo Colombo, 84017 Positano",
    latitude: 40.628,
    longitude: 14.485,
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
        id: "room-5-1",
        title: "Superior Cliff Balcony Room",
        description: "Hand-painted ceramic tiles, king bed and bougainvillea-framed balcony directly over the sea.",
        capacityGuests: 2,
        capacityBedrooms: 1,
        capacityBeds: 1,
        capacityBathrooms: 1,
        basePricePerNight: 415,
        cleaningFee: 0,
        images: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Panoramic Balcony", "Italian Breakfast", "Beach Club Access"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: 415,
        perks: ["Best Price Guarantee", "Free Sunset Spritz & Tapas", "Flexible Check-in"],
        isBestPrice: true,
        bookingUrl: "#book"
      },
      {
        platformName: "Booking.com",
        pricePerNight: 480,
        perks: ["Genius discount"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Airbnb",
        pricePerNight: 495,
        perks: ["Standard rate"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      }
    ],
    reviews: [
      {
        id: "rev-6",
        authorName: "Lorenzo Rossi",
        authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        authorCountry: "Italia",
        rating: 5,
        comment: "Vista spettacolare! Svegliarsi davanti ai colori di Positano non ha prezzo. Ottima comparazione delle tariffe.",
        date: "Luglio 2026"
      }
    ]
  },
  {
    id: "prop-6",
    slug: "algiers-bay-waterfront-residence",
    title: "Algiers Bay Panoramic Waterfront Residence",
    description: "Haussmannian style high-ceiling residence overlooking the glistening Bay of Algiers and the port. Minutes from the historical Casbah, offering contemporary amenities and sea breeze.",
    type: "apartment",
    stars: 4,
    rating: 4.86,
    reviewCount: 64,
    city: "Algiers",
    country: "Algeria",
    address: "Boulevard Che Guevara, 16000 Alger",
    latitude: 36.775,
    longitude: 3.060,
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
        id: "room-6-1",
        title: "Bay View Executive Suite",
        description: "2 bedrooms, grand salon with French windows, full kitchen, high-speed fiber internet.",
        capacityGuests: 4,
        capacityBedrooms: 2,
        capacityBeds: 3,
        capacityBathrooms: 2,
        basePricePerNight: 105,
        cleaningFee: 25,
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80"],
        amenities: ["Sea View", "Full Kitchen", "High-speed WiFi"]
      }
    ],
    rates: [
      {
        platformName: "Zirigo Direct",
        pricePerNight: 105,
        perks: ["Best Price Guarantee", "Free Traditional Pastries & Mint Tea", "Zero Fees"],
        isBestPrice: true,
        bookingUrl: "#book"
      },
      {
        platformName: "Booking.com",
        pricePerNight: 129,
        perks: ["Free cancellation"],
        isBestPrice: false,
        bookingUrl: "https://booking.com"
      },
      {
        platformName: "Airbnb",
        pricePerNight: 135,
        perks: ["Superhost"],
        isBestPrice: false,
        bookingUrl: "https://airbnb.com"
      }
    ],
    reviews: [
      {
        id: "rev-7",
        authorName: "Karim Mansouri",
        authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        authorCountry: "Algérie",
        rating: 5,
        comment: "Appartement exceptionnel sur le front de mer d'Alger, accueil chaleureux et vue splendide. La plateforme Zirigo est claire et très avantageuse !",
        date: "Août 2026"
      }
    ]
  }
];

export function getProperties(filter?: {
  query?: string;
  type?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  sortBy?: "price_asc" | "price_desc" | "rating" | "popular";
}): Property[] {
  let list = [...PROPERTIES];

  if (filter?.query && filter.query.trim().length > 0) {
    list = list.filter((p) => matchesPropertyQuery(p, filter.query!));
  }

  if (filter?.type) {
    list = list.filter((p) => matchesPropertyCategory(p, filter.type!));
  }

  if (filter?.minPrice !== undefined) {
    list = list.filter((p) => {
      const bestRate = Math.min(...p.rates.map((r) => r.pricePerNight));
      return bestRate >= (filter.minPrice ?? 0);
    });
  }

  if (filter?.maxPrice !== undefined) {
    list = list.filter((p) => {
      const bestRate = Math.min(...p.rates.map((r) => r.pricePerNight));
      return bestRate <= (filter.maxPrice ?? 99999);
    });
  }

  if (filter?.minRating !== undefined) {
    list = list.filter((p) => p.rating >= (filter.minRating ?? 0));
  }

  if (filter?.amenities && filter.amenities.length > 0) {
    list = list.filter((p) =>
      filter.amenities!.every((amenity) => p.amenities.includes(amenity))
    );
  }

  if (filter?.sortBy) {
    switch (filter.sortBy) {
      case "price_asc":
        list.sort(
          (a, b) =>
            Math.min(...a.rates.map((r) => r.pricePerNight)) -
            Math.min(...b.rates.map((r) => r.pricePerNight))
        );
        break;
      case "price_desc":
        list.sort(
          (a, b) =>
            Math.min(...b.rates.map((r) => r.pricePerNight)) -
            Math.min(...a.rates.map((r) => r.pricePerNight))
        );
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  }

  return list;
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}

export function getPropertyById(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}

// Currency Conversion Utility
export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  DZD: "DZD ",
  GBP: "£",
};

export const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1.0,
  USD: 1.08,
  DZD: 145.0,
  GBP: 0.85,
};

export const DEFAULT_CURRENCY = "DZD";

export function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY): string {
  const rate = EXCHANGE_RATES[currency] || 1.0;
  const converted = Math.round(amount * rate);
  const formattedNumber = converted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const symbol = CURRENCY_SYMBOLS[currency] || "€";

  if (currency === "DZD") {
    return `${formattedNumber} DZD`;
  }
  return `${symbol}${formattedNumber}`;
}

import type { Language } from "./i18n";
import type { Property } from "./types";

// ============================================================================
// Domain Helpers (Types, Amenities, Policies, Perks, Demo Properties)
// ============================================================================

const PROPERTY_TYPE_LABELS: Record<string, Record<Language, string>> = {
  all: { en: "All", fr: "Tous", ar: "الكل" },
  villa: { en: "Villa", fr: "Villa", ar: "فيلا" },
  hotel: { en: "Hotel", fr: "Hôtel", ar: "فندق" },
  apartment: { en: "Apartment", fr: "Appartement", ar: "شقة" },
  chalet: { en: "Chalet", fr: "Chalet", ar: "شاليه" },
  resort: { en: "Resort & Spa", fr: "Resort & Spa", ar: "منتجع وسبا" },
  dormitory: { en: "Dormitories", fr: "Dortoirs", ar: "مهاجع ونزل" },
};

export function translatePropertyType(type: string, lang: Language): string {
  return PROPERTY_TYPE_LABELS[type]?.[lang] || type;
}

const AMENITY_LABELS: Record<string, Record<Language, string>> = {
  pool: { en: "Pool", fr: "Piscine", ar: "مسبح" },
  ocean_view: { en: "Sea View", fr: "Vue mer", ar: "إطلالة بحرية" },
  wifi: { en: "High-speed WiFi", fr: "WiFi haut débit", ar: "واي فاي سريع" },
  air_conditioning: { en: "Air Conditioning", fr: "Climatisation", ar: "تكييف هواء" },
  free_parking: { en: "Free Parking", fr: "Parking gratuit", ar: "موقف سيارات مجاني" },
  kitchen: { en: "Equipped Kitchen", fr: "Cuisine équipée", ar: "مطبخ مجهز" },
  terrace: { en: "Terrace / Balcony", fr: "Terrasse / Balcon", ar: "تراس / شرفة" },
  spa: { en: "Spa & Wellness", fr: "Spa & Bien-être", ar: "سبا وعافية" },
  hot_tub: { en: "Hot Tub / Jacuzzi", fr: "Jacuzzi", ar: "جاكوزي" },
  gym: { en: "Fitness Gym", fr: "Salle de sport", ar: "نادي رياضي" },
  fitness_center: { en: "Fitness Center", fr: "Centre de fitness", ar: "مركز لياقة بدنية" },
  bbq: { en: "BBQ Grill", fr: "Barbecue", ar: "شواء" },
  concierge: { en: "Concierge Service", fr: "Conciergerie", ar: "خدمة كونسيرج" },
  ski_in_out: { en: "Ski-in / Ski-out", fr: "Accès skis aux pieds", ar: "وصول مباشر للتزلج" },
  fireplace: { en: "Fireplace", fr: "Cheminée", ar: "مدفأة" },
  sauna: { en: "Sauna", fr: "Sauna", ar: "ساونا" },
  heated_floors: { en: "Heated Floors", fr: "Sol chauffant", ar: "تدفئة أرضية" },
  mountain_view: { en: "Mountain View", fr: "Vue montagne", ar: "إطلالة جبلية" },
  restaurant: { en: "Restaurant", fr: "Restaurant", ar: "مطعم" },
  breakfast: { en: "Breakfast Included", fr: "Petit-déjeuner", ar: "إفطار مشمول" },
  bar: { en: "Lounge Bar", fr: "Bar lounge", ar: "بار" },
  beach_access: { en: "Beach Access", fr: "Accès plage", ar: "وصول للشاطئ" },
  workspace: { en: "Workspace", fr: "Espace bureau", ar: "مساحة عمل" },
  elevator: { en: "Elevator", fr: "Ascenseur", ar: "مصعد" },
  rooftop: { en: "Private Rooftop", fr: "Toit-terrasse", ar: "سطح خاص" },
  coffee_machine: { en: "Espresso Machine", fr: "Machine à café", ar: "ماكينة قهوة" },
  washer: { en: "Washing Machine", fr: "Lave-linge", ar: "غسالة ملابس" },
  garden: { en: "Private Garden", fr: "Jardin privé", ar: "حديقة خاصة" },
};

export function translateAmenity(amenity: string, lang: Language): string {
  return AMENITY_LABELS[amenity]?.[lang] || amenity.replace(/_/g, " ");
}

const CANCELLATION_LABELS: Record<string, Record<Language, string>> = {
  flexible: { en: "Flexible", fr: "Flexible", ar: "مرنة (مجانية)" },
  moderate: { en: "Moderate", fr: "Modérée", ar: "معتدلة" },
  strict: { en: "Strict", fr: "Stricte", ar: "صارمة" },
};

export function translateCancellation(policy: string, lang: Language): string {
  return CANCELLATION_LABELS[policy]?.[lang] || policy;
}

const RATE_PERK_LABELS: Record<string, Record<Language, string>> = {
  "Best Price Guarantee": {
    en: "Best Price Guarantee",
    fr: "Meilleur Prix Garanti",
    ar: "ضمان أفضل سعر",
  },
  "Free Welcome Wine & Breakfast": {
    en: "Free Welcome Wine & Breakfast",
    fr: "Vin d'accueil & Petit-déjeuner offerts",
    ar: "فطور مجاني وضيافة ترحيبية",
  },
  "Zero Service Fees": {
    en: "Zero Service Fees",
    fr: "Zéro frais de service",
    ar: "بدون رسوم خدمة",
  },
  "Standard Room Only": {
    en: "Standard Room Only",
    fr: "Chambre standard seule",
    ar: "غرفة قياسية فقط",
  },
  "Non-refundable": {
    en: "Non-refundable",
    fr: "Non remboursable",
    ar: "غير قابل للاسترداد",
  },
  "Includes guest service fee": {
    en: "Includes guest service fee",
    fr: "Frais de service voyageur inclus",
    ar: "يتضمن رسوم خدمة الضيوف",
  },
  "Late Check-out Included": {
    en: "Late Check-out Included",
    fr: "Départ tardif inclus",
    ar: "مغادرة متأخرة مشمولة",
  },
  "Free Airport Shuttle": {
    en: "Free Airport Shuttle",
    fr: "Navette aéroport offerte",
    ar: "نقل مجاني من المطار",
  },
  "Free Breakfast": {
    en: "Free Breakfast",
    fr: "Petit-déjeuner offert",
    ar: "إفطار مجاني",
  },
  "Free Cancellation": {
    en: "Free Cancellation",
    fr: "Annulation gratuite",
    ar: "إلغاء مجاني",
  },
  "Free cancellation": {
    en: "Free cancellation",
    fr: "Annulation gratuite",
    ar: "إلغاء مجاني",
  },
  "Standard rate": {
    en: "Standard rate",
    fr: "Tarif standard",
    ar: "السعر القياسي",
  },
  "Genius discount": {
    en: "Genius discount",
    fr: "Remise Genius",
    ar: "خصم Genius",
  },
  "Superhost": {
    en: "Superhost",
    fr: "Superhôte",
    ar: "مضيف متميز",
  },
  "Free Sunset Spritz & Tapas": {
    en: "Free Sunset Spritz & Tapas",
    fr: "Apéritif coucher de soleil & tapas offerts",
    ar: "ضيافة غروب الشمس ومقبلات مجانية",
  },
  "Flexible Check-in": {
    en: "Flexible Check-in",
    fr: "Arrivée flexible",
    ar: "تسجيل وصول مرن",
  },
  "Free Traditional Pastries & Mint Tea": {
    en: "Free Traditional Pastries & Mint Tea",
    fr: "Pâtisseries traditionnelles & thé à la menthe offerts",
    ar: "حلويات تقليدية وشاي بالنعناع مجاناً",
  },
  "Free Hammam Session & Breakfast": {
    en: "Free Hammam Session & Breakfast",
    fr: "Séance Hammam & Petit-déjeuner offerts",
    ar: "جلسة حمام مغربي وإفطار مجاني",
  },
  "Airport VIP Transfer": {
    en: "Airport VIP Transfer",
    fr: "Transfert aéroport VIP",
    ar: "نقل VIP من المطار",
  },
  "Free Firewood & Ski Pass Discount": {
    en: "Free Firewood & Ski Pass Discount",
    fr: "Bois de cheminée offert & remise forfait ski",
    ar: "حطب مجاني وخصم تذاكر التزلج",
  },
};

export function translateRatePerk(perk: string, lang: Language): string {
  return RATE_PERK_LABELS[perk]?.[lang] || perk;
}

const COUNTRY_LABELS: Record<string, Record<Language, string>> = {
  France: { en: "France", fr: "France", ar: "فرنسا" },
  Morocco: { en: "Morocco", fr: "Maroc", ar: "المغرب" },
  Italy: { en: "Italy", fr: "Italie", ar: "إيطاليا" },
  Algeria: { en: "Algeria", fr: "Algérie", ar: "الجزائر" },
  Algérie: { en: "Algeria", fr: "Algérie", ar: "الجزائر" },
  Maroc: { en: "Morocco", fr: "Maroc", ar: "المغرب" },
};

const CITY_LABELS: Record<string, Record<Language, string>> = {
  Cassis: { en: "Cassis", fr: "Cassis", ar: "كاسيس" },
  Paris: { en: "Paris", fr: "Paris", ar: "باريس" },
  "Chamonix-Mont-Blanc": {
    en: "Chamonix-Mont-Blanc",
    fr: "Chamonix-Mont-Blanc",
    ar: "شاموني مون بلان",
  },
  Marrakech: { en: "Marrakech", fr: "Marrakech", ar: "مراكش" },
  Positano: { en: "Positano", fr: "Positano", ar: "بوسيتانو" },
  Algiers: { en: "Algiers", fr: "Alger", ar: "الجزائر العاصمة" },
  Alger: { en: "Algiers", fr: "Alger", ar: "الجزائر العاصمة" },
};

interface DemoPropLocalization {
  title: Record<Language, string>;
  description: Record<Language, string>;
}

const DEMO_PROPERTY_TEXTS: Record<string, DemoPropLocalization> = {
  "prop-1": {
    title: {
      en: "Villa Luminescence & Infinity Pool",
      fr: "Villa Luminescence & Piscine à Débordement",
      ar: "فيلا لومينيسانس مع مسبح لا متناهي",
    },
    description: {
      en: "Suspended above the Mediterranean azure cliffs, Villa Luminescence combines panoramic calanque sea views, private heated infinity pool, expansive teak decks, and minimalist French Riviera architectural refinement.",
      fr: "Suspendue au-dessus des falaises azur de la Méditerranée, la Villa Luminescence allie vue panoramique sur les calanques, piscine à débordement chauffée privée, grandes terrasses en teck et raffinement architectural de la Côte d'Azur.",
      ar: "تتربع فيلا لومينيسانس فوق المنحدرات اللازوردية للبحر المتوسط، وتجمع بين إطلالات بانورامية على البحر، ومسبح خاص لا متناهي مدفأ، وتراسات واسعة بتصميم معماري راقٍ.",
    },
  },
  "prop-2": {
    title: {
      en: "Le Marais Designer Loft & Rooftop",
      fr: "Loft Design Le Marais & Rooftop Privé",
      ar: "لوفت ديزاين لو ماريه مع سطح خاص",
    },
    description: {
      en: "Centrally located in the historic heart of Le Marais. Featuring soaring exposed beam ceilings, contemporary curated artwork, custom Italian kitchen, and a private zinc rooftop terrace overlooking Parisian chimneys.",
      fr: "Idéalement situé au cœur historique du Marais. Hauts plafonds à poutres apparentes, œuvres d'art contemporain, cuisine italienne sur mesure et toit-terrasse privé surplombant les toits de Paris.",
      ar: "يقع في قلب حي لو ماريه التاريخي في باريس. يتميز بأسقف عالية، وأعمال فنية معاصرة، ومطبخ إيطالي مصمم خصيصاً، وتراس خاص يطل على معالم باريس.",
    },
  },
  "prop-3": {
    title: {
      en: "Chalet Mont-Blanc Alpine Lodge & Spa",
      fr: "Chalet Mont-Blanc Lodge Alpin & Spa",
      ar: "شاليه مون بلان ألبين لودج آند سبا",
    },
    description: {
      en: "Ski-in / ski-out luxury timber sanctuary nestled at the foot of Mont Blanc. Boasts an outdoor cedar hot tub, Finnish sauna, roaring central fireplace, and unobstructed views of the Aiguille du Midi.",
      fr: "Sanctuaire en bois luxueux skis aux pieds niché au pied du Mont-Blanc. Jacuzzi extérieur en cèdre, sauna finlandais, grande cheminée centrale et vue dégagée sur l'Aiguille du Midi.",
      ar: "ملاذ خشبي فاخر بوصول مباشر إلى منحدرات التزلج عند سفح جبل مون بلان. يضم جاكوزي خارجي، وساونا فنلندية، ومدفأة مركزية، وإطلالة خلابة على الجبال.",
    },
  },
  "prop-4": {
    title: {
      en: "The Grand Royal Palace & Botanical Gardens",
      fr: "Grand Palais Royal & Jardins Botaniques",
      ar: "القصر الملكي الكبير والحدائق النباتية",
    },
    description: {
      en: "An authentic oasis of peace set in a 5-hectare palm grove. Traditional Moorish architecture, artisan zellige tilework, two heated lap pools, Michelin-inspired dining, and a world-class hammam spa.",
      fr: "Une authentique oasis de paix au cœur d'une palmeraie de 5 hectares. Architecture mauresque traditionnelle, zellige artisanal, deux bassins chauffés, gastronomie raffinée et spa hammam d'exception.",
      ar: "واحة سلام أصيلة وسط واحة نخيل بمساحة 5 هكتارات. عمارة مغربية تقليدية، وزليج يدوي الصنع، ومسبحان مدفآن، ومطعم راقٍ، وحمام سبا عالمي.",
    },
  },
  "prop-5": {
    title: {
      en: "Amalfi Coastline Cliffside Haven",
      fr: "Refuge Falaise Côte Amalfitaine",
      ar: "ملاذ ساحل أمالفي على المنحدر البحري",
    },
    description: {
      en: "Carved into Positano’s iconic sheer cliffs. Every terrace delivers uninterrupted views of colorful cascading villas and the turquoise Tyrrhenian Sea. Direct private cliff elevator to beach.",
      fr: "Sculpté dans les célèbres falaises de Positano. Chaque terrasse offre une vue imprenable sur les villas colorées et la mer Tyrrhénienne turquoise. Ascenseur privé direct vers la plage.",
      ar: "منحوت في منحدرات بوسيتانو الشهيرة. توفر كل شرفة إطلالة خلابة على الفيلات الملونة والبحر الفيروزي مع مصعد خاص مباشر نحو الشاطئ.",
    },
  },
  "prop-6": {
    title: {
      en: "Algiers Bay Panoramic Waterfront Residence",
      fr: "Résidence Panoramique Baie d'Alger",
      ar: "إقامة بانورامية على خليج الجزائر العاصمة",
    },
    description: {
      en: "Haussmannian style high-ceiling residence overlooking the glistening Bay of Algiers and the port. Minutes from the historical Casbah, offering contemporary amenities and sea breeze.",
      fr: "Résidence haussmannienne à hauts plafonds surplombant la baie d'Alger et le port. À quelques minutes de la Casbah historique, alliant confort moderne et brise marine.",
      ar: "إقامة فاخرة بطراز كلاسيكي وأسقف عالية تطل على خليج الجزائر العاصمة والميناء. على بعد دقائق من القصبة التاريخية مع مرافق عصرية وإطلالة بحرية.",
    },
  },
};

export function localizeProperty(property: Property, lang: Language): Property {
  const demoEntry = DEMO_PROPERTY_TEXTS[property.id];
  const isDefaultTitle =
    demoEntry &&
    (property.title === demoEntry.title.en ||
      property.title === demoEntry.title.fr ||
      property.title === demoEntry.title.ar);

  return {
    ...property,
    title: isDefaultTitle && demoEntry ? demoEntry.title[lang] : property.title,
    description:
      isDefaultTitle && demoEntry ? demoEntry.description[lang] : property.description,
    city: CITY_LABELS[property.city]?.[lang] || property.city,
    country: COUNTRY_LABELS[property.country]?.[lang] || property.country,
  };
}

// ============================================================================
// Extended UI Translations (Navbar extras, Footer, Home, Auth, Espace Perso, Admin)
// ============================================================================

export interface ExtendedSiteTranslations {
  // Common / Navbar / Footer
  personalSpace: string;
  personalSpaceTitle: string;
  loginRegisterTitle: string;
  logout: string;
  logoutTitle: string;
  versus: string;
  staysWord: string;
  createSearchAlertBtn: string;
  maxCompareAlert: string;
  loadingProperty: string;
  footerDest1: string;
  footerDest2: string;
  footerDest3: string;
  footerDest4: string;
  footerDest5: string;
  footerDest6: string;
  footerComp1: string;
  footerComp2: string;
  footerComp3: string;
  footerComp4: string;
  alertsAndNotifs: string;
  adminSpace: string;
  backToPublicSite: string;
  cancel: string;
  saveChanges: string;
  saving: string;
  delete: string;
  edit: string;
  view: string;
  duplicate: string;
  refresh: string;
  searchPlaceholder: string;
  all: string;
  adSponsoredBadge: string;
  catHotels: string;
  catApartments: string;
  catVillas: string;
  catChalets: string;
  catResorts: string;
  catDormitories: string;
  catShowAll: string;
  moreFilters: string;
  allDbFiltersTitle: string;
  allDbFiltersSub: string;
  dbAmenitiesLabel: string;
  dbStarsLabel: string;
  dbCancellationLabel: string;
  dbMinRatingLabel: string;
  closeFilters: string;

  // Auth / Connexion
  auth: {
    loginTab: string;
    registerTab: string;
    loginTitle: string;
    registerTitle: string;
    verifyTitle: string;
    authSubtitle: string;
    verifySubtitle: string;
    devModeNotice: string;
    continueGoogle: string;
    continueFacebook: string;
    continueApple: string;
    orWithEmail: string;
    emailLabel: string;
    passwordLabel: string;
    passwordMinLabel: string;
    fullNameLabel: string;
    emailActivationLabel: string;
    phoneOptionalLabel: string;
    loginSubmit: string;
    loggingIn: string;
    registerSubmit: string;
    sendingCode: string;
    activationCodeLabel: string;
    activateSubmit: string;
    verifying: string;
    resendCode: string;
    backToLogin: string;
    simEmailHeader: string;
    fillCodeBtn: string;
    toLabel: string;
    codeLabel: string;
    simOAuthTitle: string;
    simOAuthDesc: string;
    oneClickTestAccounts: string;
    orCustomSimAccount: string;
    displayNameLabel: string;
    socialEmailLabel: string;
    continueAs: string;
    simulatingAuth: string;
    gateInvite: string;
  };

  // Espace Perso
  espacePerso: {
    loading: string;
    dashboard: string;
    myListings: string;
    publishListing: string;
    alertsNotifications: string;
    myProfile: string;
    accountActivated: string;
    simulatedSuffix: string;
    emailMethod: string;
    hello: string;
    dashboardSubtitle: string;
    createAlertBtn: string;
    publishedListingsStat: string;
    activeAlertsStat: string;
    unreadNotifsStat: string;
    recentNotifsTitle: string;
    manageAlerts: string;
    viewOffer: string;
    noNotifsYet: string;
    createFirstAlertLink: string;
    forNotifExplain: string;
    recentListingsTitle: string;
    viewAll: string;
    noListingsYet: string;
    publishFirstListing: string;
    myListingsTitle: string;
    myListingsSubtitle: string;
    publishNewListing: string;
    searchMyListings: string;
    confirmDeleteTitle: string;
    confirmDeleteText: string;
    noMatchesFound: string;
    alertsTitle: string;
    alertsSubtitle: string;
    newAlertBtn: string;
    closeFormBtn: string;
    createAlertHeading: string;
    createAlertSub: string;
    alertNameLabel: string;
    alertNamePlaceholder: string;
    destinationLabel: string;
    destinationPlaceholder: string;
    propertyTypeLabel: string;
    maxBudgetLabel: string;
    maxBudgetPlaceholder: string;
    minRatingLabel: string;
    allRatings: string;
    minGuestsLabel: string;
    frequencyLabel: string;
    freqInstant: string;
    freqDaily: string;
    freqWeekly: string;
    channelLabel: string;
    channelBoth: string;
    channelEmail: string;
    channelInApp: string;
    desiredAmenitiesLabel: string;
    activateAlertBtn: string;
    configuredAlertsTitle: string;
    activeBadge: string;
    pausedBadge: string;
    pauseBtn: string;
    activateBtn: string;
    allDestinations: string;
    matchesFoundSuffix: string;
    noMatchesAlertText: string;
    showResults: string;
    hideResults: string;
    noAlertsConfigured: string;
    receivedNotifsTitle: string;
    unreadWord: string;
    markAllRead: string;
    noReceivedNotifs: string;
    profileTitle: string;
    profileSubtitle: string;
    accountInfoTitle: string;
    statusActivated: string;
    authMethodLabel: string;
    profileUpdated: string;
    availabilityNav: string;
  };

  // Availability & Calendar Blocking
  availability: {
    title: string;
    subtitle: string;
    selectProperty: string;
    autoBlockLabel: string;
    autoBlockDesc: string;
    blockDatesTitle: string;
    startDate: string;
    endDate: string;
    reasonLabel: string;
    reasonExternal: string;
    reasonMaintenance: string;
    reasonOwner: string;
    noteLabel: string;
    notePlaceholder: string;
    blockBtn: string;
    blocking: string;
    blockedPeriodsTitle: string;
    noBlockedPeriods: string;
    unblockBtn: string;
    acceptedBookingTag: string;
    externalOfferTag: string;
    maintenanceTag: string;
    ownerBlockTag: string;
    bookingsForPropertyTitle: string;
    noBookingsForProperty: string;
    acceptAndBlockBtn: string;
    acceptBtn: string;
    refuseBtn: string;
    cancelAndUnblockBtn: string;
    legendAvailable: string;
    legendBooked: string;
    legendManual: string;
    legendPending: string;
    noPropertiesHint: string;
    unavailableNotice: string;
    flexibleDates: string;
    fixedDates: string;
    fixedDatesHint: string;
    flexibleDatesHint: string;
  };

  // Admin
  admin: {
    consoleTitle: string;
    platformBadge: string;
    checkingSession: string;
    loginHeading: string;
    loginSub: string;
    notAdminWarning: string;
    logoutCurrentAccount: string;
    devQuickAccess: string;
    quickLoginBtn: string;
    adminEmailLabel: string;
    adminLoginSubmit: string;
    superAdminRole: string;
    navDashboard: string;
    navProperties: string;
    navAddProperty: string;
    navRates: string;
    navBookings: string;
    navAvailability: string;
    navAds: string;
    navDisplay: string;
    navContact: string;
    navSettings: string;
    overviewTitle: string;
    overviewSub: string;
    totalListings: string;
    featuredStat: string;
    avgPriceStat: string;
    avgRatingStat: string;
    destinationsStat: string;
    bookingsStat: string;
    pendingWord: string;
    reviewsWord: string;
    categoryBreakdown: string;
    categoryBreakdownSub: string;
    quickActionsTitle: string;
    quickActionsSub: string;
    recentListingsTitle: string;
    recentListingsSub: string;
    manageListingsTitle: string;
    listingsInCatalog: string;
    allTypes: string;
    allListingsFilter: string;
    featuredOnly: string;
    standardOnly: string;
    sortDefault: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortBestRated: string;
    sortMostReviewed: string;
    publishedBy: string;
    ratesTitle: string;
    ratesSub: string;
    bookingsTitle: string;
    bookingsSub: string;
    allStatuses: string;
    confirmed: string;
    pending: string;
    cancelled: string;
    confirmAction: string;
    cancelAction: string;
    settingsTitle: string;
    settingsSub: string;
    exportTitle: string;
    exportDesc: string;
    downloadJson: string;
    resetTitle: string;
    resetDesc: string;
    resetBtn: string;
    architectureTitle: string;
    // PropertyForm
    formCreateTitle: string;
    formEditTitle: string;
    formCreateSub: string;
    formPublishBtn: string;
    formUpdateBtn: string;
    sec1Title: string;
    sec1Sub: string;
    titleField: string;
    slugField: string;
    starsField: string;
    ratingField: string;
    reviewsCountField: string;
    featuredCheckboxLabel: string;
    descField: string;
    sec2Title: string;
    sec2Sub: string;
    quickCitiesLabel: string;
    addressField: string;
    cityField: string;
    countryField: string;
    sec3Title: string;
    sec3Sub: string;
    mainImageField: string;
    galleryField: string;
    addImagePlaceholder: string;
    addBtn: string;
    sec4Title: string;
    sec4Sub: string;
    customAmenityPlaceholder: string;
    sec5Title: string;
    checkInField: string;
    checkOutField: string;
    cancellationField: string;
    sec6Title: string;
    sec6Sub: string;
    addRoomBtn: string;
    sec7Title: string;
    sec7Sub: string;
    addPlatformBtn: string;
  };
}

export const EXTENDED_TRANSLATIONS: Record<Language, ExtendedSiteTranslations> = {
  fr: {
    personalSpace: "Espace Perso",
    personalSpaceTitle: "Mon Espace Perso",
    loginRegisterTitle: "Connexion / Inscription",
    logout: "Déconnexion",
    logoutTitle: "Se déconnecter",
    versus: "vs",
    staysWord: "hébergements",
    createSearchAlertBtn: "Créer une alerte de notification",
    maxCompareAlert: "Vous pouvez comparer jusqu'à 3 hébergements simultanément.",
    loadingProperty: "Chargement de l'hébergement...",
    footerDest1: "Côte d'Azur & Cassis",
    footerDest2: "Paris Marais Historique",
    footerDest3: "Chamonix & Mont-Blanc",
    footerDest4: "Côte Amalfitaine & Positano",
    footerDest5: "Palmeraie de Marrakech",
    footerDest6: "Baie d'Alger Front de Mer",
    footerComp1: "Booking.com vs Direct",
    footerComp2: "Détail des frais Airbnb",
    footerComp3: "Programme Hôtes Directs",
    footerComp4: "Garantie Meilleur Prix",
    alertsAndNotifs: "Alertes & Notifications",
    adminSpace: "Espace Administration",
    backToPublicSite: "Voir le site public",
    cancel: "Annuler",
    saveChanges: "Enregistrer les modifications",
    saving: "Enregistrement...",
    delete: "Supprimer",
    edit: "Modifier",
    view: "Voir",
    duplicate: "Dupliquer",
    refresh: "Actualiser",
    searchPlaceholder: "Rechercher par titre, ville, pays...",
    all: "Tous",
    adSponsoredBadge: "Publicité",
    catHotels: "Hôtels",
    catApartments: "Appartements",
    catVillas: "Villas",
    catChalets: "Chalets",
    catResorts: "Resorts & Spa",
    catDormitories: "Dortoirs",
    catShowAll: "Tout afficher",
    moreFilters: "Autres",
    allDbFiltersTitle: "Tous les filtres disponibles",
    allDbFiltersSub: "Options issues des biens sélectionnés par votre recherche",
    dbAmenitiesLabel: "Équipements & Services",
    dbStarsLabel: "Classification (Étoiles)",
    dbCancellationLabel: "Politique d'annulation",
    dbMinRatingLabel: "Note minimale",
    closeFilters: "Fermer",

    auth: {
      loginTab: "Se connecter",
      registerTab: "Créer un compte",
      loginTitle: "Connexion à votre Espace Perso",
      registerTitle: "Créer votre Espace Perso",
      verifyTitle: "Activez votre compte",
      authSubtitle: "Publiez vos annonces et créez des alertes de recherche personnalisées.",
      verifySubtitle: "Saisissez le code à 6 chiffres envoyé à",
      devModeNotice: "Mode Dev : Authentification sociale simulée (Google, Facebook, Apple). Sera remplacée par OAuth réel en production.",
      continueGoogle: "Continuer avec Google (Gmail)",
      continueFacebook: "Continuer avec Facebook",
      continueApple: "Continuer avec Apple",
      orWithEmail: "OU AVEC VOTRE E-MAIL",
      emailLabel: "Adresse e-mail",
      passwordLabel: "Mot de passe",
      passwordMinLabel: "Mot de passe (min. 6 caractères) *",
      fullNameLabel: "Nom complet *",
      emailActivationLabel: "Adresse e-mail (pour recevoir le code d'activation) *",
      phoneOptionalLabel: "Téléphone (optionnel)",
      loginSubmit: "Se connecter",
      loggingIn: "Connexion en cours...",
      registerSubmit: "Créer mon compte et recevoir le code",
      sendingCode: "Envoi du code d'activation...",
      activationCodeLabel: "Code d'activation à 6 chiffres",
      activateSubmit: "Activer et accéder à mon espace",
      verifying: "Vérification...",
      resendCode: "Renvoyer un code",
      backToLogin: "Retour à la connexion",
      simEmailHeader: "Simulation E-mail (Dev)",
      fillCodeBtn: "Remplir le code",
      toLabel: "À :",
      codeLabel: "Code d'activation :",
      simOAuthTitle: "Simulateur OAuth",
      simOAuthDesc: "En phase de développement, aucune clé OAuth réelle n'est requise. Sélectionnez un profil de test ou saisissez un e-mail personnalisé pour simuler le retour du fournisseur.",
      oneClickTestAccounts: "Comptes de test en 1 clic :",
      orCustomSimAccount: "OU SAISIR UN COMPTE SIMULÉ",
      displayNameLabel: "Nom affiché",
      socialEmailLabel: "E-mail du compte social",
      continueAs: "Continuer en tant que",
      simulatingAuth: "Authentification simulée...",
      gateInvite: "Connectez-vous ou créez un compte pour publier vos annonces et gérer vos alertes de recherche.",
    },

    espacePerso: {
      loading: "Chargement de votre Espace Perso...",
      dashboard: "Tableau de bord",
      myListings: "Mes annonces",
      publishListing: "Publier une annonce",
      alertsNotifications: "Alertes & Notifications",
      myProfile: "Mon profil",
      accountActivated: "Compte activé",
      simulatedSuffix: "(simulé)",
      emailMethod: "E-mail",
      hello: "Bonjour,",
      dashboardSubtitle: "Gérez vos annonces d'hébergements et vos demandes de notifications personnalisées.",
      createAlertBtn: "Créer une alerte",
      publishedListingsStat: "Mes annonces publiées",
      activeAlertsStat: "Alertes recherche actives",
      unreadNotifsStat: "Notifications non lues",
      recentNotifsTitle: "Dernières notifications de recherche",
      manageAlerts: "Gérer mes alertes",
      viewOffer: "Voir l'offre",
      noNotifsYet: "Aucune notification pour le moment.",
      createFirstAlertLink: "Créez votre première alerte de recherche",
      forNotifExplain: "pour être averti dès qu'un bien correspond à vos choix !",
      recentListingsTitle: "Mes annonces récentes",
      viewAll: "Tout afficher",
      noListingsYet: "Vous n'avez pas encore publié d'annonce.",
      publishFirstListing: "Publier ma première annonce",
      myListingsTitle: "Mes Annonces",
      myListingsSubtitle: "Publiez, modifiez ou supprimez vos hébergements sur Zirigo.",
      publishNewListing: "Publier une nouvelle annonce",
      searchMyListings: "Rechercher dans mes annonces...",
      confirmDeleteTitle: "Supprimer cette annonce ?",
      confirmDeleteText: "sera définitivement retirée du site public.",
      noMatchesFound: "Aucune annonce pour le moment",
      alertsTitle: "Alertes de Recherche & Notifications",
      alertsSubtitle: "Configurez vos critères de recherche et soyez averti automatiquement dès qu'une annonce correspond.",
      newAlertBtn: "Nouvelle demande de notification",
      closeFormBtn: "Fermer le formulaire",
      createAlertHeading: "Créer une demande de notification personnalisée",
      createAlertSub: "Définissez vos choix de recherche : chaque nouvelle annonce publiée sera analysée en temps réel.",
      alertNameLabel: "Nom de votre alerte",
      alertNamePlaceholder: "Ex: Villa avec piscine à Cassis été 2026",
      destinationLabel: "Destination (Ville, Pays ou mot-clé)",
      destinationPlaceholder: "Ex: Paris, Cassis, Alger, Maroc...",
      propertyTypeLabel: "Type d'hébergement",
      maxBudgetLabel: "Budget maximum / nuit (€)",
      maxBudgetPlaceholder: "Ex: 350 (laisser vide si illimité)",
      minRatingLabel: "Note minimale",
      allRatings: "Toutes les notes",
      minGuestsLabel: "Voyageurs minimum",
      frequencyLabel: "Fréquence des alertes",
      freqInstant: "Instantanée (dès publication)",
      freqDaily: "Résumé quotidien",
      freqWeekly: "Résumé hebdomadaire",
      channelLabel: "Canal de réception",
      channelBoth: "E-mail + Espace Perso",
      channelEmail: "E-mail uniquement",
      channelInApp: "Espace Perso uniquement",
      desiredAmenitiesLabel: "Équipements souhaités",
      activateAlertBtn: "Activer cette alerte",
      configuredAlertsTitle: "Mes demandes de notifications configurées",
      activeBadge: "Active",
      pausedBadge: "En pause",
      pauseBtn: "Mettre en pause",
      activateBtn: "Activer",
      allDestinations: "Toutes destinations",
      matchesFoundSuffix: "annonce(s) correspondent actuellement à vos critères",
      noMatchesAlertText: "Aucune annonce correspondante pour l'instant — vous serez averti dès qu'un bien est publié.",
      showResults: "Voir les annonces",
      hideResults: "Masquer les résultats",
      noAlertsConfigured: "Vous n'avez aucune alerte configurée. Cliquez sur « Nouvelle demande de notification » pour créer votre première veille personnalisée.",
      receivedNotifsTitle: "Notifications reçues",
      unreadWord: "non lue(s)",
      markAllRead: "Tout marquer comme lu",
      noReceivedNotifs: "Aucune notification reçue pour le moment.",
      profileTitle: "Mon Profil",
      profileSubtitle: "Informations personnelles et sécurité de votre compte Zirigo.",
      accountInfoTitle: "Informations du compte",
      statusActivated: "Statut : Activé",
      authMethodLabel: "Méthode d'authentification",
      profileUpdated: "Votre profil a été mis à jour.",
      availabilityNav: "Disponibilités & Calendrier",
    },

    availability: {
      title: "Gestion des Disponibilités & Calendrier",
      subtitle: "Bloquez des dates pour vos offres extérieures et automatisez le blocage des réservations acceptées.",
      selectProperty: "Bien immobilier sélectionné",
      autoBlockLabel: "Bloquer automatiquement les dates lors de l'acceptation d'une réservation",
      autoBlockDesc: "Dès que vous acceptez une réservation client, les nuits correspondantes sont immédiatement verrouillées pour éviter toute double réservation.",
      blockDatesTitle: "Bloquer une période manuellement (offre extérieure / indisponibilité)",
      startDate: "Date de début (incluse)",
      endDate: "Date de fin (départ)",
      reasonLabel: "Motif du blocage",
      reasonExternal: "Offre extérieure (hors site)",
      reasonMaintenance: "Maintenance / Travaux",
      reasonOwner: "Blocage propriétaire",
      noteLabel: "Note ou référence (optionnel)",
      notePlaceholder: "Ex : Client téléphone / WhatsApp, séjour privé...",
      blockBtn: "Bloquer ces dates",
      blocking: "Blocage en cours...",
      blockedPeriodsTitle: "Périodes actuellement bloquées",
      noBlockedPeriods: "Aucune date bloquée pour ce bien actuellement.",
      unblockBtn: "Libérer",
      acceptedBookingTag: "Réservation acceptée (auto)",
      externalOfferTag: "Offre extérieure",
      maintenanceTag: "Maintenance",
      ownerBlockTag: "Blocage manuel",
      bookingsForPropertyTitle: "Demandes de réservation client pour ce bien",
      noBookingsForProperty: "Aucune réservation enregistrée pour ce bien.",
      acceptAndBlockBtn: "Accepter & Bloquer",
      acceptBtn: "Accepter",
      refuseBtn: "Refuser",
      cancelAndUnblockBtn: "Annuler & Libérer les dates",
      legendAvailable: "Disponible",
      legendBooked: "Réservé & accepté",
      legendManual: "Bloqué manuellement",
      legendPending: "Demande en attente",
      noPropertiesHint: "Publiez d'abord un hébergement depuis « Publier une annonce » pour gérer son calendrier et bloquer ses dates.",
      unavailableNotice: "Périodes déjà indisponibles :",
      flexibleDates: "Dates flexibles",
      fixedDates: "Dates fixes",
      fixedDatesHint: "Masque les biens déjà réservés sur ces dates",
      flexibleDatesHint: "Affiche tous les biens quelle que soit la période",
    },

    admin: {
      consoleTitle: "Console d'administration",
      platformBadge: "Admin Platform",
      checkingSession: "Vérification de la session administrateur...",
      loginHeading: "Console Administration Zirigo",
      loginSub: "Connectez-vous avec un compte administrateur pour gérer la plateforme.",
      notAdminWarning: "Ce compte n'a pas les droits d'administration.",
      logoutCurrentAccount: "Se déconnecter du compte actuel",
      devQuickAccess: "Accès Administrateur (Développement)",
      quickLoginBtn: "Connexion rapide Super Admin",
      adminEmailLabel: "Adresse e-mail administrateur",
      adminLoginSubmit: "Se connecter à l'administration",
      superAdminRole: "Super Admin",
      navDashboard: "Tableau de bord",
      navProperties: "Gestion des annonces",
      navAddProperty: "Ajouter une annonce",
      navRates: "Comparateur & Tarifs",
      navBookings: "Réservations",
      navAvailability: "Disponibilités",
      navAds: "Publicités & Bannières",
      navDisplay: "Affichage",
      navContact: "Page Contact",
      navSettings: "Paramètres & Données",
      overviewTitle: "Vue d'ensemble de la plateforme",
      overviewSub: "Supervisez et administrez toutes vos annonces d'hébergements en temps réel.",
      totalListings: "Total Annonces",
      featuredStat: "En Vedette",
      avgPriceStat: "Prix moyen / nuit",
      avgRatingStat: "Note Moyenne",
      destinationsStat: "Destinations",
      bookingsStat: "Réservations",
      pendingWord: "en attente",
      reviewsWord: "avis clients",
      categoryBreakdown: "Répartition par Catégorie",
      categoryBreakdownSub: "Volume d'annonces par type de logement",
      quickActionsTitle: "Accès rapides",
      quickActionsSub: "Actions fréquentes d'administration",
      recentListingsTitle: "Dernières annonces répertoriées",
      recentListingsSub: "Aperçu rapide des annonces du catalogue Zirigo",
      manageListingsTitle: "Gestion des Annonces",
      listingsInCatalog: "hébergements répertoriés dans le catalogue",
      allTypes: "Tous les types",
      allListingsFilter: "Toutes les annonces",
      featuredOnly: "En vedette uniquement",
      standardOnly: "Standard uniquement",
      sortDefault: "Tri par défaut",
      sortPriceAsc: "Prix croissant",
      sortPriceDesc: "Prix décroissant",
      sortBestRated: "Meilleures notes",
      sortMostReviewed: "Nombre d'avis",
      publishedBy: "Publié par :",
      ratesTitle: "Comparateur de Tarifs & Marges",
      ratesSub: "Surveillez en un coup d'œil l'écart de prix entre Zirigo Direct et les OTAs.",
      bookingsTitle: "Gestion des Réservations",
      bookingsSub: "Suivi des demandes de réservation et statuts de confirmation.",
      allStatuses: "Tous les statuts",
      confirmed: "Confirmées",
      pending: "En attente",
      cancelled: "Annulées",
      confirmAction: "Confirmer",
      cancelAction: "Annuler",
      settingsTitle: "Paramètres & Gestion des Données",
      settingsSub: "Sauvegardez vos données, gérez la persistance et configurez la plateforme.",
      exportTitle: "Export & Sauvegarde JSON",
      exportDesc: "Téléchargez l'intégralité du catalogue des annonces d'hébergement au format JSON.",
      downloadJson: "Télécharger le catalogue (.json)",
      resetTitle: "Réinitialisation d'usine",
      resetDesc: "Restaurez les 6 annonces de démonstration initiales.",
      resetBtn: "Réinitialiser les données démo",
      architectureTitle: "Architecture & Stockage Dynamique",
      formCreateTitle: "Créer une nouvelle annonce",
      formEditTitle: "Modifier l'annonce",
      formCreateSub: "Remplissez les détails pour publier un nouvel hébergement sur Zirigo",
      formPublishBtn: "Créer et publier l'annonce",
      formUpdateBtn: "Mettre à jour",
      sec1Title: "1. Informations Générales",
      sec1Sub: "Identité du logement, catégorie, classification et mise en avant.",
      titleField: "Titre de l'annonce *",
      slugField: "Slug URL",
      starsField: "Étoiles (1 à 5)",
      ratingField: "Note initiale (sur 5.0)",
      reviewsCountField: "Nombre d'avis clients",
      featuredCheckboxLabel: "Mettre cette annonce en vedette",
      descField: "Description complète de la propriété *",
      sec2Title: "2. Localisation & Coordonnées Géographiques",
      sec2Sub: "Indiquez l'adresse pour situer la propriété.",
      quickCitiesLabel: "Suggestions rapides de destinations :",
      addressField: "Adresse complète *",
      cityField: "Ville *",
      countryField: "Pays *",
      sec3Title: "3. Photos & Galerie Multimédia",
      sec3Sub: "Une image principale et une galerie complète.",
      mainImageField: "Image Principale (URL) *",
      galleryField: "Galerie de photos supplémentaires",
      addImagePlaceholder: "Coller l'URL d'une nouvelle photo...",
      addBtn: "Ajouter",
      sec4Title: "4. Équipements & Prestations Incluses",
      sec4Sub: "Cochez les prestations disponibles.",
      customAmenityPlaceholder: "Ajouter un équipement personnalisé...",
      sec5Title: "5. Horaires & Conditions d'Annulation",
      checkInField: "Heure d'arrivée (Check-in)",
      checkOutField: "Heure de départ (Check-out)",
      cancellationField: "Politique d'annulation",
      sec6Title: "6. Chambres & Unités d'Hébergement",
      sec6Sub: "Ajoutez et configurez chaque typologie de chambre ou suite.",
      addRoomBtn: "Ajouter une chambre",
      sec7Title: "7. Grille du Comparateur de Prix Multi-Plateformes",
      sec7Sub: "Fixez le tarif Zirigo Direct et comparez avec les autres plateformes.",
      addPlatformBtn: "Ajouter une plateforme",
    },
  },

  en: {
    personalSpace: "Personal Space",
    personalSpaceTitle: "My Personal Space",
    loginRegisterTitle: "Sign In / Register",
    logout: "Log out",
    logoutTitle: "Log out",
    versus: "vs",
    staysWord: "stays",
    createSearchAlertBtn: "Create notification alert",
    maxCompareAlert: "You can compare up to 3 accommodations simultaneously.",
    loadingProperty: "Loading accommodation...",
    footerDest1: "French Riviera & Cassis",
    footerDest2: "Paris Historic Marais",
    footerDest3: "Chamonix & Mont-Blanc",
    footerDest4: "Amalfi Coast & Positano",
    footerDest5: "Marrakech Palmeraie",
    footerDest6: "Algiers Waterfront Bay",
    footerComp1: "Booking.com vs Direct",
    footerComp2: "Airbnb Fees Breakdown",
    footerComp3: "Host Direct Program",
    footerComp4: "Price Match Guarantee",
    alertsAndNotifs: "Alerts & Notifications",
    adminSpace: "Admin Dashboard",
    backToPublicSite: "View public site",
    cancel: "Cancel",
    saveChanges: "Save changes",
    saving: "Saving...",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    duplicate: "Duplicate",
    refresh: "Refresh",
    searchPlaceholder: "Search by title, city, country...",
    all: "All",
    adSponsoredBadge: "Sponsored",
    catHotels: "Hotels",
    catApartments: "Apartments",
    catVillas: "Villas",
    catChalets: "Chalets",
    catResorts: "Resorts & Spa",
    catDormitories: "Dormitories",
    catShowAll: "Show all",
    moreFilters: "More",
    allDbFiltersTitle: "All available filters",
    allDbFiltersSub: "Extracted from listings matching your current search",
    dbAmenitiesLabel: "Amenities & Facilities",
    dbStarsLabel: "Star Rating",
    dbCancellationLabel: "Cancellation Policy",
    dbMinRatingLabel: "Minimum Rating",
    closeFilters: "Close",

    auth: {
      loginTab: "Sign In",
      registerTab: "Create Account",
      loginTitle: "Sign in to your Personal Space",
      registerTitle: "Create your Personal Space",
      verifyTitle: "Activate your account",
      authSubtitle: "Publish your listings and create custom search alerts.",
      verifySubtitle: "Enter the 6-digit code sent to",
      devModeNotice: "Dev Mode: Simulated social auth (Google, Facebook, Apple). Will be replaced by real OAuth in production.",
      continueGoogle: "Continue with Google (Gmail)",
      continueFacebook: "Continue with Facebook",
      continueApple: "Continue with Apple",
      orWithEmail: "OR WITH YOUR EMAIL",
      emailLabel: "Email address",
      passwordLabel: "Password",
      passwordMinLabel: "Password (min. 6 characters) *",
      fullNameLabel: "Full name *",
      emailActivationLabel: "Email address (to receive activation code) *",
      phoneOptionalLabel: "Phone (optional)",
      loginSubmit: "Sign In",
      loggingIn: "Signing in...",
      registerSubmit: "Create account & send activation code",
      sendingCode: "Sending activation code...",
      activationCodeLabel: "6-digit activation code",
      activateSubmit: "Activate & enter my space",
      verifying: "Verifying...",
      resendCode: "Resend code",
      backToLogin: "Back to sign in",
      simEmailHeader: "Email Simulation (Dev)",
      fillCodeBtn: "Fill code",
      toLabel: "To:",
      codeLabel: "Activation code:",
      simOAuthTitle: "OAuth Simulator",
      simOAuthDesc: "In development, no real OAuth keys are required. Pick a test profile or enter a custom email to simulate the OAuth provider callback.",
      oneClickTestAccounts: "1-click test accounts:",
      orCustomSimAccount: "OR ENTER A SIMULATED ACCOUNT",
      displayNameLabel: "Display name",
      socialEmailLabel: "Social account email",
      continueAs: "Continue as",
      simulatingAuth: "Simulating auth...",
      gateInvite: "Sign in or create an account to publish listings and manage your search alerts.",
    },

    espacePerso: {
      loading: "Loading your Personal Space...",
      dashboard: "Dashboard",
      myListings: "My Listings",
      publishListing: "Publish Listing",
      alertsNotifications: "Alerts & Notifications",
      myProfile: "My Profile",
      accountActivated: "Account verified",
      simulatedSuffix: "(simulated)",
      emailMethod: "Email",
      hello: "Hello,",
      dashboardSubtitle: "Manage your accommodation listings and personalized notification alerts.",
      createAlertBtn: "Create Alert",
      publishedListingsStat: "My published listings",
      activeAlertsStat: "Active search alerts",
      unreadNotifsStat: "Unread notifications",
      recentNotifsTitle: "Latest search notifications",
      manageAlerts: "Manage alerts",
      viewOffer: "View offer",
      noNotifsYet: "No notifications yet.",
      createFirstAlertLink: "Create your first search alert",
      forNotifExplain: "to get notified as soon as a property matches your preferences!",
      recentListingsTitle: "My recent listings",
      viewAll: "View all",
      noListingsYet: "You haven't published any listings yet.",
      publishFirstListing: "Publish my first listing",
      myListingsTitle: "My Listings",
      myListingsSubtitle: "Publish, edit, or delete your accommodations on Zirigo.",
      publishNewListing: "Publish new listing",
      searchMyListings: "Search in my listings...",
      confirmDeleteTitle: "Delete this listing?",
      confirmDeleteText: "will be permanently removed from the public website.",
      noMatchesFound: "No listings yet",
      alertsTitle: "Search Alerts & Notifications",
      alertsSubtitle: "Configure your search criteria and get automatically notified whenever a matching listing appears.",
      newAlertBtn: "New notification request",
      closeFormBtn: "Close form",
      createAlertHeading: "Create a custom notification request",
      createAlertSub: "Set your search preferences: every new listing published will be matched in real time.",
      alertNameLabel: "Alert name",
      alertNamePlaceholder: "e.g., Pool villa in Cassis Summer 2026",
      destinationLabel: "Destination (City, Country or keyword)",
      destinationPlaceholder: "e.g., Paris, Cassis, Algiers, Morocco...",
      propertyTypeLabel: "Accommodation type",
      maxBudgetLabel: "Maximum budget / night (€)",
      maxBudgetPlaceholder: "e.g., 350 (leave empty for unlimited)",
      minRatingLabel: "Minimum rating",
      allRatings: "All ratings",
      minGuestsLabel: "Minimum guests",
      frequencyLabel: "Alert frequency",
      freqInstant: "Instant (on publish)",
      freqDaily: "Daily digest",
      freqWeekly: "Weekly digest",
      channelLabel: "Delivery channel",
      channelBoth: "Email + Personal Space",
      channelEmail: "Email only",
      channelInApp: "Personal Space only",
      desiredAmenitiesLabel: "Desired amenities",
      activateAlertBtn: "Activate this alert",
      configuredAlertsTitle: "Configured notification requests",
      activeBadge: "Active",
      pausedBadge: "Paused",
      pauseBtn: "Pause",
      activateBtn: "Activate",
      allDestinations: "All destinations",
      matchesFoundSuffix: "listing(s) currently match your criteria",
      noMatchesAlertText: "No matching listings yet — you'll be notified as soon as a matching stay is published.",
      showResults: "View listings",
      hideResults: "Hide results",
      noAlertsConfigured: "You have no alerts configured yet. Click 'New notification request' to create your first alert.",
      receivedNotifsTitle: "Received notifications",
      unreadWord: "unread",
      markAllRead: "Mark all as read",
      noReceivedNotifs: "No notifications received yet.",
      profileTitle: "My Profile",
      profileSubtitle: "Personal details and security of your Zirigo account.",
      accountInfoTitle: "Account Information",
      statusActivated: "Status: Activated",
      authMethodLabel: "Authentication method",
      profileUpdated: "Your profile has been updated.",
      availabilityNav: "Availability & Calendar",
    },

    availability: {
      title: "Availability & Calendar Management",
      subtitle: "Block dates for external bookings and automatically lock dates when accepting client reservations.",
      selectProperty: "Selected Property",
      autoBlockLabel: "Automatically block dates when accepting a client booking",
      autoBlockDesc: "Once you accept a guest booking request, those nights are automatically locked to prevent double bookings.",
      blockDatesTitle: "Block dates manually (external offer / unavailability)",
      startDate: "Start Date (inclusive)",
      endDate: "End Date (check-out)",
      reasonLabel: "Reason",
      reasonExternal: "External offer (off-platform)",
      reasonMaintenance: "Maintenance / Renovation",
      reasonOwner: "Owner block",
      noteLabel: "Note or reference (optional)",
      notePlaceholder: "e.g., Phone / WhatsApp booking, personal stay...",
      blockBtn: "Block these dates",
      blocking: "Blocking...",
      blockedPeriodsTitle: "Currently Blocked Periods",
      noBlockedPeriods: "No dates are currently blocked for this property.",
      unblockBtn: "Unblock",
      acceptedBookingTag: "Accepted booking (auto)",
      externalOfferTag: "External offer",
      maintenanceTag: "Maintenance",
      ownerBlockTag: "Manual block",
      bookingsForPropertyTitle: "Client Booking Requests for this Property",
      noBookingsForProperty: "No reservations recorded for this property yet.",
      acceptAndBlockBtn: "Accept & Block Dates",
      acceptBtn: "Accept",
      refuseBtn: "Decline",
      cancelAndUnblockBtn: "Cancel & Release Dates",
      legendAvailable: "Available",
      legendBooked: "Accepted booking",
      legendManual: "Blocked manually",
      legendPending: "Pending request",
      noPropertiesHint: "First publish a property under 'Add Listing' to manage its calendar and block dates.",
      unavailableNotice: "Already unavailable periods:",
      flexibleDates: "Flexible dates",
      fixedDates: "Fixed dates",
      fixedDatesHint: "Hides properties already booked for these dates",
      flexibleDatesHint: "Shows all stays regardless of booked dates",
    },

    admin: {
      consoleTitle: "Admin Console",
      platformBadge: "Admin Platform",
      checkingSession: "Checking admin session...",
      loginHeading: "Zirigo Admin Console",
      loginSub: "Sign in with an administrator account to manage the platform.",
      notAdminWarning: "This account does not have administrator privileges.",
      logoutCurrentAccount: "Log out of current account",
      devQuickAccess: "Administrator Access (Development)",
      quickLoginBtn: "Quick Super Admin Login",
      adminEmailLabel: "Administrator email",
      adminLoginSubmit: "Sign in to Admin",
      superAdminRole: "Super Admin",
      navDashboard: "Dashboard",
      navProperties: "Listings Management",
      navAddProperty: "Add Listing",
      navRates: "Rates Comparator",
      navBookings: "Bookings",
      navAvailability: "Availability",
      navAds: "Ads & Banners",
      navDisplay: "Display",
      navContact: "Contact Page",
      navSettings: "Settings & Data",
      overviewTitle: "Platform Overview",
      overviewSub: "Monitor and manage all accommodation listings in real time.",
      totalListings: "Total Listings",
      featuredStat: "Featured",
      avgPriceStat: "Avg Price / night",
      avgRatingStat: "Avg Rating",
      destinationsStat: "Destinations",
      bookingsStat: "Bookings",
      pendingWord: "pending",
      reviewsWord: "reviews",
      categoryBreakdown: "Category Breakdown",
      categoryBreakdownSub: "Listing volume by accommodation type",
      quickActionsTitle: "Quick Actions",
      quickActionsSub: "Frequent administrative tasks",
      recentListingsTitle: "Latest Listed Properties",
      recentListingsSub: "Quick preview of Zirigo catalog listings",
      manageListingsTitle: "Listings Management",
      listingsInCatalog: "accommodations listed in catalog",
      allTypes: "All types",
      allListingsFilter: "All listings",
      featuredOnly: "Featured only",
      standardOnly: "Standard only",
      sortDefault: "Default sort",
      sortPriceAsc: "Price: Low to High",
      sortPriceDesc: "Price: High to Low",
      sortBestRated: "Best Rated",
      sortMostReviewed: "Most Reviewed",
      publishedBy: "Published by:",
      ratesTitle: "Rates & Margins Comparator",
      ratesSub: "Monitor price gaps between Zirigo Direct and OTAs at a glance.",
      bookingsTitle: "Bookings Management",
      bookingsSub: "Track guest booking requests and confirmation statuses.",
      allStatuses: "All statuses",
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      confirmAction: "Confirm",
      cancelAction: "Cancel",
      settingsTitle: "Settings & Data Management",
      settingsSub: "Backup your data, manage persistence, and configure the platform.",
      exportTitle: "JSON Export & Backup",
      exportDesc: "Download the entire accommodation catalog in JSON format.",
      downloadJson: "Download catalog (.json)",
      resetTitle: "Factory Reset",
      resetDesc: "Restore the 6 initial demonstration listings.",
      resetBtn: "Reset demo data",
      architectureTitle: "Architecture & Dynamic Storage",
      formCreateTitle: "Create a new listing",
      formEditTitle: "Edit listing",
      formCreateSub: "Fill in the details to publish a new accommodation on Zirigo",
      formPublishBtn: "Create & publish listing",
      formUpdateBtn: "Update listing",
      sec1Title: "1. General Information",
      sec1Sub: "Listing identity, category, star rating, and featured badge.",
      titleField: "Listing title *",
      slugField: "URL Slug",
      starsField: "Stars (1 to 5)",
      ratingField: "Initial rating (out of 5.0)",
      reviewsCountField: "Review count",
      featuredCheckboxLabel: "Feature this listing",
      descField: "Full property description *",
      sec2Title: "2. Location & Coordinates",
      sec2Sub: "Provide the address to locate the property on the map and search.",
      quickCitiesLabel: "Quick destination presets:",
      addressField: "Full address *",
      cityField: "City *",
      countryField: "Country *",
      sec3Title: "3. Photos & Gallery",
      sec3Sub: "A cover image and additional photo gallery.",
      mainImageField: "Cover Image (URL) *",
      galleryField: "Additional photo gallery",
      addImagePlaceholder: "Paste a new photo URL...",
      addBtn: "Add",
      sec4Title: "4. Amenities & Facilities",
      sec4Sub: "Select available amenities for travelers.",
      customAmenityPlaceholder: "Add a custom amenity...",
      sec5Title: "5. Check-in Times & Cancellation",
      checkInField: "Check-in time",
      checkOutField: "Check-out time",
      cancellationField: "Cancellation policy",
      sec6Title: "6. Rooms & Accommodation Units",
      sec6Sub: "Add and configure each room or suite type.",
      addRoomBtn: "Add a room",
      sec7Title: "7. Multi-Platform Price Comparison",
      sec7Sub: "Set Zirigo Direct pricing and compare against partner platforms.",
      addPlatformBtn: "Add a platform",
    },
  },

  ar: {
    personalSpace: "المساحة الشخصية",
    personalSpaceTitle: "مساحتي الشخصية",
    loginRegisterTitle: "تسجيل الدخول / إنشاء حساب",
    logout: "تسجيل الخروج",
    logoutTitle: "تسجيل الخروج",
    versus: "مقابل",
    staysWord: "إقامات",
    createSearchAlertBtn: "إنشاء تنبيه إشعارات",
    maxCompareAlert: "يمكنك مقارنة 3 أماكن إقامة كحد أقصى في وقت واحد.",
    loadingProperty: "جاري تحميل مكان الإقامة...",
    footerDest1: "الريفييرا الفرنسية وكاسيس",
    footerDest2: "حي لو ماريه التاريخي باريس",
    footerDest3: "شاموني ومون بلان",
    footerDest4: "ساحل أمالفي وبوسيتانو",
    footerDest5: "واحة النخيل بمراكش",
    footerDest6: "خليج الجزائر العاصمة",
    footerComp1: "بوكينج مقابل الحجز المباشر",
    footerComp2: "تفاصيل رسوم إير بي إن بي",
    footerComp3: "برنامج المضيفين المباشر",
    footerComp4: "ضمان مطابقة أفضل سعر",
    alertsAndNotifs: "التنبيهات والإشعارات",
    adminSpace: "لوحة الإدارة",
    backToPublicSite: "عرض الموقع العام",
    cancel: "إلغاء",
    saveChanges: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    delete: "حذف",
    edit: "تعديل",
    view: "عرض",
    duplicate: "نسخ",
    refresh: "تحديث",
    searchPlaceholder: "ابحث بالعنوان، المدينة، الدولة...",
    all: "الكل",
    adSponsoredBadge: "إعلان ممول",
    catHotels: "فنادق",
    catApartments: "شقق",
    catVillas: "فيلات",
    catChalets: "شاليهات",
    catResorts: "منتجعات وسبا",
    catDormitories: "مهاجع ونزل",
    catShowAll: "عرض الكل",
    moreFilters: "المزيد",
    allDbFiltersTitle: "جميع الفلاتر المتاحة",
    allDbFiltersSub: "خيارات مستخرجة من العقارات المطابقة لبحثك الحالي",
    dbAmenitiesLabel: "المرافق والخدمات",
    dbStarsLabel: "التصنيف (النجوم)",
    dbCancellationLabel: "سياسة الإلغاء",
    dbMinRatingLabel: "الحد الأدنى للتقييم",
    closeFilters: "إغلاق",

    auth: {
      loginTab: "تسجيل الدخول",
      registerTab: "إنشاء حساب",
      loginTitle: "تسجيل الدخول إلى مساحتك الشخصية",
      registerTitle: "إنشاء مساحتك الشخصية",
      verifyTitle: "تفعيل حسابك",
      authSubtitle: "أضف إعلاناتك وأنشئ تنبيهات بحث مخصصة.",
      verifySubtitle: "أدخل الرمز المكون من 6 أرقام المرسل إلى",
      devModeNotice: "وضع التطوير: محاكاة تسجيل الدخول الاجتماعي (Google، Facebook، Apple). سيتم استبدالها بـ OAuth الحقيقي في الإنتاج.",
      continueGoogle: "المتابعة باستخدام Google (Gmail)",
      continueFacebook: "المتابعة باستخدام Facebook",
      continueApple: "المتابعة باستخدام Apple",
      orWithEmail: "أو عبر البريد الإلكتروني",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      passwordMinLabel: "كلمة المرور (6 أحرف على الأقل) *",
      fullNameLabel: "الاسم الكامل *",
      emailActivationLabel: "البريد الإلكتروني (لاستلام رمز التفعيل) *",
      phoneOptionalLabel: "رقم الهاتف (اختياري)",
      loginSubmit: "تسجيل الدخول",
      loggingIn: "جاري تسجيل الدخول...",
      registerSubmit: "إنشاء الحساب وإرسال رمز التفعيل",
      sendingCode: "جاري إرسال رمز التفعيل...",
      activationCodeLabel: "رمز التفعيل المكون من 6 أرقام",
      activateSubmit: "تفعيل والدخول إلى مساحتي",
      verifying: "جاري التحقق...",
      resendCode: "إعادة إرسال الرمز",
      backToLogin: "العودة لتسجيل الدخول",
      simEmailHeader: "محاكاة البريد الإلكتروني (تطوير)",
      fillCodeBtn: "ملء الرمز",
      toLabel: "إلى:",
      codeLabel: "رمز التفعيل:",
      simOAuthTitle: "محاكي OAuth",
      simOAuthDesc: "في مرحلة التطوير، لا يلزم توفر مفاتيح OAuth حقيقية. اختر حساب اختبار أو أدخل بريداً مخصصاً لمحاكاة تسجيل الدخول.",
      oneClickTestAccounts: "حسابات اختبار بنقرة واحدة:",
      orCustomSimAccount: "أو أدخل حساباً للمحاكاة",
      displayNameLabel: "الاسم المعروض",
      socialEmailLabel: "بريد الحساب الاجتماعي",
      continueAs: "المتابعة باسم",
      simulatingAuth: "جاري المحاكاة...",
      gateInvite: "سجل الدخول أو أنشئ حساباً لإضافة إعلاناتك وإدارة تنبيهات البحث.",
    },

    espacePerso: {
      loading: "جاري تحميل مساحتك الشخصية...",
      dashboard: "لوحة التحكم",
      myListings: "إعلاناتي",
      publishListing: "إضافة إعلان",
      alertsNotifications: "التنبيهات والإشعارات",
      myProfile: "ملفي الشخصي",
      accountActivated: "حساب مفعل",
      simulatedSuffix: "(محاكاة)",
      emailMethod: "بريد إلكتروني",
      hello: "مرحباً،",
      dashboardSubtitle: "أدر إعلانات الإقامة الخاصة بك وطلبات الإشعارات المخصصة.",
      createAlertBtn: "إنشاء تنبيه",
      publishedListingsStat: "إعلاناتي المنشورة",
      activeAlertsStat: "تنبيهات البحث النشطة",
      unreadNotifsStat: "إشعارات غير مقروءة",
      recentNotifsTitle: "أحدث إشعارات البحث",
      manageAlerts: "إدارة التنبيهات",
      viewOffer: "عرض الإعلان",
      noNotifsYet: "لا توجد إشعارات حالياً.",
      createFirstAlertLink: "أنشئ تنبيه البحث الأول",
      forNotifExplain: "لتلقي إشعار فور نشر إقامة تناسب اختياراتك!",
      recentListingsTitle: "أحدث إعلاناتي",
      viewAll: "عرض الكل",
      noListingsYet: "لم تقم بنشر أي إعلان بعد.",
      publishFirstListing: "انشر إعلاني الأول",
      myListingsTitle: "إعلاناتي",
      myListingsSubtitle: "انشر، عدل أو احذف أماكن الإقامة الخاصة بك على زيريغو.",
      publishNewListing: "نشر إعلان جديد",
      searchMyListings: "البحث في إعلاناتي...",
      confirmDeleteTitle: "حذف هذا الإعلان؟",
      confirmDeleteText: "سيتم حذفه نهائياً من الموقع العام.",
      noMatchesFound: "لا توجد إعلانات بعد",
      alertsTitle: "تنبيهات البحث والإشعارات",
      alertsSubtitle: "حدد معايير بحثك واحصل على إشعار تلقائي فور توفر إعلان مطابق.",
      newAlertBtn: "طلب إشعار جديد",
      closeFormBtn: "إغلاق النموذج",
      createAlertHeading: "إنشاء طلب إشعار مخصص",
      createAlertSub: "حدد خيارات بحثك: سيتم فحص كل إعلان جديد يُنشر في الوقت الفعلي.",
      alertNameLabel: "اسم التنبيه",
      alertNamePlaceholder: "مثال: فيلا بمسبح في كاسيس صيف 2026",
      destinationLabel: "الوجهة (المدينة، الدولة أو كلمة مفتاحية)",
      destinationPlaceholder: "مثال: باريس، كاسيس، الجزائر، المغرب...",
      propertyTypeLabel: "نوع الإقامة",
      maxBudgetLabel: "الميزانية القصوى / ليلة (€)",
      maxBudgetPlaceholder: "مثال: 350 (اتركه فارغاً لعدم التقييد)",
      minRatingLabel: "أدنى تقييم",
      allRatings: "جميع التقييمات",
      minGuestsLabel: "الحد الأدنى للنزلاء",
      frequencyLabel: "تكرار الإشعارات",
      freqInstant: "فوري (عند النشر)",
      freqDaily: "ملخص يومي",
      freqWeekly: "ملخص أسبوعي",
      channelLabel: "قناة الاستلام",
      channelBoth: "البريد الإلكتروني + المساحة الشخصية",
      channelEmail: "البريد الإلكتروني فقط",
      channelInApp: "المساحة الشخصية فقط",
      desiredAmenitiesLabel: "المرافق المطلوبة",
      activateAlertBtn: "تفعيل هذا التنبيه",
      configuredAlertsTitle: "طلبات الإشعارات المفعلة",
      activeBadge: "نشط",
      pausedBadge: "متوقف مؤقتاً",
      pauseBtn: "إيقاف مؤقت",
      activateBtn: "تفعيل",
      allDestinations: "جميع الوجهات",
      matchesFoundSuffix: "إعلاناً يطابق معاييرك حالياً",
      noMatchesAlertText: "لا توجد إعلانات مطابقة حالياً — سيتم إشعارك فور نشر أي عرض مناسب.",
      showResults: "عرض الإعلانات",
      hideResults: "إخفاء النتائج",
      noAlertsConfigured: "ليس لديك أي تنبيه بعد. اضغط على « طلب إشعار جديد » لإنشاء أول تنبيه.",
      receivedNotifsTitle: "الإشعارات المستلمة",
      unreadWord: "غير مقروء",
      markAllRead: "تحديد الكل كمقروء",
      noReceivedNotifs: "لا توجد إشعارات مستلمة حالياً.",
      profileTitle: "ملفي الشخصي",
      profileSubtitle: "المعلومات الشخصية وأمان حسابك على زيريغو.",
      accountInfoTitle: "معلومات الحساب",
      statusActivated: "الحالة: مفعل",
      authMethodLabel: "طريقة المصادقة",
      profileUpdated: "تم تحديث ملفك الشخصي.",
      availabilityNav: "التوفر والتقويم",
    },

    availability: {
      title: "إدارة التوفر وحجز التواريخ",
      subtitle: "احجب التواريخ للعروض الخارجية وفعل الحجب التلقائي عند قبول حجوزات العملاء.",
      selectProperty: "العقار المحدد",
      autoBlockLabel: "حجب التواريخ تلقائياً عند قبول حجز العميل",
      autoBlockDesc: "بمجرد قبول طلب حجز، يتم قفل تلك الليالي تلقائياً لمنع أي حجز مزدوج.",
      blockDatesTitle: "حجب التواريخ يدوياً (عرض خارجي / غير متاح)",
      startDate: "تاريخ البدء (شامل)",
      endDate: "تاريخ الانتهاء (المغادرة)",
      reasonLabel: "سبب الحجب",
      reasonExternal: "عرض خارجي (من خارج المنصة)",
      reasonMaintenance: "صيانة / أشغال",
      reasonOwner: "حجب من المالك",
      noteLabel: "ملاحظة أو مرجع (اختياري)",
      notePlaceholder: "مثال: حجز عبر الهاتف أو واتساب...",
      blockBtn: "حجب هذه التواريخ",
      blocking: "جاري الحجب...",
      blockedPeriodsTitle: "الفترات المحجوبة حالياً",
      noBlockedPeriods: "لا توجد تواريخ محجوبة لهذا العقار حالياً.",
      unblockBtn: "إلغاء الحجب",
      acceptedBookingTag: "حجز مقبول (تلقائي)",
      externalOfferTag: "عرض خارجي",
      maintenanceTag: "صيانة",
      ownerBlockTag: "حجب يدوي",
      bookingsForPropertyTitle: "طلبات حجز العملاء لهذا العقار",
      noBookingsForProperty: "لا توجد طلبات حجز مسجلة لهذا العقار بعد.",
      acceptAndBlockBtn: "قبول وحجب التواريخ",
      acceptBtn: "قبول",
      refuseBtn: "رفض",
      cancelAndUnblockBtn: "إلغاء وتحرير التواريخ",
      legendAvailable: "متاح",
      legendBooked: "محجوز ومقبول",
      legendManual: "محجوب يدوياً",
      legendPending: "طلب قيد الانتظار",
      noPropertiesHint: "قم بنشر إعلان عقاري أولاً لإدارة تقويم التوفر وحجب التواريخ.",
      unavailableNotice: "الفترات غير المتاحة حالياً:",
      flexibleDates: "تواريخ مرنة",
      fixedDates: "تواريخ محددة",
      fixedDatesHint: "إخفاء العقارات المحجوزة خلال هذه الفترة",
      flexibleDatesHint: "عرض جميع العقارات بغض النظر عن التواريخ",
    },

    admin: {
      consoleTitle: "لوحة تحكم الإدارة",
      platformBadge: "منصة الإدارة",
      checkingSession: "جاري التحقق من جلسة المسؤول...",
      loginHeading: "إدارة منصة زيريغو",
      loginSub: "سجل الدخول بحساب مسؤول لإدارة المنصة.",
      notAdminWarning: "هذا الحساب لا يملك صلاحيات الإدارة.",
      logoutCurrentAccount: "تسجيل الخروج من الحساب الحالي",
      devQuickAccess: "دخول المسؤول (وضع التطوير)",
      quickLoginBtn: "دخول سريع كمسؤول",
      adminEmailLabel: "البريد الإلكتروني للمسؤول",
      adminLoginSubmit: "دخول إلى الإدارة",
      superAdminRole: "المسؤول العام",
      navDashboard: "لوحة التحكم",
      navProperties: "إدارة الإعلانات",
      navAddProperty: "إضافة إعلان",
      navRates: "مقارنة الأسعار",
      navBookings: "الحجوزات",
      navAvailability: "التوفر والتواريخ",
      navAds: "الإعلانات والبنرات",
      navDisplay: "إدارة العرض",
      navContact: "صفحة اتصل بنا",
      navSettings: "الإعدادات والبيانات",
      overviewTitle: "نظرة عامة على المنصة",
      overviewSub: "راقب وأدر جميع إعلانات الإقامة في الوقت الفعلي.",
      totalListings: "إجمالي الإعلانات",
      featuredStat: "إعلانات مميزة",
      avgPriceStat: "متوسط السعر / ليلة",
      avgRatingStat: "متوسط التقييم",
      destinationsStat: "الوجهات",
      bookingsStat: "الحجوزات",
      pendingWord: "قيد الانتظار",
      reviewsWord: "تقييمات",
      categoryBreakdown: "التوزيع حسب الفئة",
      categoryBreakdownSub: "حجم الإعلانات حسب نوع العقار",
      quickActionsTitle: "وصول سريع",
      quickActionsSub: "المهام الإدارية الشائعة",
      recentListingsTitle: "أحدث الإعلانات المضافة",
      recentListingsSub: "معاينة سريعة لكتالوج زيريغو",
      manageListingsTitle: "إدارة الإعلانات",
      listingsInCatalog: "أماكن إقامة مسجلة في الكتالوج",
      allTypes: "جميع الأنواع",
      allListingsFilter: "جميع الإعلانات",
      featuredOnly: "المميزة فقط",
      standardOnly: "العادية فقط",
      sortDefault: "الترتيب الافتراضي",
      sortPriceAsc: "السعر: من الأقل للأعلى",
      sortPriceDesc: "السعر: من الأعلى للأقل",
      sortBestRated: "الأعلى تقييماً",
      sortMostReviewed: "الأكثر تقييماً",
      publishedBy: "نُشر بواسطة:",
      ratesTitle: "مقارن الأسعار والهوامش",
      ratesSub: "راقب فرق السعر بين زيريغو مباشر والمنصات الأخرى.",
      bookingsTitle: "إدارة الحجوزات",
      bookingsSub: "متابعة طلبات الحجز وحالات التأكيد.",
      allStatuses: "جميع الحالات",
      confirmed: "مؤكدة",
      pending: "قيد الانتظار",
      cancelled: "ملغاة",
      confirmAction: "تأكيد",
      cancelAction: "إلغاء",
      settingsTitle: "الإعدادات وإدارة البيانات",
      settingsSub: "النسخ الاحتياطي للبيانات وتهيئة المنصة.",
      exportTitle: "تصدير وحفظ JSON",
      exportDesc: "قم بتحميل كامل كتالوج الإعلانات بصيغة JSON.",
      downloadJson: "تحميل الكتالوج (.json)",
      resetTitle: "إعادة ضبط المصنع",
      resetDesc: "استعادة الإعلانات الـ 6 التجريبية الأصلية.",
      resetBtn: "إعادة ضبط البيانات التجريبية",
      architectureTitle: "الهيكلية والتخزين الديناميكي",
      formCreateTitle: "إنشاء إعلان جديد",
      formEditTitle: "تعديل الإعلان",
      formCreateSub: "املأ التفاصيل لنشر إقامة جديدة على زيريغو",
      formPublishBtn: "إنشاء ونشر الإعلان",
      formUpdateBtn: "تحديث الإعلان",
      sec1Title: "1. المعلومات العامة",
      sec1Sub: "هوية العقار، الفئة، التصنيف والتمييز.",
      titleField: "عنوان الإعلان *",
      slugField: "رابط URL (Slug)",
      starsField: "النجوم (1 إلى 5)",
      ratingField: "التقييم المبدئي (من 5.0)",
      reviewsCountField: "عدد التقييمات",
      featuredCheckboxLabel: "وضع هذا الإعلان كمميز",
      descField: "الوصف الكامل للعقار *",
      sec2Title: "2. الموقع والإحداثيات الجغرافية",
      sec2Sub: "حدد العنوان لتحديد موقع العقار في البحث.",
      quickCitiesLabel: "اقتراحات سريعة للوجهات:",
      addressField: "العنوان الكامل *",
      cityField: "المدينة *",
      countryField: "الدولة *",
      sec3Title: "3. الصور ومعرض الوسائط",
      sec3Sub: "صورة رئيسية ومعرض صور إضافية.",
      mainImageField: "الصورة الرئيسية (URL) *",
      galleryField: "معرض الصور الإضافية",
      addImagePlaceholder: "الصق رابط صورة جديدة...",
      addBtn: "إضافة",
      sec4Title: "4. المرافق والخدمات المتاحة",
      sec4Sub: "اختر المرافق المتوفرة للنزلاء.",
      customAmenityPlaceholder: "أضف مرفقاً مخصصاً...",
      sec5Title: "5. أوقات الوصول وسياسة الإلغاء",
      checkInField: "وقت تسجيل الوصول",
      checkOutField: "وقت المغادرة",
      cancellationField: "سياسة الإلغاء",
      sec6Title: "6. الغرف والوحدات المتاحة",
      sec6Sub: "أضف وحدد كل نوع غرفة أو جناح.",
      addRoomBtn: "إضافة غرفة",
      sec7Title: "7. جدول مقارنة الأسعار متعدد المنصات",
      sec7Sub: "حدد سعر زيريغو المباشر وقارنه مع المنصات الأخرى.",
      addPlatformBtn: "إضافة منصة",
    },
  },
};

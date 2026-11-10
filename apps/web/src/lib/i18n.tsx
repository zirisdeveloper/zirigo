"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  EXTENDED_TRANSLATIONS,
  ExtendedSiteTranslations,
  translatePropertyType,
  translateAmenity,
  translateCancellation,
  translateRatePerk,
  localizeProperty,
} from "./i18nSite";

export {
  translatePropertyType,
  translateAmenity,
  translateCancellation,
  translateRatePerk,
  localizeProperty,
};

export type Language = "en" | "fr" | "ar";

export interface Translations {
  // Navbar
  tagline: string;
  compare: string;
  wishlist: string;
  listProperty: string;
  themeToggle: string;

  // Hero & Search
  heroPromo: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  destination: string;
  whereGoing: string;
  popularDestinations: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  guestSingle: string;
  guestPlural: string;
  guestPlus: string;
  searchBtn: string;
  trustSavings: string;
  trustMultiPlatform: string;
  trustDirectPerks: string;

  // Types
  typeAll: string;
  typeVilla: string;
  typeHotel: string;
  typeApartment: string;
  typeChalet: string;
  typeResort: string;
  typeDormitory: string;

  // Filters & Sorting
  filters: string;
  amenityPool: string;
  amenitySeaView: string;
  amenitySpa: string;
  amenityWifi: string;
  amenityAC: string;
  amenityKitchen: string;
  sortBy: string;
  sortPopular: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortRating: string;
  showingStays: string;
  matching: string;
  resetFilters: string;
  noResultsTitle: string;
  noResultsSub: string;
  viewAllBtn: string;

  // Property Card
  featured: string;
  bestRateAvailable: string;
  night: string;
  saveVs: string;
  compareRates: string;
  instantBook: string;
  addToWishlist: string;
  removeFromWishlist: string;
  addToCompare: string;
  removeFromCompare: string;
  reviews: string;

  // Rate Matrix
  rateAuditBadge: string;
  matrixTitle: string;
  matrixSubtitle: string;
  youSaveUpTo: string;
  forNights: string;
  lowestPriceVerified: string;
  officialDirect: string;
  totalForStay: string;
  bookDirectAndSave: string;
  viewOn: string;

  // Compare Drawer
  selectedForComparison: string;
  comparePricesSub: string;
  clearAll: string;
  compareNow: string;
  sideBySideTitle: string;
  sideBySideSub: string;
  feature: string;
  categoryPricing: string;
  directGuaranteed: string;
  yourSavings: string;
  categorySpecs: string;
  specType: string;
  specCancellation: string;
  specCheckInOut: string;
  categoryAmenities: string;
  action: string;
  bookOnZirigo: string;

  // Property Details Page
  home: string;
  save: string;
  saved: string;
  share: string;
  linkCopied: string;
  guaranteedBestPrice: string;
  guaranteedBestPriceSub: string;
  flexibleCancellation: string;
  flexibleCancellationSub: string;
  directHostPerks: string;
  directHostPerksSub: string;
  aboutProperty: string;
  availableRooms: string;
  selectRoom: string;
  beds: string;
  bath: string;
  whatOffers: string;
  guestReviews: string;
  reserveDirect: string;
  noChargeYet: string;

  // Booking Modal
  directBookingTitle: string;
  selectRoomUnit: string;
  fullName: string;
  fullNamePlaceholder: string;
  email: string;
  phoneWhatsApp: string;
  specialRequests: string;
  specialRequestsPlaceholder: string;
  priceBreakdown: string;
  cleaningFee: string;
  serviceFee: string;
  waivedFree: string;
  otaSavings: string;
  totalAmount: string;
  directGuarantees: string;
  guaranteeSecure: string;
  guaranteeDirectContact: string;
  guaranteeCancellation: string;
  confirmBookingBtn: string;
  confirmedTitle: string;
  allSet: string;
  confirmedSub: string;
  confirmationCode: string;
  dates: string;
  selectedUnit: string;
  totalPaid: string;
  savedBanner: string;
  emailSentNote: string;
  doneBtn: string;

  // Why Zirigo Section
  whyBadge: string;
  whyTitle: string;
  whySubtitle: string;
  why1Title: string;
  why1Desc: string;
  why2Title: string;
  why2Desc: string;
  why3Title: string;
  why3Desc: string;

  // Footer
  footerDesc: string;
  footerGuarantee: string;
  destinationsCol: string;
  comparisonCol: string;
  hostsCol: string;
  copyright: string;
  terms: string;
  privacy: string;
  cookies: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    tagline: "Comparator & Direct Booking",
    compare: "Compare",
    wishlist: "Wishlist",
    listProperty: "List a Property",
    themeToggle: "Toggle theme",

    heroPromo: "Real-Time Multi-Platform Comparison Engine",
    heroTitle1: "",
    heroTitle2: "Book at the Best Rate.",
    heroSubtitle: "Zirigo scans Booking.com, Airbnb, Agoda, and Expedia simultaneously to guarantee you the lowest price, exclusive host perks, and zero hidden service fees.",
    destination: "Destination",
    whereGoing: "Where are you going?",
    popularDestinations: "Popular Destinations",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    guestSingle: "1 Guest",
    guestPlural: "Guests",
    guestPlus: "6+ Guests",
    searchBtn: "Search & Compare",
    trustSavings: "Average 18% Savings vs major OTA portals",
    trustMultiPlatform: "Transparent Comparison: 4+ platforms audited",
    trustDirectPerks: "Direct Host Perks: Free breakfast, welcome wine & passes",

    typeAll: "All Stays",
    typeVilla: "Luxury Villas",
    typeHotel: "Hotels",
    typeApartment: "Apartments",
    typeChalet: "Chalets",
    typeResort: "Resorts & Spa",
    typeDormitory: "Dormitories",

    filters: "Filters:",
    amenityPool: "Pool",
    amenitySeaView: "Sea View",
    amenitySpa: "Spa & Hot Tub",
    amenityWifi: "Fast WiFi",
    amenityAC: "Air Conditioning",
    amenityKitchen: "Kitchen",
    sortBy: "Sort:",
    sortPopular: "Most Popular",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortRating: "Top Rated (4.9+)",
    showingStays: "Showing",
    matching: "matching",
    resetFilters: "Reset all filters",
    noResultsTitle: "No matching accommodations found",
    noResultsSub: "Try adjusting your destination, accommodation type, or removing some filters.",
    viewAllBtn: "View all accommodations",

    featured: "Featured",
    bestRateAvailable: "Best Rate Available",
    night: "/ night",
    saveVs: "Save",
    compareRates: "Compare Rates",
    instantBook: "Instant Book",
    addToWishlist: "Add to wishlist",
    removeFromWishlist: "Remove from wishlist",
    addToCompare: "Add to comparison",
    removeFromCompare: "Remove from comparison",
    reviews: "reviews",

    rateAuditBadge: "Real-Time Rate Audit",
    matrixTitle: "Direct Booking vs Other Platforms",
    matrixSubtitle: "We audit OTA channels to guarantee you the authentic best deal with zero markup.",
    youSaveUpTo: "You save up to",
    forNights: "for",
    lowestPriceVerified: "Lowest Price Verified",
    officialDirect: "Official Direct",
    totalForStay: "Total",
    bookDirectAndSave: "Book Direct & Save",
    viewOn: "View on",

    selectedForComparison: "Selected for Comparison",
    comparePricesSub: "Compare prices, perks & amenities side by side",
    clearAll: "Clear All",
    compareNow: "Compare Now",
    sideBySideTitle: "Side-by-Side Accommodation Comparison",
    sideBySideSub: "Evaluate live platform rates, specifications, and exclusive direct perks.",
    feature: "Feature",
    categoryPricing: "Direct vs OTA Pricing (per night)",
    directGuaranteed: "Zirigo Direct (Guaranteed Best)",
    yourSavings: "Your Savings with Direct",
    categorySpecs: "Property Specifications",
    specType: "Type",
    specCancellation: "Cancellation Policy",
    specCheckInOut: "Check-in / Check-out",
    categoryAmenities: "Amenities Checklist",
    action: "Action",
    bookOnZirigo: "Book on Zirigo",

    home: "Home",
    save: "Save",
    saved: "Saved",
    share: "Share",
    linkCopied: "Link copied to clipboard!",
    guaranteedBestPrice: "Guaranteed Best Price",
    guaranteedBestPriceSub: "Save 15% vs OTA platforms",
    flexibleCancellation: "Flexible Cancellation",
    flexibleCancellationSub: "Free cancellation up to 48 hours",
    directHostPerks: "Direct Host Perks",
    directHostPerksSub: "Welcome gifts & direct contact",
    aboutProperty: "About this property",
    availableRooms: "Available Room Options",
    selectRoom: "Select Room",
    beds: "Beds",
    bath: "Bath",
    whatOffers: "What this place offers",
    guestReviews: "Guest Reviews",
    reserveDirect: "Reserve on Zirigo Direct",
    noChargeYet: "You won't be charged yet. Instant confirmation upon checkout.",

    directBookingTitle: "Direct Booking with Host",
    selectRoomUnit: "Select Room / Suite",
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. Éléonore Laurent",
    email: "Email",
    phoneWhatsApp: "Phone / WhatsApp",
    specialRequests: "Special Requests (Optional)",
    specialRequestsPlaceholder: "Early check-in, dietary restrictions, airport pickup...",
    priceBreakdown: "Direct Price Breakdown",
    cleaningFee: "Cleaning Fee",
    serviceFee: "Platform Service Fee",
    waivedFree: "€0 FREE (Waived)",
    otaSavings: "OTA Price Comparison Savings",
    totalAmount: "Total Amount",
    directGuarantees: "Direct Booking Guarantees:",
    guaranteeSecure: "100% Secure reservation",
    guaranteeDirectContact: "Direct communication with property host",
    guaranteeCancellation: "Free cancellation policy respected",
    confirmBookingBtn: "Confirm Direct Booking",
    confirmedTitle: "Reservation Confirmed!",
    allSet: "You're all set!",
    confirmedSub: "Your direct reservation has been secured at the guaranteed lowest rate.",
    confirmationCode: "Confirmation Code:",
    dates: "Dates:",
    selectedUnit: "Selected Unit:",
    totalPaid: "Total Paid:",
    savedBanner: "You saved by booking direct on Zirigo!",
    emailSentNote: "A confirmation email and WhatsApp host arrival guide have been sent to",
    doneBtn: "Done",

    whyBadge: "The Zirigo Difference",
    whyTitle: "Why Savvy Travelers Choose Zirigo",
    whySubtitle: "Traditional travel agencies charge up to 20% commission that gets passed on to you. We eliminate the middlemen.",
    why1Title: "Guaranteed Lowest Rates",
    why1Desc: "We compare prices across Airbnb, Booking.com, and Agoda, then connect you with direct host rates that are consistently 10% to 25% lower.",
    why2Title: "Exclusive Direct Perks",
    why2Desc: "Hosts offer complimentary gourmet breakfasts, welcome champagne, and flexible check-in when you book directly through Zirigo.",
    why3Title: "Zero Hidden Fees",
    why3Desc: "The price you see is the price you pay. No surprising traveler service fees added at the final checkout step.",

    footerDesc: "The transparent accommodation comparison engine. We audit major online travel portals in real time to guarantee you book at the authentic lowest rate with direct host benefits.",
    footerGuarantee: "Best Direct Rate Guarantee • No Hidden Fees",
    destinationsCol: "Popular Destinations",
    comparisonCol: "Platform Comparison",
    hostsCol: "For Hosts & Hoteliers",
    copyright: "Zirigo Inc. All rights reserved. Built with Next.js, Turbo & Drizzle ORM.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    cookies: "Cookie Settings",
  },
  fr: {
    tagline: "Comparateur & Réservation Directe",
    compare: "Comparer",
    wishlist: "Favoris",
    listProperty: "Publier une annonce",
    themeToggle: "Changer de thème",

    heroPromo: "Moteur de Comparaison Multi-Plateformes en Temps Réel",
    heroTitle1: "",
    heroTitle2: "Réservez au Meilleur Tarif.",
    heroSubtitle: "Zirigo scanne Booking.com, Airbnb, Agoda et Expedia simultanément pour vous garantir le prix le plus bas, des avantages hôte exclusifs et aucun frais de service caché.",
    destination: "Destination",
    whereGoing: "Où souhaitez-vous aller ?",
    popularDestinations: "Destinations Populaires",
    checkIn: "Arrivée",
    checkOut: "Départ",
    guests: "Voyageurs",
    guestSingle: "1 Voyageur",
    guestPlural: "Voyageurs",
    guestPlus: "6+ Voyageurs",
    searchBtn: "Rechercher & Comparer",
    trustSavings: "18% d'économie en moyenne vs les grandes agences en ligne",
    trustMultiPlatform: "Comparaison transparente : 4+ plateformes auditées",
    trustDirectPerks: "Avantages Directs : Petit-déjeuner offert, vin d'accueil & pass",

    typeAll: "Tous les séjours",
    typeVilla: "Villas d'exception",
    typeHotel: "Hôtels",
    typeApartment: "Appartements",
    typeChalet: "Chalets",
    typeResort: "Resorts & Spa",
    typeDormitory: "Dortoirs",

    filters: "Filtres :",
    amenityPool: "Piscine",
    amenitySeaView: "Vue mer",
    amenitySpa: "Spa & Jacuzzi",
    amenityWifi: "WiFi rapide",
    amenityAC: "Climatisation",
    amenityKitchen: "Cuisine",
    sortBy: "Trier :",
    sortPopular: "Plus populaires",
    sortPriceAsc: "Prix : Croissant",
    sortPriceDesc: "Prix : Décroissant",
    sortRating: "Mieux notés (4.9+)",
    showingStays: "Affichage de",
    matching: "pour",
    resetFilters: "Réinitialiser les filtres",
    noResultsTitle: "Aucun hébergement correspondant",
    noResultsSub: "Essayez de modifier votre destination, le type d'hébergement ou de retirer des filtres.",
    viewAllBtn: "Voir tous les hébergements",

    featured: "Coup de cœur",
    bestRateAvailable: "Meilleur tarif disponible",
    night: "/ nuit",
    saveVs: "Économisez",
    compareRates: "Comparer les tarifs",
    instantBook: "Réserver",
    addToWishlist: "Ajouter aux favoris",
    removeFromWishlist: "Retirer des favoris",
    addToCompare: "Ajouter au comparateur",
    removeFromCompare: "Retirer du comparateur",
    reviews: "avis",

    rateAuditBadge: "Audit des Tarifs en Direct",
    matrixTitle: "Réservation Directe vs Autres Plateformes",
    matrixSubtitle: "Nous auditons les canaux de réservation pour vous garantir l'offre la plus avantageuse sans commission intermédiaire.",
    youSaveUpTo: "Vous économisez jusqu'à",
    forNights: "pour",
    lowestPriceVerified: "Meilleur Prix Garanti",
    officialDirect: "Direct Officiel",
    totalForStay: "Total",
    bookDirectAndSave: "Réserver en direct & économiser",
    viewOn: "Voir sur",

    selectedForComparison: "Sélectionnés pour comparaison",
    comparePricesSub: "Comparez les prix, avantages et prestations côte à côte",
    clearAll: "Tout effacer",
    compareNow: "Comparer maintenant",
    sideBySideTitle: "Comparatif Détaillé des Hébergements",
    sideBySideSub: "Analysez les tarifs en temps réel, caractéristiques et avantages exclusifs.",
    feature: "Caractéristique",
    categoryPricing: "Tarifs Direct vs OTA (par nuit)",
    directGuaranteed: "Zirigo Direct (Meilleur garanti)",
    yourSavings: "Votre économie en direct",
    categorySpecs: "Caractéristiques du bien",
    specType: "Type",
    specCancellation: "Politique d'annulation",
    specCheckInOut: "Arrivée / Départ",
    categoryAmenities: "Prestations & Équipements",
    action: "Action",
    bookOnZirigo: "Réserver sur Zirigo",

    home: "Accueil",
    save: "Sauvegarder",
    saved: "Enregistré",
    share: "Partager",
    linkCopied: "Lien copié dans le presse-papier !",
    guaranteedBestPrice: "Meilleur Prix Garanti",
    guaranteedBestPriceSub: "Économisez 15% vs les plateformes OTA",
    flexibleCancellation: "Annulation Flexible",
    flexibleCancellationSub: "Annulation gratuite jusqu'à 48h avant",
    directHostPerks: "Avantages Hôte Direct",
    directHostPerksSub: "Cadeaux de bienvenue & contact direct",
    aboutProperty: "À propos de ce logement",
    availableRooms: "Options d'hébergement disponibles",
    selectRoom: "Choisir cette option",
    beds: "Lits",
    bath: "SdB",
    whatOffers: "Ce que propose ce logement",
    guestReviews: "Avis des voyageurs",
    reserveDirect: "Réserver sur Zirigo Direct",
    noChargeYet: "Vous ne serez pas débité maintenant. Confirmation immédiate.",

    directBookingTitle: "Réservation Directe avec l'Hôte",
    selectRoomUnit: "Choisir la suite / logement",
    fullName: "Nom et Prénom",
    fullNamePlaceholder: "ex. Éléonore Laurent",
    email: "Adresse e-mail",
    phoneWhatsApp: "Téléphone / WhatsApp",
    specialRequests: "Demandes particulières (facultatif)",
    specialRequestsPlaceholder: "Arrivée matinale, restrictions, transfert aéroport...",
    priceBreakdown: "Détail du prix en direct",
    cleaningFee: "Frais de ménage",
    serviceFee: "Frais de service plateforme",
    waivedFree: "0€ OFFERT (Supprimé)",
    otaSavings: "Économie réalisée vs agences en ligne",
    totalAmount: "Montant total",
    directGuarantees: "Garanties Réservation Directe :",
    guaranteeSecure: "Paiement 100% sécurisé",
    guaranteeDirectContact: "Lien direct avec le propriétaire",
    guaranteeCancellation: "Politique d'annulation respectée",
    confirmBookingBtn: "Confirmer la réservation directe",
    confirmedTitle: "Réservation Confirmée !",
    allSet: "Tout est prêt !",
    confirmedSub: "Votre réservation directe a été enregistrée au meilleur prix garanti.",
    confirmationCode: "Code de confirmation :",
    dates: "Dates :",
    selectedUnit: "Logement choisi :",
    totalPaid: "Total réglé :",
    savedBanner: "Vous avez économisé en réservant sur Zirigo !",
    emailSentNote: "Un e-mail de confirmation et le guide d'arrivée ont été envoyés à",
    doneBtn: "Terminé",

    whyBadge: "La Différence Zirigo",
    whyTitle: "Pourquoi les Voyageurs Avertis Choisissent Zirigo",
    whySubtitle: "Les agences de voyage traditionnelles prélèvent jusqu'à 20% de commissions répercutées sur vous. Nous supprimons les intermédiaires.",
    why1Title: "Prix les Plus Bas Garantis",
    why1Desc: "Nous comparons les prix sur Airbnb, Booking.com et Agoda, puis vous connectons aux tarifs directs de l'hôte, systématiquement 10% à 25% moins chers.",
    why2Title: "Avantages Directs Exclusifs",
    why2Desc: "Les hôtes offrent le petit-déjeuner gourmand, une bouteille de bienvenue et des horaires flexibles en réservant directement sur Zirigo.",
    why3Title: "Zéro Frais Cachés",
    why3Desc: "Le prix affiché est le prix exact payé. Aucun frais de voyageur surprise ajouté à l'étape finale de paiement.",

    footerDesc: "Le moteur transparent de comparaison d'hébergements. Nous auditons les grands portails de voyage en temps réel pour vous garantir une réservation au tarif le plus bas avec des avantages exclusifs.",
    footerGuarantee: "Garantie Meilleur Tarif Direct • Zéro Frais Cachés",
    destinationsCol: "Destinations Populaires",
    comparisonCol: "Comparateur de Plateformes",
    hostsCol: "Espace Hôtes & Hôteliers",
    copyright: "Zirigo Inc. Tous droits réservés. Développé avec Next.js, Turbo & Drizzle ORM.",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    cookies: "Gestion des cookies",
  },
  ar: {
    tagline: "مقارن الأسعار والحجز المباشر",
    compare: "مقارنة",
    wishlist: "المفضلة",
    listProperty: "أضف عقارك",
    themeToggle: "تبديل المظهر",

    heroPromo: "محرك مقارنة متعدد المنصات في الوقت الفعلي",
    heroTitle1: "",
    heroTitle2: "احجز بأفضل سعر.",
    heroSubtitle: "يقوم زيريغو (Zirigo) بمسح منصات بوكينج وإير بي إن بي وأجودا وإكسبيديا في نفس اللحظة ليضمن لك أدنى سعر ممكن ومزايا حصرية وبدون رسوم خدمة مخفية.",
    destination: "الوجهة",
    whereGoing: "إلى أين تريد الذهاب؟",
    popularDestinations: "الوجهات الأكثر طلباً",
    checkIn: "تاريخ الوصول",
    checkOut: "تاريخ المغادرة",
    guests: "النزلاء",
    guestSingle: "نزيل واحد",
    guestPlural: "نزلاء",
    guestPlus: "6+ نزلاء",
    searchBtn: "بحث ومقارنة",
    trustSavings: "توفير 18% في المتوسط مقارنة بالمنصات التقليدية",
    trustMultiPlatform: "مقارنة شفافة وموثوقة: تدقيق أكثر من 4 منصات",
    trustDirectPerks: "مزايا الحجز المباشر: فطور مجاني، هدايا ترحيبية ودخول ميسر",

    typeAll: "جميع الإقامات",
    typeVilla: "فيلات فاخرة",
    typeHotel: "فنادق",
    typeApartment: "شقق",
    typeChalet: "شاليهات",
    typeResort: "منتجعات وسبا",
    typeDormitory: "مهاجع ونزل",

    filters: "تصفية حسب:",
    amenityPool: "مسبح",
    amenitySeaView: "إطلالة بحرية",
    amenitySpa: "سبا وجاكوزي",
    amenityWifi: "واي فاي فائق السرعة",
    amenityAC: "تكييف هواء",
    amenityKitchen: "مطبخ متكامل",
    sortBy: "ترتيب:",
    sortPopular: "الأكثر شهرة",
    sortPriceAsc: "السعر: من الأقل للأعلى",
    sortPriceDesc: "السعر: من الأعلى للأقل",
    sortRating: "الأعلى تقييماً (4.9+)",
    showingStays: "عرض",
    matching: "المطابقة لـ",
    resetFilters: "إعادة ضبط الفلاتر",
    noResultsTitle: "لم يتم العثور على أماكن إقامة مطابقة",
    noResultsSub: "جرب تعديل وجهة البحث أو نوع الإقامة أو إزالة بعض خيارات التصفية.",
    viewAllBtn: "عرض جميع الإقامات",

    featured: "مميز ومختار",
    bestRateAvailable: "أفضل سعر متاح",
    night: "/ ليلة",
    saveVs: "وفر",
    compareRates: "قارن الأسعار",
    instantBook: "حجز فوري",
    addToWishlist: "إضافة إلى المفضلة",
    removeFromWishlist: "إزالة من المفضلة",
    addToCompare: "إضافة للمقارنة",
    removeFromCompare: "إزالة من المقارنة",
    reviews: "تقييم",

    rateAuditBadge: "تدقيق الأسعار المباشر",
    matrixTitle: "الحجز المباشر مقابل باقي المنصات",
    matrixSubtitle: "نقوم بتدقيق القنوات الكبرى لنضمن لك صفقة حقيقية خالية من أي عمولات وسيطة إضافية.",
    youSaveUpTo: "توفر ما يصل إلى",
    forNights: "لمدة",
    lowestPriceVerified: "أقل سعر موثق ومضمون",
    officialDirect: "مباشر ورسمي",
    totalForStay: "الإجمالي",
    bookDirectAndSave: "احجز مباشرة ووفر الآن",
    viewOn: "عرض على",

    selectedForComparison: "إقامات مختارة للمقارنة",
    comparePricesSub: "قارن الأسعار والامتيازات والمواصفات جنباً إلى جنب",
    clearAll: "مسح الكل",
    compareNow: "قارن الآن",
    sideBySideTitle: "المقارنة التفصيلية بين أماكن الإقامة",
    sideBySideSub: "اطلع على أسعار المنصات الحية والمواصفات والمزايا المباشرة الممنوحة.",
    feature: "المواصفات",
    categoryPricing: "مقارنة الأسعار لكل ليلة (مباشر مقابل المنصات)",
    directGuaranteed: "زيريغو مباشر (الأفضل ضماناً)",
    yourSavings: "توفيرك بالحجز المباشر",
    categorySpecs: "مواصفات العقار",
    specType: "النوع",
    specCancellation: "سياسة الإلغاء",
    specCheckInOut: "الوصول / المغادرة",
    categoryAmenities: "المرافق والخدمات المتاحة",
    action: "الإجراء",
    bookOnZirigo: "احجز عبر زيريغو",

    home: "الرئيسية",
    save: "حفظ",
    saved: "محفوظ",
    share: "مشاركة",
    linkCopied: "تم نسخ الرابط بنجاح!",
    guaranteedBestPrice: "أفضل سعر مضمون",
    guaranteedBestPriceSub: "وفر 15% مقارنة بالمنصات الأخرى",
    flexibleCancellation: "إلغاء مرن ومجاني",
    flexibleCancellationSub: "إلغاء مجاني حتى 48 ساعة قبل الموعد",
    directHostPerks: "مزايا المضيف المباشرة",
    directHostPerksSub: "هدايا ترحيبية وتواصل فوري مع المضيف",
    aboutProperty: "حول مكان الإقامة",
    availableRooms: "خيارات الغرف والأجنحة المتاحة",
    selectRoom: "اختيار الغرفة",
    beds: "أسرّة",
    bath: "حمام",
    whatOffers: "المرافق المتاحة في هذا المكان",
    guestReviews: "تقييمات النزلاء الحقيقية",
    reserveDirect: "حجز عبر زيريغو المباشر",
    noChargeYet: "لن يتم خصم المبلغ الآن. تأكيد فوري ومباشر.",

    directBookingTitle: "الحجز المباشر مع المضيف",
    selectRoomUnit: "حدد الجناح أو الغرفة",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "مثال: كريم بن علي",
    email: "البريد الإلكتروني",
    phoneWhatsApp: "الهاتف / واتساب",
    specialRequests: "طلبات خاصة (اختياري)",
    specialRequestsPlaceholder: "تسجيل وصول مبكر، تفضيلات معينة، استقبال من المطار...",
    priceBreakdown: "تفاصيل السعر المباشر",
    cleaningFee: "رسوم التنظيف",
    serviceFee: "رسوم خدمة المنصة",
    waivedFree: "0 مجاناً (معفى بالكامل)",
    otaSavings: "مبلغ التوفير مقارنة بمواقع الحجز",
    totalAmount: "المبلغ الإجمالي",
    directGuarantees: "ضمانات الحجز المباشر:",
    guaranteeSecure: "دفع آمن ومحمي 100%",
    guaranteeDirectContact: "تواصل مباشر مع مالك العقار",
    guaranteeCancellation: "احترام كامل لسياسة الإلغاء المرنة",
    confirmBookingBtn: "تأكيد الحجز المباشر الآن",
    confirmedTitle: "تم تأكيد حجزك بنجاح!",
    allSet: "تم تأكيد طلبك بنجاح!",
    confirmedSub: "تم تأمين حجزك المباشر بأفضل سعر مضمون وبدون أي عمولات إضافية.",
    confirmationCode: "رمز التأكيد:",
    dates: "التواريخ:",
    selectedUnit: "الوحدة المختارة:",
    totalPaid: "المبلغ الإجمالي المدفوع:",
    savedBanner: "مبروك! لقد وفرت مالك عبر الحجز المباشر على زيريغو!",
    emailSentNote: "تم إرسال بريد التأكيد الإلكتروني ودليل الوصول إلى",
    doneBtn: "تم بنجاح",

    whyBadge: "ما الذي يميز زيريغو؟",
    whyTitle: "لماذا يفضل المسافرون الحجز عبر زيريغو",
    whySubtitle: "تفرض منصات ووكالات السفر التقليدية عمولات تصل إلى 20% يتحملها المسافر. نحن نزيل الوسطاء لنقدم لك السعر الصافي.",
    why1Title: "أدنى الأسعار المضمونة",
    why1Desc: "نقارن الأسعار عبر إير بي إن بي وبوكينج وأجودا، ثم نربطك مباشرة بأسعار المضيفين التي تقل بنسبة تتراوح بين 10% و25%.",
    why2Title: "مزايا استثنائية من المضيف",
    why2Desc: "يقدم المضيفون وجبات إفطار فاخرة مجانية ومشروبات ترحيبية ومرونة في ساعات الوصول عند الحجز عبر زيريغو.",
    why3Title: "خالٍ تماماً من الرسوم الخفية",
    why3Desc: "السعر الذي تراه هو السعر النهائي الذي تدفعه. لن تفاجأ بأي رسوم خدمة إضافية غير متوقعة عند الدفع.",

    footerDesc: "محرك مقارنة أسعار الإقامات الشفاف والأول من نوعه. نراقب المنصات الكبرى على مدار الساعة لنضمن لك الحجز بأفضل سعر واقعي مع هدايا حصرية.",
    footerGuarantee: "ضمان أفضل سعر مباشر • بدون رسوم خدمة مخفية",
    destinationsCol: "الوجهات المميزة",
    comparisonCol: "مقارنة المنصات",
    hostsCol: "للمضيفين وأصحاب الفنادق",
    copyright: "جميع الحقوق محفوظة لشركة زيريغو. مطور باستخدام Next.js وTurbo وDrizzle ORM.",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    cookies: "إعدادات ملفات تعريف الارتباط",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  ext: ExtendedSiteTranslations;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: "fr",
  setLanguage: () => {},
  t: TRANSLATIONS.fr,
  ext: EXTENDED_TRANSLATIONS.fr,
  dir: "ltr",
  isRTL: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("zirigo_language") as Language;
    if (saved && (saved === "en" || saved === "fr" || saved === "ar")) {
      setLanguageState(saved);
      applyLanguage(saved);
    } else {
      applyLanguage("fr");
    }
  }, []);

  const applyLanguage = (lang: Language) => {
    const isArabic = lang === "ar";
    const dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    if (isArabic) {
      document.documentElement.setAttribute("data-rtl", "true");
    } else {
      document.documentElement.removeAttribute("data-rtl");
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("zirigo_language", lang);
    applyLanguage(lang);
  };

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";
  const t = TRANSLATIONS[language];
  const ext = EXTENDED_TRANSLATIONS[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, ext, dir, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

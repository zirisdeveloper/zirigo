"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Tag, Store, X, Check } from "lucide-react";
import { AdBanner } from "../lib/types";
import { useI18n } from "../lib/i18n";
import styles from "./AdAndCategoryStrip.module.css";

interface AdAndCategoryStripProps {
  selectedTypes: string[];
  onToggleCategory: (type: string) => void;
  onClearCategories: () => void;
  onSelectAdCategory?: (type: string) => void;
  matchedCount?: number;
}

const FALLBACK_ADS: AdBanner[] = [
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

export function AdAndCategoryStrip({
  selectedTypes,
  onToggleCategory,
  onClearCategories,
  onSelectAdCategory,
  matchedCount,
}: AdAndCategoryStripProps) {
  const { ext, language, isRTL } = useI18n();
  const [ads, setAds] = useState<AdBanner[]>(FALLBACK_ADS);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/ads")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAds(data);
        }
      })
      .catch(() => {
        // fallback remains intact
      });
  }, []);

  const mainAds = ads.filter((a) => a.placement === "main" && a.isActive);
  const sideAds = ads.filter((a) => a.placement === "side" && a.isActive);

  useEffect(() => {
    if (mainAds.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % mainAds.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [mainAds.length, isPaused]);

  const currentMain = mainAds[activeSlide % Math.max(mainAds.length, 1)] || FALLBACK_ADS[0];
  const currentSide = sideAds[0] || FALLBACK_ADS[1];

  const categories = [
    {
      id: "hotel",
      label: ext.catHotels,
      image: "/images/categories/hotels.jpg",
    },
    {
      id: "apartment",
      label: ext.catApartments,
      image: "/images/categories/apartments.jpg",
    },
    {
      id: "villa",
      label: ext.catVillas,
      image: "/images/categories/villas.svg",
    },
    {
      id: "chalet",
      label: ext.catChalets,
      image: "/images/categories/chalets.svg",
    },
    {
      id: "resort",
      label: ext.catResorts,
      image: "/images/categories/resorts.svg",
    },
    {
      id: "dormitory",
      label: ext.catDormitories,
      image: "/images/categories/dormitories.svg",
    },
  ];

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onToggleCategory(categoryId);
  };

  const handleAdClick = (ad: AdBanner, e: React.MouseEvent) => {
    if (ad.filterType && ad.filterType !== "all") {
      e.preventDefault();
      if (onSelectAdCategory) {
        onSelectAdCategory(ad.filterType);
      } else {
        onToggleCategory(ad.filterType);
      }
      scrollToCatalog();
    }
  };

  return (
    <section className={styles.showcaseBand} aria-label={ext.adSponsoredBadge}>
      <div className={`container ${styles.showcaseContainer}`}>
        {/* 1. Asymmetric Advertising Row (Main Carousel + Companion Partner Slot) */}
        <div className={styles.adsGrid}>
          {/* Main Ad Carousel */}
          <div
            className={styles.mainBannerWrapper}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <span className={styles.adCornerTag}>{ext.adSponsoredBadge}</span>

            <Link
              href={currentMain.targetUrl || "#catalog"}
              onClick={(e) => handleAdClick(currentMain, e)}
              className={styles.bannerLinkCard}
            >
              <img
                src={currentMain.imageUrl}
                alt={currentMain.title[language] || currentMain.brandName}
                className={styles.bannerImage}
              />

              {!currentMain.isFullArtwork && (
                <>
                  <div className={styles.mainScrim} />
                  <div className={styles.mainBannerContent}>
                    <div className={styles.bannerTopRow}>
                      <span
                        className={styles.brandBadge}
                        style={{ backgroundColor: currentMain.accentColor || "#0d9488" }}
                      >
                        <Sparkles size={12} />
                        <span>{currentMain.brandName}</span>
                      </span>
                      {currentMain.badgeText?.[language] && (
                        <span className={styles.sponsorPill}>
                          {currentMain.badgeText[language]}
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className={styles.mainHeadline}>{currentMain.title[language]}</h2>
                      {currentMain.subtitle?.[language] && (
                        <p className={styles.mainSubtitle}>{currentMain.subtitle[language]}</p>
                      )}
                    </div>

                    <div className={styles.mainBottomRow}>
                      {currentMain.contactOrPromo && (
                        <span className={styles.promoContactChip}>
                          <Tag size={13} />
                          <span>{currentMain.contactOrPromo}</span>
                        </span>
                      )}
                      <span className={styles.mainCtaBtn}>
                        <span>{currentMain.ctaText[language]}</span>
                        <ArrowRight
                          size={15}
                          style={isRTL ? { transform: "rotate(180deg)" } : undefined}
                        />
                      </span>
                    </div>
                  </div>
                </>
              )}
            </Link>

            {mainAds.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() =>
                    setActiveSlide((prev) => (prev - 1 + mainAds.length) % mainAds.length)
                  }
                  className={`${styles.navArrow} ${styles.navPrev}`}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % mainAds.length)}
                  className={`${styles.navArrow} ${styles.navNext}`}
                >
                  <ChevronRight size={18} />
                </button>

                <div className={styles.carouselDots}>
                  {mainAds.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Slide ${idx + 1}`}
                      onClick={() => setActiveSlide(idx)}
                      className={`${styles.dotBtn} ${
                        idx === activeSlide % mainAds.length ? styles.dotBtnActive : ""
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Side Companion Ad Slot */}
          <div className={styles.sideBannerWrapper}>
            <span className={styles.adCornerTag}>{currentSide.badgeText[language]}</span>
            <Link
              href={currentSide.targetUrl || "/espace-perso/ajouter"}
              onClick={(e) => handleAdClick(currentSide, e)}
              className={styles.bannerLinkCard}
            >
              <img
                src={currentSide.imageUrl}
                alt={currentSide.title[language] || currentSide.brandName}
                className={styles.bannerImage}
              />

              {!currentSide.isFullArtwork && (
                <>
                  <div className={styles.sideScrim} />
                  <div className={styles.sideBannerContent}>
                    <div className={styles.bannerTopRow}>
                      <span
                        className={styles.brandBadge}
                        style={{ backgroundColor: currentSide.accentColor || "#1d4ed8" }}
                      >
                        <Store size={12} />
                        <span>{currentSide.brandName}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className={styles.sideTitle}>{currentSide.title[language]}</h3>
                      {currentSide.subtitle?.[language] && (
                        <p className={styles.sideSubtitle}>{currentSide.subtitle[language]}</p>
                      )}
                    </div>

                    <span className={styles.sideCtaPill}>
                      <span>{currentSide.ctaText[language]}</span>
                      <ArrowRight
                        size={14}
                        style={isRTL ? { transform: "rotate(180deg)" } : undefined}
                      />
                    </span>
                  </div>
                </>
              )}
            </Link>
          </div>
        </div>

        {/* 2. Illustrated Circular Category Strip (Multi-select) */}
        <div className={styles.categoriesRowWrapper}>
          <div className={styles.categoriesRow} role="group" aria-label="Accommodation categories">
            {categories.map((cat) => {
              const isSelected = selectedTypes.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`${styles.categoryCardBtn} ${
                    isSelected ? styles.categoryCardActive : ""
                  }`}
                >
                  <div className={styles.categoryCircleWrap}>
                    <div className={styles.categoryCircle}>
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className={styles.categoryImg}
                      />
                    </div>
                    {isSelected && (
                      <span className={styles.categoryCheckBadge}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className={styles.categoryLabel}>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {selectedTypes.length > 0 && (
            <div className={styles.categoryActionsRow}>
              {typeof matchedCount === "number" && (
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className={styles.jumpResultsChip}
                >
                  <span>
                    {matchedCount} {ext.staysWord}
                  </span>
                  <ArrowRight size={13} style={{ transform: "rotate(90deg)" }} />
                </button>
              )}
              <button
                type="button"
                onClick={onClearCategories}
                className={styles.resetCategoryChip}
              >
                <X size={13} />
                <span>{ext.catShowAll}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


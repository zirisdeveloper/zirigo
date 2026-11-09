"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { HeroSearch } from "../components/HeroSearch";
import { PropertyCard } from "../components/PropertyCard";
import { CompareDrawer } from "../components/CompareDrawer";
import { BookingModal } from "../components/BookingModal";
import { Footer } from "../components/Footer";
import { PROPERTIES, getProperties } from "../lib/data";
import { Property } from "../lib/types";
import { useI18n } from "../lib/i18n";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  ShieldCheck,
  Zap,
  TrendingDown,
  Building,
  Check,
} from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  const { t, isRTL } = useI18n();

  const [activeType, setActiveType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"popular" | "price_asc" | "price_desc" | "rating">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currency, setCurrency] = useState("EUR");

  // Dynamic properties loaded from store / API
  const [propertiesList, setPropertiesList] = useState<Property[]>(PROPERTIES);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPropertiesList(data);
        }
      })
      .catch((err) => console.error("Error fetching live properties:", err));
  }, []);

  // Interaction State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  const AMENITY_FILTERS = [
    { id: "pool", label: t.amenityPool },
    { id: "ocean_view", label: t.amenitySeaView },
    { id: "spa", label: t.amenitySpa },
    { id: "wifi", label: t.amenityWifi },
    { id: "air_conditioning", label: t.amenityAC },
    { id: "kitchen", label: t.amenityKitchen },
  ];

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle compare (max 3 items)
  const handleToggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert(isRTL ? "يمكنك مقارنة 3 أماكن إقامة كحد أقصى في وقت واحد." : "You can compare up to 3 accommodations simultaneously.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleToggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return propertiesList
      .filter((prop) => {
        if (activeType !== "all" && prop.type !== activeType) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = prop.title.toLowerCase().includes(q);
          const matchCity = prop.city.toLowerCase().includes(q);
          const matchCountry = prop.country.toLowerCase().includes(q);
          if (!matchTitle && !matchCity && !matchCountry) return false;
        }
        if (minRating > 0 && prop.rating < minRating) return false;
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) => prop.amenities.includes(amenity));
          if (!hasAll) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA =
          a.rates?.find((r) => r.platformName.toLowerCase().includes("direct"))?.pricePerNight ||
          a.rates?.[0]?.pricePerNight ||
          0;
        const priceB =
          b.rates?.find((r) => r.platformName.toLowerCase().includes("direct"))?.pricePerNight ||
          b.rates?.[0]?.pricePerNight ||
          0;

        switch (sortBy) {
          case "price_asc":
            return priceA - priceB;
          case "price_desc":
            return priceB - priceA;
          case "rating":
            return b.rating - a.rating;
          case "popular":
          default:
            return b.reviewCount - a.reviewCount;
        }
      });
  }, [propertiesList, searchQuery, activeType, minRating, selectedAmenities, sortBy]);

  const comparedProperties = useMemo(() => {
    return propertiesList.filter((p) => comparedIds.includes(p.id));
  }, [propertiesList, comparedIds]);

  return (
    <main className={styles.main}>
      {/* Navbar */}
      <Navbar
        favoriteCount={favorites.length}
        compareCount={comparedIds.length}
        onOpenCompare={() => {
          if (comparedIds.length === 0) {
            alert(isRTL ? "يرجى تحديد مكان إقامة واحد على الأقل للمقارنة عبر النقر على أيقونة الميزان (⚖️)." : "Please select at least one property using the compare icon (⚖️) to view the comparison table.");
          }
        }}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Hero & Search Engine */}
      <HeroSearch
        activeType={activeType}
        onTypeChange={setActiveType}
        onSearch={({ query, type }) => {
          setSearchQuery(query);
          setActiveType(type);
        }}
      />

      {/* Main Catalog Section */}
      <section className={`container ${styles.catalogSection}`}>
        {/* Filter and Control Bar */}
        <div className={styles.filterBar}>
          {/* Quick Amenity Pills */}
          <div className={styles.amenityFilterGroup}>
            <span className={styles.filterGroupLabel}>
              <SlidersHorizontal size={14} />
              <span>{t.filters}</span>
            </span>
            {AMENITY_FILTERS.map((am) => {
              const active = selectedAmenities.includes(am.id);
              return (
                <button
                  key={am.id}
                  onClick={() => handleToggleAmenity(am.id)}
                  className={`${styles.amenityFilterBtn} ${active ? styles.amenityFilterActive : ""}`}
                >
                  {active && <Check size={12} />}
                  <span>{am.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Sort & View Mode */}
          <div className={styles.rightControls}>
            {/* Sort Dropdown */}
            <div className={styles.sortWrapper}>
              <span className={styles.sortLabel}>{t.sortBy}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.sortSelect}
              >
                <option value="popular">{t.sortPopular}</option>
                <option value="price_asc">{t.sortPriceAsc}</option>
                <option value="price_desc">{t.sortPriceDesc}</option>
                <option value="rating">{t.sortRating}</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className={styles.viewToggleGroup}>
              <button
                onClick={() => setViewMode("grid")}
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter summary */}
        <div className={styles.resultsInfoRow}>
          <div className={styles.resultsCount}>
            {t.showingStays} <strong>{filteredProperties.length}</strong> {t.typeAll.toLowerCase()}
            {searchQuery && <span> {t.matching} "{searchQuery}"</span>}
          </div>

          {(searchQuery || selectedAmenities.length > 0 || activeType !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveType("all");
                setSelectedAmenities([]);
                setMinRating(0);
              }}
              className={styles.resetFiltersBtn}
            >
              {t.resetFilters}
            </button>
          )}
        </div>

        {/* Properties Grid / List */}
        {filteredProperties.length > 0 ? (
          <div className={viewMode === "grid" ? styles.propertiesGrid : styles.propertiesList}>
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                currency={currency}
                isFavorite={favorites.includes(prop.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompared={comparedIds.includes(prop.id)}
                onToggleCompare={handleToggleCompare}
                onOpenBookingModal={setBookingProperty}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Building size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>{t.noResultsTitle}</h3>
            <p className={styles.emptySub}>{t.noResultsSub}</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveType("all");
                setSelectedAmenities([]);
              }}
              className="btn btn-primary"
            >
              {t.viewAllBtn}
            </button>
          </div>
        )}

        {/* Why Zirigo Direct Booking Section */}
        <div className={styles.whyZirigoSection}>
          <div className={styles.whyHeader}>
            <span className={styles.whyBadge}>{t.whyBadge}</span>
            <h2 className={styles.whyTitle}>{t.whyTitle}</h2>
            <p className={styles.whySubtitle}>{t.whySubtitle}</p>
          </div>

          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIconWrapper}>
                <TrendingDown size={24} />
              </div>
              <h4 className={styles.whyCardTitle}>{t.why1Title}</h4>
              <p className={styles.whyCardText}>{t.why1Desc}</p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconWrapper}>
                <Zap size={24} />
              </div>
              <h4 className={styles.whyCardTitle}>{t.why2Title}</h4>
              <p className={styles.whyCardText}>{t.why2Desc}</p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconWrapper}>
                <ShieldCheck size={24} />
              </div>
              <h4 className={styles.whyCardTitle}>{t.why3Title}</h4>
              <p className={styles.whyCardText}>{t.why3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Compare Drawer */}
      <CompareDrawer
        properties={comparedProperties}
        currency={currency}
        onRemove={(id) => setComparedIds((prev) => prev.filter((item) => item !== id))}
        onClear={() => setComparedIds([])}
        onSelectDirectBooking={(prop) => setBookingProperty(prop)}
      />

      {/* Booking Modal */}
      <BookingModal
        property={bookingProperty}
        currency={currency}
        onClose={() => setBookingProperty(null)}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}

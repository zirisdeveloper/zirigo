"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { AdAndCategoryStrip } from "../components/AdAndCategoryStrip";
import { HeroSearch, SearchDateMode } from "../components/HeroSearch";
import { PropertyCard } from "../components/PropertyCard";
import { CompareDrawer } from "../components/CompareDrawer";
import { BookingModal } from "../components/BookingModal";
import { Footer } from "../components/Footer";
import { PROPERTIES, getProperties } from "../lib/data";
import { AvailabilityBlock, Property } from "../lib/types";
import { useDisplaySettings } from "../lib/displaySettingsContext";
import { matchesPropertyQuery, matchesPropertyCategory } from "../lib/searchUtils";
import { datesOverlap, isValidIsoDate } from "../lib/dateUtils";
import { useI18n, localizeProperty, translateAmenity, translateCancellation } from "../lib/i18n";
import { usePreferences } from "../lib/preferencesContext";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  ShieldCheck,
  Zap,
  TrendingDown,
  Building,
  Check,
  BellRing,
  Plus,
  X,
  Star,
} from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  const { t, ext, language, isRTL } = useI18n();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateMode, setDateMode] = useState<SearchDateMode>("fixed");
  const [searchDates, setSearchDates] = useState<{ checkIn: string; checkOut: string }>({
    checkIn: "2026-06-15",
    checkOut: "2026-06-16",
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedCancellations, setSelectedCancellations] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "price_asc" | "price_desc" | "rating">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { currency, setCurrency } = usePreferences();

  // Dynamic properties, display settings & blocked date ranges loaded from store / API
  const [propertiesList, setPropertiesList] = useState<Property[]>(PROPERTIES);
  const [allBlockedRanges, setAllBlockedRanges] = useState<AvailabilityBlock[]>([]);
  const { displaySettings } = useDisplaySettings();

  const loadAvailabilitySnapshot = () => {
    fetch("/api/availability")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.blocks)) {
          setAllBlockedRanges(data.blocks);
        }
      })
      .catch(() => {
        // fallback cleanly
      });
  };

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

    loadAvailabilitySnapshot();

    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");
    if (
      typeParam &&
      ["hotel", "apartment", "villa", "chalet", "resort", "dorm"].includes(typeParam)
    ) {
      setSelectedTypes([typeParam]);
    }

    const handleSelectCategory = (event: Event) => {
      const customEvent = event as CustomEvent<{ type?: string }>;
      const type = customEvent.detail?.type;
      if (
        type &&
        ["hotel", "apartment", "villa", "chalet", "resort", "dorm"].includes(type)
      ) {
        setSelectedTypes([type]);
        document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("zirigo:select-category", handleSelectCategory);
    return () => {
      window.removeEventListener("zirigo:select-category", handleSelectCategory);
    };
  }, []);

  // Interaction State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);

  const PREFERRED_QUICK_AMENITIES = ["pool", "ocean_view", "spa", "wifi", "air_conditioning", "kitchen"];

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
        alert(ext.maxCompareAlert);
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

  const handleToggleStar = (starsValue: number) => {
    setSelectedStars((prev) =>
      prev.includes(starsValue)
        ? prev.filter((s) => s !== starsValue)
        : [...prev, starsValue]
    );
  };

  const handleToggleCancellation = (policyId: string) => {
    setSelectedCancellations((prev) =>
      prev.includes(policyId)
        ? prev.filter((c) => c !== policyId)
        : [...prev, policyId]
    );
  };

  const handleToggleType = (typeId: string) => {
    if (typeId === "all") {
      setSelectedTypes([]);
      return;
    }
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((tItem) => tItem !== typeId) : [...prev, typeId]
    );
  };

  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setDateMode("fixed");
    setSelectedAmenities([]);
    setSelectedStars([]);
    setSelectedCancellations([]);
    setMinRating(0);
    setShowMoreFilters(false);
  };

  // Base properties matched by current search, categories & fixed-date availability
  const searchMatchedProperties = useMemo(() => {
    const hasValidFixedRange =
      dateMode === "fixed" &&
      isValidIsoDate(searchDates.checkIn) &&
      isValidIsoDate(searchDates.checkOut) &&
      searchDates.checkIn < searchDates.checkOut;

    return propertiesList.filter((prop) => {
      if (!matchesPropertyCategory(prop, selectedTypes)) return false;
      if (searchQuery && !matchesPropertyQuery(prop, searchQuery)) {
        return false;
      }
      if (hasValidFixedRange) {
        const isReserved = allBlockedRanges.some(
          (blk) =>
            blk.propertyId === prop.id &&
            datesOverlap(searchDates.checkIn, searchDates.checkOut, blk.startDate, blk.endDate)
        );
        if (isReserved) return false;
      }
      return true;
    });
  }, [propertiesList, selectedTypes, searchQuery, dateMode, searchDates, allBlockedRanges]);

  // All filters dynamically extracted from database listings matching the current search
  const dynamicDbFilters = useMemo(() => {
    const amenityCounts = new Map<string, number>();
    const starCounts = new Map<number, number>();
    const cancellationCounts = new Map<string, number>();

    for (const prop of searchMatchedProperties) {
      const uniqueAmenities = new Set(prop.amenities || []);
      for (const am of uniqueAmenities) {
        amenityCounts.set(am, (amenityCounts.get(am) || 0) + 1);
      }
      if (typeof prop.stars === "number" && prop.stars > 0) {
        starCounts.set(prop.stars, (starCounts.get(prop.stars) || 0) + 1);
      }
      if (prop.cancellationPolicy) {
        cancellationCounts.set(
          prop.cancellationPolicy,
          (cancellationCounts.get(prop.cancellationPolicy) || 0) + 1
        );
      }
    }

    const amenities = Array.from(amenityCounts.entries())
      .map(([id, count]) => ({
        id,
        count,
        label: translateAmenity(id, language),
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    const stars = Array.from(starCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.value - a.value);

    const cancellations = Array.from(cancellationCounts.entries())
      .map(([id, count]) => ({
        id,
        count,
        label: translateCancellation(id, language),
      }))
      .sort((a, b) => b.count - a.count);

    return { amenities, stars, cancellations };
  }, [searchMatchedProperties, language]);

  // Up to 6 quick pills relevant to searched properties + any extra active amenities
  const quickAmenityPills = useMemo(() => {
    const availableMap = new Map(dynamicDbFilters.amenities.map((a) => [a.id, a]));
    const pickedIds: string[] = [];

    for (const id of PREFERRED_QUICK_AMENITIES) {
      if (availableMap.has(id)) {
        pickedIds.push(id);
      }
    }
    for (const item of dynamicDbFilters.amenities) {
      if (pickedIds.length >= 6) break;
      if (!pickedIds.includes(item.id)) {
        pickedIds.push(item.id);
      }
    }
    for (const activeId of selectedAmenities) {
      if (!pickedIds.includes(activeId)) {
        pickedIds.push(activeId);
      }
    }

    return pickedIds.map((id) => ({
      id,
      label: availableMap.get(id)?.label || translateAmenity(id, language),
      count: availableMap.get(id)?.count ?? 0,
    }));
  }, [dynamicDbFilters.amenities, selectedAmenities, language]);

  const extraActiveFiltersCount = useMemo(() => {
    const quickSet = new Set(quickAmenityPills.slice(0, 6).map((q) => q.id));
    const extraAmenities = selectedAmenities.filter((id) => !quickSet.has(id)).length;
    return (
      extraAmenities +
      selectedStars.length +
      selectedCancellations.length +
      (minRating > 0 ? 1 : 0)
    );
  }, [quickAmenityPills, selectedAmenities, selectedStars, selectedCancellations, minRating]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return searchMatchedProperties
      .filter((prop) => {
        if (minRating > 0 && prop.rating < minRating) return false;
        if (selectedStars.length > 0 && !selectedStars.includes(prop.stars)) return false;
        if (
          selectedCancellations.length > 0 &&
          !selectedCancellations.includes(prop.cancellationPolicy)
        ) {
          return false;
        }
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
  }, [
    searchMatchedProperties,
    minRating,
    selectedStars,
    selectedCancellations,
    selectedAmenities,
    sortBy,
  ]);

  const comparedProperties = useMemo(() => {
    return propertiesList.filter((p) => comparedIds.includes(p.id));
  }, [propertiesList, comparedIds]);

  const alertTargetUrl = useMemo(() => {
    const params = new URLSearchParams({ create: "1" });
    if (searchQuery) params.set("query", searchQuery);
    if (selectedTypes.length === 1) params.set("type", selectedTypes[0]);
    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
    if (minRating > 0) params.set("minRating", String(minRating));
    return `/espace-perso/alertes?${params.toString()}`;
  }, [searchQuery, selectedTypes, selectedAmenities, minRating]);

  return (
    <main className={styles.main}>
      {/* Navbar */}
      <Navbar
        favoriteCount={favorites.length}
        compareCount={comparedIds.length}
        onOpenCompare={() => {
          if (comparedIds.length === 0) {
            alert(
              language === "ar"
                ? "يرجى تحديد مكان إقامة واحد على الأقل للمقارنة عبر النقر على أيقونة الميزان (⚖️)."
                : language === "fr"
                  ? "Veuillez sélectionner au moins un hébergement avec l'icône balance (⚖️) pour afficher le comparatif."
                  : "Please select at least one property using the compare icon (⚖️) to view the comparison table."
            );
          }
        }}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Ad Space & Circular Category Strip */}
      <AdAndCategoryStrip
        selectedTypes={selectedTypes}
        onToggleCategory={handleToggleType}
        onClearCategories={() => setSelectedTypes([])}
        onSelectAdCategory={(type) => setSelectedTypes([type])}
        matchedCount={filteredProperties.length}
        displaySettings={displaySettings}
      />

      {/* Hero & Search Engine */}
      <HeroSearch
        searchQuery={searchQuery}
        dateMode={dateMode}
        dates={searchDates}
        displaySettings={displaySettings}
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
        onDateFilterChange={(mode, dates) => {
          setDateMode(mode);
          setSearchDates(dates);
        }}
        onSearch={({ query, types, dateMode: mode, dates }) => {
          setSearchQuery(query);
          setSelectedTypes(types);
          setDateMode(mode);
          setSearchDates(dates);
        }}
      />

      {/* Main Catalog Section */}
      <section id="catalog" className={`container ${styles.catalogSection}`}>
        {/* Filter and Control Bar */}
        <div className={styles.filterBar}>
          {/* Quick Amenity Pills + More (+) DB Filters Button */}
          <div className={styles.amenityFilterGroup}>
            <span className={styles.filterGroupLabel}>
              <SlidersHorizontal size={14} />
              <span>{t.filters}</span>
            </span>
            {quickAmenityPills.map((am) => {
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

            <button
              type="button"
              onClick={() => setShowMoreFilters((prev) => !prev)}
              aria-expanded={showMoreFilters}
              className={`${styles.moreFiltersBtn} ${showMoreFilters || extraActiveFiltersCount > 0 ? styles.moreFiltersBtnActive : ""
                }`}
            >
              <Plus
                size={14}
                style={
                  showMoreFilters
                    ? { transform: "rotate(45deg)", transition: "transform 0.2s ease" }
                    : { transition: "transform 0.2s ease" }
                }
              />
              <span>{ext.moreFilters}</span>
              <span className={styles.moreFiltersCountBadge}>
                {extraActiveFiltersCount > 0
                  ? extraActiveFiltersCount
                  : dynamicDbFilters.amenities.length}
              </span>
            </button>
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

        {/* Expanded Database Filters Panel ("+ Autres") */}
        {showMoreFilters && (
          <div className={styles.moreFiltersPanel}>
            <div className={styles.moreFiltersHeader}>
              <div>
                <h3 className={styles.moreFiltersTitle}>{ext.allDbFiltersTitle}</h3>
                <p className={styles.moreFiltersSub}>{ext.allDbFiltersSub}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreFilters(false)}
                className={styles.moreFiltersCloseBtn}
              >
                <X size={14} />
                <span>{ext.closeFilters}</span>
              </button>
            </div>

            <div className={styles.moreFiltersSections}>
              {/* All Database Amenities for Searched Properties */}
              {dynamicDbFilters.amenities.length > 0 && (
                <div>
                  <div className={styles.moreFilterSectionTitle}>
                    {ext.dbAmenitiesLabel} ({dynamicDbFilters.amenities.length})
                  </div>
                  <div className={styles.moreFilterChips}>
                    {dynamicDbFilters.amenities.map((am) => {
                      const active = selectedAmenities.includes(am.id);
                      return (
                        <button
                          key={am.id}
                          type="button"
                          onClick={() => handleToggleAmenity(am.id)}
                          className={`${styles.amenityFilterBtn} ${active ? styles.amenityFilterActive : ""
                            }`}
                        >
                          {active && <Check size={12} />}
                          <span>{am.label}</span>
                          <span className={styles.filterItemCount}>({am.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stars Classification */}
              {dynamicDbFilters.stars.length > 0 && (
                <div>
                  <div className={styles.moreFilterSectionTitle}>{ext.dbStarsLabel}</div>
                  <div className={styles.moreFilterChips}>
                    {dynamicDbFilters.stars.map((st) => {
                      const active = selectedStars.includes(st.value);
                      return (
                        <button
                          key={st.value}
                          type="button"
                          onClick={() => handleToggleStar(st.value)}
                          className={`${styles.amenityFilterBtn} ${active ? styles.amenityFilterActive : ""
                            }`}
                        >
                          {active && <Check size={12} />}
                          <Star size={12} fill="currentColor" />
                          <span>{st.value} ★</span>
                          <span className={styles.filterItemCount}>({st.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              {dynamicDbFilters.cancellations.length > 0 && (
                <div>
                  <div className={styles.moreFilterSectionTitle}>{ext.dbCancellationLabel}</div>
                  <div className={styles.moreFilterChips}>
                    {dynamicDbFilters.cancellations.map((pol) => {
                      const active = selectedCancellations.includes(pol.id);
                      return (
                        <button
                          key={pol.id}
                          type="button"
                          onClick={() => handleToggleCancellation(pol.id)}
                          className={`${styles.amenityFilterBtn} ${active ? styles.amenityFilterActive : ""
                            }`}
                        >
                          {active && <Check size={12} />}
                          <span>{pol.label}</span>
                          <span className={styles.filterItemCount}>({pol.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Minimum Rating */}
              <div>
                <div className={styles.moreFilterSectionTitle}>{ext.dbMinRatingLabel}</div>
                <div className={styles.moreFilterChips}>
                  {[0, 4.5, 4.8, 4.9].map((score) => {
                    const active = minRating === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setMinRating(score)}
                        className={`${styles.amenityFilterBtn} ${active ? styles.amenityFilterActive : ""
                          }`}
                      >
                        {active && <Check size={12} />}
                        <span>{score === 0 ? ext.all : `${score}+ ★`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Counter & Active Filter summary */}
        <div className={styles.resultsInfoRow}>
          <div className={styles.resultsCount}>
            {t.showingStays} <strong>{filteredProperties.length}</strong> {ext.staysWord}
            {searchQuery && <span> {t.matching} "{searchQuery}"</span>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href={alertTargetUrl}
              className="btn btn-outline"
              style={{
                padding: "0.45rem 0.9rem",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                textDecoration: "none",
              }}
            >
              <BellRing size={14} />
              <span>{ext.createSearchAlertBtn}</span>
            </Link>

            {(searchQuery ||
              dateMode === "flexible" ||
              selectedAmenities.length > 0 ||
              selectedStars.length > 0 ||
              selectedCancellations.length > 0 ||
              minRating > 0 ||
              selectedTypes.length > 0) && (
                <button onClick={handleResetAllFilters} className={styles.resetFiltersBtn}>
                  {t.resetFilters}
                </button>
              )}
          </div>
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
            <button onClick={handleResetAllFilters} className="btn btn-primary">
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
        property={bookingProperty ? localizeProperty(bookingProperty, language) : null}
        currency={currency}
        initialCheckIn={searchDates.checkIn}
        initialCheckOut={searchDates.checkOut}
        onClose={() => {
          setBookingProperty(null);
          loadAvailabilitySnapshot();
        }}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}

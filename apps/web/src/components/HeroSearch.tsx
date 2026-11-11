"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, CalendarCheck2, Users, CheckCircle2, X, Check } from "lucide-react";
import { useI18n, Language } from "../lib/i18n";
import { addDaysIso, isValidIsoDate } from "../lib/dateUtils";
import { DisplaySettings } from "../lib/types";
import styles from "./HeroSearch.module.css";

export type SearchDateMode = "flexible" | "fixed";

interface HeroSearchProps {
  searchQuery?: string;
  dateMode?: SearchDateMode;
  dates?: { checkIn: string; checkOut: string };
  displaySettings?: DisplaySettings;
  onSearch: (params: {
    query: string;
    types: string[];
    dateMode: SearchDateMode;
    guests: number;
    dates: { checkIn: string; checkOut: string };
  }) => void;
  onDateFilterChange?: (
    mode: SearchDateMode,
    dates: { checkIn: string; checkOut: string }
  ) => void;
  selectedTypes: string[];
  onToggleType: (type: string) => void;
}

const POPULAR_DESTINATIONS: Record<Language, string[]> = {
  fr: [
    "Cassis, France",
    "Paris, France",
    "Chamonix, France",
    "Positano, Italie",
    "Marrakech, Maroc",
    "Alger, Algérie",
  ],
  en: [
    "Cassis, France",
    "Paris, France",
    "Chamonix, France",
    "Positano, Italy",
    "Marrakech, Morocco",
    "Algiers, Algeria",
  ],
  ar: [
    "كاسيس، فرنسا",
    "باريس، فرنسا",
    "شاموني، فرنسا",
    "بوسيتانو، إيطاليا",
    "مراكش، المغرب",
    "الجزائر العاصمة، الجزائر",
  ],
};

export function HeroSearch({
  searchQuery,
  dateMode: externalDateMode,
  dates: externalDates,
  displaySettings,
  onSearch,
  onDateFilterChange,
  selectedTypes,
  onToggleType,
}: HeroSearchProps) {
  const { t, ext, language, isRTL } = useI18n();
  const av = ext.availability;
  const [query, setQuery] = useState(searchQuery || "");
  const [dateMode, setDateMode] = useState<SearchDateMode>(externalDateMode || "flexible");
  const [checkIn, setCheckIn] = useState(externalDates?.checkIn || "2026-06-15");
  const [checkOut, setCheckOut] = useState(externalDates?.checkOut || "2026-06-16");
  const [guests, setGuests] = useState(2);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const destinationFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (externalDateMode !== undefined) {
      setDateMode(externalDateMode);
    }
  }, [externalDateMode]);

  useEffect(() => {
    if (externalDates) {
      setCheckIn(externalDates.checkIn);
      setCheckOut(externalDates.checkOut);
    }
  }, [externalDates]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        destinationFieldRef.current &&
        !destinationFieldRef.current.contains(event.target as Node)
      ) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const PROPERTY_TYPES = [
    { id: "all", label: t.typeAll },
    { id: "hotel", label: t.typeHotel },
    { id: "apartment", label: t.typeApartment },
    { id: "villa", label: t.typeVilla },
    { id: "chalet", label: t.typeChalet },
    { id: "resort", label: t.typeResort },
    { id: "dormitory", label: t.typeDormitory },
  ];

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDateModeChange = (nextMode: SearchDateMode) => {
    setDateMode(nextMode);
    onDateFilterChange?.(nextMode, { checkIn, checkOut });
  };

  const handleCheckInChange = (nextCheckIn: string) => {
    setCheckIn(nextCheckIn);
    const nextCheckOut = isValidIsoDate(nextCheckIn)
      ? addDaysIso(nextCheckIn, 1)
      : checkOut;
    setCheckOut(nextCheckOut);
    onDateFilterChange?.(dateMode, { checkIn: nextCheckIn, checkOut: nextCheckOut });
  };

  const handleCheckOutChange = (nextCheckOut: string) => {
    setCheckOut(nextCheckOut);
    onDateFilterChange?.(dateMode, { checkIn, checkOut: nextCheckOut });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDestinationDropdown(false);
    onSearch({
      query,
      types: selectedTypes,
      dateMode,
      guests,
      dates: { checkIn, checkOut },
    });
    scrollToCatalog();
  };

  const handleSelectDestination = (dest: string) => {
    setQuery(dest);
    setShowDestinationDropdown(false);
    onSearch({
      query: dest,
      types: selectedTypes,
      dateMode,
      guests,
      dates: { checkIn, checkOut },
    });
    scrollToCatalog();
  };

  const handleClearQuery = () => {
    setQuery("");
    onSearch({
      query: "",
      types: selectedTypes,
      dateMode,
      guests,
      dates: { checkIn, checkOut },
    });
  };

  const destinations = POPULAR_DESTINATIONS[language] || POPULAR_DESTINATIONS.fr;
  const showHeroHeader = displaySettings?.showHeroHeader ?? true;
  const showTypeTabs = displaySettings?.showTypeTabs ?? true;
  const showTrustBanner = displaySettings?.showTrustBanner ?? true;

  const promoText = displaySettings?.heroPromoText?.[language] ?? t.heroPromo;
  const titleText = displaySettings?.heroTitleText?.[language] ?? t.heroTitle2;
  const subtitleText = displaySettings?.heroSubtitleText?.[language] ?? t.heroSubtitle;

  const trustItems = [
    displaySettings?.trustItem1Text?.[language] ?? t.trustSavings,
    displaySettings?.trustItem2Text?.[language] ?? t.trustMultiPlatform,
    displaySettings?.trustItem3Text?.[language] ?? t.trustDirectPerks,
  ].filter((item) => Boolean(item && item.trim().length > 0));

  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroContainer}`}>
        {/* Title & Value Proposition */}
        {showHeroHeader && (
          <div className={styles.heroHeader}>
            {promoText && promoText.trim().length > 0 && (
              <div className={styles.badgePromo}>
                <span className={styles.badgePulse} />
                <span>{promoText}</span>
              </div>
            )}
            <h1 className={styles.heroTitle}>
              {t.heroTitle1 && (
                <>
                  {t.heroTitle1} <br />
                </>
              )}
              <span className={styles.gradientText}>{titleText}</span>
            </h1>
            {subtitleText && subtitleText.trim().length > 0 && (
              <p className={styles.heroSubtitle}>{subtitleText}</p>
            )}
          </div>
        )}

        {/* Accommodation Type Filter Tabs (Multi-select) */}
        {showTypeTabs && (
          <div className={styles.typeTabs}>
            {PROPERTY_TYPES.map((type) => {
              const isSelected =
                type.id === "all"
                  ? selectedTypes.length === 0
                  : selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleType(type.id)}
                  className={`${styles.typeTab} ${isSelected ? styles.typeTabActive : ""}`}
                >
                  {isSelected && type.id !== "all" && <Check size={14} />}
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Date Flexibility Switch (Flexible vs Fixed Dates) */}
        <div className={styles.dateModeRow}>
          <div className={styles.dateModeGroup} role="group" aria-label="Date mode">
            <button
              type="button"
              onClick={() => handleDateModeChange("flexible")}
              className={`${styles.dateModeBtn} ${
                dateMode === "flexible" ? styles.dateModeBtnActive : ""
              }`}
            >
              <Calendar size={14} />
              <span>{av.flexibleDates}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDateModeChange("fixed")}
              className={`${styles.dateModeBtn} ${
                dateMode === "fixed" ? styles.dateModeBtnActive : ""
              }`}
            >
              <CalendarCheck2 size={14} />
              <span>{av.fixedDates}</span>
            </button>
          </div>
          <span className={styles.dateModeHint}>
            {dateMode === "fixed" ? av.fixedDatesHint : av.flexibleDatesHint}
          </span>
        </div>

        {/* Floating Luxury Search Box */}
        <form onSubmit={handleSubmit} className={styles.searchBox}>
          {/* Destination */}
          <div
            ref={destinationFieldRef}
            className={styles.searchField}
            style={{ position: "relative" }}
          >
            <label className={styles.fieldLabel}>
              <MapPin size={15} className={styles.fieldIcon} />
              <span>{t.destination}</span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <input
                type="text"
                placeholder={t.whereGoing}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowDestinationDropdown(true)}
                className={styles.fieldInput}
                style={{ flex: 1, minWidth: 0 }}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  aria-label="Clear destination"
                  style={{
                    color: "var(--text-muted)",
                    padding: "0.2rem",
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: "50%",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {showDestinationDropdown && (
              <div className={`${styles.destinationDropdown} ${isRTL ? styles.rtlDropdown : ""}`}>
                <div className={styles.dropdownTitle}>{t.popularDestinations}</div>
                {destinations.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => handleSelectDestination(dest)}
                    className={styles.dropdownItem}
                  >
                    <MapPin size={14} />
                    <span>{dest}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.divider} />

          {/* Dates */}
          <div className={styles.searchField}>
            <label className={styles.fieldLabel}>
              <Calendar size={15} className={styles.fieldIcon} />
              <span>{t.checkIn}</span>
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.searchField}>
            <label className={styles.fieldLabel}>
              <Calendar size={15} className={styles.fieldIcon} />
              <span>{t.checkOut}</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={isValidIsoDate(checkIn) ? addDaysIso(checkIn, 1) : undefined}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              className={styles.fieldInput}
            />
          </div>

          <div className={styles.divider} />

          {/* Guests */}
          <div className={styles.searchField}>
            <label className={styles.fieldLabel}>
              <Users size={15} className={styles.fieldIcon} />
              <span>{t.guests}</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={styles.fieldInput}
            >
              <option value={1}>{t.guestSingle}</option>
              <option value={2}>2 {t.guestPlural}</option>
              <option value={3}>3 {t.guestPlural}</option>
              <option value={4}>4 {t.guestPlural}</option>
              <option value={6}>{t.guestPlus}</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className={`btn btn-primary ${styles.searchSubmitBtn}`}>
            <Search size={18} />
            <span>{t.searchBtn}</span>
          </button>
        </form>

        {/* Live Trust Metrics */}
        {showTrustBanner && trustItems.length > 0 && (
          <div className={styles.trustBanner}>
            {trustItems.map((itemText, idx) => (
              <div key={idx} className={styles.trustItem}>
                <CheckCircle2 size={16} className={styles.trustIcon} />
                <span>{itemText}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

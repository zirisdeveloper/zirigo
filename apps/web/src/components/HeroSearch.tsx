"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, CheckCircle2 } from "lucide-react";
import { useI18n } from "../lib/i18n";
import styles from "./HeroSearch.module.css";

interface HeroSearchProps {
  onSearch: (params: {
    query: string;
    type: string;
    guests: number;
    dates: { checkIn: string; checkOut: string };
  }) => void;
  activeType: string;
  onTypeChange: (type: string) => void;
}

const POPULAR_DESTINATIONS = [
  "Cassis, France",
  "Paris, France",
  "Chamonix, France",
  "Positano, Italy",
  "Marrakech, Morocco",
  "Algiers, Algeria",
];

export function HeroSearch({ onSearch, activeType, onTypeChange }: HeroSearchProps) {
  const { t, isRTL } = useI18n();
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("2026-06-15");
  const [checkOut, setCheckOut] = useState("2026-06-20");
  const [guests, setGuests] = useState(2);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const PROPERTY_TYPES = [
    { id: "all", label: t.typeAll },
    { id: "villa", label: t.typeVilla },
    { id: "hotel", label: t.typeHotel },
    { id: "apartment", label: t.typeApartment },
    { id: "chalet", label: t.typeChalet },
    { id: "resort", label: t.typeResort },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query,
      type: activeType,
      guests,
      dates: { checkIn, checkOut },
    });
  };

  const handleSelectDestination = (dest: string) => {
    setQuery(dest);
    setShowDestinationDropdown(false);
  };

  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroContainer}`}>
        {/* Title & Value Proposition */}
        <div className={styles.heroHeader}>
          <div className={styles.badgePromo}>
            <span className={styles.badgePulse} />
            <span>{t.heroPromo}</span>
          </div>
          <h1 className={styles.heroTitle}>
            {t.heroTitle1} <br />
            <span className={styles.gradientText}>{t.heroTitle2}</span>
          </h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
        </div>

        {/* Accommodation Type Filter Tabs */}
        <div className={styles.typeTabs}>
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`${styles.typeTab} ${activeType === type.id ? styles.typeTabActive : ""}`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Floating Luxury Search Box */}
        <form onSubmit={handleSubmit} className={styles.searchBox}>
          {/* Destination */}
          <div className={styles.searchField} style={{ position: "relative" }}>
            <label className={styles.fieldLabel}>
              <MapPin size={15} className={styles.fieldIcon} />
              <span>{t.destination}</span>
            </label>
            <input
              type="text"
              placeholder={t.whereGoing}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDestinationDropdown(true)}
              className={styles.fieldInput}
            />
            {showDestinationDropdown && (
              <div className={`${styles.destinationDropdown} ${isRTL ? styles.rtlDropdown : ""}`}>
                <div className={styles.dropdownTitle}>{t.popularDestinations}</div>
                {POPULAR_DESTINATIONS.map((dest) => (
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
              onChange={(e) => setCheckIn(e.target.value)}
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
              onChange={(e) => setCheckOut(e.target.value)}
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
        <div className={styles.trustBanner}>
          <div className={styles.trustItem}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            <span>{t.trustSavings}</span>
          </div>
          <div className={styles.trustItem}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            <span>{t.trustMultiPlatform}</span>
          </div>
          <div className={styles.trustItem}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            <span>{t.trustDirectPerks}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

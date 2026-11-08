"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, SlidersHorizontal, CheckCircle2 } from "lucide-react";
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

const PROPERTY_TYPES = [
  { id: "all", label: "All Stays" },
  { id: "villa", label: "Luxury Villas" },
  { id: "hotel", label: "Boutique Hotels" },
  { id: "apartment", label: "City Lofts" },
  { id: "chalet", label: "Alpine Chalets" },
  { id: "resort", label: "Spa Resorts" },
];

const POPULAR_DESTINATIONS = [
  "Cassis, France",
  "Paris, France",
  "Chamonix, France",
  "Positano, Italy",
  "Marrakech, Morocco",
  "Algiers, Algeria",
];

export function HeroSearch({ onSearch, activeType, onTypeChange }: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("2026-06-15");
  const [checkOut, setCheckOut] = useState("2026-06-20");
  const [guests, setGuests] = useState(2);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

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
            <span>Real-Time Multi-Platform Comparison Engine</span>
          </div>
          <h1 className={styles.heroTitle}>
            Compare Prices Everywhere. <br />
            <span className={styles.gradientText}>Book Direct for the Best Rate.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Zirigo scans Booking.com, Airbnb, Agoda, and Expedia simultaneously to guarantee you the lowest price, exclusive host perks, and zero hidden service fees.
          </p>
        </div>

        {/* Accommodation Type Filter Tabs */}
        <div className={styles.typeTabs}>
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTypeChange(t.id)}
              className={`${styles.typeTab} ${activeType === t.id ? styles.typeTabActive : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Floating Luxury Search Box */}
        <form onSubmit={handleSubmit} className={styles.searchBox}>
          {/* Destination */}
          <div className={styles.searchField} style={{ position: "relative" }}>
            <label className={styles.fieldLabel}>
              <MapPin size={15} className={styles.fieldIcon} />
              <span>Destination</span>
            </label>
            <input
              type="text"
              placeholder="Where are you going?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDestinationDropdown(true)}
              className={styles.fieldInput}
            />
            {showDestinationDropdown && (
              <div className={styles.destinationDropdown}>
                <div className={styles.dropdownTitle}>Popular Destinations</div>
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
              <span>Check-in</span>
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
              <span>Check-out</span>
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
              <span>Guests</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={styles.fieldInput}
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={6}>6+ Guests</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className={`btn btn-primary ${styles.searchSubmitBtn}`}>
            <Search size={18} />
            <span>Search & Compare</span>
          </button>
        </form>

        {/* Live Trust Metrics */}
        <div className={styles.trustBanner}>
          <div className={styles.trustItem}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            <span><strong>Average 18% Savings</strong> vs major OTA portals</span>
          </div>
          <div className={styles.trustItem}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            <span><strong>Transparent Comparison:</strong> 4+ platforms audited</span>
          </div>
          <div className={styles.trustItem}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            <span><strong>Direct Host Perks:</strong> Free breakfast, welcome wine & passes</span>
          </div>
        </div>
      </div>
    </section>
  );
}

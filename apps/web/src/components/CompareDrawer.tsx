"use client";

import React, { useState } from "react";
import { Scale, X, ArrowRight, Check, Minus, ShieldCheck, Zap } from "lucide-react";
import { Property } from "../lib/types";
import { formatCurrency } from "../lib/data";
import styles from "./CompareDrawer.module.css";

interface CompareDrawerProps {
  properties: Property[];
  currency: string;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSelectDirectBooking: (property: Property) => void;
}

export function CompareDrawer({
  properties,
  currency,
  onRemove,
  onClear,
  onSelectDirectBooking,
}: CompareDrawerProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (properties.length === 0) return null;

  const ALL_AMENITIES_CHECK = [
    { id: "ocean_view", label: "Ocean / Sea View" },
    { id: "pool", label: "Swimming Pool" },
    { id: "spa", label: "Spa & Wellness" },
    { id: "kitchen", label: "Kitchen / Kitchenette" },
    { id: "wifi", label: "High-speed WiFi" },
    { id: "air_conditioning", label: "Air Conditioning" },
    { id: "free_parking", label: "Free Private Parking" },
    { id: "breakfast", label: "Breakfast Included" },
  ];

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className={styles.floatingBar}>
        <div className={styles.barContent}>
          <div className={styles.barInfo}>
            <div className={styles.scaleIconWrapper}>
              <Scale size={20} />
            </div>
            <div>
              <div className={styles.barTitle}>
                {properties.length} {properties.length === 1 ? "Stay" : "Stays"} Selected for Comparison
              </div>
              <div className={styles.barSub}>Compare prices, perks & amenities side by side</div>
            </div>
          </div>

          {/* Thumbnails preview */}
          <div className={styles.thumbnails}>
            {properties.map((p) => (
              <div key={p.id} className={styles.thumbWrapper}>
                <img src={p.featuredImage} alt={p.title} className={styles.thumbImg} />
                <button
                  onClick={() => onRemove(p.id)}
                  className={styles.thumbRemoveBtn}
                  title="Remove from comparison"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.barActions}>
            <button onClick={onClear} className={styles.clearBtn}>
              Clear All
            </button>
            <button
              onClick={() => setIsOpenModal(true)}
              className={`btn btn-primary ${styles.compareNowBtn}`}
            >
              <span>Compare Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Comparison Modal */}
      {isOpenModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Side-by-Side Accommodation Comparison</h2>
                <p className={styles.modalSubtitle}>
                  Evaluate live platform rates, specifications, and exclusive direct perks.
                </p>
              </div>
              <button onClick={() => setIsOpenModal(false)} className={styles.modalCloseBtn}>
                <X size={22} />
              </button>
            </div>

            {/* Comparison Table */}
            <div className={styles.tableScroll}>
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th className={styles.featureColHeader}>Feature</th>
                    {properties.map((p) => (
                      <th key={p.id} className={styles.propColHeader}>
                        <div className={styles.headerPropCard}>
                          <img
                            src={p.featuredImage}
                            alt={p.title}
                            className={styles.headerPropImg}
                          />
                          <div className={styles.headerPropTitle}>{p.title}</div>
                          <div className={styles.headerPropLocation}>
                            {p.city}, {p.country}
                          </div>
                          <div className={styles.headerRating}>
                            ★ {p.rating.toFixed(2)} ({p.reviewCount} reviews)
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Category: Pricing Matrix */}
                  <tr className={styles.sectionHeaderRow}>
                    <td colSpan={properties.length + 1}>Direct vs OTA Pricing (per night)</td>
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>
                      <strong>Zirigo Direct (Guaranteed Best)</strong>
                    </td>
                    {properties.map((p) => {
                      const directRate = p.rates.find((r) => r.platformName === "Zirigo Direct");
                      return (
                        <td key={p.id} className={styles.bestRateCell}>
                          <div className={styles.cellBestPrice}>
                            {directRate ? formatCurrency(directRate.pricePerNight, currency) : "N/A"}
                          </div>
                          <span className={styles.cellBestTag}>Lowest Price</span>
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>Booking.com Rate</td>
                    {properties.map((p) => {
                      const bookingRate = p.rates.find((r) => r.platformName === "Booking.com");
                      return (
                        <td key={p.id}>
                          {bookingRate ? formatCurrency(bookingRate.pricePerNight, currency) : "—"}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>Airbnb Rate</td>
                    {properties.map((p) => {
                      const airbnbRate = p.rates.find((r) => r.platformName === "Airbnb");
                      return (
                        <td key={p.id}>
                          {airbnbRate ? formatCurrency(airbnbRate.pricePerNight, currency) : "—"}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>Your Savings with Direct</td>
                    {properties.map((p) => {
                      const directRate = p.rates.find((r) => r.platformName === "Zirigo Direct");
                      const highest = Math.max(...p.rates.map((r) => r.pricePerNight));
                      const diff = directRate ? highest - directRate.pricePerNight : 0;
                      return (
                        <td key={p.id} className={styles.savingsCell}>
                          {diff > 0 ? `Save ${formatCurrency(diff, currency)} / night` : "Best Available"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category: Specs */}
                  <tr className={styles.sectionHeaderRow}>
                    <td colSpan={properties.length + 1}>Property Specifications</td>
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>Type</td>
                    {properties.map((p) => (
                      <td key={p.id} style={{ textTransform: "capitalize" }}>
                        {p.type}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>Cancellation Policy</td>
                    {properties.map((p) => (
                      <td key={p.id} style={{ textTransform: "capitalize" }}>
                        {p.cancellationPolicy}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>Check-in / Check-out</td>
                    {properties.map((p) => (
                      <td key={p.id}>
                        {p.checkInTime} / {p.checkOutTime}
                      </td>
                    ))}
                  </tr>

                  {/* Category: Amenities */}
                  <tr className={styles.sectionHeaderRow}>
                    <td colSpan={properties.length + 1}>Amenities Checklist</td>
                  </tr>

                  {ALL_AMENITIES_CHECK.map((am) => (
                    <tr key={am.id}>
                      <td className={styles.featureLabel}>{am.label}</td>
                      {properties.map((p) => {
                        const hasAmenity = p.amenities.includes(am.id);
                        return (
                          <td key={p.id} className={styles.amenityCell}>
                            {hasAmenity ? (
                              <Check size={18} className={styles.checkIcon} />
                            ) : (
                              <Minus size={18} className={styles.minusIcon} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Booking CTA row */}
                  <tr>
                    <td className={styles.featureLabel}>Action</td>
                    {properties.map((p) => (
                      <td key={p.id}>
                        <button
                          onClick={() => {
                            setIsOpenModal(false);
                            onSelectDirectBooking(p);
                          }}
                          className={`btn btn-primary ${styles.tableBookBtn}`}
                        >
                          <Zap size={14} />
                          <span>Book on Zirigo</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

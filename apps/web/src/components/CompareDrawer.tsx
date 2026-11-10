"use client";

import React, { useState } from "react";
import { Scale, X, ArrowRight, Check, Minus, Zap } from "lucide-react";
import { Property } from "../lib/types";
import { formatCurrency } from "../lib/data";
import {
  useI18n,
  translatePropertyType,
  translateCancellation,
  localizeProperty,
} from "../lib/i18n";
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
  const { t, language, isRTL } = useI18n();
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (properties.length === 0) return null;

  const ALL_AMENITIES_CHECK = [
    { id: "ocean_view", label: t.amenitySeaView },
    { id: "pool", label: t.amenityPool },
    { id: "spa", label: t.amenitySpa },
    { id: "kitchen", label: t.amenityKitchen },
    { id: "wifi", label: t.amenityWifi },
    { id: "air_conditioning", label: t.amenityAC },
    { id: "breakfast", label: t.trustDirectPerks },
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
                {properties.length} {t.selectedForComparison}
              </div>
              <div className={styles.barSub}>{t.comparePricesSub}</div>
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
              {t.clearAll}
            </button>
            <button
              onClick={() => setIsOpenModal(true)}
              className={`btn btn-primary ${styles.compareNowBtn}`}
            >
              <span>{t.compareNow}</span>
              <ArrowRight size={16} className={isRTL ? "rtl-flip" : ""} />
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
                <h2 className={styles.modalTitle}>{t.sideBySideTitle}</h2>
                <p className={styles.modalSubtitle}>{t.sideBySideSub}</p>
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
                    <th className={styles.featureColHeader}>{t.feature}</th>
                    {properties.map((p) => {
                      const loc = localizeProperty(p, language);
                      return (
                        <th key={p.id} className={styles.propColHeader}>
                          <div className={styles.headerPropCard}>
                            <img
                              src={p.featuredImage}
                              alt={loc.title}
                              className={styles.headerPropImg}
                            />
                            <div className={styles.headerPropTitle}>{loc.title}</div>
                            <div className={styles.headerPropLocation}>
                              {loc.city}, {loc.country}
                            </div>
                            <div className={styles.headerRating}>
                              ★ {p.rating.toFixed(2)} ({p.reviewCount} {t.reviews})
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Category: Pricing Matrix */}
                  <tr className={styles.sectionHeaderRow}>
                    <td colSpan={properties.length + 1}>{t.categoryPricing}</td>
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>
                      <strong>{t.directGuaranteed}</strong>
                    </td>
                    {properties.map((p) => {
                      const directRate = p.rates.find((r) => r.platformName === "Zirigo Direct");
                      return (
                        <td key={p.id} className={styles.bestRateCell}>
                          <div className={styles.cellBestPrice}>
                            {directRate ? formatCurrency(directRate.pricePerNight, currency) : "N/A"}
                          </div>
                          <span className={styles.cellBestTag}>{t.lowestPriceVerified}</span>
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>Booking.com</td>
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
                    <td className={styles.featureLabel}>Airbnb</td>
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
                    <td className={styles.featureLabel}>{t.yourSavings}</td>
                    {properties.map((p) => {
                      const directRate = p.rates.find((r) => r.platformName === "Zirigo Direct");
                      const highest = Math.max(...p.rates.map((r) => r.pricePerNight));
                      const diff = directRate ? highest - directRate.pricePerNight : 0;
                      return (
                        <td key={p.id} className={styles.savingsCell}>
                          {diff > 0 ? `${t.saveVs} ${formatCurrency(diff, currency)} ${t.night}` : t.lowestPriceVerified}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category: Specs */}
                  <tr className={styles.sectionHeaderRow}>
                    <td colSpan={properties.length + 1}>{t.categorySpecs}</td>
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>{t.specType}</td>
                    {properties.map((p) => (
                      <td key={p.id} style={{ textTransform: "capitalize" }}>
                        {translatePropertyType(p.type, language)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>{t.specCancellation}</td>
                    {properties.map((p) => (
                      <td key={p.id} style={{ textTransform: "capitalize" }}>
                        {translateCancellation(p.cancellationPolicy, language)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className={styles.featureLabel}>{t.specCheckInOut}</td>
                    {properties.map((p) => (
                      <td key={p.id}>
                        {p.checkInTime} / {p.checkOutTime}
                      </td>
                    ))}
                  </tr>

                  {/* Category: Amenities */}
                  <tr className={styles.sectionHeaderRow}>
                    <td colSpan={properties.length + 1}>{t.categoryAmenities}</td>
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
                    <td className={styles.featureLabel}>{t.action}</td>
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
                          <span>{t.bookOnZirigo}</span>
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

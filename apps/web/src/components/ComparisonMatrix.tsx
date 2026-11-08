"use client";

import React from "react";
import { Check, ShieldCheck, Zap, ExternalLink, ArrowRight, Sparkles, TrendingDown } from "lucide-react";
import { PlatformRate } from "../lib/types";
import { formatCurrency } from "../lib/data";
import styles from "./ComparisonMatrix.module.css";

interface ComparisonMatrixProps {
  rates: PlatformRate[];
  currency: string;
  nights?: number;
  onSelectDirectBooking: () => void;
}

export function ComparisonMatrix({
  rates,
  currency,
  nights = 3,
  onSelectDirectBooking,
}: ComparisonMatrixProps) {
  // Sort rates with lowest price first
  const sortedRates = [...rates].sort((a, b) => a.pricePerNight - b.pricePerNight);
  const bestRate = sortedRates[0];
  const highestRate = sortedRates[sortedRates.length - 1];
  const maxSavingsPerNight = highestRate.pricePerNight - bestRate.pricePerNight;
  const totalSavings = maxSavingsPerNight * nights;

  return (
    <div className={styles.matrixWrapper}>
      {/* Header Banner */}
      <div className={styles.matrixHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.badgePulseWrapper}>
            <Sparkles size={16} className={styles.sparkleIcon} />
            <span className={styles.matrixBadge}>Real-Time Rate Audit</span>
          </div>
          <h3 className={styles.matrixTitle}>Direct Booking vs Other Platforms</h3>
          <p className={styles.matrixSubtitle}>
            We audit OTA channels to guarantee you the authentic best deal with zero markup.
          </p>
        </div>

        {totalSavings > 0 && (
          <div className={styles.savingsCard}>
            <TrendingDown size={22} className={styles.savingsIcon} />
            <div>
              <div className={styles.savingsLabel}>You save up to</div>
              <div className={styles.savingsValue}>
                {formatCurrency(totalSavings, currency)}
                <span className={styles.savingsSub}> for {nights} nights</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-side comparison cards */}
      <div className={styles.cardsGrid}>
        {sortedRates.map((rate) => {
          const isDirect = rate.platformName === "Zirigo Direct";
          const isBest = rate.isBestPrice;
          const totalPrice = rate.pricePerNight * nights;

          return (
            <div
              key={rate.platformName}
              className={`${styles.rateCard} ${isBest ? styles.bestRateCard : ""} ${
                isDirect ? styles.directCard : ""
              }`}
            >
              {isBest && (
                <div className={styles.bestPriceRibbon}>
                  <ShieldCheck size={13} />
                  <span>Lowest Price Verified</span>
                </div>
              )}

              <div className={styles.cardHeader}>
                <div className={styles.platformNameRow}>
                  <span className={styles.platformName}>{rate.platformName}</span>
                  {isDirect && <span className={styles.officialBadge}>Official Direct</span>}
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceAmount}>
                    {formatCurrency(rate.pricePerNight, currency)}
                  </span>
                  <span className={styles.pricePeriod}>/ night</span>
                </div>
                <div className={styles.totalPriceNote}>
                  Total: {formatCurrency(totalPrice, currency)} ({nights} nights)
                </div>
              </div>

              {/* Perks List */}
              <div className={styles.perksList}>
                {rate.perks.map((perk, i) => (
                  <div key={i} className={styles.perkItem}>
                    <Check size={14} className={isBest ? styles.checkGreen : styles.checkMuted} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className={styles.cardFooter}>
                {isDirect ? (
                  <button
                    onClick={onSelectDirectBooking}
                    className={`btn btn-primary ${styles.directBookingBtn}`}
                  >
                    <Zap size={16} />
                    <span>Book Direct & Save</span>
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <a
                    href={rate.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-secondary ${styles.externalBookingBtn}`}
                  >
                    <span>View on {rate.platformName}</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

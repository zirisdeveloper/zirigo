"use client";

import React from "react";
import { Check, ShieldCheck, Zap, ExternalLink, ArrowRight, Sparkles, TrendingDown } from "lucide-react";
import { PlatformRate } from "../lib/types";
import { formatCurrency } from "../lib/data";
import { useI18n } from "../lib/i18n";
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
  const { t, isRTL } = useI18n();
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
            <span className={styles.matrixBadge}>{t.rateAuditBadge}</span>
          </div>
          <h3 className={styles.matrixTitle}>{t.matrixTitle}</h3>
          <p className={styles.matrixSubtitle}>{t.matrixSubtitle}</p>
        </div>

        {totalSavings > 0 && (
          <div className={styles.savingsCard}>
            <TrendingDown size={22} className={styles.savingsIcon} />
            <div>
              <div className={styles.savingsLabel}>{t.youSaveUpTo}</div>
              <div className={styles.savingsValue}>
                {formatCurrency(totalSavings, currency)}
                <span className={styles.savingsSub}> {t.forNights} {nights} {t.night.replace("/", "")}</span>
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
                  <span>{t.lowestPriceVerified}</span>
                </div>
              )}

              <div className={styles.cardHeader}>
                <div className={styles.platformNameRow}>
                  <span className={styles.platformName}>{rate.platformName}</span>
                  {isDirect && <span className={styles.officialBadge}>{t.officialDirect}</span>}
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceAmount}>
                    {formatCurrency(rate.pricePerNight, currency)}
                  </span>
                  <span className={styles.pricePeriod}>{t.night}</span>
                </div>
                <div className={styles.totalPriceNote}>
                  {t.totalForStay}: {formatCurrency(totalPrice, currency)} ({nights} {t.night.replace("/", "")})
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
                    <span>{t.bookDirectAndSave}</span>
                    <ArrowRight size={15} className={isRTL ? "rtl-flip" : ""} />
                  </button>
                ) : (
                  <a
                    href={rate.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-secondary ${styles.externalBookingBtn}`}
                  >
                    <span>{t.viewOn} {rate.platformName}</span>
                    <ExternalLink size={14} className={isRTL ? "rtl-flip" : ""} />
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

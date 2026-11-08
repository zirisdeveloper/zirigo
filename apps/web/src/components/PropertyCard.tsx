"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Heart, Scale, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Property } from "../lib/types";
import { formatCurrency } from "../lib/data";
import styles from "./PropertyCard.module.css";

interface PropertyCardProps {
  property: Property;
  currency: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onOpenBookingModal: (property: Property) => void;
}

export function PropertyCard({
  property,
  currency,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onOpenBookingModal,
}: PropertyCardProps) {
  const sortedRates = [...property.rates].sort((a, b) => a.pricePerNight - b.pricePerNight);
  const bestRate = sortedRates[0];
  const highestRate = sortedRates[sortedRates.length - 1];
  const savings = highestRate.pricePerNight - bestRate.pricePerNight;

  return (
    <div className={styles.card}>
      {/* Image Thumbnail Container */}
      <div className={styles.imageContainer}>
        <img
          src={property.featuredImage}
          alt={property.title}
          className={styles.image}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className={styles.topBadges}>
          <span className={`badge badge-type ${styles.typeBadge}`}>{property.type}</span>
          {property.isFeatured && (
            <span className={`badge badge-featured`}>
              <Sparkles size={12} />
              Featured
            </span>
          )}
        </div>

        {/* Favorite & Compare Quick Actions */}
        <div className={styles.floatingActions}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(property.id);
            }}
            className={`${styles.iconBtn} ${isFavorite ? styles.favorited : ""}`}
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Wishlist toggle"
          >
            <Heart size={16} fill={isFavorite ? "#ef4444" : "none"} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleCompare(property.id);
            }}
            className={`${styles.iconBtn} ${isCompared ? styles.compared : ""}`}
            title={isCompared ? "Remove from comparison" : "Add to comparison"}
            aria-label="Compare toggle"
          >
            <Scale size={16} />
          </button>
        </div>

        {/* Rating Overlay */}
        <div className={styles.ratingOverlay}>
          <Star size={13} className={styles.starIcon} />
          <span className={styles.ratingScore}>{property.rating.toFixed(2)}</span>
          <span className={styles.reviewCount}>({property.reviewCount})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className={styles.content}>
        {/* Location */}
        <div className={styles.locationRow}>
          <MapPin size={14} className={styles.locationIcon} />
          <span>
            {property.city}, {property.country}
          </span>
        </div>

        {/* Title */}
        <Link href={`/properties/${property.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{property.title}</h3>
        </Link>

        {/* Key Amenities */}
        <div className={styles.amenitiesRow}>
          {property.amenities.slice(0, 3).map((a) => (
            <span key={a} className={styles.amenityChip}>
              {a.replace("_", " ")}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className={styles.amenityMore}>+{property.amenities.length - 3}</span>
          )}
        </div>

        {/* Live Comparison Price Strip */}
        <div className={styles.comparisonStrip}>
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>Best Rate Available</span>
            <div className={styles.priceValueRow}>
              <span className={styles.priceValue}>
                {formatCurrency(bestRate.pricePerNight, currency)}
              </span>
              <span className={styles.priceNight}>/ night</span>
            </div>
            {savings > 0 && (
              <div className={styles.savingsTag}>
                Save {formatCurrency(savings, currency)} vs {highestRate.platformName}
              </div>
            )}
          </div>

          <div className={styles.providerBadge}>
            <ShieldCheck size={14} className={styles.providerCheck} />
            <span>{bestRate.platformName}</span>
          </div>
        </div>

        {/* Action Button Row */}
        <div className={styles.cardActions}>
          <Link
            href={`/properties/${property.slug}`}
            className={`btn btn-secondary ${styles.detailsBtn}`}
          >
            <span>Compare Rates</span>
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={() => onOpenBookingModal(property)}
            className={`btn btn-primary ${styles.bookBtn}`}
          >
            <span>Instant Book</span>
          </button>
        </div>
      </div>
    </div>
  );
}

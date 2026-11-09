"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { ComparisonMatrix } from "../../../components/ComparisonMatrix";
import { BookingModal } from "../../../components/BookingModal";
import { Footer } from "../../../components/Footer";
import { getPropertyBySlug, formatCurrency } from "../../../lib/data";
import { Property, RoomUnit, PropertyReview } from "../../../lib/types";
import { useI18n } from "../../../lib/i18n";
import {
  Star,
  MapPin,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Bed,
  Bath,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const initial = getPropertyBySlug(resolvedParams.slug);
  const [property, setProperty] = useState<Property | null>(initial || null);
  const [isLoading, setIsLoading] = useState(!initial);

  useEffect(() => {
    fetch(`/api/properties/${resolvedParams.slug}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && !data.error) {
          setProperty(data);
        }
      })
      .catch((err) => console.error("Error loading property:", err))
      .finally(() => setIsLoading(false));
  }, [resolvedParams.slug]);

  const { t, isRTL } = useI18n();
  const [currency, setCurrency] = useState("EUR");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <main className={styles.main}>
        <Navbar
          favoriteCount={0}
          compareCount={0}
          onOpenCompare={() => {}}
          currency={currency}
          onCurrencyChange={setCurrency}
        />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", fontSize: "1.1rem", color: "var(--text-muted)" }}>
          Chargement de l'hébergement...
        </div>
      </main>
    );
  }

  if (!property) {
    notFound();
  }

  const bestRate = [...property.rates].sort((a, b) => a.pricePerNight - b.pricePerNight)[0];

  return (
    <main className={styles.main}>
      {/* Navbar */}
      <Navbar
        favoriteCount={isFavorite ? 1 : 0}
        compareCount={0}
        onOpenCompare={() => {}}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <div className={`container ${styles.detailContainer}`}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">{t.home}</Link>
          <ChevronRight size={14} className={isRTL ? "rtl-flip" : ""} />
          <span>{property.country}</span>
          <ChevronRight size={14} className={isRTL ? "rtl-flip" : ""} />
          <span>{property.city}</span>
          <ChevronRight size={14} className={isRTL ? "rtl-flip" : ""} />
          <span className={styles.activeBreadcrumb}>{property.title}</span>
        </nav>

        {/* Title & Header Actions */}
        <div className={styles.titleHeader}>
          <div className={styles.titleGroup}>
            <div className={styles.badgesRow}>
              <span className={`badge badge-type`}>{property.type}</span>
              <span className={styles.starsWrapper}>
                {Array.from({ length: property.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </span>
              <span className={styles.ratingBadge}>
                ★ {property.rating.toFixed(2)} ({property.reviewCount} {t.reviews})
              </span>
            </div>

            <h1 className={styles.propertyTitle}>{property.title}</h1>

            <div className={styles.locationText}>
              <MapPin size={16} className={styles.locationIcon} />
              <span>{property.address}</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`${styles.actionButton} ${isFavorite ? styles.favorited : ""}`}
            >
              <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} />
              <span>{isFavorite ? t.saved : t.save}</span>
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert(t.linkCopied);
                }
              }}
              className={styles.actionButton}
            >
              <Share2 size={18} />
              <span>{t.share}</span>
            </button>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className={styles.galleryGrid}>
          <div className={styles.mainImageWrapper}>
            <img
              src={property.images[selectedImageIndex] || property.featuredImage}
              alt={property.title}
              className={styles.mainImage}
            />
          </div>
          <div className={styles.thumbnailsColumn}>
            {property.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`${styles.thumbBtn} ${
                  selectedImageIndex === idx ? styles.activeThumb : ""
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className={styles.thumbImage} />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout with Sticky Sidebar */}
        <div className={styles.layoutCols}>
          {/* Left Column: Details, Rates Comparison, Rooms, Reviews */}
          <div className={styles.contentCol}>
            {/* Quick Highlights Strip */}
            <div className={styles.highlightsStrip}>
              <div className={styles.highlightItem}>
                <ShieldCheck size={20} className={styles.highlightIcon} />
                <div>
                  <strong>{t.guaranteedBestPrice}</strong>
                  <p>{t.guaranteedBestPriceSub}</p>
                </div>
              </div>
              <div className={styles.highlightItem}>
                <Clock size={20} className={styles.highlightIcon} />
                <div>
                  <strong>{t.flexibleCancellation}</strong>
                  <p>{t.flexibleCancellationSub}</p>
                </div>
              </div>
              <div className={styles.highlightItem}>
                <Sparkles size={20} className={styles.highlightIcon} />
                <div>
                  <strong>{t.directHostPerks}</strong>
                  <p>{t.directHostPerksSub}</p>
                </div>
              </div>
            </div>

            {/* LIVE COMPARISON MATRIX WIDGET */}
            <section className={styles.sectionBlock}>
              <ComparisonMatrix
                rates={property.rates}
                currency={currency}
                nights={3}
                onSelectDirectBooking={() => setIsBookingOpen(true)}
              />
            </section>

            {/* About / Description */}
            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>{t.aboutProperty}</h2>
              <p className={styles.descriptionText}>{property.description}</p>
            </section>

            {/* Room Options & Layouts */}
            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>{t.availableRooms}</h2>
              <div className={styles.roomsGrid}>
                {property.rooms.map((room: RoomUnit) => (
                  <div key={room.id} className={styles.roomCard}>
                    {room.images[0] && (
                      <img src={room.images[0]} alt={room.title} className={styles.roomImg} />
                    )}
                    <div className={styles.roomInfo}>
                      <h3 className={styles.roomTitle}>{room.title}</h3>
                      <p className={styles.roomDesc}>{room.description}</p>

                      <div className={styles.roomSpecs}>
                        <span><Users size={14} /> {room.capacityGuests} {t.guests}</span>
                        <span><Bed size={14} /> {room.capacityBeds} {t.beds}</span>
                        <span><Bath size={14} /> {room.capacityBathrooms} {t.bath}</span>
                      </div>

                      <div className={styles.roomFooter}>
                        <div>
                          <span className={styles.roomPrice}>
                            {formatCurrency(room.basePricePerNight, currency)}
                          </span>
                          <span className={styles.roomPriceSub}> {t.night}</span>
                        </div>
                        <button
                          onClick={() => setIsBookingOpen(true)}
                          className="btn btn-primary"
                        >
                          {t.selectRoom}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities Grid */}
            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>{t.whatOffers}</h2>
              <div className={styles.amenitiesGrid}>
                {property.amenities.map((am: string) => (
                  <div key={am} className={styles.amenityItem}>
                    <CheckCircle2 size={18} className={styles.amenityCheck} />
                    <span>{am.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Verified Reviews */}
            <section className={styles.sectionBlock}>
              <div className={styles.reviewsHeader}>
                <h2 className={styles.sectionHeading}>
                  {t.guestReviews} ★ {property.rating.toFixed(2)} ({property.reviewCount})
                </h2>
              </div>

              <div className={styles.reviewsGrid}>
                {property.reviews.map((rev: PropertyReview) => (
                  <div key={rev.id} className={styles.reviewCard}>
                    <div className={styles.reviewAuthorRow}>
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className={styles.reviewAvatar}
                      />
                      <div>
                        <div className={styles.reviewName}>{rev.authorName}</div>
                        <div className={styles.reviewCountry}>
                          {rev.authorCountry} • {rev.date}
                        </div>
                      </div>
                      <div className={styles.reviewStars}>
                        ★ {rev.rating}
                      </div>
                    </div>
                    <p className={styles.reviewComment}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <aside className={styles.sidebarCol}>
            <div className={styles.stickyBookingCard}>
              <div className={styles.sidebarPriceRow}>
                <div>
                  <span className={styles.sidebarPrice}>
                    {formatCurrency(bestRate.pricePerNight, currency)}
                  </span>
                  <span className={styles.sidebarNight}>{t.night}</span>
                </div>
                <div className={styles.sidebarRating}>
                  ★ {property.rating.toFixed(2)}
                </div>
              </div>

              <div className={styles.directGuaranteeBanner}>
                <Zap size={15} />
                <span>{t.guaranteedBestPrice}</span>
              </div>

              <div className={styles.quickDateBox}>
                <div className={styles.dateCell}>
                  <label>{t.checkIn.toUpperCase()}</label>
                  <span>15 Jun 2026</span>
                </div>
                <div className={styles.dateCell}>
                  <label>{t.checkOut.toUpperCase()}</label>
                  <span>18 Jun 2026</span>
                </div>
              </div>

              <div className={styles.sidebarPerks}>
                <div className={styles.sidebarPerkItem}>
                  <CheckCircle2 size={15} className={styles.perkCheck} />
                  <span>{t.flexibleCancellation}</span>
                </div>
                <div className={styles.sidebarPerkItem}>
                  <CheckCircle2 size={15} className={styles.perkCheck} />
                  <span>{t.why3Title}</span>
                </div>
                <div className={styles.sidebarPerkItem}>
                  <CheckCircle2 size={15} className={styles.perkCheck} />
                  <span>{t.directHostPerks}</span>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                className={`btn btn-primary ${styles.sidebarBookBtn}`}
              >
                <Zap size={18} />
                <span>{t.reserveDirect}</span>
              </button>

              <p className={styles.sidebarNote}>
                {t.noChargeYet}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        property={isBookingOpen ? property : null}
        currency={currency}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}

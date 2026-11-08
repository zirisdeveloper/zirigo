"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { ComparisonMatrix } from "../../../components/ComparisonMatrix";
import { BookingModal } from "../../../components/BookingModal";
import { Footer } from "../../../components/Footer";
import { getPropertyBySlug, PROPERTIES, formatCurrency } from "../../../lib/data";
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
  ArrowLeft,
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
  const property = getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  const [currency, setCurrency] = useState("EUR");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span>{property.country}</span>
          <ChevronRight size={14} />
          <span>{property.city}</span>
          <ChevronRight size={14} />
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
                ★ {property.rating.toFixed(2)} ({property.reviewCount} reviews)
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
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className={styles.actionButton}
            >
              <Share2 size={18} />
              <span>Share</span>
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
            {property.images.map((img, idx) => (
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
                  <strong>Guaranteed Best Price</strong>
                  <p>Save 15% vs OTA platforms</p>
                </div>
              </div>
              <div className={styles.highlightItem}>
                <Clock size={20} className={styles.highlightIcon} />
                <div>
                  <strong>Flexible Cancellation</strong>
                  <p>Free cancellation up to 48 hours</p>
                </div>
              </div>
              <div className={styles.highlightItem}>
                <Sparkles size={20} className={styles.highlightIcon} />
                <div>
                  <strong>Direct Host Perks</strong>
                  <p>Welcome gifts & direct contact</p>
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
              <h2 className={styles.sectionHeading}>About this property</h2>
              <p className={styles.descriptionText}>{property.description}</p>
            </section>

            {/* Room Options & Layouts */}
            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>Available Room Options</h2>
              <div className={styles.roomsGrid}>
                {property.rooms.map((room) => (
                  <div key={room.id} className={styles.roomCard}>
                    {room.images[0] && (
                      <img src={room.images[0]} alt={room.title} className={styles.roomImg} />
                    )}
                    <div className={styles.roomInfo}>
                      <h3 className={styles.roomTitle}>{room.title}</h3>
                      <p className={styles.roomDesc}>{room.description}</p>

                      <div className={styles.roomSpecs}>
                        <span><Users size={14} /> {room.capacityGuests} Guests</span>
                        <span><Bed size={14} /> {room.capacityBeds} Beds</span>
                        <span><Bath size={14} /> {room.capacityBathrooms} Bath</span>
                      </div>

                      <div className={styles.roomFooter}>
                        <div>
                          <span className={styles.roomPrice}>
                            {formatCurrency(room.basePricePerNight, currency)}
                          </span>
                          <span className={styles.roomPriceSub}> / night</span>
                        </div>
                        <button
                          onClick={() => setIsBookingOpen(true)}
                          className="btn btn-primary"
                        >
                          Select Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities Grid */}
            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>What this place offers</h2>
              <div className={styles.amenitiesGrid}>
                {property.amenities.map((am) => (
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
                  Guest Reviews ★ {property.rating.toFixed(2)} ({property.reviewCount})
                </h2>
              </div>

              <div className={styles.reviewsGrid}>
                {property.reviews.map((rev) => (
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
                  <span className={styles.sidebarNight}>/ night</span>
                </div>
                <div className={styles.sidebarRating}>
                  ★ {property.rating.toFixed(2)}
                </div>
              </div>

              <div className={styles.directGuaranteeBanner}>
                <Zap size={15} />
                <span>Zirigo Direct Best Price Guarantee</span>
              </div>

              <div className={styles.quickDateBox}>
                <div className={styles.dateCell}>
                  <label>CHECK-IN</label>
                  <span>15 Jun 2026</span>
                </div>
                <div className={styles.dateCell}>
                  <label>CHECK-OUT</label>
                  <span>18 Jun 2026</span>
                </div>
              </div>

              <div className={styles.sidebarPerks}>
                <div className={styles.sidebarPerkItem}>
                  <CheckCircle2 size={15} className={styles.perkCheck} />
                  <span>Free cancellation up to 48 hours</span>
                </div>
                <div className={styles.sidebarPerkItem}>
                  <CheckCircle2 size={15} className={styles.perkCheck} />
                  <span>No platform traveler booking fees</span>
                </div>
                <div className={styles.sidebarPerkItem}>
                  <CheckCircle2 size={15} className={styles.perkCheck} />
                  <span>Complimentary welcome host gift</span>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                className={`btn btn-primary ${styles.sidebarBookBtn}`}
              >
                <Zap size={18} />
                <span>Reserve on Zirigo Direct</span>
              </button>

              <p className={styles.sidebarNote}>
                You won't be charged yet. Instant confirmation upon checkout.
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

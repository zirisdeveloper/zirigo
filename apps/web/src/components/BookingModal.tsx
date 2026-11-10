"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Users,
  Zap,
  Mail,
  Phone,
  User,
  AlertCircle,
  CalendarX2,
} from "lucide-react";
import { AvailabilityBlock, Property, RoomUnit } from "../lib/types";
import { formatCurrency } from "../lib/data";
import { useI18n } from "../lib/i18n";
import { addDaysIso, datesOverlap, isValidIsoDate } from "../lib/dateUtils";
import styles from "./BookingModal.module.css";

interface BookingModalProps {
  property: Property | null;
  currency: string;
  onClose: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export function BookingModal({
  property,
  currency,
  onClose,
  initialCheckIn,
  initialCheckOut,
}: BookingModalProps) {
  if (!property) return null;
  return (
    <BookingModalContent
      property={property}
      currency={currency}
      onClose={onClose}
      initialCheckIn={initialCheckIn}
      initialCheckOut={initialCheckOut}
    />
  );
}

function BookingModalContent({
  property,
  currency,
  onClose,
  initialCheckIn,
  initialCheckOut,
}: {
  property: Property;
  currency: string;
  onClose: () => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
}) {
  const { t, ext, language } = useI18n();

  const [selectedRoom, setSelectedRoom] = useState<RoomUnit>(
    property.rooms[0] || {
      id: "default",
      title: "Standard Accommodation",
      description: "",
      capacityGuests: 2,
      capacityBedrooms: 1,
      capacityBeds: 1,
      capacityBathrooms: 1,
      basePricePerNight: property.rates[0]?.pricePerNight || 200,
      cleaningFee: 30,
      images: [property.featuredImage],
      amenities: [],
    }
  );

  const defaultCheckIn = initialCheckIn && isValidIsoDate(initialCheckIn) ? initialCheckIn : "2026-06-15";
  const defaultCheckOut =
    initialCheckOut && isValidIsoDate(initialCheckOut) && initialCheckOut > defaultCheckIn
      ? initialCheckOut
      : addDaysIso(defaultCheckIn, 1);

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);

  const handleCheckInChange = (nextCheckIn: string) => {
    setCheckIn(nextCheckIn);
    if (isValidIsoDate(nextCheckIn)) {
      setCheckOut(addDaysIso(nextCheckIn, 1));
    }
  };
  const [guestsCount, setGuestsCount] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [blockedRanges, setBlockedRanges] = useState<AvailabilityBlock[]>([]);

  useEffect(() => {
    fetch(`/api/availability?propertyId=${encodeURIComponent(property.id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.blocks)) {
          setBlockedRanges(data.blocks);
        }
      })
      .catch(() => {
        // leave empty if unreachable
      });
  }, [property.id]);

  const overlappingBlock = useMemo(() => {
    if (!checkIn || !checkOut || checkIn >= checkOut) return null;
    return blockedRanges.find((b) => datesOverlap(checkIn, checkOut, b.startDate, b.endDate)) || null;
  }, [blockedRanges, checkIn, checkOut]);

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  const nights = isNaN(diffTime) || diffTime < 1 ? 1 : diffTime;

  // Rate calculations
  const directRate = property.rates.find((r) => r.platformName === "Zirigo Direct");
  const nightlyPrice = directRate ? directRate.pricePerNight : selectedRoom.basePricePerNight;
  const highestOta = Math.max(...property.rates.map((r) => r.pricePerNight));
  const subtotal = nightlyPrice * nights;
  const otaSubtotal = highestOta * nights;
  const savings = Math.max(0, otaSubtotal - subtotal);
  const cleaningFee = selectedRoom.cleaningFee || 0;
  const serviceFee = 0; // Direct booking waived fee
  const total = subtotal + cleaningFee + serviceFee;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (checkIn >= checkOut) {
      setErrorMessage(
        language === "ar"
          ? "يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول."
          : language === "en"
          ? "Check-out date must be after check-in date."
          : "La date de départ doit être postérieure à la date d'arrivée."
      );
      return;
    }

    if (overlappingBlock) {
      setErrorMessage(
        language === "ar"
          ? `التواريخ المختارة محجوزة (${overlappingBlock.startDate} → ${overlappingBlock.endDate}).`
          : language === "en"
          ? `Selected dates overlap an unavailable period (${overlappingBlock.startDate} → ${overlappingBlock.endDate}).`
          : `Ces dates sont indisponibles (${overlappingBlock.startDate} → ${overlappingBlock.endDate}).`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          roomTitle: selectedRoom?.title,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestsCount,
          totalAmount: total,
          currency,
          specialRequests,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Impossible d'enregistrer la réservation.");
        return;
      }

      setBookingRef(data.bookingReference || "ZIR-" + Math.floor(100000 + Math.random() * 900000));
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to persist booking:", err);
      setErrorMessage("Erreur réseau lors de l'envoi de votre réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.directPill}>
              <Zap size={14} />
              <span>{t.officialDirect}</span>
            </div>
            <h2 className={styles.title}>
              {isSuccess ? t.confirmedTitle : t.directBookingTitle}
            </h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          /* Confirmation Success View */
          <div className={styles.successBody}>
            <div className={styles.successIconWrapper}>
              <CheckCircle2 size={54} className={styles.successIcon} />
            </div>
            <h3 className={styles.successHeadline}>{t.allSet}</h3>
            <p className={styles.successSub}>
              {t.confirmedSub} (<strong>{property.title}</strong>).
            </p>

            <div className={styles.voucherCard}>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>{t.confirmationCode}</span>
                <span className={styles.voucherCode}>{bookingRef}</span>
              </div>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>{t.dates}</span>
                <span>
                  {checkIn} → {checkOut} ({nights} {t.night.replace("/", "")})
                </span>
              </div>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>{t.selectedUnit}</span>
                <span>{selectedRoom.title}</span>
              </div>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>{t.totalPaid}</span>
                <strong className={styles.voucherTotal}>
                  {formatCurrency(total, currency)}
                </strong>
              </div>
              {savings > 0 && (
                <div className={styles.voucherSavings}>
                  🎉 {t.savedBanner} ({formatCurrency(savings, currency)})
                </div>
              )}
            </div>

            <p className={styles.voucherNote}>
              {t.emailSentNote}{" "}
              <strong>{email || "your email"}</strong>.
            </p>

            <button onClick={onClose} className={`btn btn-primary ${styles.successBtn}`}>
              {t.doneBtn}
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleConfirm} className={styles.formGrid}>
            <div className={styles.leftCol}>
              {/* Property Snapshot */}
              <div className={styles.propertySnapshot}>
                <img
                  src={property.featuredImage}
                  alt={property.title}
                  className={styles.snapshotImg}
                />
                <div>
                  <h4 className={styles.snapshotTitle}>{property.title}</h4>
                  <div className={styles.snapshotLoc}>
                    {property.city}, {property.country}
                  </div>
                  <div className={styles.snapshotRating}>
                    ★ {property.rating.toFixed(2)} ({property.reviewCount} {t.reviews})
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              {property.rooms.length > 1 && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.selectRoomUnit}</label>
                  <select
                    value={selectedRoom.id}
                    onChange={(e) => {
                      const found = property.rooms.find((r) => r.id === e.target.value);
                      if (found) setSelectedRoom(found);
                    }}
                    className={styles.input}
                  >
                    {property.rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({formatCurrency(r.basePricePerNight, currency)}{t.night})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dates & Guests */}
              <div className={styles.rowTwoCols}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Calendar size={14} /> {t.checkIn}
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Calendar size={14} /> {t.checkOut}
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={isValidIsoDate(checkIn) ? addDaysIso(checkIn, 1) : undefined}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              {blockedRanges.length > 0 && (
                <div
                  style={{
                    background: "var(--bg-muted)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.6rem 0.75rem",
                    fontSize: "0.78rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <CalendarX2 size={13} />
                    <span>{ext.availability.unavailableNotice}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {blockedRanges.map((b) => (
                      <span
                        key={b.id}
                        style={{
                          padding: "0.15rem 0.45rem",
                          borderRadius: "6px",
                          background: "var(--alert-red-bg)",
                          color: "var(--alert-red)",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          fontSize: "0.73rem",
                        }}
                      >
                        {b.startDate} → {b.endDate}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(overlappingBlock || errorMessage) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.65rem 0.8rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--alert-red-bg)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    color: "var(--alert-red)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>
                    {errorMessage ||
                      (overlappingBlock
                        ? `${overlappingBlock.startDate} → ${overlappingBlock.endDate}`
                        : "")}
                  </span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Users size={14} /> {t.guests}
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className={styles.input}
                >
                  <option value={1}>{t.guestSingle}</option>
                  <option value={2}>2 {t.guestPlural}</option>
                  <option value={3}>3 {t.guestPlural}</option>
                  <option value={4}>4 {t.guestPlural}</option>
                  <option value={6}>{t.guestPlus}</option>
                </select>
              </div>

              {/* Guest Details */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={14} /> {t.fullName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.fullNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.rowTwoCols}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Mail size={14} /> {t.email}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone size={14} /> {t.phoneWhatsApp}
                  </label>
                  <input
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t.specialRequests}</label>
                <textarea
                  rows={2}
                  placeholder={t.specialRequestsPlaceholder}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Right Column: Price Summary */}
            <div className={styles.rightCol}>
              <div className={styles.summaryCard}>
                <h4 className={styles.summaryTitle}>{t.priceBreakdown}</h4>

                <div className={styles.summaryRow}>
                  <span>
                    {formatCurrency(nightlyPrice, currency)} × {nights} {t.night.replace("/", "")}
                  </span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>

                {cleaningFee > 0 && (
                  <div className={styles.summaryRow}>
                    <span>{t.cleaningFee}</span>
                    <span>{formatCurrency(cleaningFee, currency)}</span>
                  </div>
                )}

                <div className={styles.summaryRow}>
                  <span>{t.serviceFee}</span>
                  <span className={styles.freeFee}>{t.waivedFree}</span>
                </div>

                {savings > 0 && (
                  <div className={`${styles.summaryRow} ${styles.savingsRow}`}>
                    <span>{t.otaSavings}</span>
                    <span className={styles.savingsNumber}>
                      -{formatCurrency(savings, currency)}
                    </span>
                  </div>
                )}

                <div className={styles.divider} />

                <div className={styles.totalRow}>
                  <span>{t.totalAmount}</span>
                  <span className={styles.totalAmount}>
                    {formatCurrency(total, currency)}
                  </span>
                </div>

                <div className={styles.perksNotice}>
                  <ShieldCheck size={16} className={styles.shieldIcon} />
                  <div>
                    <strong>{t.directGuarantees}</strong>
                    <ul className={styles.perksBullets}>
                      <li>{t.guaranteeSecure}</li>
                      <li>{t.guaranteeDirectContact}</li>
                      <li>{t.guaranteeCancellation}</li>
                    </ul>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || Boolean(overlappingBlock)}
                  className={`btn btn-primary ${styles.confirmBtn}`}
                >
                  <Zap size={16} />
                  <span>{isSubmitting ? ext.saving : t.confirmBookingBtn}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

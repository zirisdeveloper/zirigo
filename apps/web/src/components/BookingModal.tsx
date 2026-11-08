"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Sparkles, Calendar, Users, Zap, Mail, Phone, User } from "lucide-react";
import { Property, RoomUnit } from "../lib/types";
import { formatCurrency } from "../lib/data";
import styles from "./BookingModal.module.css";

interface BookingModalProps {
  property: Property | null;
  currency: string;
  onClose: () => void;
}

export function BookingModal({ property, currency, onClose }: BookingModalProps) {
  if (!property) return null;

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

  const [checkIn, setCheckIn] = useState("2026-06-15");
  const [checkOut, setCheckOut] = useState("2026-06-18");
  const [guestsCount, setGuestsCount] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

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

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = "ZRG-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randomRef);
    setIsSuccess(true);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.directPill}>
              <Zap size={14} />
              <span>Official Direct Booking</span>
            </div>
            <h2 className={styles.title}>
              {isSuccess ? "Reservation Confirmed!" : "Direct Booking with Host"}
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
            <h3 className={styles.successHeadline}>You're all set!</h3>
            <p className={styles.successSub}>
              Your direct reservation for <strong>{property.title}</strong> has been secured at the guaranteed lowest rate.
            </p>

            <div className={styles.voucherCard}>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>Confirmation Code:</span>
                <span className={styles.voucherCode}>{bookingRef}</span>
              </div>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>Dates:</span>
                <span>
                  {checkIn} → {checkOut} ({nights} nights)
                </span>
              </div>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>Selected Unit:</span>
                <span>{selectedRoom.title}</span>
              </div>
              <div className={styles.voucherRow}>
                <span className={styles.voucherLabel}>Total Paid:</span>
                <strong className={styles.voucherTotal}>
                  {formatCurrency(total, currency)}
                </strong>
              </div>
              {savings > 0 && (
                <div className={styles.voucherSavings}>
                  🎉 You saved {formatCurrency(savings, currency)} by booking direct on Zirigo!
                </div>
              )}
            </div>

            <p className={styles.voucherNote}>
              A confirmation email and WhatsApp host arrival guide have been sent to{" "}
              <strong>{email || "your email"}</strong>.
            </p>

            <button onClick={onClose} className={`btn btn-primary ${styles.successBtn}`}>
              Done
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
                    ★ {property.rating.toFixed(2)} ({property.reviewCount} verified reviews)
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              {property.rooms.length > 1 && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Room / Suite</label>
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
                        {r.title} ({formatCurrency(r.basePricePerNight, currency)}/night)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dates & Guests */}
              <div className={styles.rowTwoCols}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Calendar size={14} /> Check-In
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Calendar size={14} /> Check-Out
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Users size={14} /> Guests Count
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className={styles.input}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests</option>
                </select>
              </div>

              {/* Guest Details */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Éléonore Laurent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.rowTwoCols}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Mail size={14} /> Email
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
                    <Phone size={14} /> Phone / WhatsApp
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
                <label className={styles.label}>Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Early check-in, dietary restrictions, airport pickup..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Right Column: Price Summary */}
            <div className={styles.rightCol}>
              <div className={styles.summaryCard}>
                <h4 className={styles.summaryTitle}>Direct Price Breakdown</h4>

                <div className={styles.summaryRow}>
                  <span>
                    {formatCurrency(nightlyPrice, currency)} × {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>

                {cleaningFee > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Cleaning Fee</span>
                    <span>{formatCurrency(cleaningFee, currency)}</span>
                  </div>
                )}

                <div className={styles.summaryRow}>
                  <span>Platform Service Fee</span>
                  <span className={styles.freeFee}>€0 FREE (Waived)</span>
                </div>

                {savings > 0 && (
                  <div className={`${styles.summaryRow} ${styles.savingsRow}`}>
                    <span>OTA Price Comparison Savings</span>
                    <span className={styles.savingsNumber}>
                      -{formatCurrency(savings, currency)}
                    </span>
                  </div>
                )}

                <div className={styles.divider} />

                <div className={styles.totalRow}>
                  <span>Total Amount</span>
                  <span className={styles.totalAmount}>
                    {formatCurrency(total, currency)}
                  </span>
                </div>

                <div className={styles.perksNotice}>
                  <ShieldCheck size={16} className={styles.shieldIcon} />
                  <div>
                    <strong>Direct Booking Guarantees:</strong>
                    <ul className={styles.perksBullets}>
                      <li>100% Secure reservation</li>
                      <li>Direct communication with property host</li>
                      <li>Free cancellation policy respected</li>
                    </ul>
                  </div>
                </div>

                <button type="submit" className={`btn btn-primary ${styles.confirmBtn}`}>
                  <Zap size={16} />
                  <span>Confirm Direct Booking</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

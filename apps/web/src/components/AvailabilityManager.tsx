"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  CalendarX2,
  Clock,
  XCircle,
  Loader2,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import {
  AvailabilityBlock,
  AvailabilityBlockReason,
  Property,
} from "@/lib/types";
import { BookingRecord } from "@/lib/serverStore";
import { useI18n, Language } from "@/lib/i18n";
import adminStyles from "@/app/admin/admin.module.css";
import styles from "./AvailabilityManager.module.css";

interface AvailabilityManagerProps {
  mode: "owner" | "admin";
  initialPropertyId?: string;
}

const MONTH_NAMES: Record<Language, string[]> = {
  fr: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ar: [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
};

const WEEKDAYS: Record<Language, string[]> = {
  fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
};

function toIsoDate(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function addOneDay(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().slice(0, 10);
}

export function AvailabilityManager({
  mode,
  initialPropertyId,
}: AvailabilityManagerProps) {
  const { ext, language } = useI18n();
  const av = ext.availability;
  const ad = ext.admin;

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialPropertyId || ""
  );
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [autoBlockOnAccept, setAutoBlockOnAccept] = useState<boolean>(true);
  const [isLoadingProps, setIsLoadingProps] = useState<boolean>(true);
  const [isLoadingAvail, setIsLoadingAvail] = useState<boolean>(false);

  // Calendar view state (defaults to June 2026 or current month)
  const [calYear, setCalYear] = useState<number>(2026);
  const [calMonth, setCalMonth] = useState<number>(5); // June (0-indexed)

  // Manual block form
  const [startDate, setStartDate] = useState<string>("2026-06-22");
  const [endDate, setEndDate] = useState<string>("2026-06-25");
  const [reason, setReason] = useState<AvailabilityBlockReason>("external_offer");
  const [note, setNote] = useState<string>("");
  const [isSubmittingBlock, setIsSubmittingBlock] = useState<boolean>(false);
  const [selectionAnchor, setSelectionAnchor] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const endpoint =
      mode === "admin" ? "/api/properties" : "/api/espace-perso/properties";
    setIsLoadingProps(true);
    fetch(endpoint)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Property[]) => {
        const list = Array.isArray(data) ? data : [];
        setProperties(list);
        if (list.length > 0) {
          setSelectedPropertyId((prev) =>
            prev && list.some((p) => p.id === prev) ? prev : list[0].id
          );
        }
      })
      .catch(() => {
        setProperties([]);
      })
      .finally(() => setIsLoadingProps(false));
  }, [mode]);

  const loadAvailability = useCallback(async (propId: string) => {
    if (!propId) return;
    setIsLoadingAvail(true);
    try {
      const res = await fetch(
        `/api/availability?propertyId=${encodeURIComponent(propId)}`
      );
      if (res.ok) {
        const data = await res.json();
        setBlocks(Array.isArray(data.blocks) ? data.blocks : []);
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        setAutoBlockOnAccept(data.autoBlockOnAccept !== false);
      }
    } catch {
      // keep silent on transient errors
    } finally {
      setIsLoadingAvail(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      loadAvailability(selectedPropertyId);
    }
  }, [selectedPropertyId, loadAvailability]);

  const handleToggleAutoBlock = async () => {
    if (!selectedPropertyId) return;
    const nextValue = !autoBlockOnAccept;
    setAutoBlockOnAccept(nextValue);
    try {
      const res = await fetch("/api/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          autoBlockOnAccept: nextValue,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.blocks)) {
          setBlocks(data.blocks);
        }
        showToast(av.autoBlockLabel);
      } else {
        setAutoBlockOnAccept(!nextValue);
        showToast("Erreur", "error");
      }
    } catch {
      setAutoBlockOnAccept(!nextValue);
      showToast("Erreur réseau", "error");
    }
  };

  const handleCreateManualBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId) return;
    setIsSubmittingBlock(true);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          startDate,
          endDate,
          reason,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Impossible de bloquer ces dates", "error");
        return;
      }
      setNote("");
      setSelectionAnchor(null);
      showToast(`${data.startDate} → ${data.endDate}`);
      await loadAvailability(selectedPropertyId);
    } catch {
      showToast("Erreur réseau", "error");
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      const res = await fetch(`/api/availability/${blockId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Erreur", "error");
        return;
      }
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      showToast(av.unblockBtn);
    } catch {
      showToast("Erreur réseau", "error");
    }
  };

  const handleBookingStatus = async (
    bookingId: string,
    status: "confirmed" | "cancelled"
  ) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Impossible de mettre à jour la réservation", "error");
        return;
      }
      showToast(
        status === "confirmed" ? av.acceptAndBlockBtn : av.cancelAndUnblockBtn
      );
      await loadAvailability(selectedPropertyId);
    } catch {
      showToast("Erreur réseau", "error");
    }
  };

  const handleDayClick = (isoDate: string) => {
    if (!selectionAnchor) {
      setSelectionAnchor(isoDate);
      setStartDate(isoDate);
      setEndDate(addOneDay(isoDate));
      return;
    }

    if (isoDate < selectionAnchor) {
      setStartDate(isoDate);
      setEndDate(addOneDay(selectionAnchor));
    } else if (isoDate === selectionAnchor) {
      setStartDate(isoDate);
      setEndDate(addOneDay(isoDate));
    } else {
      setStartDate(selectionAnchor);
      setEndDate(addOneDay(isoDate));
    }
    setSelectionAnchor(null);
  };

  const calendarCells = useMemo(() => {
    const firstWeekday = new Date(Date.UTC(calYear, calMonth, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(calYear, calMonth + 1, 0)).getUTCDate();
    const cells: Array<{ day: number | null; iso?: string }> = [];

    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ day: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, iso: toIsoDate(calYear, calMonth, day) });
    }
    return cells;
  }, [calYear, calMonth]);

  const goPrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const getReasonLabel = (r: AvailabilityBlockReason) => {
    switch (r) {
      case "accepted_booking":
        return av.acceptedBookingTag;
      case "maintenance":
        return av.maintenanceTag;
      case "owner_block":
        return av.ownerBlockTag;
      case "external_offer":
      default:
        return av.externalOfferTag;
    }
  };

  if (isLoadingProps) {
    return (
      <div style={{ padding: "3.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        <Loader2 size={30} className="animate-spin" style={{ margin: "0 auto" }} />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>{av.title}</h1>
            <p className={styles.subtitle}>{av.subtitle}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.emptyHint}>
            <CalendarRange size={40} style={{ margin: "0 auto 0.85rem", opacity: 0.45 }} />
            <p style={{ maxWidth: 480, margin: "0 auto 1.25rem", lineHeight: 1.55 }}>
              {av.noPropertiesHint}
            </p>
            <Link
              href={mode === "admin" ? "/admin/properties/new" : "/espace-perso/annonces/new"}
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
            >
              <PlusCircle size={16} />
              <span>{mode === "admin" ? ad.navAddProperty : ext.espacePerso.publishListing}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {toast && (
        <div className={adminStyles.toastContainer}>
          <div
            className={`${adminStyles.toast} ${
              toast.type === "success" ? adminStyles.toastSuccess : adminStyles.toastError
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} style={{ color: "var(--deal-green)" }} />
            ) : (
              <AlertCircle size={18} style={{ color: "var(--alert-red)" }} />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{av.title}</h1>
          <p className={styles.subtitle}>{av.subtitle}</p>
        </div>
      </div>

      {/* Property Picker + Auto-Block Toggle */}
      <div className={styles.topConfigGrid}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <label className={styles.fieldLabel}>{av.selectProperty}</label>
            <select
              className={styles.input}
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.autoBlockCard}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                }}
              >
                <ShieldCheck size={17} style={{ color: "var(--brand-primary)" }} />
                <span>{av.autoBlockLabel}</span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: "0.25rem",
                  lineHeight: 1.4,
                }}
              >
                {av.autoBlockDesc}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={autoBlockOnAccept}
              onClick={handleToggleAutoBlock}
              className={`${styles.switchBtn} ${
                autoBlockOnAccept ? styles.switchBtnActive : ""
              }`}
              title={av.autoBlockLabel}
            >
              <span className={styles.switchKnob} />
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className={styles.workspaceGrid}>
        {/* Left: Visual Interactive Monthly Calendar */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <CalendarRange size={18} style={{ color: "var(--brand-primary)" }} />
              <span>
                {MONTH_NAMES[language][calMonth]} {calYear}
              </span>
            </div>

            <div className={styles.calendarControls}>
              <button
                type="button"
                onClick={goPrevMonth}
                className={styles.monthNavBtn}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.monthLabel}>
                {MONTH_NAMES[language][calMonth]} {calYear}
              </span>
              <button
                type="button"
                onClick={goNextMonth}
                className={styles.monthNavBtn}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className={styles.cardBody}>
            {isLoadingAvail ? (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto" }} />
              </div>
            ) : (
              <>
                <div className={styles.weekdaysGrid}>
                  {WEEKDAYS[language].map((wd) => (
                    <div key={wd} className={styles.weekdayCell}>
                      {wd}
                    </div>
                  ))}
                </div>

                <div className={styles.daysGrid}>
                  {calendarCells.map((cell, idx) => {
                    if (!cell.day || !cell.iso) {
                      return <div key={`blank-${idx}`} className={styles.dayBlank} />;
                    }
                    const iso = cell.iso;
                    const activeBlock = blocks.find(
                      (b) => b.startDate <= iso && iso < b.endDate
                    );
                    const hasPending = bookings.some(
                      (bk) =>
                        bk.status === "pending" &&
                        bk.checkInDate <= iso &&
                        iso < bk.checkOutDate
                    );
                    const isPicked = iso >= startDate && iso < endDate;

                    let statusClass = "";
                    if (activeBlock) {
                      if (activeBlock.reason === "accepted_booking") {
                        statusClass = styles.dayBooked;
                      } else if (activeBlock.reason === "maintenance") {
                        statusClass = styles.dayMaintenance;
                      } else {
                        statusClass = styles.dayManual;
                      }
                    }

                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => handleDayClick(iso)}
                        title={
                          activeBlock
                            ? `${getReasonLabel(activeBlock.reason)}${
                                activeBlock.note ? ` — ${activeBlock.note}` : ""
                              }`
                            : iso
                        }
                        className={`${styles.dayCell} ${statusClass} ${
                          isPicked && !activeBlock ? styles.daySelected : ""
                        }`}
                      >
                        <span>{cell.day}</span>
                        {hasPending && <span className={styles.pendingDot} />}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.legendRow}>
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendSwatch}
                      style={{
                        background: "var(--bg-primary)",
                        borderColor: "var(--border-subtle)",
                      }}
                    />
                    {av.legendAvailable}
                  </span>
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendSwatch}
                      style={{
                        background: "rgba(16, 185, 129, 0.25)",
                        borderColor: "rgba(16, 185, 129, 0.6)",
                      }}
                    />
                    {av.legendBooked}
                  </span>
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendSwatch}
                      style={{
                        background: "rgba(239, 68, 68, 0.22)",
                        borderColor: "rgba(239, 68, 68, 0.55)",
                      }}
                    />
                    {av.legendManual}
                  </span>
                  <span className={styles.legendItem}>
                    <span
                      className={styles.legendSwatch}
                      style={{ background: "#f59e0b", borderRadius: "50%" }}
                    />
                    {av.legendPending}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Block Dates Form + Active Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Lock size={17} style={{ color: "var(--alert-red)" }} />
                <span>{av.blockDatesTitle}</span>
              </div>
            </div>

            <form onSubmit={handleCreateManualBlock} className={styles.cardBody}>
              <div className={styles.formStack}>
                <div className={styles.twoCols}>
                  <div>
                    <label className={styles.fieldLabel}>{av.startDate}</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>{av.endDate}</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.fieldLabel}>{av.reasonLabel}</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as AvailabilityBlockReason)}
                    className={styles.input}
                  >
                    <option value="external_offer">{av.reasonExternal}</option>
                    <option value="owner_block">{av.reasonOwner}</option>
                    <option value="maintenance">{av.reasonMaintenance}</option>
                  </select>
                </div>

                <div>
                  <label className={styles.fieldLabel}>{av.noteLabel}</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={av.notePlaceholder}
                    className={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBlock}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                  }}
                >
                  <Lock size={15} />
                  <span>{isSubmittingBlock ? av.blocking : av.blockBtn}</span>
                </button>
              </div>
            </form>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <CalendarX2 size={17} style={{ color: "var(--brand-primary)" }} />
                <span>
                  {av.blockedPeriodsTitle} ({blocks.length})
                </span>
              </div>
            </div>

            <div className={styles.cardBody}>
              {blocks.length === 0 ? (
                <div className={styles.emptyHint} style={{ padding: "1.25rem" }}>
                  {av.noBlockedPeriods}
                </div>
              ) : (
                <div className={styles.blocksList}>
                  {blocks.map((blk) => (
                    <div key={blk.id} className={styles.blockItem}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span className={styles.blockDates}>
                            {blk.startDate} → {blk.endDate}
                          </span>
                          <span
                            className={`${styles.blockTag} ${
                              blk.reason === "accepted_booking"
                                ? styles.tagBooked
                                : blk.reason === "maintenance"
                                ? styles.tagMaintenance
                                : styles.tagExternal
                            }`}
                          >
                            {getReasonLabel(blk.reason)}
                          </span>
                        </div>
                        {blk.note && <div className={styles.blockNote}>{blk.note}</div>}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(blk.id)}
                        className="btn btn-secondary"
                        style={{
                          padding: "0.35rem 0.7rem",
                          fontSize: "0.76rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          flexShrink: 0,
                        }}
                      >
                        <Unlock size={13} />
                        <span>{av.unblockBtn}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Client Reservations Section */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <CheckCircle2 size={18} style={{ color: "var(--brand-primary)" }} />
            <span>
              {av.bookingsForPropertyTitle} ({bookings.length})
            </span>
          </div>
        </div>

        <div className={styles.cardBody}>
          {bookings.length === 0 ? (
            <div className={styles.emptyHint}>{av.noBookingsForProperty}</div>
          ) : (
            <div className={styles.bookingsList}>
              {bookings.map((b) => (
                <div key={b.id} className={styles.bookingRow}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "0.95rem" }}>{b.guestName}</strong>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.76rem",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          background: "var(--bg-muted)",
                          color: "var(--brand-primary)",
                          fontWeight: 700,
                        }}
                      >
                        {b.bookingReference}
                      </span>
                      <span
                        className={styles.blockTag}
                        style={{
                          backgroundColor:
                            b.status === "confirmed"
                              ? "var(--deal-green-bg)"
                              : b.status === "pending"
                              ? "rgba(245, 158, 11, 0.14)"
                              : "var(--alert-red-bg)",
                          color:
                            b.status === "confirmed"
                              ? "var(--deal-green)"
                              : b.status === "pending"
                              ? "#d97706"
                              : "var(--alert-red)",
                        }}
                      >
                        {b.status === "confirmed" && <CheckCircle2 size={12} />}
                        {b.status === "pending" && <Clock size={12} />}
                        {b.status === "cancelled" && <XCircle size={12} />}
                        <span>
                          {b.status === "confirmed"
                            ? ad.confirmed
                            : b.status === "pending"
                            ? ad.pending
                            : ad.cancelled}
                        </span>
                      </span>
                    </div>

                    <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      <strong>
                        {b.checkInDate} → {b.checkOutDate}
                      </strong>{" "}
                      · {b.guestEmail}
                      {b.guestPhone ? ` · ${b.guestPhone}` : ""}
                      {b.roomTitle ? ` · ${b.roomTitle}` : ""}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                    {b.status !== "confirmed" && (
                      <button
                        type="button"
                        onClick={() => handleBookingStatus(b.id, "confirmed")}
                        className="btn btn-primary"
                        style={{ padding: "0.42rem 0.85rem", fontSize: "0.8rem" }}
                      >
                        {autoBlockOnAccept ? av.acceptAndBlockBtn : av.acceptBtn}
                      </button>
                    )}

                    {b.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => handleBookingStatus(b.id, "cancelled")}
                        className="btn btn-secondary"
                        style={{
                          padding: "0.42rem 0.85rem",
                          fontSize: "0.8rem",
                          color: "var(--alert-red)",
                        }}
                      >
                        {b.status === "confirmed"
                          ? av.cancelAndUnblockBtn
                          : av.refuseBtn}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


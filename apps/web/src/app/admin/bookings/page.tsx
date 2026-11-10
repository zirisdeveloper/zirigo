"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { BookingRecord } from "@/lib/serverStore";
import { useI18n } from "@/lib/i18n";
import styles from "../admin.module.css";

export default function AdminBookingsPage() {
  const { t, ext } = useI18n();
  const ad = ext.admin;

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const msg =
          data.availabilityAction === "blocked"
            ? ext.availability.acceptAndBlockBtn
            : data.availabilityAction === "released"
            ? ext.availability.cancelAndUnblockBtn
            : status;
        showToast(msg);
        loadBookings();
      } else {
        showToast(data.error || "Erreur", "error");
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        b.bookingReference.toLowerCase().includes(s) ||
        b.guestName.toLowerCase().includes(s) ||
        b.guestEmail.toLowerCase().includes(s) ||
        b.propertyTitle.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div>
      {toastMessage && (
        <div className={styles.toastContainer}>
          <div
            className={`${styles.toast} ${toastMessage.type === "success" ? styles.toastSuccess : styles.toastError
              }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={18} style={{ color: "var(--deal-green)" }} />
            ) : (
              <AlertCircle size={18} style={{ color: "var(--alert-red)" }} />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {ad.bookingsTitle}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {ad.bookingsSub}
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="btn btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span>{ext.refresh}</span>
        </button>
      </div>

      <div className={styles.adminCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder={ext.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterControls}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">{ad.allStatuses}</option>
              <option value="confirmed">{ad.confirmed}</option>
              <option value="pending">{ad.pending}</option>
              <option value="cancelled">{ad.cancelled}</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>{t.fullName}</th>
                <th>{t.destination}</th>
                <th>{t.dates}</th>
                <th>{t.totalAmount}</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontFamily: "monospace",
                          color: "var(--brand-primary)",
                          backgroundColor: "var(--bg-muted)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {b.bookingReference}
                      </span>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{b.guestName}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Mail size={12} />
                        <span>{b.guestEmail}</span>
                      </div>
                      {b.guestPhone && (
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Phone size={11} />
                          <span>{b.guestPhone}</span>
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{b.propertyTitle}</div>
                      {b.roomTitle && (
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {b.roomTitle}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {b.checkInDate} → {b.checkOutDate}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {b.guestsCount} {t.guests}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                        {b.totalAmount} {b.currency}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          backgroundColor:
                            b.status === "confirmed"
                              ? "var(--deal-green-bg)"
                              : b.status === "pending"
                                ? "rgba(245, 158, 11, 0.12)"
                                : "var(--alert-red-bg)",
                          color:
                            b.status === "confirmed"
                              ? "var(--deal-green)"
                              : b.status === "pending"
                                ? "#d97706"
                                : "var(--alert-red)",
                        }}
                      >
                        {b.status === "confirmed" && <CheckCircle2 size={13} />}
                        {b.status === "pending" && <Clock size={13} />}
                        {b.status === "cancelled" && <XCircle size={13} />}
                        <span>
                          {b.status === "confirmed"
                            ? ad.confirmed
                            : b.status === "pending"
                              ? ad.pending
                              : ad.cancelled}
                        </span>
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                        {b.status !== "confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "confirmed")}
                            className="btn btn-secondary"
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", color: "var(--deal-green)" }}
                          >
                            {ad.confirmAction}
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "cancelled")}
                            className="btn btn-secondary"
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", color: "var(--alert-red)" }}
                          >
                            {ad.cancelAction}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem" }}>
                    {t.noResultsTitle}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

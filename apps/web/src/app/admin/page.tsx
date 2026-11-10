"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  DollarSign,
  Star,
  Users,
  Compass,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Copy,
  TrendingDown,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Property } from "@/lib/types";
import { useI18n, localizeProperty, translatePropertyType } from "@/lib/i18n";
import styles from "./admin.module.css";

interface StatsData {
  totalProperties: number;
  featuredCount: number;
  avgPrice: number;
  avgRating: number;
  totalReviews: number;
  citiesCount: number;
  typeCounts: Record<string, number>;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  recentProperties: Property[];
}

export default function AdminDashboardPage() {
  const { t, ext, language } = useI18n();
  const ad = ext.admin;

  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}/toggle-featured`, {
        method: "POST",
      });
      if (res.ok) {
        showToast("✓");
        loadStats();
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}/duplicate`, {
        method: "POST",
      });
      if (res.ok) {
        const created = await res.json();
        showToast(`${ext.duplicate}: "${created.title}"`);
        loadStats();
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      const res = await fetch(`/api/properties/${propertyToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`${ext.delete}: "${propertyToDelete.title}"`);
        setPropertyToDelete(null);
        loadStats();
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "villa":
        return styles.typeVilla;
      case "hotel":
        return styles.typeHotel;
      case "apartment":
        return styles.typeApartment;
      case "chalet":
        return styles.typeChalet;
      case "resort":
        return styles.typeResort;
      default:
        return styles.typeVilla;
    }
  };

  return (
    <div>
      {toastMessage && (
        <div className={styles.toastContainer}>
          <div
            className={`${styles.toast} ${
              toastMessage.type === "success" ? styles.toastSuccess : styles.toastError
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

      {propertyToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  backgroundColor: "var(--alert-red-bg)",
                  color: "var(--alert-red)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trash2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  {ext.espacePerso.confirmDeleteTitle}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {ext.espacePerso.confirmDeleteText}
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-muted)",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              <strong>{propertyToDelete.title}</strong>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                {propertyToDelete.city}, {propertyToDelete.country}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                onClick={() => setPropertyToDelete(null)}
                className="btn btn-secondary"
                style={{ padding: "0.6rem 1.25rem" }}
              >
                {ext.cancel}
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "0.6rem 1.25rem",
                  backgroundColor: "var(--alert-red)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {ext.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
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
            {ad.overviewTitle}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {ad.overviewSub}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={loadStats}
            className="btn btn-secondary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>{ext.refresh}</span>
          </button>
          <Link href="/admin/properties/new" className={styles.quickAddBtn}>
            <PlusCircle size={17} />
            <span>{ad.navAddProperty}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "rgba(13, 148, 136, 0.12)", color: "#0d9488" }}
          >
            <Building2 size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats?.totalProperties ?? 0}</span>
            <span className={styles.metricLabel}>{ad.totalListings}</span>
            <span className={styles.metricSubtext}>
              {stats?.featuredCount ?? 0} {ad.featuredStat.toLowerCase()}
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}
          >
            <Sparkles size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats?.featuredCount ?? 0}</span>
            <span className={styles.metricLabel}>{ad.featuredStat}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
          >
            <DollarSign size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats?.avgPrice ?? 0} €</span>
            <span className={styles.metricLabel}>{ad.avgPriceStat}</span>
            <span className={styles.metricSubtext}>{t.officialDirect}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "rgba(2, 132, 199, 0.12)", color: "#0284c7" }}
          >
            <Star size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats?.avgRating ?? 0} / 5</span>
            <span className={styles.metricLabel}>{ad.avgRatingStat}</span>
            <span className={styles.metricSubtext}>
              {stats?.totalReviews ?? 0} {ad.reviewsWord}
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" }}
          >
            <Compass size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats?.citiesCount ?? 0}</span>
            <span className={styles.metricLabel}>{ad.destinationsStat}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "rgba(236, 72, 153, 0.12)", color: "#db2777" }}
          >
            <Users size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricValue}>{stats?.totalBookings ?? 0}</span>
            <span className={styles.metricLabel}>{ad.bookingsStat}</span>
            <span className={styles.metricSubtext}>
              {stats?.pendingBookings ?? 0} {ad.pendingWord}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown & Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div className={styles.adminCard} style={{ margin: 0 }}>
          <div className={styles.adminCardHeader}>
            <div>
              <div className={styles.cardTitle}>{ad.categoryBreakdown}</div>
              <div className={styles.cardSubtitle}>{ad.categoryBreakdownSub}</div>
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {stats &&
              Object.entries(stats.typeCounts).map(([type, count]) => {
                const total = stats.totalProperties || 1;
                const percent = Math.round((count / total) * 100);
                return (
                  <div key={type} style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      <span>{translatePropertyType(type, language)}</span>
                      <span>
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "var(--bg-muted)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percent}%`,
                          backgroundColor:
                            type === "villa"
                              ? "#0d9488"
                              : type === "hotel"
                              ? "#0284c7"
                              : type === "apartment"
                              ? "#8b5cf6"
                              : type === "chalet"
                              ? "#f59e0b"
                              : "#db2777",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className={styles.adminCard} style={{ margin: 0 }}>
          <div className={styles.adminCardHeader}>
            <div>
              <div className={styles.cardTitle}>{ad.quickActionsTitle}</div>
              <div className={styles.cardSubtitle}>{ad.quickActionsSub}</div>
            </div>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <Link
              href="/admin/properties/new"
              className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <PlusCircle size={18} />
              <span>{ad.navAddProperty}</span>
            </Link>

            <Link
              href="/admin/properties"
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Building2 size={18} />
              <span>
                {ad.navProperties} ({stats?.totalProperties || 0})
              </span>
            </Link>

            <Link
              href="/admin/rates"
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <TrendingDown size={18} />
              <span>{ad.navRates}</span>
            </Link>

            <Link
              href="/admin/bookings"
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Users size={18} />
              <span>
                {ad.navBookings} ({stats?.totalBookings || 0})
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Properties Table */}
      <div className={styles.adminCard}>
        <div className={styles.adminCardHeader}>
          <div>
            <div className={styles.cardTitle}>{ad.recentListingsTitle}</div>
            <div className={styles.cardSubtitle}>{ad.recentListingsSub}</div>
          </div>
          <div className={styles.cardActions}>
            <Link
              href="/admin/properties"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "var(--brand-primary)",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              <span>{ext.espacePerso.viewAll}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>{t.destination}</th>
                <th>{t.specType}</th>
                <th>★</th>
                <th>{t.officialDirect}</th>
                <th>{t.featured}</th>
                <th style={{ textAlign: "right" }}>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentProperties && stats.recentProperties.length > 0 ? (
                stats.recentProperties.map((prop) => {
                  const loc = localizeProperty(prop, language);
                  const directRate =
                    prop.rates?.find((r) => r.platformName.toLowerCase().includes("direct"))
                      ?.pricePerNight ||
                    prop.rates?.[0]?.pricePerNight ||
                    prop.rooms?.[0]?.basePricePerNight ||
                    0;

                  return (
                    <tr key={prop.id}>
                      <td>
                        <div className={styles.propertyRowCell}>
                          <img
                            src={prop.featuredImage}
                            alt={loc.title}
                            className={styles.propertyThumb}
                          />
                          <div className={styles.propertyRowInfo}>
                            <Link
                              href={`/admin/properties/${prop.id}/edit`}
                              className={styles.propertyRowTitle}
                            >
                              {loc.title}
                            </Link>
                            <span className={styles.propertyRowLocation}>
                              {loc.city}, {loc.country}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.typeBadge} ${getTypeBadgeClass(prop.type)}`}>
                          {translatePropertyType(prop.type, language)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Star size={15} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                          <span style={{ fontWeight: 700 }}>{prop.rating}</span>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                            ({prop.reviewCount})
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: "var(--brand-primary)" }}>
                          {directRate} €
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>
                            {" "}
                            {t.night}
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleFeatured(prop.id)}
                          className={`${styles.featuredToggleBtn} ${
                            prop.isFeatured ? styles.featuredActive : styles.featuredInactive
                          }`}
                        >
                          <Star size={18} fill={prop.isFeatured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.rowActions} style={{ justifyContent: "flex-end" }}>
                          <Link
                            href={`/properties/${prop.slug}`}
                            target="_blank"
                            className={styles.actionIconBtn}
                            title={ext.view}
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/properties/${prop.id}/edit`}
                            className={styles.actionIconBtn}
                            title={ext.edit}
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(prop.id)}
                            className={styles.actionIconBtn}
                            title={ext.duplicate}
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => setPropertyToDelete(prop)}
                            className={`${styles.actionIconBtn} ${styles.actionDeleteBtn}`}
                            title={ext.delete}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem" }}>
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

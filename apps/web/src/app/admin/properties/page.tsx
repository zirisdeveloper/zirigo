"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  Copy,
  Star,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MapPin,
  CalendarRange,
} from "lucide-react";
import { Property } from "@/lib/types";
import { useI18n, localizeProperty, translatePropertyType } from "@/lib/i18n";
import styles from "../admin.module.css";

export default function AdminPropertiesPage() {
  const { t, ext, language } = useI18n();
  const ad = ext.admin;

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFeatured, setSelectedFeatured] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}/toggle-featured`, {
        method: "POST",
      });
      if (res.ok) {
        showToast("✓");
        loadProperties();
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
        loadProperties();
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
        loadProperties();
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          const matchTitle = prop.title.toLowerCase().includes(s);
          const matchCity = prop.city.toLowerCase().includes(s);
          const matchCountry = prop.country.toLowerCase().includes(s);
          const matchAddress = prop.address.toLowerCase().includes(s);
          if (!matchTitle && !matchCity && !matchCountry && !matchAddress) {
            return false;
          }
        }
        if (selectedType !== "all" && prop.type !== selectedType) return false;
        if (selectedFeatured === "featured" && !prop.isFeatured) return false;
        if (selectedFeatured === "standard" && prop.isFeatured) return false;
        return true;
      })
      .sort((a, b) => {
        const priceA =
          a.rates?.find((r) => r.platformName.toLowerCase().includes("direct"))?.pricePerNight ||
          a.rates?.[0]?.pricePerNight ||
          0;
        const priceB =
          b.rates?.find((r) => r.platformName.toLowerCase().includes("direct"))?.pricePerNight ||
          b.rates?.[0]?.pricePerNight ||
          0;

        switch (sortBy) {
          case "price_asc":
            return priceA - priceB;
          case "price_desc":
            return priceB - priceA;
          case "rating":
            return b.rating - a.rating;
          case "reviews":
            return b.reviewCount - a.reviewCount;
          default:
            return 0;
        }
      });
  }, [properties, searchTerm, selectedType, selectedFeatured, sortBy]);

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
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {ad.manageListingsTitle}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {properties.length} {ad.listingsInCatalog}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={loadProperties}
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">{ad.allTypes}</option>
              <option value="villa">{translatePropertyType("villa", language)}</option>
              <option value="hotel">{translatePropertyType("hotel", language)}</option>
              <option value="apartment">{translatePropertyType("apartment", language)}</option>
              <option value="chalet">{translatePropertyType("chalet", language)}</option>
              <option value="resort">{translatePropertyType("resort", language)}</option>
              <option value="dormitory">{translatePropertyType("dormitory", language)}</option>
            </select>

            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">{ad.allListingsFilter}</option>
              <option value="featured">{ad.featuredOnly}</option>
              <option value="standard">{ad.standardOnly}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="default">{ad.sortDefault}</option>
              <option value="price_asc">{ad.sortPriceAsc}</option>
              <option value="price_desc">{ad.sortPriceDesc}</option>
              <option value="rating">{ad.sortBestRated}</option>
              <option value="reviews">{ad.sortMostReviewed}</option>
            </select>
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
                <th>{t.availableRooms}</th>
                <th>{t.featured}</th>
                <th style={{ textAlign: "right" }}>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => {
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
                              <MapPin size={12} />
                              {loc.city}, {loc.country}
                            </span>
                            {prop.ownerName && (
                              <span style={{ fontSize: "0.73rem", color: "var(--brand-primary)", fontWeight: 600 }}>
                                {ad.publishedBy} {prop.ownerName}
                              </span>
                            )}
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
                            ({prop.stars}★)
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
                        <span style={{ fontWeight: 600 }}>
                          {prop.rooms?.length || 0}
                        </span>
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
                            href={`/admin/disponibilites?propertyId=${prop.id}`}
                            className={styles.actionIconBtn}
                            title={ad.navAvailability}
                          >
                            <CalendarRange size={15} />
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
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                      <Building2 size={40} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
                      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{t.noResultsTitle}</div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        {t.noResultsSub}
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedType("all");
                          setSelectedFeatured("all");
                          setSortBy("default");
                        }}
                        className="btn btn-secondary"
                        style={{ marginTop: "0.5rem" }}
                      >
                        {t.resetFilters}
                      </button>
                    </div>
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  CalendarRange,
} from "lucide-react";
import { Property } from "@/lib/types";
import { useI18n, translatePropertyType, localizeProperty } from "@/lib/i18n";
import adminStyles from "@/app/admin/admin.module.css";
import styles from "../espacePerso.module.css";

export default function EspacePersoAnnoncesPage() {
  const { t, ext, language } = useI18n();
  const ep = ext.espacePerso;

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadMyProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/espace-perso/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyProperties();
  }, []);

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      const res = await fetch(`/api/espace-perso/properties/${propertyToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(propertyToDelete.title);
        setPropertyToDelete(null);
        loadMyProperties();
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const filtered = properties.filter((p) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(s) ||
      p.city.toLowerCase().includes(s) ||
      p.country.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      {toastMessage && (
        <div className={adminStyles.toastContainer}>
          <div
            className={`${adminStyles.toast} ${
              toastMessage.type === "success" ? adminStyles.toastSuccess : adminStyles.toastError
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
        <div className={adminStyles.modalBackdrop}>
          <div className={adminStyles.modalBox}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              {ep.confirmDeleteTitle}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              <strong>{propertyToDelete.title}</strong> — {ep.confirmDeleteText}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button onClick={() => setPropertyToDelete(null)} className="btn btn-secondary">
                {ext.cancel}
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "0.65rem 1.25rem",
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: 800 }}>
            {ep.myListingsTitle} ({properties.length})
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {ep.myListingsSubtitle}
          </p>
        </div>

        <Link href="/espace-perso/annonces/new" className="btn btn-primary">
          <PlusCircle size={17} />
          <span>{ep.publishNewListing}</span>
        </Link>
      </div>

      <div className={styles.sectionCard}>
        <div className={adminStyles.filterBar}>
          <div className={adminStyles.searchBox}>
            <Search size={17} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder={ep.searchMyListings}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={adminStyles.searchInput}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            {ep.loading}
          </div>
        ) : filtered.length > 0 ? (
          <div className={adminStyles.tableResponsive}>
            <table className={adminStyles.adminTable}>
              <thead>
                <tr>
                  <th>{t.destination}</th>
                  <th>{t.specType}</th>
                  <th>{t.officialDirect}</th>
                  <th>★</th>
                  <th style={{ textAlign: "right" }}>{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prop) => {
                  const loc = localizeProperty(prop, language);
                  const directPrice =
                    prop.rates?.find((r) => r.platformName.toLowerCase().includes("direct"))
                      ?.pricePerNight ||
                    prop.rates?.[0]?.pricePerNight ||
                    prop.rooms?.[0]?.basePricePerNight ||
                    0;

                  return (
                    <tr key={prop.id}>
                      <td>
                        <div className={adminStyles.propertyRowCell}>
                          <img
                            src={prop.featuredImage}
                            alt={loc.title}
                            className={adminStyles.propertyThumb}
                          />
                          <div className={adminStyles.propertyRowInfo}>
                            <Link
                              href={`/espace-perso/annonces/${prop.id}/edit`}
                              className={adminStyles.propertyRowTitle}
                            >
                              {loc.title}
                            </Link>
                            <span className={adminStyles.propertyRowLocation}>
                              <MapPin size={12} />
                              {loc.city}, {loc.country}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-type">
                          {translatePropertyType(prop.type, language)}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "var(--brand-primary)" }}>{directPrice} €</strong>{" "}
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.night}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Star size={14} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                          <span>{prop.stars} ★</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={adminStyles.rowActions} style={{ justifyContent: "flex-end" }}>
                          <Link
                            href={`/properties/${prop.slug}`}
                            target="_blank"
                            className={adminStyles.actionIconBtn}
                            title={ext.view}
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/espace-perso/disponibilites?propertyId=${prop.id}`}
                            className={adminStyles.actionIconBtn}
                            title={ep.availabilityNav}
                          >
                            <CalendarRange size={15} />
                          </Link>
                          <Link
                            href={`/espace-perso/annonces/${prop.id}/edit`}
                            className={adminStyles.actionIconBtn}
                            title={ext.edit}
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => setPropertyToDelete(prop)}
                            className={`${adminStyles.actionIconBtn} ${adminStyles.actionDeleteBtn}`}
                            title={ext.delete}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <Building2 size={44} style={{ color: "var(--text-muted)", opacity: 0.45, marginBottom: "0.75rem" }} />
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              {ep.noMatchesFound}
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              {ep.noListingsYet}
            </p>
            <Link href="/espace-perso/annonces/new" className="btn btn-primary">
              <PlusCircle size={17} />
              <span>{ep.publishFirstListing}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

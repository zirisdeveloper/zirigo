"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingDown,
  Edit,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
} from "lucide-react";
import { Property } from "@/lib/types";
import { useI18n, localizeProperty } from "@/lib/i18n";
import styles from "../admin.module.css";

export default function AdminRatesPage() {
  const { t, ext, language } = useI18n();
  const ad = ext.admin;

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProperties = properties.filter((p) => {
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
            {ad.ratesTitle}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            {ad.ratesSub}
          </p>
        </div>

        <button
          onClick={loadProperties}
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
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>{t.destination}</th>
                <th>{t.officialDirect}</th>
                <th>Booking.com</th>
                <th>Airbnb</th>
                <th>{t.yourSavings}</th>
                <th>{t.lowestPriceVerified}</th>
                <th style={{ textAlign: "right" }}>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => {
                  const loc = localizeProperty(prop, language);
                  const directRate = prop.rates?.find((r) =>
                    r.platformName.toLowerCase().includes("direct")
                  );
                  const bookingRate = prop.rates?.find((r) =>
                    r.platformName.toLowerCase().includes("booking")
                  );
                  const airbnbRate = prop.rates?.find((r) =>
                    r.platformName.toLowerCase().includes("airbnb")
                  );

                  const directPrice = directRate?.pricePerNight || 0;
                  const competitorPrice = bookingRate?.pricePerNight || airbnbRate?.pricePerNight || directPrice;
                  const diff = competitorPrice - directPrice;
                  const percentSaved = competitorPrice > 0 ? Math.round((diff / competitorPrice) * 100) : 0;
                  const isBest = directRate?.isBestPrice ?? diff > 0;

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
                        <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--brand-primary)" }}>
                          {directPrice} €
                        </div>
                      </td>

                      <td>
                        {bookingRate ? (
                          <span style={{ fontWeight: 700 }}>{bookingRate.pricePerNight} €</span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>—</span>
                        )}
                      </td>

                      <td>
                        {airbnbRate ? (
                          <span style={{ fontWeight: 700 }}>{airbnbRate.pricePerNight} €</span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>—</span>
                        )}
                      </td>

                      <td>
                        {diff > 0 ? (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--deal-green)", fontWeight: 700 }}>
                            <TrendingDown size={15} />
                            <span>-{diff} € (-{percentSaved}%)</span>
                          </div>
                        ) : diff === 0 ? (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        ) : (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--alert-red)", fontWeight: 700 }}>
                            <AlertTriangle size={15} />
                            <span>+{Math.abs(diff)} €</span>
                          </div>
                        )}
                      </td>

                      <td>
                        {isBest ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              backgroundColor: "var(--deal-green-bg)",
                              color: "var(--deal-green)",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "var(--radius-full)",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>{t.lowestPriceVerified}</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              backgroundColor: "var(--alert-red-bg)",
                              color: "var(--alert-red)",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "var(--radius-full)",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                            }}
                          >
                            <AlertTriangle size={14} />
                            <span>!</span>
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <Link
                          href={`/admin/properties/${prop.id}/edit`}
                          className="btn btn-secondary"
                          style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                        >
                          <Edit size={14} />
                          <span>{ext.edit}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
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

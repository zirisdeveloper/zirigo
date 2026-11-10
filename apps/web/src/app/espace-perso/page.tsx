"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Bell,
  PlusCircle,
  Sparkles,
  ArrowRight,
  MapPin,
  Eye,
  Edit,
  BellRing,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useI18n, localizeProperty } from "@/lib/i18n";
import { Property, UserNotification } from "@/lib/types";
import styles from "./espacePerso.module.css";

export default function EspacePersoDashboardPage() {
  const { user } = useAuth();
  const { t, ext, language } = useI18n();
  const ep = ext.espacePerso;

  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadSummary() {
      try {
        const [propRes, alertRes, notifRes] = await Promise.all([
          fetch("/api/espace-perso/properties"),
          fetch("/api/espace-perso/alerts"),
          fetch("/api/espace-perso/notifications"),
        ]);

        if (propRes.ok) {
          const props = await propRes.json();
          setMyProperties(Array.isArray(props) ? props : []);
        }
        if (alertRes.ok) {
          const alerts = await alertRes.json();
          setAlertsCount(Array.isArray(alerts) ? alerts.filter((a: any) => a.isActive).length : 0);
        }
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData.notifications || []);
          setUnreadCount(notifData.unreadCount || 0);
        }
      } catch (err) {
        console.error("Failed to load personal space summary:", err);
      }
    }

    if (user) {
      loadSummary();
    }
  }, [user]);

  return (
    <div>
      {/* Welcome header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {ep.hello} {user?.name} 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.2rem" }}>
            {ep.dashboardSubtitle}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/espace-perso/alertes" className="btn btn-secondary">
            <BellRing size={16} />
            <span>{ep.createAlertBtn}</span>
          </Link>
          <Link href="/espace-perso/annonces/new" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>{ep.publishListing}</span>
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "rgba(13, 148, 136, 0.12)", color: "#0d9488" }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <div className={styles.statVal}>{myProperties.length}</div>
            <div className={styles.statLbl}>{ep.publishedListingsStat}</div>
          </div>
        </div>

        <div className={styles.statBox}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "rgba(2, 132, 199, 0.12)", color: "#0284c7" }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div className={styles.statVal}>{alertsCount}</div>
            <div className={styles.statLbl}>{ep.activeAlertsStat}</div>
          </div>
        </div>

        <div className={styles.statBox}>
          <div
            className={styles.statIcon}
            style={{ backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#d97706" }}
          >
            <Bell size={22} />
          </div>
          <div>
            <div className={styles.statVal}>{unreadCount}</div>
            <div className={styles.statLbl}>{ep.unreadNotifsStat}</div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Bell size={18} style={{ color: "var(--brand-primary)" }} />
            <span>{ep.recentNotifsTitle}</span>
          </div>
          <Link
            href="/espace-perso/alertes"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--brand-primary)",
            }}
          >
            <span>{ep.manageAlerts}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {notifications.length > 0 ? (
          <div>
            {notifications.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notifItem} ${!notif.isRead ? styles.notifItemUnread : ""
                  }`}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.2rem" }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {notif.alertName} • {notif.propertyCity} •{" "}
                    <strong>{notif.pricePerNight} € {t.night}</strong>
                  </div>
                </div>
                <Link
                  href={`/properties/${notif.propertySlug}`}
                  className="btn btn-secondary"
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", flexShrink: 0 }}
                >
                  {ep.viewOffer}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            {ep.noNotifsYet}{" "}
            <Link
              href="/espace-perso/alertes"
              style={{ color: "var(--brand-primary)", fontWeight: 700 }}
            >
              {ep.createFirstAlertLink}
            </Link>{" "}
            {ep.forNotifExplain}
          </div>
        )}
      </div>

      {/* My Latest Listings */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Building2 size={18} style={{ color: "var(--brand-primary)" }} />
            <span>{ep.recentListingsTitle}</span>
          </div>
          <Link
            href="/espace-perso/annonces"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--brand-primary)",
            }}
          >
            <span>{ep.viewAll}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {myProperties.length > 0 ? (
          <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {myProperties.slice(0, 4).map((prop) => {
              const loc = localizeProperty(prop, language);
              return (
                <div
                  key={prop.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-muted)",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <img
                      src={prop.featuredImage}
                      alt={loc.title}
                      style={{ width: 64, height: 52, borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{loc.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <MapPin size={12} />
                        <span>{loc.city}, {loc.country}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      href={`/properties/${prop.slug}`}
                      target="_blank"
                      className="btn btn-secondary"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                    >
                      <Eye size={14} />
                      <span>{ext.view}</span>
                    </Link>
                    <Link
                      href={`/espace-perso/annonces/${prop.id}/edit`}
                      className="btn btn-primary"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                    >
                      <Edit size={14} />
                      <span>{ext.edit}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            {ep.noListingsYet}{" "}
            <Link
              href="/espace-perso/annonces/new"
              style={{ color: "var(--brand-primary)", fontWeight: 700 }}
            >
              {ep.publishFirstListing}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

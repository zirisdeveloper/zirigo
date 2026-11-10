"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  MapPin,
  DollarSign,
  Star,
  Users,
  Sparkles,
  ExternalLink,
  Mail,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useI18n, translateAmenity, translatePropertyType } from "@/lib/i18n";
import { SearchAlert, UserNotification } from "@/lib/types";
import adminStyles from "@/app/admin/admin.module.css";
import styles from "../espacePerso.module.css";

interface EnrichedAlert extends SearchAlert {
  matchesCount: number;
  matchingProperties: Array<{
    id: string;
    slug: string;
    title: string;
    city: string;
    country: string;
    type: string;
    rating: number;
    featuredImage: string;
    pricePerNight: number;
  }>;
}

const ALERT_AMENITY_IDS = [
  "pool",
  "ocean_view",
  "wifi",
  "air_conditioning",
  "free_parking",
  "kitchen",
  "spa",
  "terrace",
];

function AlertesContent() {
  const searchParams = useSearchParams();
  const { refreshNotifications } = useAuth();
  const { t, ext, language } = useI18n();
  const ep = ext.espacePerso;

  const [alerts, setAlerts] = useState<EnrichedAlert[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(searchParams.get("create") === "1");
  const [name, setName] = useState(searchParams.get("name") || "");
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [propertyType, setPropertyType] = useState<SearchAlert["propertyType"]>(
    (searchParams.get("type") as any) || "all"
  );
  const [maxPricePerNight, setMaxPricePerNight] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "0");
  const [minGuests, setMinGuests] = useState(searchParams.get("guests") || "");
  const [amenities, setAmenities] = useState<string[]>(() => {
    const raw = searchParams.get("amenities");
    return raw ? raw.split(",").filter(Boolean) : [];
  });
  const [frequency, setFrequency] = useState<SearchAlert["frequency"]>("instant");
  const [channel, setChannel] = useState<SearchAlert["channel"]>("both");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [alertRes, notifRes] = await Promise.all([
        fetch("/api/espace-perso/alerts"),
        fetch("/api/espace-perso/notifications"),
      ]);

      if (alertRes.ok) {
        const alertData = await alertRes.json();
        setAlerts(Array.isArray(alertData) ? alertData : []);
      }

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
        setUnreadCount(notifData.unreadCount || 0);
      }
      await refreshNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const autoName =
      name.trim() ||
      `${translatePropertyType(propertyType, language)}${query.trim() ? ` - ${query.trim()}` : ""}`;

    try {
      const res = await fetch("/api/espace-perso/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: autoName,
          query,
          propertyType,
          maxPricePerNight: maxPricePerNight ? Number(maxPricePerNight) : undefined,
          minRating: Number(minRating) > 0 ? Number(minRating) : undefined,
          minGuests: minGuests ? Number(minGuests) : undefined,
          amenities,
          frequency,
          channel,
          isActive: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`${data.matchesCount} ${ep.matchesFoundSuffix}`);
        setShowForm(false);
        setName("");
        await loadData();
      } else {
        const err = await res.json();
        showToast(err.error || "Error", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAlert = async (alert: EnrichedAlert) => {
    try {
      const res = await fetch(`/api/espace-perso/alerts/${alert.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !alert.isActive }),
      });
      if (res.ok) {
        showToast(alert.isActive ? ep.pausedBadge : ep.activeBadge);
        loadData();
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/espace-perso/alerts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(ext.delete);
        loadData();
      }
    } catch {
      showToast("Error", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/espace-perso/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      // ignore
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await fetch("/api/espace-perso/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadData();
    } catch {
      // ignore
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await fetch(`/api/espace-perso/notifications?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      loadData();
    } catch {
      // ignore
    }
  };

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

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: 800 }}>
            {ep.alertsTitle}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginTop: "0.2rem" }}>
            {ep.alertsSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={17} />
          <span>{showForm ? ep.closeFormBtn : ep.newAlertBtn}</span>
        </button>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <form onSubmit={handleCreateAlert} className={adminStyles.formSection}>
          <div className={adminStyles.sectionHeader}>
            <div className={adminStyles.sectionTitle}>
              <BellRing size={20} style={{ color: "var(--brand-primary)" }} />
              <span>{ep.createAlertHeading}</span>
            </div>
            <div className={adminStyles.sectionDesc}>{ep.createAlertSub}</div>
          </div>

          <div className={adminStyles.formGrid}>
            <div className={adminStyles.formGroupFull}>
              <label className={adminStyles.formLabel}>{ep.alertNameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={ep.alertNamePlaceholder}
                className={adminStyles.formInput}
              />
            </div>

            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel}>{ep.destinationLabel}</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={ep.destinationPlaceholder}
                className={adminStyles.formInput}
              />
            </div>

            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel}>{ep.propertyTypeLabel}</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className={adminStyles.formSelect}
              >
                <option value="all">{t.typeAll}</option>
                <option value="villa">{translatePropertyType("villa", language)}</option>
                <option value="hotel">{translatePropertyType("hotel", language)}</option>
                <option value="apartment">{translatePropertyType("apartment", language)}</option>
                <option value="chalet">{translatePropertyType("chalet", language)}</option>
                <option value="resort">{translatePropertyType("resort", language)}</option>
                <option value="dormitory">{translatePropertyType("dormitory", language)}</option>
              </select>
            </div>

            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel}>{ep.maxBudgetLabel}</label>
              <input
                type="number"
                min={0}
                value={maxPricePerNight}
                onChange={(e) => setMaxPricePerNight(e.target.value)}
                placeholder={ep.maxBudgetPlaceholder}
                className={adminStyles.formInput}
              />
            </div>

            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel}>{ep.minRatingLabel}</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className={adminStyles.formSelect}
              >
                <option value="0">{ep.allRatings}</option>
                <option value="4">4.0 ★+</option>
                <option value="4.5">4.5 ★+</option>
                <option value="4.8">4.8 ★+</option>
              </select>
            </div>

            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel}>{ep.minGuestsLabel}</label>
              <input
                type="number"
                min={1}
                value={minGuests}
                onChange={(e) => setMinGuests(e.target.value)}
                placeholder="4"
                className={adminStyles.formInput}
              />
            </div>

            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel}>{ep.frequencyLabel}</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className={adminStyles.formSelect}
              >
                <option value="instant">{ep.freqInstant}</option>
                <option value="daily">{ep.freqDaily}</option>
                <option value="weekly">{ep.freqWeekly}</option>
              </select>
            </div>

            <div className={adminStyles.formGroup}>
              <label className={adminStyles.formLabel}>{ep.channelLabel}</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className={adminStyles.formSelect}
              >
                <option value="both">{ep.channelBoth}</option>
                <option value="email">{ep.channelEmail}</option>
                <option value="in_app">{ep.channelInApp}</option>
              </select>
            </div>

            <div className={adminStyles.formGroupFull}>
              <label className={adminStyles.formLabel}>{ep.desiredAmenitiesLabel}</label>
              <div className={adminStyles.amenityGrid}>
                {ALERT_AMENITY_IDS.map((amId) => {
                  const checked = amenities.includes(amId);
                  return (
                    <div
                      key={amId}
                      onClick={() => toggleAmenity(amId)}
                      className={`${adminStyles.amenityCheckboxItem} ${
                        checked ? adminStyles.amenityCheckboxActive : ""
                      }`}
                    >
                      <div
                        style={{
                          width: 17,
                          height: 17,
                          borderRadius: 4,
                          border: "2px solid",
                          borderColor: checked ? "var(--brand-primary)" : "var(--border-medium)",
                          backgroundColor: checked ? "var(--brand-primary)" : "transparent",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {checked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: "0.84rem" }}>
                        {translateAmenity(amId, language)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              {ext.cancel}
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <BellRing size={16} />
              <span>{isSubmitting ? ext.saving : ep.activateAlertBtn}</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Alerts List */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Sparkles size={18} style={{ color: "var(--brand-primary)" }} />
            <span>{ep.configuredAlertsTitle} ({alerts.length})</span>
          </div>
        </div>

        <div style={{ padding: "1.25rem" }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              {ep.loading}
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className={styles.alertCard}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 800 }}>{alert.name}</h3>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: alert.isActive
                            ? "var(--deal-green-bg)"
                            : "var(--bg-muted)",
                          color: alert.isActive ? "var(--deal-green)" : "var(--text-muted)",
                        }}
                      >
                        {alert.isActive ? ep.activeBadge : ep.pausedBadge}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      <strong>
                        {alert.frequency === "instant"
                          ? ep.freqInstant
                          : alert.frequency === "daily"
                          ? ep.freqDaily
                          : ep.freqWeekly}
                      </strong>{" "}
                      •{" "}
                      <strong>
                        {alert.channel === "both"
                          ? ep.channelBoth
                          : alert.channel === "email"
                          ? ep.channelEmail
                          : ep.channelInApp}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.45rem" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleAlert(alert)}
                      className="btn btn-secondary"
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                    >
                      {alert.isActive ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
                      <span>{alert.isActive ? ep.pauseBtn : ep.activateBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className={`${adminStyles.actionIconBtn} ${adminStyles.actionDeleteBtn}`}
                      title={ext.delete}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className={styles.criteriaChips}>
                  <span className={styles.chip}>
                    <MapPin size={12} />
                    {alert.query ? alert.query : ep.allDestinations}
                  </span>
                  <span className={styles.chip}>
                    {translatePropertyType(alert.propertyType, language)}
                  </span>
                  {alert.maxPricePerNight && (
                    <span className={styles.chip}>
                      <DollarSign size={12} />
                      Max {alert.maxPricePerNight} € {t.night}
                    </span>
                  )}
                  {alert.minRating && (
                    <span className={styles.chip}>
                      <Star size={12} />
                      {alert.minRating}+ ★
                    </span>
                  )}
                  {alert.minGuests && (
                    <span className={styles.chip}>
                      <Users size={12} />
                      Min {alert.minGuests}
                    </span>
                  )}
                  {alert.amenities.map((am) => (
                    <span key={am} className={styles.chip}>
                      + {translateAmenity(am, language)}
                    </span>
                  ))}
                </div>

                <div className={styles.matchBanner}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--brand-primary)" }}>
                    {alert.matchesCount > 0
                      ? `${alert.matchesCount} ${ep.matchesFoundSuffix}`
                      : ep.noMatchesAlertText}
                  </div>

                  {alert.matchesCount > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedAlertId(expandedAlertId === alert.id ? null : alert.id)
                      }
                      className="btn btn-primary"
                      style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}
                    >
                      {expandedAlertId === alert.id ? ep.hideResults : ep.showResults}
                    </button>
                  )}
                </div>

                {expandedAlertId === alert.id && alert.matchingProperties.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.85rem",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {alert.matchingProperties.map((m) => (
                      <Link
                        key={m.id}
                        href={`/properties/${m.slug}`}
                        style={{
                          display: "flex",
                          gap: "0.65rem",
                          padding: "0.6rem",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-subtle)",
                          backgroundColor: "var(--bg-muted)",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={m.featuredImage}
                          alt={m.title}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "var(--radius-sm)",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {m.title}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                            {m.city} • {m.pricePerNight} € {t.night}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)" }}>
              {ep.noAlertsConfigured}
            </div>
          )}
        </div>
      </div>

      {/* Received Notifications Inbox */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <Bell size={18} style={{ color: "var(--brand-primary)" }} />
            <span>
              {ep.receivedNotifsTitle} ({unreadCount} {ep.unreadWord})
            </span>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="btn btn-secondary"
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
            >
              <Check size={14} />
              <span>{ep.markAllRead}</span>
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notifItem} ${
                  !notif.isRead ? styles.notifItemUnread : ""
                }`}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    {!notif.isRead && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "var(--brand-primary)",
                          display: "inline-block",
                        }}
                      />
                    )}
                    <strong style={{ fontSize: "0.92rem" }}>{notif.message}</strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <Mail size={12} style={{ display: "inline", marginRight: 4 }} />
                    <strong>{notif.alertName}</strong> • {notif.propertyCity} •{" "}
                    <strong>{notif.pricePerNight} € {t.night}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexShrink: 0 }}>
                  <Link
                    href={`/properties/${notif.propertySlug}`}
                    onClick={() => !notif.isRead && handleMarkOneRead(notif.id)}
                    className="btn btn-secondary"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                  >
                    <ExternalLink size={14} />
                    <span>{ext.view}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(notif.id)}
                    className={`${adminStyles.actionIconBtn} ${adminStyles.actionDeleteBtn}`}
                    title={ext.delete}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            {ep.noReceivedNotifs}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EspacePersoAlertesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          Loading...
        </div>
      }
    >
      <AlertesContent />
    </Suspense>
  );
}

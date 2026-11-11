"use client";

import React from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { ContactMapProvider } from "@/lib/types";

interface ContactLocationMapProps {
  title?: string;
  addressQuery?: string;
  lat: number;
  lng: number;
  zoom?: number;
  provider?: ContactMapProvider;
  externalUrl?: string;
  openInMapsLabel: string;
  height?: number;
}

export function buildExternalMapsUrl(
  lat: number,
  lng: number,
  addressQuery?: string,
  customExternalUrl?: string
): string {
  const trimmed = (customExternalUrl || "").trim();
  if (trimmed) return trimmed;
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const encodedQuery = encodeURIComponent(addressQuery || "Algiers, Algeria");
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

export function buildEmbedMapUrl(
  lat: number,
  lng: number,
  zoom: number,
  provider: ContactMapProvider,
  addressQuery?: string
): string {
  const safeLat = Number.isFinite(lat) ? lat : 36.7486;
  const safeLng = Number.isFinite(lng) ? lng : 3.0389;
  const safeZoom = Math.min(19, Math.max(2, Math.round(zoom || 14)));

  if (provider === "google") {
    const q = encodeURIComponent(
      Number.isFinite(lat) && Number.isFinite(lng)
        ? `${safeLat},${safeLng}`
        : addressQuery || "Algiers"
    );
    return `https://maps.google.com/maps?q=${q}&z=${safeZoom}&output=embed`;
  }

  // OpenStreetMap embed bounding box scaled around target coordinates
  const span = 360 / Math.pow(2, safeZoom + 1);
  const lngDelta = Math.max(0.002, span * 1.45);
  const latDelta = Math.max(0.0015, span * 0.95);
  const minLng = Math.max(-180, safeLng - lngDelta).toFixed(6);
  const maxLng = Math.min(180, safeLng + lngDelta).toFixed(6);
  const minLat = Math.max(-85, safeLat - latDelta).toFixed(6);
  const maxLat = Math.min(85, safeLat + latDelta).toFixed(6);

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${safeLat.toFixed(
    6
  )}%2C${safeLng.toFixed(6)}`;
}

/**
 * Interactive map widget for the Direct Contact card with an "Open in Maps" floating action button.
 */
export function ContactLocationMap({
  title,
  addressQuery,
  lat,
  lng,
  zoom = 14,
  provider = "openstreetmap",
  externalUrl,
  openInMapsLabel,
  height = 195,
}: ContactLocationMapProps) {
  const embedSrc = buildEmbedMapUrl(lat, lng, zoom, provider, addressQuery);
  const mapsHref = buildExternalMapsUrl(lat, lng, addressQuery, externalUrl);

  return (
    <div style={{ marginTop: "0.35rem" }}>
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            marginBottom: "0.45rem",
          }}
        >
          <MapPin size={13} style={{ color: "var(--brand-primary)" }} />
          <span>{title}</span>
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: `${height}px`,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <iframe
          title={title || openInMapsLabel}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
          }}
        />

        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.35rem 0.72rem",
            borderRadius: "9999px",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-medium)",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            fontSize: "0.74rem",
            fontWeight: 700,
            textDecoration: "none",
            zIndex: 2,
          }}
        >
          <ExternalLink size={12} style={{ color: "var(--brand-primary)" }} />
          <span>{openInMapsLabel}</span>
        </a>
      </div>
    </div>
  );
}

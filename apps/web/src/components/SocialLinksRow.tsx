"use client";

import React from "react";
import { useDisplaySettings } from "@/lib/displaySettingsContext";

interface SocialLinksRowProps {
  className?: string;
  linkClassName?: string;
  variant?: "default" | "minimal";
}

const DEFAULT_LINK_STYLE: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  background: "var(--bg-muted)",
  border: "1px solid var(--border-subtle)",
  color: "var(--text-primary)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  textDecoration: "none",
};

const MINIMAL_LINK_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-primary)",
  transition: "all 0.2s ease",
  textDecoration: "none",
  padding: 4,
};

/**
 * Shared Facebook, Instagram & LinkedIn icon links driven globally by DisplaySettings.
 */
export function SocialLinksRow({ className, linkClassName, variant = "default" }: SocialLinksRowProps) {
  const { displaySettings } = useDisplaySettings();

  const items = [
    {
      key: "facebook",
      label: "Facebook",
      href: displaySettings.socialFacebookUrl,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      label: "Instagram",
      href: displaySettings.socialInstagramUrl,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: displaySettings.socialLinkedInUrl,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean((item.href || "").trim()));

  if (items.length === 0) return null;

  const baseStyle = variant === "minimal" ? MINIMAL_LINK_STYLE : DEFAULT_LINK_STYLE;

  return (
    <div
      className={className}
      style={className ? undefined : { display: "flex", alignItems: "center", gap: variant === "minimal" ? "1.5rem" : "0.65rem", justifyContent: "center" }}
    >
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={linkClassName}
          style={linkClassName ? undefined : baseStyle}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}

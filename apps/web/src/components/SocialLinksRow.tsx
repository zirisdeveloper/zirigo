"use client";

import React from "react";
import { useDisplaySettings } from "@/lib/displaySettingsContext";

interface SocialLinksRowProps {
  className?: string;
  linkClassName?: string;
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

/**
 * Shared Facebook, Instagram & LinkedIn icon links driven globally by DisplaySettings.
 */
export function SocialLinksRow({ className, linkClassName }: SocialLinksRowProps) {
  const { displaySettings } = useDisplaySettings();

  const items = [
    {
      key: "facebook",
      label: "Facebook",
      href: displaySettings.socialFacebookUrl,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H8v3h2.4v8h3.1z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      label: "Instagram",
      href: displaySettings.socialInstagramUrl,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.2 13.02 9.91V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.06 11.09C16.4 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean((item.href || "").trim()));

  if (items.length === 0) return null;

  return (
    <div
      className={className}
      style={className ? undefined : { display: "flex", alignItems: "center", gap: "0.65rem" }}
    >
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={linkClassName}
          style={linkClassName ? undefined : DEFAULT_LINK_STYLE}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Moon, Sun, Heart, Sparkles, Scale, Globe, LogOut, User } from "lucide-react";
import { useI18n, Language } from "../lib/i18n";
import { useAuth } from "../lib/authContext";
import { usePreferences } from "../lib/preferencesContext";
import { CurrencyCode } from "../lib/types";
import styles from "./Navbar.module.css";

interface NavbarProps {
  favoriteCount: number;
  compareCount: number;
  onOpenCompare: () => void;
  currency?: CurrencyCode;
  onCurrencyChange?: (c: CurrencyCode) => void;
}

export function Navbar({
  favoriteCount,
  compareCount,
  onOpenCompare,
  currency: propCurrency,
  onCurrencyChange,
}: NavbarProps) {
  const router = useRouter();
  const { t, ext } = useI18n();
  const { user, unreadNotificationsCount, logout } = useAuth();
  const {
    currency: ctxCurrency,
    language,
    isDark,
    setCurrency: setCtxCurrency,
    setLanguage,
    toggleTheme,
  } = usePreferences();

  const activeCurrency = propCurrency || ctxCurrency;

  const handleCurrencySelect = (val: string) => {
    const nextCurrency = val as CurrencyCode;
    setCtxCurrency(nextCurrency);
    if (onCurrencyChange && onCurrencyChange !== setCtxCurrency) {
      onCurrencyChange(nextCurrency);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navbarInner}`}>
        {/* Brand Logo & Tagline */}
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIconWrapper}>
              <Compass className={styles.logoIcon} />
            </div>
            <span className={styles.logoText}>
              Ziri<span className={styles.logoAccent}>go</span>
            </span>
          </Link>
          <span className={styles.tagline}>{t.tagline}</span>
        </div>

        {/* Action Controls */}
        <div className={styles.navActions}>
          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className={`${styles.actionBtn} ${compareCount > 0 ? styles.activeAction : ""}`}
            title={t.compare}
          >
            <Scale size={18} />
            <span className={styles.actionLabel}>{t.compare}</span>
            {compareCount > 0 && (
              <span className={styles.badgeCount}>{compareCount}</span>
            )}
          </button>

          {/* Favorites Button */}
          <div className={styles.actionBtn} title={t.wishlist}>
            <Heart size={18} />
            <span className={styles.actionLabel}>{t.wishlist}</span>
            {favoriteCount > 0 && (
              <span className={styles.badgeCount}>{favoriteCount}</span>
            )}
          </div>

          {/* Language Switcher */}
          <div className={styles.selectWrapper}>
            <Globe size={15} className={styles.selectIcon} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className={styles.languageSelect}
              aria-label="Select language"
            >
              <option value="en">English (EN)</option>
              <option value="fr">Français (FR)</option>
              <option value="ar">العربية (AR)</option>
            </select>
          </div>

          {/* Currency Switcher */}
          <div className={styles.currencyWrapper}>
            <select
              value={activeCurrency}
              onChange={(e) => handleCurrencySelect(e.target.value)}
              className={styles.currencySelect}
              aria-label="Select currency"
            >
              <option value="DZD">DZD</option>
              <option value="EUR">€ EUR</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={styles.themeToggleBtn}
            title={t.themeToggle}
            aria-label={t.themeToggle}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Espace Perso / Connexion */}
          <Link
            href={user ? "/espace-perso" : "/connexion"}
            className={`${styles.actionBtn} ${styles.personalSpaceBtn} ${user ? styles.activeAction : ""}`}
            title={user ? ext.personalSpaceTitle : ext.loginRegisterTitle}
            style={{ textDecoration: "none" }}
          >
            <User size={18} />
            <span className={styles.actionLabel}>
              {user ? user.name.split(" ")[0] : ext.personalSpace}
            </span>
            {user && unreadNotificationsCount > 0 && (
              <span className={styles.badgeCount} style={{ backgroundColor: "var(--alert-red)" }}>
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* Logout Button when connected */}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className={styles.actionBtn}
              title={ext.logoutTitle}
              style={{ color: "var(--alert-red)", borderColor: "rgba(239, 68, 68, 0.25)" }}
            >
              <LogOut size={17} />
              <span className={styles.actionLabel}>{ext.logout}</span>
            </button>
          )}

          {/* List Property CTA -> Requires Auth in Espace Perso */}
          <Link
            href={user ? "/espace-perso/annonces/new" : "/connexion?redirect=/espace-perso/annonces/new"}
            className={`btn btn-primary ${styles.listPropertyBtn}`}
            style={{ textDecoration: "none" }}
          >
            <Sparkles size={16} />
            <span>{t.listProperty}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

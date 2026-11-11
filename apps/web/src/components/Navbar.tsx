"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Moon,
  Sun,
  Heart,
  Sparkles,
  Scale,
  Globe,
  LogOut,
  User,
  UserPlus,
  PlusCircle,
  X,
  Building2,
  Home,
  Hotel,
  Trees,
  Umbrella,
  BedDouble,
  Phone,
  ShieldCheck,
  FileText,
  Megaphone,
  CalendarRange,
  Bell,
} from "lucide-react";
import { useI18n, Language } from "../lib/i18n";
import { useAuth } from "../lib/authContext";
import { usePreferences } from "../lib/preferencesContext";
import { useDisplaySettings } from "../lib/displaySettingsContext";
import { SocialLinksRow } from "./SocialLinksRow";
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
  const { displaySettings } = useDisplaySettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const {
    currency: ctxCurrency,
    language,
    isDark,
    setCurrency: setCtxCurrency,
    setLanguage,
    toggleTheme,
  } = usePreferences();

  const activeCurrency = propCurrency || ctxCurrency;
  const showMenuBtn = displaySettings?.showHeaderMenuButton ?? true;

  const menuCopy =
    language === "ar"
      ? {
          openMenu: "فتح القائمة",
          closeMenu: "إغلاق القائمة",
          accountSection: "الحساب",
          signIn: "تسجيل الدخول",
          createAccount: "إنشاء حساب",
          publishListing: "نشر إعلان",
          mySpace: "مساحتي الشخصية",
          availability: "التوفر والتواريخ",
          alerts: "التنبيهات والإشعارات",
          categoriesSection: "الفئات",
          usefulLinksSection: "روابط مفيدة",
          howToPublish: "كيف تنشر إعلانك؟",
          contactUs: "اتصل بنا",
          privacyPolicy: "سياسة الخصوصية",
          termsOfUse: "شروط الاستخدام",
        }
      : language === "en"
      ? {
          openMenu: "Open menu",
          closeMenu: "Close menu",
          accountSection: "Account",
          signIn: "Sign in",
          createAccount: "Create account",
          publishListing: "Publish listing",
          mySpace: "My Personal Space",
          availability: "Availability & Calendar",
          alerts: "Alerts & Notifications",
          categoriesSection: "Categories",
          usefulLinksSection: "Useful Links",
          howToPublish: "How to list a property?",
          contactUs: "Contact Us",
          privacyPolicy: "Privacy Policy",
          termsOfUse: "Terms of Use",
        }
      : {
          openMenu: "Ouvrir le menu",
          closeMenu: "Fermer le menu",
          accountSection: "Compte",
          signIn: "Se connecter",
          createAccount: "Créer compte",
          publishListing: "Publier annonce",
          mySpace: "Mon Espace Perso",
          availability: "Disponibilités & Calendrier",
          alerts: "Alertes & Notifications",
          categoriesSection: "Catégories",
          usefulLinksSection: "Liens utiles",
          howToPublish: "Comment annoncer ?",
          contactUs: "Contactez-nous",
          privacyPolicy: "Politique de confidentialité",
          termsOfUse: "Conditions d'utilisation",
        };

  const drawerCategories = [
    { id: "hotel", label: ext.catHotels, icon: Hotel },
    { id: "apartment", label: ext.catApartments, icon: Building2 },
    { id: "villa", label: ext.catVillas, icon: Home },
    { id: "chalet", label: ext.catChalets, icon: Trees },
    { id: "resort", label: ext.catResorts, icon: Umbrella },
    { id: "dormitory", label: ext.catDormitories, icon: BedDouble },
  ];

  const handleCategoryNavigate = (categoryId: string) => {
    setIsMenuOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("zirigo:select-category", { detail: categoryId }));
    }
    router.push(`/?type=${categoryId}#catalog`);
  };

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
    <>
      <header className={styles.header}>
        <div className={`container ${styles.navbarInner}`}>
          {/* Brand Logo, Left Menu Button & Tagline */}
          <div className={styles.brandGroup}>
            {showMenuBtn && (
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className={styles.menuTriggerBtn}
                aria-label={menuCopy.openMenu}
                title={menuCopy.openMenu}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="zirigoMenuBarGrad" x1="3" y1="0" x2="21" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="18%" stopColor="currentColor" />
                      <stop offset="82%" stopColor="currentColor" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                  <rect x="3" y="5" width="18" height="2.6" rx="1.3" fill="url(#zirigoMenuBarGrad)" />
                  <rect x="3" y="10.7" width="18" height="2.6" rx="1.3" fill="url(#zirigoMenuBarGrad)" />
                  <rect x="3" y="16.4" width="18" height="2.6" rx="1.3" fill="url(#zirigoMenuBarGrad)" />
                </svg>
              </button>
            )}
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

      {/* Slide-Over Navigation Drawer */}
      {isMenuOpen && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setIsMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <aside className={styles.drawerPanel} onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <Link
                href="/"
                className={styles.logo}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={styles.logoIconWrapper}>
                  <Compass className={styles.logoIcon} />
                </div>
                <span className={styles.logoText}>
                  Ziri<span className={styles.logoAccent}>go</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className={styles.drawerCloseBtn}
                aria-label={menuCopy.closeMenu}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* 1. Compte Section */}
              <div className={styles.drawerSection}>
                <div className={styles.drawerSectionTitle}>{menuCopy.accountSection}</div>
                <div className={styles.drawerList}>
                  {!user ? (
                    <>
                      <Link
                        href="/connexion"
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.drawerLink}
                      >
                        <User size={18} className={styles.drawerLinkIcon} />
                        <span>{menuCopy.signIn}</span>
                      </Link>
                      <Link
                        href="/connexion?tab=register"
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.drawerLink}
                      >
                        <UserPlus size={18} className={styles.drawerLinkIcon} />
                        <span>{menuCopy.createAccount}</span>
                      </Link>
                      <Link
                        href="/connexion?redirect=/espace-perso/annonces/new"
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.drawerLink}
                      >
                        <PlusCircle size={18} className={styles.drawerLinkIcon} />
                        <span>{menuCopy.publishListing}</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/espace-perso"
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.drawerLink}
                      >
                        <User size={18} className={styles.drawerLinkIcon} />
                        <span>{menuCopy.mySpace}</span>
                      </Link>
                      <Link
                        href="/espace-perso/annonces/new"
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.drawerLink}
                      >
                        <PlusCircle size={18} className={styles.drawerLinkIcon} />
                        <span>{menuCopy.publishListing}</span>
                      </Link>
                      <Link
                        href="/espace-perso/disponibilites"
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.drawerLink}
                      >
                        <CalendarRange size={18} className={styles.drawerLinkIcon} />
                        <span>{menuCopy.availability}</span>
                      </Link>
                      <Link
                        href="/espace-perso/alertes"
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.drawerLink}
                      >
                        <Bell size={18} className={styles.drawerLinkIcon} />
                        <span>{menuCopy.alerts}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className={styles.drawerLink}
                        style={{ color: "var(--alert-red)" }}
                      >
                        <LogOut size={18} />
                        <span>{ext.logout}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 2. Catégories Section */}
              <div className={styles.drawerSection}>
                <div className={styles.drawerSectionTitle}>{menuCopy.categoriesSection}</div>
                <div className={styles.drawerList}>
                  {drawerCategories.map((cat) => {
                    const IconComp = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryNavigate(cat.id)}
                        className={styles.drawerLink}
                      >
                        <IconComp size={18} className={styles.drawerLinkIcon} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Liens utiles Section */}
              <div className={styles.drawerSection}>
                <div className={styles.drawerSectionTitle}>{menuCopy.usefulLinksSection}</div>
                <div className={styles.drawerList}>
                  <Link
                    href={user ? "/espace-perso/annonces/new" : "/connexion?redirect=/espace-perso/annonces/new"}
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerLink}
                  >
                    <Megaphone size={18} className={styles.drawerLinkIcon} />
                    <span>{menuCopy.howToPublish}</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerLink}
                  >
                    <Phone size={18} className={styles.drawerLinkIcon} />
                    <span>{menuCopy.contactUs}</span>
                  </Link>
                  <Link
                    href="/politique-confidentialite"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerLink}
                  >
                    <ShieldCheck size={18} className={styles.drawerLinkIcon} />
                    <span>{menuCopy.privacyPolicy}</span>
                  </Link>
                  <Link
                    href="/conditions-utilisation"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerLink}
                  >
                    <FileText size={18} className={styles.drawerLinkIcon} />
                    <span>{menuCopy.termsOfUse}</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Social Icons Row */}
              <SocialLinksRow
                className={styles.drawerSocialRow}
                linkClassName={styles.drawerSocialLink}
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

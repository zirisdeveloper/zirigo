"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Landmark,
  Phone,
  ShieldCheck,
  FileText,
  Megaphone,
  CalendarRange,
  Bell,
  ChevronDown,
  LayoutDashboard,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isUserMenuOpen]);

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
        createShop: "أنشئ متجراً / مساحة وكالة",
        advertising: "إعلانات على زيريغو",
        howToPublish: "كيف تنشر إعلانك؟",
        contactUs: "اتصل بنا",
        privacyPolicy: "سياسة الخصوصية",
        termsOfUse: "شروط الاستخدام",
        salesAndPaymentTerms: "شروط البيع والدفع",
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
          usefulLinksSection: "Useful links",
          createShop: "Create a shop",
          advertising: "Advertise on Zirigo",
          howToPublish: "How to list a property?",
          contactUs: "Contact us",
          privacyPolicy: "Privacy policy",
          termsOfUse: "Terms of use",
          salesAndPaymentTerms: "Terms of sale and payment",
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
          createShop: "Créez une boutique",
          advertising: "Publicité sur Zirigo",
          howToPublish: "Comment annoncer ?",
          contactUs: "Contactez-nous",
          privacyPolicy: "Politique de confidentialité",
          termsOfUse: "Conditions d'utilisation",
          salesAndPaymentTerms: "Conditions de vente et paiement",
        };

  const userMenuCopy =
    language === "ar"
      ? {
        mySpace: "مساحتي الشخصية",
        myListings: "إعلاناتي وعقاراتي",
        availability: "التوفر والتواريخ",
        alerts: "التنبيهات والإشعارات",
        adminPlatform: "لوحة تحكم المشرف",
        logout: "تسجيل الخروج",
        adminRole: "مشرف",
        userRole: "مضيف",
      }
      : language === "en"
        ? {
          mySpace: "My Personal Space",
          myListings: "My Listings",
          availability: "Availability & Calendar",
          alerts: "Alerts & Notifications",
          adminPlatform: "Admin Dashboard",
          logout: "Sign Out",
          adminRole: "Admin",
          userRole: "Host",
        }
        : {
          mySpace: "Mon Espace Perso",
          myListings: "Mes Annonces",
          availability: "Disponibilités & Calendrier",
          alerts: "Alertes & Notifications",
          adminPlatform: "Administration",
          logout: "Déconnexion",
          adminRole: "Admin",
          userRole: "Hôte",
        };

  const drawerCategories = [
    { id: "hotel", label: ext.catHotels, icon: Hotel },
    { id: "apartment", label: ext.catApartments, icon: Building2 },
    { id: "villa", label: ext.catVillas, icon: Home },
    { id: "chalet", label: ext.catChalets, icon: Trees },
    { id: "resort", label: ext.catResorts, icon: Umbrella },
    { id: "dormitory", label: ext.catDormitories, icon: BedDouble },
    { id: "complex", label: ext.catComplexes, icon: Landmark },
  ].filter((cat) => {
    if (!displaySettings?.enabledPropertyTypes) return true;
    return displaySettings.enabledPropertyTypes[cat.id as keyof typeof displaySettings.enabledPropertyTypes] !== false;
  });

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
                  height="18"
                  viewBox="0 0 24 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="4" x2="21" y2="4" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="3" y1="16" x2="21" y2="16" />
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
                <span className={styles.badgeCount}>
                  <span className={styles.badgeValue}>{compareCount}</span>
                </span>
              )}
            </button>

            {/* Favorites Button */}
            <div className={styles.actionBtn} title={t.wishlist}>
              <Heart size={18} />
              <span className={styles.actionLabel}>{t.wishlist}</span>
              {favoriteCount > 0 && (
                <span className={styles.badgeCount}>
                  <span className={styles.badgeValue}>{favoriteCount}</span>
                </span>
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

            {/* Espace Perso / Connexion & User Submenu */}
            {!user ? (
              <Link
                href="/connexion"
                className={`${styles.actionBtn} ${styles.personalSpaceBtn}`}
                title={ext.loginRegisterTitle}
                style={{ textDecoration: "none" }}
              >
                <User size={18} />
                <span className={styles.actionLabel}>{ext.personalSpace}</span>
              </Link>
            ) : (
              <div className={styles.userMenuWrapper} ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className={`${styles.actionBtn} ${styles.personalSpaceBtn} ${styles.userMenuTrigger} ${isUserMenuOpen ? styles.activeAction : ""
                    }`}
                  title={ext.personalSpaceTitle}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User size={18} />
                  <span className={styles.actionLabel}>{user.name.split(" ")[0]}</span>
                  {unreadNotificationsCount > 0 && (
                    <span className={styles.badgeCount} style={{ backgroundColor: "var(--alert-red)" }}>
                      <span className={styles.badgeValue}>{unreadNotificationsCount}</span>
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={isUserMenuOpen ? styles.userMenuChevronOpen : styles.userMenuChevron}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className={styles.userDropdown} role="menu">
                    <div className={styles.userDropdownHeader}>
                      <div className={styles.userDropdownNameRow}>
                        <span className={styles.userDropdownName}>{user.name}</span>
                        <span className={styles.userRoleBadge}>
                          {user.role === "admin" ? userMenuCopy.adminRole : userMenuCopy.userRole}
                        </span>
                      </div>
                      <span className={styles.userDropdownEmail}>{user.email}</span>
                    </div>

                    <div className={styles.userDropdownList}>
                      <Link
                        href="/espace-perso"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={styles.userDropdownItem}
                        role="menuitem"
                      >
                        <div className={styles.userDropdownItemLeft}>
                          <User size={16} />
                          <span>{userMenuCopy.mySpace}</span>
                        </div>
                      </Link>

                      <Link
                        href="/espace-perso/annonces"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={styles.userDropdownItem}
                        role="menuitem"
                      >
                        <div className={styles.userDropdownItemLeft}>
                          <Building2 size={16} />
                          <span>{userMenuCopy.myListings}</span>
                        </div>
                      </Link>

                      <Link
                        href="/espace-perso/disponibilites"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={styles.userDropdownItem}
                        role="menuitem"
                      >
                        <div className={styles.userDropdownItemLeft}>
                          <CalendarRange size={16} />
                          <span>{userMenuCopy.availability}</span>
                        </div>
                      </Link>

                      <Link
                        href="/espace-perso/alertes"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={styles.userDropdownItem}
                        role="menuitem"
                      >
                        <div className={styles.userDropdownItemLeft}>
                          <Bell size={16} />
                          <span>{userMenuCopy.alerts}</span>
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <span
                            className={styles.badgeCount}
                            style={{
                              backgroundColor: "var(--alert-red)",
                              height: 17,
                              minWidth: 17,
                              fontSize: "0.68rem",
                            }}
                          >
                            <span className={styles.badgeValue}>{unreadNotificationsCount}</span>
                          </span>
                        )}
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={styles.userDropdownItem}
                          role="menuitem"
                        >
                          <div className={styles.userDropdownItemLeft}>
                            <LayoutDashboard size={16} />
                            <span>{userMenuCopy.adminPlatform}</span>
                          </div>
                        </Link>
                      )}

                      <div className={styles.userDropdownDivider} />

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className={`${styles.userDropdownItem} ${styles.userDropdownLogout}`}
                        role="menuitem"
                      >
                        <div className={styles.userDropdownItemLeft}>
                          <LogOut size={16} />
                          <span>{userMenuCopy.logout}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                    href="/creer-boutique"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerTextLink}
                  >
                    {menuCopy.createShop}
                  </Link>
                  <Link
                    href="/contact?subject=publicite"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerTextLink}
                  >
                    {menuCopy.advertising}
                  </Link>
                  <Link
                    href="/comment-annoncer"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerTextLink}
                  >
                    {menuCopy.howToPublish}
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerTextLink}
                  >
                    {menuCopy.contactUs}
                  </Link>
                  <Link
                    href="/politique-confidentialite"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerTextLink}
                  >
                    {menuCopy.privacyPolicy}
                  </Link>
                  <Link
                    href="/conditions-utilisation"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerTextLink}
                  >
                    {menuCopy.termsOfUse}
                  </Link>
                  <Link
                    href="/conditions-vente"
                    onClick={() => setIsMenuOpen(false)}
                    className={styles.drawerTextLink}
                  >
                    {menuCopy.salesAndPaymentTerms}
                  </Link>
                </div>
              </div>

              {/* Bottom Social Icons Row */}
              <SocialLinksRow
                variant="minimal"
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

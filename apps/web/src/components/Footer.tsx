"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck } from "lucide-react";
import { useI18n } from "../lib/i18n";
import styles from "./Footer.module.css";

export function Footer() {
  const { t, ext } = useI18n();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.topSection}>
          {/* Brand info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIconWrapper}>
                <Compass className={styles.logoIcon} />
              </div>
              <span className={styles.logoText}>
                Ziri<span className={styles.logoAccent}>go</span>
              </span>
            </Link>
            <p className={styles.brandDesc}>{t.footerDesc}</p>
            <div className={styles.trustBadge}>
              <ShieldCheck size={18} className={styles.trustBadgeIcon} />
              <span>{t.footerGuarantee}</span>
            </div>
          </div>

          {/* Nav links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>{t.destinationsCol}</h4>
            <ul className={styles.linksList}>
              <li><Link href="/">{ext.footerDest1}</Link></li>
              <li><Link href="/">{ext.footerDest2}</Link></li>
              <li><Link href="/">{ext.footerDest3}</Link></li>
              <li><Link href="/">{ext.footerDest4}</Link></li>
              <li><Link href="/">{ext.footerDest5}</Link></li>
              <li><Link href="/">{ext.footerDest6}</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>{t.comparisonCol}</h4>
            <ul className={styles.linksList}>
              <li><Link href="/">{ext.footerComp1}</Link></li>
              <li><Link href="/">{ext.footerComp2}</Link></li>
              <li><Link href="/">{ext.footerComp3}</Link></li>
              <li><Link href="/">{ext.footerComp4}</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>{t.hostsCol}</h4>
            <ul className={styles.linksList}>
              <li><Link href="/espace-perso/annonces/new">{t.listProperty}</Link></li>
              <li><Link href="/espace-perso">{ext.personalSpaceTitle}</Link></li>
              <li><Link href="/espace-perso/alertes">{ext.alertsAndNotifs}</Link></li>
              <li><Link href="/admin">{ext.adminSpace}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} {t.copyright}
          </div>
          <div className={styles.socialRow}>
            <span>{t.terms}</span>
            <span>•</span>
            <span>{t.privacy}</span>
            <span>•</span>
            <span>{t.cookies}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

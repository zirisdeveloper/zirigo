"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, Heart, ExternalLink, Globe } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
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
            <p className={styles.brandDesc}>
              The transparent accommodation comparison engine. We audit major online travel portals in real time to guarantee you book at the authentic lowest rate with direct host benefits.
            </p>
            <div className={styles.trustBadge}>
              <ShieldCheck size={18} className={styles.trustBadgeIcon} />
              <span>Best Direct Rate Guarantee • No Hidden Fees</span>
            </div>
          </div>

          {/* Nav links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Popular Destinations</h4>
            <ul className={styles.linksList}>
              <li><Link href="/">French Riviera & Cassis</Link></li>
              <li><Link href="/">Paris Historic Marais</Link></li>
              <li><Link href="/">Chamonix & Mont-Blanc</Link></li>
              <li><Link href="/">Amalfi Coast & Positano</Link></li>
              <li><Link href="/">Marrakech Palmeraie</Link></li>
              <li><Link href="/">Algiers Waterfront Bay</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Platform Comparison</h4>
            <ul className={styles.linksList}>
              <li><Link href="/">How Zirigo Compares Rates</Link></li>
              <li><Link href="/">Booking.com vs Direct</Link></li>
              <li><Link href="/">Airbnb Fees Breakdown</Link></li>
              <li><Link href="/">Host Direct Booking Program</Link></li>
              <li><Link href="/">Price Match Guarantee</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>For Hosts & Hoteliers</h4>
            <ul className={styles.linksList}>
              <li><Link href="/">List your accommodation</Link></li>
              <li><Link href="/">PMS & Channel Manager Sync</Link></li>
              <li><Link href="/">Commission-Free Direct Bookings</Link></li>
              <li><Link href="/">Partner Success Stories</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} Zirigo Inc. All rights reserved. Built with Next.js, Turbo & Drizzle ORM.
          </div>
          <div className={styles.socialRow}>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

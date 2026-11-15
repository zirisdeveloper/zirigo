"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { InfoPageShell } from "@/components/InfoPageShell";
import { useI18n } from "@/lib/i18n";

export default function HowToPublishPage() {
  const { language } = useI18n();

  const content =
    language === "ar"
      ? {
          badge: "دليل المضيفين والمعلنين",
          title: "كيف تنشر إعلانك على زيريغو؟",
          subtitle: "خطوات بسيطة لنشر فندقك، شقتك، فيلتك، شاليهك أو منتجعك وبدء استقبال طلبات الحجز المباشرة مجاناً.",
          steps: [
            {
              step: "1",
              title: "أنشئ حسابك الشخصي أو المهني",
              desc: "سجل مجاناً في ثوانٍ عبر البريد الإلكتروني للوصول إلى لوحة التحكم الشخصية وإدارة إعلاناتك وتقويم الحجوزات.",
            },
            {
              step: "2",
              title: "أدخل تفاصيل ومميزات الإقامة",
              desc: "حدد نوع العقار (فندق، شقة، فيلا، شاليه، منتجع)، المدينة والولاية، وسائل الراحة المتاحة، وأضف صوراً واضحة وجذابة.",
            },
            {
              step: "3",
              title: "حدد الأسعار وشروط الحجز",
              desc: "اضبط السعر لليلة الواحدة بالدينار الجزائري، سياسة الإلغاء، أوقات الوصول والمغادرة وأي عروض خاصة للنزلاء.",
            },
            {
              step: "4",
              title: "استقبل الحجوزات المباشرة وتواصل مع النزلاء",
              desc: "يتم فحص إعلانك وتفعيله فوراً ليظهر في نتائج البحث ومحرك المقارنة. يتم حظر التواريخ المحجوزة تلقائياً في التقويم.",
            },
          ],
          cta: "نشر إعلان جديد الآن",
        }
      : language === "en"
      ? {
          badge: "Host & Advertiser Guide",
          title: "How to List on Zirigo?",
          subtitle: "A step-by-step walkthrough to list your hotel, apartment, villa, chalet, or resort and start receiving direct bookings.",
          steps: [
            {
              step: "1",
              title: "Create your free host account",
              desc: "Register in seconds with your email to unlock your personal space, calendar synchronization, and listing tools.",
            },
            {
              step: "2",
              title: "Fill in property details & photos",
              desc: "Select the accommodation category (hotel, apartment, villa, chalet, resort), location, amenities, and upload crisp photos.",
            },
            {
              step: "3",
              title: "Configure rates & stay rules",
              desc: "Set nightly rates in DZD with automatic multi-currency conversion, minimum stay rules, and your cancellation policy.",
            },
            {
              step: "4",
              title: "Receive direct booking requests",
              desc: "Your listing goes live across our search comparator. Confirmed reservations instantly block dates on your live calendar.",
            },
          ],
          cta: "Publish a Listing Now",
        }
      : {
          badge: "Guide Annonceurs & Hôtes",
          title: "Comment annoncer sur Zirigo ?",
          subtitle: "Découvrez comment publier votre hôtel, appartement, villa, chalet ou resort et recevoir des réservations directes sans commission cachée.",
          steps: [
            {
              step: "1",
              title: "Créez votre compte en quelques secondes",
              desc: "Inscrivez-vous gratuitement avec votre adresse email pour accéder à votre espace personnel dédié et piloter vos disponibilités.",
            },
            {
              step: "2",
              title: "Renseignez les détails et photos de votre bien",
              desc: "Choisissez le type d'hébergement (hôtel, appartement, villa, chalet, resort, dortoir), l'emplacement, les commodités et téléchargez de belles photos.",
            },
            {
              step: "3",
              title: "Fixez vos tarifs et conditions d'accueil",
              desc: "Définissez le prix par nuit en DZD, les horaires de check-in / check-out, la caution éventuelle et la politique d'annulation applicable.",
            },
            {
              step: "4",
              title: "Recevez les demandes et synchronisez votre calendrier",
              desc: "Votre annonce est auditée et mise en avant dans le comparateur. Dès qu'un séjour est accepté, les dates se bloquent automatiquement sur le calendrier.",
            },
          ],
          cta: "Publier mon annonce maintenant",
        };

  return (
    <InfoPageShell title={content.title} subtitle={content.subtitle} badge={content.badge}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {content.steps.map((st) => (
            <div
              key={st.step}
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "var(--brand-primary)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                {st.step}
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800 }}>{st.title}</h3>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)",
            border: "1px solid rgba(13, 148, 136, 0.2)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.25rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.25rem" }}>
              Prêt à publier votre hébergement ?
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
              Rejoignez les meilleurs hôtes et hôtels répertoriés sur Zirigo.
            </div>
          </div>
          <Link
            href="/espace-perso/annonces/new"
            className="btn btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Sparkles size={16} />
            <span>{content.cta}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </InfoPageShell>
  );
}


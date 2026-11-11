"use client";

import React from "react";
import { InfoPageShell } from "@/components/InfoPageShell";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPolicyPage() {
  const { language } = useI18n();

  const content =
    language === "ar"
      ? {
          badge: "الخصوصية وحماية البيانات",
          title: "سياسة الخصوصية",
          subtitle: "تلتزم منصة زيريغو بحماية بياناتك الشخصية وتوضيح كيفية استخدامها بشفافية كاملة.",
          sections: [
            {
              h: "1. البيانات التي نجمعها",
              p: "نجمع فقط المعلومات الضرورية لتشغيل حسابك وطلبات الحجز: الاسم، البريد الإلكتروني، رقم الهاتف الاختياري، وتفضيلات العرض (العملة مثل DZD، اللغة، والمظهر الداكن أو الفاتح).",
            },
            {
              h: "2. استخدام البيانات",
              p: "تُستخدم بياناتك لإدارة إعلاناتك العقارية، معالجة طلبات الحجز، إرسال تنبيهات البحث التي أنشأتها، وتخصيص واجهة المنصة وفق اختياراتك المحفوظة.",
            },
            {
              h: "3. أمان الحساب والتواريخ",
              p: "تُعرض تواريخ التوفر للعامة دون الكشف عن الأسماء أو بيانات الاتصال الخاصة بالضيوف. تظل بيانات المراسلة والحجوزات مقصورة على المالك المعني وإدارة المنصة.",
            },
            {
              h: "4. حقوقك",
              p: "يمكنك تحديث بياناتك الشخصية أو تفضيلاتك في أي وقت من خلال « مساحتي الشخصية » أو مراسلتنا عبر contact@zirigo.com لطلب حذف حسابك.",
            },
          ],
        }
      : language === "en"
      ? {
          badge: "Privacy & Data Protection",
          title: "Privacy Policy",
          subtitle: "Zirigo is committed to safeguarding your personal information and explaining clearly how it is used.",
          sections: [
            {
              h: "1. Data We Collect",
              p: "We collect only information required to operate your account, bookings, and listings: full name, email address, optional phone number, and display preferences (currency such as DZD, language, and theme mode).",
            },
            {
              h: "2. How We Use Information",
              p: "Your data enables direct booking requests, availability synchronization, owner/guest communications, search alerts, and cross-session preference restoration.",
            },
            {
              h: "3. Calendar & Booking Confidentiality",
              p: "Public availability calendars expose only blocked date intervals without exposing guest identities, email addresses, or private reservation notes.",
            },
            {
              h: "4. Your Rights",
              p: "You can inspect, update, or remove your profile and alerts anytime in your Personal Space or by contacting privacy@zirigo.com.",
            },
          ],
        }
      : {
          badge: "Confidentialité & Données",
          title: "Politique de confidentialité",
          subtitle: "Zirigo s'engage à protéger vos données personnelles et à vous offrir une transparence totale sur leur utilisation.",
          sections: [
            {
              h: "1. Données collectées",
              p: "Nous collectons uniquement les informations nécessaires à la création de votre compte, la gestion de vos annonces et vos demandes de réservation : nom, adresse e-mail, téléphone optionnel et préférences d'affichage (devise DZD/EUR/USD/GBP, langue et thème).",
            },
            {
              h: "2. Finalités du traitement",
              p: "Vos données servent à traiter vos demandes de réservation directe, activer vos alertes personnalisées de recherche, mémoriser vos préférences en base de données et faciliter le contact entre voyageurs et propriétaires.",
            },
            {
              h: "3. Confidentialité des calendriers et réservations",
              p: "Les calendriers publics de disponibilité n'exposent jamais les coordonnées ou notes personnelles des clients : seules les périodes occupées sont signalées pour prévenir les doubles réservations.",
            },
            {
              h: "4. Vos droits d'accès et de suppression",
              p: "Conformément aux bonnes pratiques de protection des données, vous pouvez modifier vos informations à tout moment depuis votre Espace Perso ou demander leur suppression via contact@zirigo.com.",
            },
          ],
        };

  return (
    <InfoPageShell title={content.title} subtitle={content.subtitle} badge={content.badge}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
        {content.sections.map((sec) => (
          <section
            key={sec.h}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem 1.4rem",
            }}
          >
            <h2 style={{ fontSize: "1.08rem", fontWeight: 800, marginBottom: "0.45rem" }}>
              {sec.h}
            </h2>
            <p style={{ fontSize: "0.94rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              {sec.p}
            </p>
          </section>
        ))}
      </div>
    </InfoPageShell>
  );
}


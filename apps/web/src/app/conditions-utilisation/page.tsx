"use client";

import React from "react";
import { InfoPageShell } from "@/components/InfoPageShell";
import { useI18n } from "@/lib/i18n";

export default function TermsOfUsePage() {
  const { language } = useI18n();

  const content =
    language === "ar"
      ? {
          badge: "الشروط القانونية",
          title: "شروط الاستخدام",
          subtitle: "تحكم هذه الشروط استخدام منصة زيريغو للمقارنة والحجز المباشر وإضافة الإعلانات العقارية.",
          sections: [
            {
              h: "1. دور المنصة",
              p: "زيريغو هي منصة للمقارنة والحجز المباشر بين المسافرين وأصحاب الفنادق، الشقق، الفيلات، الشاليهات، المنتجعات والمهاجع دون عمولات مخفية.",
            },
            {
              h: "2. نشر الإعلانات وإدارة التوفر",
              p: "يتعهد المعلنون بتقديم أوصاف وأسعار دقيقة والالتزام بتحديث تقويم التوفر سواء تلقائياً عند قبول الحجوزات أو يدوياً للعروض الخارجية.",
            },
            {
              h: "3. طلبات الحجز والإلغاء",
              p: "تخضع كل طلبات الحجز لموافقة المالك أو الإدارة ما لم يُنص على خلاف ذلك، وتُطبق سياسة الإلغاء المحددة في كل إعلان.",
            },
            {
              h: "4. السلوك والمسؤولية",
              p: "يُمنع نشر إعلانات مضللة أو حجب تواريخ بغرض التحايل. تحتفظ إدارة زيريغو بحق تعليق أي حساب يخالف هذه الشروط.",
            },
          ],
        }
      : language === "en"
      ? {
          badge: "Legal Terms",
          title: "Terms of Use",
          subtitle: "These terms govern access to and use of Zirigo's accommodation comparator, direct bookings, and owner tools.",
          sections: [
            {
              h: "1. Platform Purpose",
              p: "Zirigo provides transparent rate comparison across major booking portals alongside commission-free direct reservation requests for hotels, apartments, villas, chalets, spa resorts, and dormitories.",
            },
            {
              h: "2. Listings & Availability Accuracy",
              p: "Property owners agree to publish accurate pricing, photos, and amenities, and keep calendars up to date via automatic booking locks or manual external blocks.",
            },
            {
              h: "3. Reservation Requests & Cancellation",
              p: "Booking requests submitted on the platform are confirmed once accepted by the host or administrator, subject to the cancellation policy shown on each listing.",
            },
            {
              h: "4. Acceptable Use",
              p: "Users agree not to submit fraudulent bookings or misleading listings. Zirigo reserves the right to moderate or remove non-compliant content.",
            },
          ],
        }
      : {
          badge: "Cadre d'utilisation",
          title: "Conditions d'utilisation",
          subtitle: "Les présentes conditions définissent les règles d'accès et d'utilisation du comparateur Zirigo, des réservations directes et de l'espace annonceurs.",
          sections: [
            {
              h: "1. Objet de la plateforme",
              p: "Zirigo permet aux voyageurs de comparer les tarifs entre plateformes et d'adresser des demandes de réservation directe auprès des propriétaires d'hôtels, appartements, villas, chalets, resorts & spa et dortoirs.",
            },
            {
              h: "2. Exactitude des annonces et disponibilités",
              p: "Tout propriétaire ou gestionnaire publiant une annonce s'engage à fournir des informations exactes et à maintenir son calendrier à jour, notamment via le blocage automatique des séjours acceptés et le blocage manuel des offres extérieures.",
            },
            {
              h: "3. Demandes de réservation et annulation",
              p: "Une demande envoyée via le formulaire de réservation devient confirmée dès son acceptation par le propriétaire ou l'administrateur, selon la politique d'annulation affichée sur la fiche du bien.",
            },
            {
              h: "4. Utilisation loyale du service",
              p: "Les utilisateurs s'interdisent toute publication frauduleuse ou usurpation d'identité. L'administration se réserve le droit de modérer ou retirer toute annonce non conforme.",
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


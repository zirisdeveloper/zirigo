"use client";

import React from "react";
import { InfoPageShell } from "@/components/InfoPageShell";
import { useI18n } from "@/lib/i18n";

export default function SalesAndPaymentTermsPage() {
  const { language } = useI18n();

  const content =
    language === "ar"
      ? {
          badge: "الشروط القانونية والمالية",
          title: "شروط البيع والدفع",
          subtitle: "تفاصيل قواعد تسعير الإقامات، طلبات الحجز، طرق الدفع المعتمدة وسياسات الإلغاء والاسترداد على زيريغو.",
          sections: [
            {
              h: "1. الأسعار والشفافية",
              p: "تُعرض جميع أسعار الإقامات بالدينار الجزائري (DZD) مع إمكانية التحويل المباشر إلى العملات الرئيسية (EUR, USD, GBP). يلتزم زيريغو بضمان أسعار خالية من أي عمولات أو رسوم خدمة مخفية تُفرض على المسافرين.",
            },
            {
              h: "2. تأكيد الحجوزات والعربون",
              p: "يتم تثبيت طلب الحجز عند قبوله من طرف المضيف أو المنشأة. قد يطلب بعض الملاك دفع عربون ضمان أو دفعة أولى عبر الطرق المصرفية المعتمدة لضمان الجدية قبل موعد تسجيل الوصول.",
            },
            {
              h: "3. طرق الدفع المتاحة",
              p: "تتيح المنصة تسوية المستحقات عبر وسائل متعددة يحددها المالك: الدفع الإلكتروني المحلي (البطاقة الذهبية، بطاقات CIB)، تطبيق بريدي موب (BaridiMob)، التحويل البنكي المباشر، أو الدفع نقداً عند الوصول للمنشأة.",
            },
            {
              h: "4. سياسة الإلغاء والاسترجاع",
              p: "تخضع كل منشأة لسياسة إلغاء محددة (مرنة، معتدلة، أو صارمة) وموضحة بوضوح في بطاقة العقار. في حال الإلغاء ضمن المهلة المحددة، يُعاد العربون وفقاً للشروط المعلنة.",
            },
            {
              h: "5. تأمين الضمان والأضرار",
              p: "قد تطلب بعض الفيلات والشاليهات إيداع مبلغ تأميني قابل للاسترداد عند الدخول لضمان سلامة التجهيزات، ويُعاد بالكامل عند تسليم المفاتيح في حال خلو مكان الإقامة من أي تلفيات.",
            },
          ],
        }
      : language === "en"
      ? {
          badge: "Financial & Legal Terms",
          title: "Terms of Sale & Payment",
          subtitle: "Clear policies on accommodation pricing, booking confirmation, accepted payment methods, and refund rules on Zirigo.",
          sections: [
            {
              h: "1. Pricing & Zero Hidden Fees",
              p: "All accommodation rates are displayed in Algerian Dinars (DZD) with live conversions to EUR, USD, and GBP. Zirigo guarantees direct pricing with zero hidden commission markups for guests.",
            },
            {
              h: "2. Booking Requests & Deposits",
              p: "Reservation requests are confirmed once accepted by the host. Depending on host preferences, a partial advance deposit may be requested via certified payment channels to lock your reserved dates.",
            },
            {
              h: "3. Accepted Payment Methods",
              p: "Supported payment options configured by hosts include Edahabia cards, CIB interbank cards, BaridiMob mobile transfers, direct bank wire, or cash settlement upon arrival.",
            },
            {
              h: "4. Cancellation & Refund Policy",
              p: "Each listing specifies its own cancellation schedule (flexible, moderate, or strict) visible before booking. Cancellations performed within the authorized window will receive full or partial refunds according to host terms.",
            },
            {
              h: "5. Security Deposits",
              p: "Selected villas and chalets may require a refundable damage deposit upon check-in, fully returned upon inspection and key return at departure.",
            },
          ],
        }
      : {
          badge: "Cadre financier et légal",
          title: "Conditions de vente et paiement",
          subtitle: "Règles applicables aux tarifs d'hébergement, modalités de réservation, moyens de paiement acceptés et politiques d'annulation sur Zirigo.",
          sections: [
            {
              h: "1. Tarification transparente et sans frais cachés",
              p: "Tous les tarifs sont indiqués en Dinars Algériens (DZD) avec conversion indicative instantanée en EUR, USD et GBP. Zirigo s'engage pour une transparence totale, sans aucun frais de service caché prélevé sur le voyageur.",
            },
            {
              h: "2. Validation de réservation et arrhes",
              p: "La réservation est confirmée suite à l'accord direct du propriétaire ou de l'établissement hôtelier. Selon les conditions de l'hébergeur, un acompte ou des arrhes peuvent être requis pour bloquer définitivement les dates.",
            },
            {
              h: "3. Moyens de paiement acceptés",
              p: "Selon les options activées par l'annonceur, les règlements peuvent s'effectuer par paiement électronique (carte Edahabia, cartes CIB), virement BaridiMob, virement bancaire ou règlement en espèces directement à l'arrivée.",
            },
            {
              h: "4. Politique d'annulation et remboursement",
              p: "Chaque annonce précise sa politique d'annulation (flexible, modérée ou stricte). En cas d'annulation effectuée dans le délai imparti, le remboursement de l'acompte intervient selon les conditions stipulées lors de la réservation.",
            },
            {
              h: "5. Dépôt de garantie et caution",
              p: "Pour certaines villas et certains chalets haut de gamme, une caution remboursable peut être sollicitée à la remise des clés afin de couvrir d'éventuelles dégradations, restituée intégralement lors de l'état des lieux de sortie.",
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


"use client";

import React from "react";
import Link from "next/link";
import { Store, ShieldCheck, TrendingUp, Users, ArrowRight } from "lucide-react";
import { InfoPageShell } from "@/components/InfoPageShell";
import { useI18n } from "@/lib/i18n";

export default function CreateShopPage() {
  const { language } = useI18n();

  const content =
    language === "ar"
      ? {
          badge: "حلول الوكالات والمؤسسات الفندقية",
          title: "أنشئ متجرك / مساحتك المهنية على زيريغو",
          subtitle: "حل متكامل لوكالات السفر، سلاسل الفنادق، مكاتب التسيير العقاري والمجمعات السياحية لإبراز علاماتهم وزيادة المبيعات.",
          benefits: [
            {
              icon: Store,
              title: "واجهة وهوية مخصصة",
              desc: "صفحة متجر احترافية تحمل شعار مؤسستك، وصف نشاطك، وروابط التواصل الاجتماعي مع عرض لكامل محفظة العقارات.",
            },
            {
              icon: TrendingUp,
              title: "ظهور استراتيجي وأولوية في النتائج",
              desc: "استفد من تصنيف مميز في محرك المقارنة وبطاقات إعلانية حصرية لجذب أكبر عدد من المسافرين والنزلاء.",
            },
            {
              icon: ShieldCheck,
              title: "حسابات موثقة وعلامة ثقة",
              desc: "شارة تحقق رسمية تؤكد مصداقية منشآتك وتمنح الزبائن أقصى درجات الطمأنينة عند إتمام الحجز المباشر.",
            },
            {
              icon: Users,
              title: "مرافقة وإدارة متعددة المستخدمين",
              desc: "أدوات مخصصة لإدارة فرق العمل، وتتبع الإحصائيات، مع دعم فني مخصص للمؤسسات الشريكة.",
            },
          ],
          cta: "تواصل معنا لفتح مساحتك المهنية",
        }
      : language === "en"
      ? {
          badge: "Agencies & Hospitality Brands",
          title: "Create your Brand Storefront on Zirigo",
          subtitle: "Dedicated commercial showcases for property management companies, hotel groups, and real estate hosts.",
          benefits: [
            {
              icon: Store,
              title: "Custom Brand Showcase",
              desc: "A branded portal displaying your logo, agency description, social networks, and full catalog of managed listings.",
            },
            {
              icon: TrendingUp,
              title: "Priority Visibility",
              desc: "Enhanced exposure across Zirigo search results, top comparator slots, and partner promo carousels.",
            },
            {
              icon: ShieldCheck,
              title: "Verified Partner Badge",
              desc: "Official verification badge building trust with travelers seeking certified and guaranteed stays.",
            },
            {
              icon: Users,
              title: "Dedicated Account Support",
              desc: "Multi-user management, portfolio synchronization tools, and prioritized customer success assistance.",
            },
          ],
          cta: "Contact Us to Open Your Pro Space",
        }
      : {
          badge: "Agences & Établissements Hôteliers",
          title: "Créez votre boutique / vitrine pro sur Zirigo",
          subtitle: "Une solution sur mesure pour les conciergeries, groupes hôteliers, agences immobilières et exploitants de résidences touristiques.",
          benefits: [
            {
              icon: Store,
              title: "Vitrine de marque personnalisée",
              desc: "Une page boutique exclusive avec votre logo, description d'entreprise, coordonnées directes et l'ensemble de votre catalogue de biens.",
            },
            {
              icon: TrendingUp,
              title: "Visibilité prioritaire sur le comparateur",
              desc: "Mise en avant sponsorisée dans les résultats de recherche et opportunités d'affichage sur les bandeaux publicitaires.",
            },
            {
              icon: ShieldCheck,
              title: "Badge Hôte Vérifié & Sécurité",
              desc: "Un label de confiance qui rassure instantanément les voyageurs et optimise votre taux de conversion en réservations directes.",
            },
            {
              icon: Users,
              title: "Gestion de flotte & Support dédié",
              desc: "Synchronisation de calendriers groupée, accès multi-collaborateurs et un conseiller Zirigo dédié à votre croissance.",
            },
          ],
          cta: "Contacter l'équipe Zirigo Pro",
        };

  return (
    <InfoPageShell title={content.title} subtitle={content.subtitle} badge={content.badge}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {content.benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(13, 148, 136, 0.1)",
                    color: "var(--brand-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800 }}>{b.title}</h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)",
            border: "1px solid rgba(13, 148, 136, 0.25)",
            borderRadius: "var(--radius-lg)",
            padding: "1.85rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.25rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.25rem" }}>
              Développez votre marque sur Zirigo
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.94rem" }}>
              Prenez contact avec notre équipe pour activer votre espace professionnel et configurer votre vitrine.
            </div>
          </div>
          <Link
            href="/contact?subject=boutique"
            className="btn btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span>{content.cta}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </InfoPageShell>
  );
}


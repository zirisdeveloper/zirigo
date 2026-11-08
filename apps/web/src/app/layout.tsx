import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zirigo | Plateforme de Comparaison et de Réservation d'Hébergements",
  description:
    "Comparez les tarifs d'hôtels, villas de luxe et chalets sur Booking.com, Airbnb, Agoda et Expedia en temps réel. Réservez en direct au meilleur prix garanti avec Zirigo.",
  keywords: [
    "comparateur hébergement",
    "réservation directe",
    "villas de luxe",
    "hôtels de charme",
    "comparateur prix hôtel",
    "Zirigo",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

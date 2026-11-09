import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cairo, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zirigo | Plateforme de Comparaison et de Réservation d'Hébergements",
  description:
    "Comparez les tarifs d'hôtels, villas de luxe et chalets sur Booking.com, Airbnb, Agoda et Expedia en temps réel. Réservez en direct au meilleur prix garanti avec Zirigo.",
  keywords: [
    "comparateur hébergement",
    "réservation directe",
    "villas de luxe",
    "hôtels",
    "comparateur prix hôtel",
    "Zirigo",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${cairo.variable} ${outfit.variable} ${plusJakartaSans.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


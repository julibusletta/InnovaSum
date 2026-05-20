import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import ViewportHandler from "./components/ViewportHandler/ViewportHandler";
import { AnimationInitializer } from "./components/AnimationInitializer/AnimationInitializer";
import Header from "./components/Header/Header";
import LogosMarquee from "./components/LogosMarquee/LogosMarquee";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import ConditionalLayout from "./components/ConditionalLayout";
import { AuthModalProvider } from "./context/AuthModalContext";
import AuthModal from "./components/Auth/AuthModal";
import AnalyticsTracker from "./components/AnalyticsTracker";
import CookieConsent from "./components/CookieConsent";
import TrackingScripts from "./components/TrackingScripts";
import SplashScreen from "./components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Innovasum | Tecnología a un solo clic",
  description: "Los mejores productos de tecnología al mejor precio. Envíos a todo el país. Importadores directos de Xiaomi, Apple, Samsung y Notebooks.",
  keywords: ["celulares", "notebooks", "tecnología", "importadores", "cuotas", "xiaomi", "apple", "samsung", "tablets", "Innovasum", "tienda"],
  authors: [{ name: "Innovasum" }],
  openGraph: {
    title: "Innovasum | Tecnología a un solo clic",
    description: "Renová tu celular y notebook al mejor precio de Argentina. Descubrí nuestro catálogo.",
    url: "https://www.innovasum.com.ar",
    siteName: "Innovasum",
    images: [{ url: "https://www.innovasum.com.ar/images/logoinnovasum.webp", width: 800, height: 600, alt: "Innovasum Logo" }],
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: "/images/logoinnovasum.webp",
    shortcut: "/images/logoinnovasum.webp",
    apple: "/images/logoinnovasum.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <SplashScreen />
        <TrackingScripts />
        <ViewportHandler />
        <AnimationInitializer />
        <CartProvider>
          <AuthProvider>
            <AnalyticsTracker />
            <AuthModalProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <AuthModal />
            </AuthModalProvider>
          </AuthProvider>
        </CartProvider>
        <CookieConsent />
      </body>
    </html>
  );
}

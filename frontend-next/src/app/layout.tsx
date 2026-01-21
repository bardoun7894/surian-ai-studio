import type { Metadata, Viewport } from "next";
import { Cairo, Noto_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Google Fonts
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "وزارة الاقتصاد والتجارة الخارجية - الجمهورية العربية السورية",
    template: "%s | وزارة الاقتصاد والتجارة الخارجية",
  },
  description: "البوابة الإلكترونية الرسمية لوزارة الاقتصاد والتجارة الخارجية في الجمهورية العربية السورية",
  keywords: ["وزارة الاقتصاد", "التجارة الخارجية", "سوريا", "خدمات حكومية", "شكاوى"],
  authors: [{ name: "Ministry of Economy and Foreign Trade" }],
  icons: {
    icon: "/assets/logo/11.png",
    apple: "/assets/logo/11.png",
  },
  openGraph: {
    title: "وزارة الاقتصاد والتجارة الخارجية",
    description: "البوابة الإلكترونية الرسمية لوزارة الاقتصاد والتجارة الخارجية",
    locale: "ar_SY",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edebe0" },
    { media: "(prefers-color-scheme: dark)", color: "#094239" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${cairo.variable} ${notoSansArabic.variable} ${notoKufiArabic.variable} font-sans antialiased bg-gov-beige dark:bg-gov-forest text-gov-charcoal dark:text-gov-beige selection:bg-gov-gold selection:text-gov-forest overflow-x-hidden`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

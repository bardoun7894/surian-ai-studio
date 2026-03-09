import type { Metadata, Viewport } from "next";
import { Cairo, Noto_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import LayoutExtras from "@/components/LayoutExtras";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://moe.gov.sy'),
  title: {
    default: "وزارة الاقتصاد والصناعة - الجمهورية العربية السورية",
    template: "%s | وزارة الاقتصاد والصناعة",
  },
  description: "البوابة الإلكترونية الرسمية لوزارة الاقتصاد والصناعة في الجمهورية العربية السورية - خدمات حكومية، أخبار، مراسيم، تراخيص صناعية",
  keywords: ["وزارة الاقتصاد", "الصناعة", "التجارة الداخلية", "سوريا", "خدمات حكومية", "تراخيص صناعية", "مراسيم", "أخبار الوزارة", "Ministry of Economy", "Syria"],
  authors: [{ name: "Ministry of Economy and Industry" }],
  creator: "Ministry of Economy and Industry - Syrian Arab Republic",
  publisher: "Ministry of Economy and Industry",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/assets/logo/11.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "وزارة الاقتصاد والصناعة - الجمهورية العربية السورية",
    description: "البوابة الإلكترونية الرسمية لوزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
    url: "https://moe.gov.sy",
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [
      {
        url: "/assets/logo/og-image.png",
        width: 1200,
        height: 630,
        alt: "وزارة الاقتصاد والصناعة - الجمهورية العربية السورية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "وزارة الاقتصاد والصناعة - الجمهورية العربية السورية",
    description: "البوابة الإلكترونية الرسمية لوزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
    images: ["/assets/logo/og-image.png"],
  },
  metadataBase: new URL("https://moe.gov.sy"),
  alternates: {
    canonical: "https://moe.gov.sy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
        <link rel="icon" type="image/png" href="/assets/logo/11.png" />
        <link rel="apple-touch-icon" href="/assets/logo/11.png" />
        <link rel="preload" href="/fonts/itfQomraArabic-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/assets/logo/11.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('gov_theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var fs = localStorage.getItem('gov_font_size');
                  if (fs) {
                    var parsedSize = parseInt(fs, 10);
                    if (!isNaN(parsedSize)) {
                      var clampedSize = Math.min(Math.max(parsedSize, 80), 150);
                      document.documentElement.style.fontSize = clampedSize + '%';
                    }
                  }
                  if (localStorage.getItem('gov_high_contrast') === 'true') {
                    document.documentElement.classList.add('high-contrast');
                    if (document.body) {
                      document.body.classList.add('high-contrast');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${cairo.variable} ${notoSansArabic.variable} ${notoKufiArabic.variable} font-sans antialiased text-gov-charcoal dark:text-gov-beige selection:bg-gov-gold selection:text-gov-forest overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Providers>
          <ClientLayoutWrapper>
            <LayoutExtras />
            <ChunkErrorHandler />
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

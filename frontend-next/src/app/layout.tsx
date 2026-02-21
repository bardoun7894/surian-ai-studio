import type { Metadata, Viewport } from "next";
import { Cairo, Noto_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import LayoutExtras from "@/components/LayoutExtras";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

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
    default: "وزارة الاقتصاد والصناعة - الجمهورية العربية السورية",
    template: "%s | وزارة الاقتصاد والصناعة",
  },
  description: "البوابة الإلكترونية الرسمية لوزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
  keywords: ["وزارة الاقتصاد", "الصناعة", "التجارة الداخلية", "سوريا", "خدمات حكومية", "تراخيص صناعية"],
  authors: [{ name: "Ministry of Economy and Industry" }],
  icons: {
    icon: "/assets/logo/11.png",
    apple: "/assets/logo/11.png",
  },
  openGraph: {
    title: "وزارة الاقتصاد والصناعة",
    description: "البوابة الإلكترونية الرسمية لوزارة الاقتصاد والصناعة",
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
        <link rel="preload" href="/fonts/itfQomraArabic-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
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
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

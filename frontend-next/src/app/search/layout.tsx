import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "البحث",
  description: "البحث في محتويات بوابة وزارة الاقتصاد والصناعة",
  openGraph: {
    title: "البحث | وزارة الاقتصاد والصناعة",
    description: "البحث في محتويات بوابة وزارة الاقتصاد والصناعة",
    url: '/search',
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "البحث | وزارة الاقتصاد والصناعة",
    description: "البحث في محتويات بوابة وزارة الاقتصاد والصناعة",
    images: ['/assets/logo/og-image.png'],
  },
  alternates: { canonical: '/search' },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}

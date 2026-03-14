import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإعلانات",
  description: "إعلانات ومناقصات وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
  openGraph: {
    title: "الإعلانات | وزارة الاقتصاد والصناعة",
    description: "إعلانات ومناقصات وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
    url: '/announcements',
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "الإعلانات | وزارة الاقتصاد والصناعة",
    description: "إعلانات ومناقصات وزارة الاقتصاد والصناعة",
    images: ['/assets/logo/og-image.png'],
  },
  alternates: { canonical: '/announcements' },
};

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

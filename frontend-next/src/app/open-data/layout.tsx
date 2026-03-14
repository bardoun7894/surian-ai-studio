import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "البيانات المفتوحة",
  description: "البيانات والإحصائيات المفتوحة من وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
  openGraph: {
    title: "البيانات المفتوحة | وزارة الاقتصاد والصناعة",
    description: "البيانات والإحصائيات المفتوحة من وزارة الاقتصاد والصناعة",
    url: '/open-data',
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "البيانات المفتوحة | وزارة الاقتصاد والصناعة",
    description: "البيانات والإحصائيات المفتوحة من وزارة الاقتصاد والصناعة",
    images: ['/assets/logo/og-image.png'],
  },
  alternates: { canonical: '/open-data' },
};

export default function OpenDataLayout({ children }: { children: React.ReactNode }) {
  return children;
}

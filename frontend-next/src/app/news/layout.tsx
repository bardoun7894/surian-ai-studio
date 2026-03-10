import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأخبار",
  description: "آخر الأخبار والمستجدات من وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
  openGraph: {
    title: "الأخبار | وزارة الاقتصاد والصناعة",
    description: "آخر الأخبار والمستجدات من وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
    url: '/news',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "الأخبار | وزارة الاقتصاد والصناعة",
    description: "آخر الأخبار والمستجدات من وزارة الاقتصاد والصناعة",
  },
  alternates: { canonical: '/news' },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

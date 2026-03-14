import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دليل الخدمات",
  description: "دليل الخدمات الحكومية المقدمة من وزارة الاقتصاد والصناعة - خدمات إلكترونية وتقليدية للمواطنين والمستثمرين",
  openGraph: {
    title: "دليل الخدمات | وزارة الاقتصاد والصناعة",
    description: "دليل الخدمات الحكومية المقدمة من وزارة الاقتصاد والصناعة - خدمات إلكترونية وتقليدية",
    url: '/services',
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "دليل الخدمات | وزارة الاقتصاد والصناعة",
    description: "دليل الخدمات الحكومية - خدمات إلكترونية وتقليدية للمواطنين والمستثمرين",
    images: ['/assets/logo/og-image.png'],
  },
  alternates: { canonical: '/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

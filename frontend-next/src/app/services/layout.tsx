import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دليل الخدمات",
  description: "دليل الخدمات الحكومية المقدمة من وزارة الاقتصاد والصناعة - خدمات إلكترونية وتقليدية للمواطنين والمستثمرين",
  openGraph: {
    title: "دليل الخدمات | وزارة الاقتصاد والصناعة",
    description: "دليل الخدمات الحكومية المقدمة من وزارة الاقتصاد والصناعة - خدمات إلكترونية وتقليدية",
    url: '/services',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "دليل الخدمات | وزارة الاقتصاد والصناعة",
    description: "دليل الخدمات الحكومية - خدمات إلكترونية وتقليدية للمواطنين والمستثمرين",
  },
  alternates: { canonical: '/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

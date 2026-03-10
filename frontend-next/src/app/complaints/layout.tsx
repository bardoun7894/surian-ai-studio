import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشكاوى",
  description: "بوابة الشكاوى الإلكترونية لوزارة الاقتصاد والصناعة - تقديم ومتابعة الشكاوى",
  openGraph: {
    title: "الشكاوى | وزارة الاقتصاد والصناعة",
    description: "بوابة الشكاوى الإلكترونية لوزارة الاقتصاد والصناعة - تقديم ومتابعة الشكاوى",
    url: '/complaints',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "الشكاوى | وزارة الاقتصاد والصناعة",
    description: "بوابة الشكاوى الإلكترونية - تقديم ومتابعة الشكاوى",
  },
  alternates: { canonical: '/complaints' },
};

export default function ComplaintsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

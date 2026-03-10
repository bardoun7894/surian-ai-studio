import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فرص الاستثمار",
  description: "فرص الاستثمار والمشاريع المتاحة في قطاعات الاقتصاد والصناعة في سوريا",
  openGraph: {
    title: "فرص الاستثمار | وزارة الاقتصاد والصناعة",
    description: "فرص الاستثمار والمشاريع المتاحة في قطاعات الاقتصاد والصناعة في سوريا",
    url: '/investment',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "فرص الاستثمار | وزارة الاقتصاد والصناعة",
    description: "فرص الاستثمار والمشاريع المتاحة في قطاعات الاقتصاد والصناعة في سوريا",
  },
  alternates: { canonical: '/investment' },
};

export default function InvestmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}

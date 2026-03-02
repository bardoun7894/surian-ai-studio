import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فرص الاستثمار",
  description: "فرص الاستثمار والمشاريع المتاحة في قطاعات الاقتصاد والصناعة في سوريا",
  openGraph: {
    title: "فرص الاستثمار | وزارة الاقتصاد والصناعة",
    description: "فرص الاستثمار والمشاريع المتاحة في قطاعات الاقتصاد والصناعة في سوريا",
    url: '/investment',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  alternates: { canonical: '/investment' },
};

export default function InvestmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}

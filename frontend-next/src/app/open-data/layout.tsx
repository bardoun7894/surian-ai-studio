import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "البيانات المفتوحة",
  description: "البيانات والإحصائيات المفتوحة من وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
  openGraph: {
    title: "البيانات المفتوحة | وزارة الاقتصاد والصناعة",
    description: "البيانات والإحصائيات المفتوحة من وزارة الاقتصاد والصناعة",
    url: '/open-data',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  alternates: { canonical: '/open-data' },
};

export default function OpenDataLayout({ children }: { children: React.ReactNode }) {
  return children;
}

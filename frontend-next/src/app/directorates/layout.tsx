import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المديريات",
  description: "مديريات وزارة الاقتصاد والصناعة في المحافظات السورية - الخدمات والعناوين ومعلومات التواصل",
  openGraph: {
    title: "المديريات | وزارة الاقتصاد والصناعة",
    description: "مديريات وزارة الاقتصاد والصناعة في المحافظات السورية",
    url: '/directorates',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "المديريات | وزارة الاقتصاد والصناعة",
    description: "مديريات وزارة الاقتصاد والصناعة في المحافظات السورية",
  },
  alternates: { canonical: '/directorates' },
};

export default function DirectoratesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

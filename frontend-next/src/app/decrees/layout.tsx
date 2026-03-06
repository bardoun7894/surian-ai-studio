import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المراسيم والقوانين",
  description: "المراسيم التشريعية والقوانين والقرارات والتعاميم الصادرة عن وزارة الاقتصاد والصناعة",
  openGraph: {
    title: "المراسيم والقوانين | وزارة الاقتصاد والصناعة",
    description: "المراسيم التشريعية والقوانين والقرارات والتعاميم الصادرة عن وزارة الاقتصاد والصناعة",
    url: '/decrees',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "المراسيم والقوانين | وزارة الاقتصاد والصناعة",
    description: "المراسيم التشريعية والقوانين والقرارات والتعاميم",
  },
  alternates: { canonical: '/decrees' },
};

export default function DecreesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

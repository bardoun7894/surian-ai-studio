import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المراسيم والقوانين",
  description: "المراسيم التشريعية والقوانين والقرارات والتعاميم الصادرة عن وزارة الاقتصاد والصناعة",
  openGraph: {
    title: "المراسيم والقوانين | وزارة الاقتصاد والصناعة",
    description: "المراسيم التشريعية والقوانين والقرارات والتعاميم الصادرة عن وزارة الاقتصاد والصناعة",
    url: '/decrees',
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "المراسيم والقوانين | وزارة الاقتصاد والصناعة",
    description: "المراسيم التشريعية والقوانين والقرارات والتعاميم",
    images: ['/assets/logo/og-image.png'],
  },
  alternates: { canonical: '/decrees' },
};

export default function DecreesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

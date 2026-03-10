import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط وأحكام استخدام بوابة وزارة الاقتصاد والصناعة الإلكترونية",
  openGraph: {
    title: "شروط الاستخدام | وزارة الاقتصاد والصناعة",
    description: "شروط وأحكام استخدام بوابة وزارة الاقتصاد والصناعة الإلكترونية",
    url: '/terms',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "شروط الاستخدام | وزارة الاقتصاد والصناعة",
    description: "شروط وأحكام استخدام بوابة وزارة الاقتصاد والصناعة الإلكترونية",
  },
  alternates: { canonical: '/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "الأسئلة الشائعة حول خدمات وزارة الاقتصاد والصناعة - إجابات شاملة عن الاستفسارات المتكررة",
  openGraph: {
    title: "الأسئلة الشائعة | وزارة الاقتصاد والصناعة",
    description: "الأسئلة الشائعة حول خدمات وزارة الاقتصاد والصناعة",
    url: '/faq',
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "الأسئلة الشائعة | وزارة الاقتصاد والصناعة",
    description: "إجابات شاملة عن الاستفسارات المتكررة",
    images: ['/assets/logo/og-image.png'],
  },
  alternates: { canonical: '/faq' },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}

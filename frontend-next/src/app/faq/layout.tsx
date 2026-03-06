import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "الأسئلة الشائعة حول خدمات وزارة الاقتصاد والصناعة - إجابات شاملة عن الاستفسارات المتكررة",
  openGraph: {
    title: "الأسئلة الشائعة | وزارة الاقتصاد والصناعة",
    description: "الأسئلة الشائعة حول خدمات وزارة الاقتصاد والصناعة",
    url: '/faq',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "الأسئلة الشائعة | وزارة الاقتصاد والصناعة",
    description: "إجابات شاملة عن الاستفسارات المتكررة",
  },
  alternates: { canonical: '/faq' },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}

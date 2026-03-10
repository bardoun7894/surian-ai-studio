import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المقترحات",
  description: "تقديم مقترحاتكم لتحسين خدمات وزارة الاقتصاد والصناعة",
  openGraph: {
    title: "المقترحات | وزارة الاقتصاد والصناعة",
    description: "تقديم مقترحاتكم لتحسين خدمات وزارة الاقتصاد والصناعة",
    url: '/suggestions',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "المقترحات | وزارة الاقتصاد والصناعة",
    description: "تقديم مقترحاتكم لتحسين خدمات وزارة الاقتصاد والصناعة",
  },
  alternates: { canonical: '/suggestions' },
};

export default function SuggestionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

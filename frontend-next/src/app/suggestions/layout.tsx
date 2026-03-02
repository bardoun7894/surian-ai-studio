import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المقترحات",
  description: "تقديم مقترحاتكم لتحسين خدمات وزارة الاقتصاد والصناعة",
  openGraph: {
    title: "المقترحات | وزارة الاقتصاد والصناعة",
    description: "تقديم مقترحاتكم لتحسين خدمات وزارة الاقتصاد والصناعة",
    url: '/suggestions',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  alternates: { canonical: '/suggestions' },
};

export default function SuggestionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

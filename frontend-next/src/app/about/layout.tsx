import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن الوزارة",
  description: "تعرف على رؤية ورسالة وأهداف وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
  openGraph: {
    title: "عن الوزارة | وزارة الاقتصاد والصناعة",
    description: "تعرف على رؤية ورسالة وأهداف وزارة الاقتصاد والصناعة في الجمهورية العربية السورية",
    url: '/about',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "عن الوزارة | وزارة الاقتصاد والصناعة",
    description: "تعرف على رؤية ورسالة وأهداف وزارة الاقتصاد والصناعة",
  },
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

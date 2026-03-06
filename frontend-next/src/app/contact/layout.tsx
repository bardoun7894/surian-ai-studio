import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع وزارة الاقتصاد والصناعة - أرقام الهاتف والبريد الإلكتروني والعنوان ونموذج التواصل",
  openGraph: {
    title: "اتصل بنا | وزارة الاقتصاد والصناعة",
    description: "تواصل مع وزارة الاقتصاد والصناعة - أرقام الهاتف والبريد الإلكتروني والعنوان",
    url: '/contact',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "اتصل بنا | وزارة الاقتصاد والصناعة",
    description: "تواصل مع وزارة الاقتصاد والصناعة",
  },
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

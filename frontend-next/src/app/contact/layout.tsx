import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع وزارة الاقتصاد والصناعة - أرقام الهاتف والبريد الإلكتروني والعنوان ونموذج التواصل",
  openGraph: {
    title: "اتصل بنا | وزارة الاقتصاد والصناعة",
    description: "تواصل مع وزارة الاقتصاد والصناعة - أرقام الهاتف والبريد الإلكتروني والعنوان",
    url: '/contact',
    siteName: "وزارة الاقتصاد والصناعة",
    locale: "ar_SY",
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "اتصل بنا | وزارة الاقتصاد والصناعة",
    description: "تواصل مع وزارة الاقتصاد والصناعة",
    images: ['/assets/logo/og-image.png'],
  },
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

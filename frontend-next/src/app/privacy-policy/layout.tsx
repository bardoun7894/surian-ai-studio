import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية وحماية البيانات الشخصية لبوابة وزارة الاقتصاد والصناعة",
  openGraph: {
    title: "سياسة الخصوصية | وزارة الاقتصاد والصناعة",
    description: "سياسة الخصوصية وحماية البيانات الشخصية لبوابة وزارة الاقتصاد والصناعة",
    url: '/privacy-policy',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "سياسة الخصوصية | وزارة الاقتصاد والصناعة",
    description: "سياسة الخصوصية وحماية البيانات الشخصية لبوابة وزارة الاقتصاد والصناعة",
  },
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

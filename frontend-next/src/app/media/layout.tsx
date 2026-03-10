import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المكتبة الإعلامية",
  description: "الصور والفيديوهات والمواد الإعلامية لوزارة الاقتصاد والصناعة",
  openGraph: {
    title: "المكتبة الإعلامية | وزارة الاقتصاد والصناعة",
    description: "الصور والفيديوهات والمواد الإعلامية لوزارة الاقتصاد والصناعة",
    url: '/media',
    type: "website",
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  twitter: {
    card: 'summary',
    title: "المكتبة الإعلامية | وزارة الاقتصاد والصناعة",
    description: "الصور والفيديوهات والمواد الإعلامية لوزارة الاقتصاد والصناعة",
  },
  alternates: { canonical: '/media' },
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

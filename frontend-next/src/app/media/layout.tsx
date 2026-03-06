import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المكتبة الإعلامية",
  description: "الصور والفيديوهات والمواد الإعلامية لوزارة الاقتصاد والصناعة",
  openGraph: {
    title: "المكتبة الإعلامية | وزارة الاقتصاد والصناعة",
    description: "الصور والفيديوهات والمواد الإعلامية لوزارة الاقتصاد والصناعة",
    url: '/media',
    type: "website",
    images: [{ url: '/assets/logo/11.png', width: 512, height: 512, alt: 'وزارة الاقتصاد والصناعة' }],
  },
  alternates: { canonical: '/media' },
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

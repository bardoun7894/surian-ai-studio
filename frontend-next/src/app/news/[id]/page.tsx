import { Metadata } from 'next';
import { serverFetch } from '@/lib/server-fetch';
import NewsDetailClient from './NewsDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const news = await serverFetch<any>(`/public/news/${id}`);
  const title = news?.title_ar || news?.title || 'خبر';
  const desc = news?.summary_ar || news?.summary || '';
  const image = news?.imageUrl || news?.image_url || '/assets/logo/og-image.png';

  return {
    title,
    description: desc,
    openGraph: {
      title: `${title} | وزارة الاقتصاد والصناعة`,
      description: desc,
      url: `/news/${id}`,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | وزارة الاقتصاد والصناعة`,
      description: desc,
      images: [image],
    },
    alternates: { canonical: `/news/${id}` },
  };
}

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  return <NewsDetailClient params={params} />;
}

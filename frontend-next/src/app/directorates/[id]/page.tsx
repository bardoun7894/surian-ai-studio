import { Metadata } from 'next';
import { serverFetch } from '@/lib/server-fetch';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectorateDetail from '@/components/DirectorateDetail';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await serverFetch<any>(`/public/directorates/${id}`);
  const name = data?.name?.ar || data?.name_ar || 'مديرية';
  const desc = data?.description?.ar || data?.description_ar || '';

  return {
    title: name,
    description: desc,
    openGraph: {
      title: `${name} | وزارة الاقتصاد والصناعة`,
      description: desc,
      url: `/directorates/${id}`,
      type: 'website',
      images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary',
      title: `${name} | وزارة الاقتصاد والصناعة`,
      description: desc,
    },
    alternates: { canonical: `/directorates/${id}` },
  };
}

export default async function DirectorateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar />
      <main className="flex-grow">
        <DirectorateDetail key={id} directorateId={id} />
      </main>
      <Footer />
    </div>
  );
}

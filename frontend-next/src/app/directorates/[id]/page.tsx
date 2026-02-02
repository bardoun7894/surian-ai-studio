import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectorateDetail from '@/components/DirectorateDetail';

export default function DirectorateDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24 overflow-hidden">
                <DirectorateDetail directorateId={params.id} />
            </main>

            <Footer />
        </div>
    );
}

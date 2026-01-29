import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectorateDetail from '@/components/DirectorateDetail';
import ChatBot from '@/components/ChatBot';

export default function DirectorateDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-14 md:pt-16 overflow-hidden">
                <DirectorateDetail directorateId={params.id} />
            </main>

            <ChatBot />
            <Footer />
        </div>
    );
}

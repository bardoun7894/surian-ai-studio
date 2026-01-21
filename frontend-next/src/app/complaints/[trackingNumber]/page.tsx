import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComplaintPortal from '@/components/ComplaintPortal';
import ChatBot from '@/components/ChatBot';

export default function ComplaintDetailPage({ params }: { params: { trackingNumber: string } }) {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 overflow-hidden">
                <ComplaintPortal initialMode="track" initialTrackingNumber={params.trackingNumber} />
            </main>

            <ChatBot />
            <Footer />
        </div>
    );
}

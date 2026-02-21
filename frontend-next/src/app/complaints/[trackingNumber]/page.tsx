import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComplaintPortal from '@/components/ComplaintPortal';

export default function ComplaintDetailPage({ params }: { params: { trackingNumber: string } }) {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24">
                <ComplaintPortal initialMode="track" initialTrackingNumber={params.trackingNumber} />
            </main>

            <Footer />
        </div>
    );
}

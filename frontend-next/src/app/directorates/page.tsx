import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoratesList from '@/components/DirectoratesList';

export default function DirectoratesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24 overflow-hidden animate-fade-in-up">
                <DirectoratesList />
            </main>

            <Footer />
        </div>
    );
}

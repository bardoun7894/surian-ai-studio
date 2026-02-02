import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoratesList from '@/components/DirectoratesList';

export default function DirectoratesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-black transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-14 md:pt-16 overflow-hidden animate-fade-in-up">
                <DirectoratesList />
            </main>

            <Footer />
        </div>
    );
}

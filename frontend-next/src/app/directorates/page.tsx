import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoratesList from '@/components/DirectoratesList';
import ChatBot from '@/components/ChatBot';

export default function DirectoratesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 overflow-hidden animate-fade-in-up">
                <DirectoratesList variant="full" />
            </main>

            <ChatBot />
            <Footer />
        </div>
    );
}

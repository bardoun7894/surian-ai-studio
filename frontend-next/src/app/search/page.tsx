'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResultsPage from '@/components/SearchResultsPage';
import ChatBot from '@/components/ChatBot';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 overflow-hidden">
                <SearchResultsPage initialQuery={query} />
            </main>

            <ChatBot />
            <Footer />
        </div>
    );
}

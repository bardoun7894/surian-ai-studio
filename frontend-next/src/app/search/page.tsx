'use client';

import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResultsPage from '@/components/SearchResultsPage';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    return (
        <Suspense>
            <SearchPageContent />
        </Suspense>
    );
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-surface transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24">
                <SearchResultsPage initialQuery={query} />
            </main>

            <Footer />
        </div>
    );
}

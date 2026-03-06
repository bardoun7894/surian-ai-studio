import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubDirectorateDetail from '@/components/SubDirectorateDetail';

export default function SubDirectoratePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow">
                <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                    <SubDirectorateDetail />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}

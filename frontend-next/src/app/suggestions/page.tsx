import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuggestionsForm from '@/components/SuggestionsForm';

export default function SuggestionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gov-forest flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 md:pt-32 pb-16">
                {/* Hero Section */}
                <div className="container mx-auto px-4 mb-12 text-center">
                    <div className="max-w-3xl mx-auto animate-[fadeInUp_0.5s_ease-out]">
                        <h1 className="text-4xl md:text-5xl font-bold text-gov-forest dark:text-gov-gold mb-6 mt-6">
                            نستمع إليك .. لنبني المستقبل
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            تولي وزارة الاقتصاد أهمية بالغة لمقترحاتكم وأفكاركم. مشاركتك تساعدنا في تطوير خدماتنا وتحقيق التنمية الاقتصادية المستدامة.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
                        <SuggestionsForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DirectoratesList from "@/components/DirectoratesList";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DirectoratesPage() {
    const { language } = useLanguage();
    usePageMeta({
        title: language === "ar" ? "الهيكل التنظيمي" : "Organizational Structure",
        description: language === "ar" ? "الهيكل التنظيمي لوزارة الاقتصاد والصناعة" : "Organizational structure of the Ministry of Economy and Industry",
    });
    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow animate-fade-in-up">
                <DirectoratesList />
            </main>

            <Footer />
        </div>
    );
}

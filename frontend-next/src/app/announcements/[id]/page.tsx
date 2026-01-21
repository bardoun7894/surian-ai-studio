'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleDetail from '@/components/ArticleDetail';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
    const { language } = useLanguage();
    const [announcement, setAnnouncement] = useState<any | null>(null);
    const [relatedItems, setRelatedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [item, allAnnouncements] = await Promise.all([
                    API.announcements.getById(params.id),
                    API.announcements.getAll()
                ]);
                setAnnouncement(item);
                setRelatedItems(allAnnouncements.filter(a => a.id !== params.id).slice(0, 3));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-gov-teal" size={40} />
                </main>
                <Footer />
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                    <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                        {language === 'ar' ? 'عفواً، الإعلان غير موجود' : 'Announcement Not Found'}
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        {language === 'ar' ? 'قد يكون هذا الإعلان قد انتهى أو تم حذفه.' : 'This announcement might have expired or been deleted.'}
                    </p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
            <Navbar />
            <main className="flex-grow pt-20">
                <ArticleDetail
                    title={announcement.title}
                    date={announcement.date}
                    category={announcement.category}
                    content={announcement.description + "\n\n" + (language === 'ar'
                        ? "يرجى العلم أن كافة المرفقات والمستندات المطلوبة موجودة في مبنى الوزارة الرئيسي. على الراغبين بالتقديم الالتزام بالمواعيد المذكورة وإحضار كافة الأوراق المطلوبة.\n\nلمزيد من الاستفسارات يمكنكم التواصل مع مكتب خدمة المواطن التابع للوزارة المعنية."
                        : "Please note that all attachments and required documents are available at the main Ministry building. Interested parties must adhere to the mentioned dates and bring all required paperwork.\n\nFor further inquiries, you can contact the Citizen Service Office of the concerned Ministry.")
                    }
                    backLink={{
                        href: '/announcements',
                        label: language === 'ar' ? 'العودة للإعلانات' : 'Back to Announcements'
                    }}
                    relatedItems={relatedItems.map(item => ({
                        id: item.id,
                        title: item.title,
                        date: item.date,
                        href: `/announcements/${item.id}`
                    }))}
                />
            </main>
            <Footer />
        </div>
    );
}

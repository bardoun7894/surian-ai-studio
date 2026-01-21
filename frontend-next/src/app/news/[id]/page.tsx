'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleDetail from '@/components/ArticleDetail';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsDetailPage({ params }: { params: { id: string } }) {
    const { language } = useLanguage();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [relatedItems, setRelatedItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [item, allNews] = await Promise.all([
                    API.news.getById(params.id),
                    API.news.getOfficialNews()
                ]);
                setNews(item);
                setRelatedItems(allNews.filter(n => n.id !== params.id).slice(0, 3));
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

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                    <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                        {language === 'ar' ? 'عفواً، الخبر غير موجود' : 'Article Not Found'}
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-md">
                        {language === 'ar' ? 'قد يكون هذا الخبر قد تم نقله أو حذفه.' : 'This article might have been moved or deleted.'}
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
                    title={news.title}
                    date={news.date}
                    category={news.category}
                    content={news.summary + "\n\n" + (language === 'ar'
                        ? "هذا المحتوى هو تفصيل كامل للخبر المنشور أعلاه. يتضمن الخبر كافة التفاصيل المتعلقة بالحدث، بالإضافة إلى تصريحات المسؤولين والإجراءات المتخذة.\n\nتواصل الحكومة جهودها لتقديم كافة الخدمات للمواطنين بأفضل جودة ممكنة وضمان وصول المعلومات بدقة وشفافية."
                        : "This is the detailed content of the article mentioned above. It includes all specific details regarding the event, officials' statements, and actions taken.\n\nThe government continues its efforts to provide all services to citizens with the highest quality and ensuring information reaches them with accuracy and transparency.")
                    }
                    imageUrl={news.imageUrl}
                    backLink={{
                        href: '/news',
                        label: language === 'ar' ? 'العودة لمركز الأخبار' : 'Back to News Center'
                    }}
                    relatedItems={relatedItems.map(item => ({
                        id: item.id,
                        title: item.title,
                        date: item.date,
                        href: `/news/${item.id}`
                    }))}
                />
            </main>
            <Footer />
        </div>
    );
}

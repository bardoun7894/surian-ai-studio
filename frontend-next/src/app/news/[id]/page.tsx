'use client';

import React, { useState, useEffect, use } from 'react';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';

interface NewsItemDetail extends NewsItem {
    content_ar?: string;
    content_en?: string;
    title_ar?: string;
    title_en?: string;
    summary_ar?: string;
    summary_en?: string;
    images?: string[];
    author?: string;
    read_time?: string;
}
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleDetail from '@/components/ArticleDetail';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    const { language } = useLanguage();
    // Handle both sync and async params (Next.js 14.x compatibility)
    const resolvedParams = params instanceof Promise ? use(params) : params;
    const articleId = resolvedParams.id;

    const [news, setNews] = useState<NewsItemDetail | null>(null);
    const [relatedItems, setRelatedItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!articleId) {
            setLoading(false);
            setError(true);
            return;
        }

        const fetchData = async () => {
            try {
                const [item, allNews] = await Promise.all([
                    API.news.getById(articleId),
                    API.news.getOfficialNews()
                ]);
                if (item) {
                    setNews(item as NewsItemDetail);
                    setRelatedItems(allNews.filter(n => String(n.id) !== String(articleId)).slice(0, 3));
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error('Failed to fetch news article:', e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [articleId]);

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

    if (!news || error) {
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
                    <a
                        href="/news"
                        className="px-6 py-3 bg-gov-teal text-white rounded-lg hover:bg-gov-teal/90 transition-colors"
                    >
                        {language === 'ar' ? 'العودة لمركز الأخبار' : 'Back to News Center'}
                    </a>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
            <Navbar />
            <main className="flex-grow pt-14 md:pt-16">
                <ArticleDetail
                    title={language === 'ar'
                        ? (news.title_ar || news.title || '')
                        : (news.title_en || news.title || '')
                    }
                    date={news.date || ''}
                    category={language === 'ar' ? (news.category || 'أخبار') : ('News')}
                    author={news.author || (language === 'ar' ? 'المكتب الإعلامي' : 'Media Office')}
                    readTime={news.read_time}
                    content={language === 'ar'
                        ? (news.content_ar || news.summary_ar || news.summary || '')
                        : (news.content_en || news.summary_en || news.summary || '')
                    }
                    imageUrl={news.imageUrl}
                    images={news.images}
                    language={language}
                    backLink={{
                        href: '/news',
                        label: language === 'ar' ? 'العودة لمركز الأخبار' : 'Back to News Center'
                    }}
                    relatedItems={relatedItems.map(item => ({
                        id: String(item.id),
                        title: language === 'ar'
                            ? ((item as any).title_ar || item.title)
                            : ((item as any).title_en || item.title),
                        date: item.date,
                        href: `/news/${item.id}`,
                        imageUrl: item.imageUrl,
                    }))}
                />
            </main>
            <Footer />
        </div>
    );
}

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
import { SkeletonText, SkeletonCard } from '@/components/SkeletonLoader';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    const { language } = useLanguage();

    // Handle both sync and async params (Next.js 14.x compatibility)
    const resolvedParams = params instanceof Promise ? use(params) : params;
    const articleId = resolvedParams.id;

    const [news, setNews] = useState<NewsItemDetail | null>(null);
    const [relatedItems, setRelatedItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Favorites
    const { isAuthenticated } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);

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

    // Reset favorite status when article changes
    useEffect(() => {
        setIsFavorite(false);
    }, [articleId]);

    // Check favorite status
    useEffect(() => {
        const checkFavorite = async () => {
            if (isAuthenticated && articleId) {
                try {
                    const status = await API.favorites.check([{ content_type: 'news', content_id: articleId }]);
                    const key = `news_${articleId}`;
                    setIsFavorite(status[key] || false);
                } catch (e) {
                    console.error('Failed to check favorite status', e);
                }
            }
        };
        checkFavorite();
    }, [isAuthenticated, articleId]);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'You must be logged in to add favorites');
            return;
        }

        if (favLoading || !news) return;

        setFavLoading(true);
        try {
            if (isFavorite) {
                const success = await API.favorites.remove('news', articleId);
                if (success) {
                    setIsFavorite(false);
                    toast.success(language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites');
                }
            } else {
                const metadata = {
                    title: language === 'ar' ? (news.title_ar || news.title) : (news.title_en || news.title),
                    title_ar: news.title_ar || news.title,
                    title_en: news.title_en || news.title,
                    description: language === 'ar' ? (news.summary_ar || news.summary) : (news.summary_en || news.summary),
                    description_ar: news.summary_ar || news.summary,
                    description_en: news.summary_en || news.summary,
                    image: news.imageUrl,
                    url: `/news/${articleId}`
                };

                const success = await API.favorites.add('news', articleId, metadata);
                if (success) {
                    setIsFavorite(true);
                    toast.success(language === 'ar' ? 'تمت الإضافة للمفضلة' : 'Added to favorites');
                }
            }
        } catch (e) {
            toast.error(language === 'ar' ? 'حدث خطأ ما' : 'An error occurred');
        } finally {
            setFavLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
                <Navbar />
                <main className="flex-grow pt-20 md:pt-24 pb-20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Back Link Skeleton */}
                        <div className="inline-flex items-center gap-2 mb-8">
                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                            <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                        </div>

                        {/* Article Skeleton */}
                        <article className="bg-white dark:bg-gov-card/10 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gov-border/15">
                            {/* Featured Image Skeleton */}
                            <div className="relative h-[400px] md:h-[500px] w-full bg-gray-200 dark:bg-white/5 animate-pulse" />

                            <div className="p-8 md:p-12">
                                {/* Meta Data Skeleton */}
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-4 mb-8 pb-8 border-b border-gray-100 dark:border-gov-border/15">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                                    </div>
                                    <div className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-white/30" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                                    </div>
                                    <div className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-white/30" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                        <div className="h-4 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                                    </div>
                                    <div className="flex-1" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                        <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                    </div>
                                </div>

                                {/* Title Skeleton */}
                                <div className="h-10 md:h-12 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse w-full mb-4" />
                                <div className="h-10 md:h-12 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse w-2/3 mb-8" />

                                {/* AI Summary Skeleton */}
                                <div className="mb-8 p-1 bg-gradient-to-br from-gov-gold/20 to-gov-forest/5 rounded-2xl border border-gov-gold/30">
                                    <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
                                            <div className="h-8 w-24 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                            <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Skeleton */}
                                <div className="space-y-4">
                                    <SkeletonText lines={6} />
                                    <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                    <SkeletonText lines={4} />
                                </div>
                            </div>
                        </article>

                        {/* Related Items Skeleton */}
                        <div className="mt-16">
                            <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!news || error) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
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
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
            <Navbar />
            <main className="flex-grow pt-20 md:pt-24">
                <ArticleDetail
                    title={language === 'ar'
                        ? (news.title_ar || news.title || '')
                        : (news.title_en || news.title || '')
                    }
                    date={news.date || ''}
                    category={language === 'ar' ? (news.category || 'أخبار') : ((news as any).category_en || 'News')}
                    author={language === 'ar'
                        ? (news.author || 'المكتب الإعلامي')
                        : ((news as any).author_en || (news.author === 'المكتب الإعلامي' ? 'Media Office' : news.author) || 'Media Office')
                    }
                    readTime={undefined}
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

                    isFavorite={isFavorite}
                    onToggleFavorite={isAuthenticated ? handleToggleFavorite : undefined}
                />
            </main>
            <Footer />
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleDetail from '@/components/ArticleDetail';
import { SkeletonText, SkeletonCard } from '@/components/SkeletonLoader';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from '@/components/FavoriteButton';



const isExpired = (expiresAt?: string): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
};

const formatDate = (dateStr: string, lang: string) => {
    const date = new Date(dateStr);
    return lang === 'ar'
        ? date.toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' })
        : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
    const { language } = useLanguage();
    const { isAuthenticated } = useAuth();
    const [announcement, setAnnouncement] = useState<any | null>(null);
    const [relatedItems, setRelatedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const isAr = language === 'ar';

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
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
                <Navbar />
                <main className="flex-grow pt-20 md:pt-24 pb-20">
                    <div className="max-w-7xl mx-auto px-4 relative">
                        <div className="max-w-5xl mx-auto">
                            {/* Article Skeleton */}
                            <article className="bg-white dark:bg-gov-card/10 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gov-border/15">
                                {/* Meta Data Skeleton */}
                                <div className="p-8 md:p-12">
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
                                        <div className="flex-1" />
                                    </div>

                                    {/* Title Skeleton */}
                                    <div className="h-10 md:h-12 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse w-full mb-4" />
                                    <div className="h-10 md:h-12 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse w-3/4 mb-8" />

                                    {/* Content Skeleton */}
                                    <div className="space-y-4">
                                        <SkeletonText lines={6} />
                                        <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                        <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                        <SkeletonText lines={4} />
                                    </div>

                                    {/* Attachments Section Skeleton */}
                                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gov-border/15">
                                        <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-6" />
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse" />
                                                    <div className="flex-1">
                                                        <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-1" />
                                                        <div className="h-3 w-24 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
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

    // Resolve localized fields from API response
    const localizedTitle = isAr
        ? (announcement.title_ar || announcement.title || '')
        : (announcement.title_en || announcement.title || '');
    const localizedContent = isAr
        ? (announcement.content_ar || announcement.content || announcement.description_ar || announcement.description || '')
        : (announcement.content_en || announcement.content || announcement.description_en || announcement.description || '');

    const expired = isExpired(announcement.expires_at);

    return (
        <div className={`min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg ${expired ? 'opacity-60' : ''}`}>
            <Navbar />
            <main className="flex-grow pt-20 md:pt-24 print:pt-0">
                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* Expired Banner */}
                    {expired && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-gov-red/30 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="text-gov-red" size={24} />
                            <div>
                                <span className="bg-gov-red text-white px-3 py-1 rounded-full text-sm font-bold">
                                    {isAr ? 'انتهى التقديم' : 'Application Closed'}
                                </span>
                                {announcement.expires_at && (
                                    <span className="text-gov-red dark:text-gov-red text-sm ml-3 rtl:ml-0 rtl:mr-3">
                                        {isAr
                                            ? `انتهى بتاريخ: ${formatDate(announcement.expires_at, language)}`
                                            : `Expired on: ${formatDate(announcement.expires_at, language)}`
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    <ArticleDetail
                        title={localizedTitle}
                        date={announcement.date}
                        category={announcement.category}
                        content={localizedContent
                            ? localizedContent + "\n\n" + (isAr
                                ? "يرجى العلم أن كافة المرفقات والمستندات المطلوبة موجودة في مبنى الوزارة الرئيسي. على الراغبين بالتقديم الالتزام بالمواعيد المذكورة وإحضار كافة الأوراق المطلوبة.\n\nلمزيد من الاستفسارات يمكنكم التواصل مع مكتب خدمة المواطن التابع للوزارة المعنية."
                                : "Please note that all attachments and required documents are available at the main Ministry building. Interested parties must adhere to the mentioned dates and bring all required paperwork.\n\nFor further inquiries, you can contact the Citizen Service Office of the concerned Ministry.")
                            : (isAr
                                ? "يرجى العلم أن كافة المرفقات والمستندات المطلوبة موجودة في مبنى الوزارة الرئيسي. على الراغبين بالتقديم الالتزام بالمواعيد المذكورة وإحضار كافة الأوراق المطلوبة.\n\nلمزيد من الاستفسارات يمكنكم التواصل مع مكتب خدمة المواطن التابع للوزارة المعنية."
                                : "Please note that all attachments and required documents are available at the main Ministry building. Interested parties must adhere to the mentioned dates and bring all required paperwork.\n\nFor further inquiries, you can contact the Citizen Service Office of the concerned Ministry.")
                        }
                        backLink={{
                            href: '/announcements',
                            label: isAr ? 'العودة للإعلانات' : 'Back to Announcements'
                        }}
                        relatedItems={relatedItems.map(item => ({
                            id: item.id,
                            title: isAr ? (item.title_ar || item.title) : (item.title_en || item.title),
                            date: item.date,
                            href: `/announcements/${item.id}`
                        }))}
                        favoriteButtonSlot={
                            <FavoriteButton
                                contentType="announcement"
                                contentId={params.id}
                                size={18}
                                variant="default"
                                className="p-2.5"
                                metadata={{
                                    title: localizedTitle,
                                    title_ar: announcement.title_ar || announcement.title || '',
                                    title_en: announcement.title_en || announcement.title || '',
                                    description: localizedContent,
                                    description_ar: announcement.content_ar || announcement.content || announcement.description_ar || announcement.description || '',
                                    description_en: announcement.content_en || announcement.content || announcement.description_en || announcement.description || '',
                                    url: `/announcements/${params.id}`
                                }}
                            />
                        }
                    />
                </div>
            </main>
            <Footer />




        </div>
    );
}

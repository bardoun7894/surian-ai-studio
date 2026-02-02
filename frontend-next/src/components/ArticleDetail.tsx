'use client';

import React, { useState } from 'react';
import { Calendar, User, Clock, Share2, Printer, ChevronRight, ChevronLeft, X, ZoomIn, Images, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { formatRelativeTime } from '@/lib/utils';

interface ArticleDetailProps {
    title: string;
    date: string;
    category: string;
    author?: string;
    readTime?: string;
    imageUrl?: string;
    images?: string[];
    content: string;
    language?: string;
    backLink: {
        href: string;
        label: string;
    };
    relatedItems?: Array<{
        id: string;
        title: string;
        date: string;
        href: string;
        imageUrl?: string;
    }>;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
    title,
    date,
    category,
    author,
    readTime,
    imageUrl,
    images,
    content,
    language = 'ar',
    backLink,
    relatedItems
}) => {
    const { language: ctxLanguage } = useLanguage();
    const lang = language || ctxLanguage || 'ar';

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // T047: AI Smart Summary state
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryText, setSummaryText] = useState<string | null>(null);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [summaryOpen, setSummaryOpen] = useState(true);

    const handleSmartSummary = async () => {
        if (summaryText) {
            setSummaryOpen((prev) => !prev);
            return;
        }
        setSummaryLoading(true);
        setSummaryError(null);
        try {
            const result = await API.ai.summarize(content);
            setSummaryText(result.summary);
            setSummaryOpen(true);
        } catch {
            setSummaryError(lang === 'ar' ? 'فشل في إنشاء الملخص' : 'Failed to generate summary');
        } finally {
            setSummaryLoading(false);
        }
    };

    // Gallery images: use images array if available, otherwise just featured
    const galleryImages = images && images.length > 1 ? images : [];

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    return (
        <div className="bg-gov-beige dark:bg-dm-bg min-h-screen pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

                {/* Back Link */}
                <Link
                    href={backLink.href}
                    className="inline-flex items-center gap-2 text-gov-teal dark:text-gov-teal font-bold mb-8 hover:gap-3 transition-all"
                >
                    <ChevronRight size={20} className="rtl:rotate-0 rotate-180" />
                    {backLink.label}
                </Link>

                <article className="bg-white dark:bg-gov-card/10 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gov-border/15">

                    {/* Featured Image */}
                    {imageUrl && (
                        <div
                            className="relative h-[400px] md:h-[500px] w-full cursor-pointer group"
                            onClick={() => galleryImages.length > 0 ? openLightbox(0) : undefined}
                        >
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 right-6 rtl:right-auto rtl:left-6">
                                <span className="px-4 py-1.5 bg-gov-gold text-gov-forest text-sm font-bold rounded-full">
                                    {category}
                                </span>
                            </div>
                            {galleryImages.length > 1 && (
                                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Images size={16} />
                                    <span>{galleryImages.length} {language === 'ar' ? 'صورة' : 'photos'}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-white/70 mb-8 pb-8 border-b border-gray-100 dark:border-gov-border/15">
                            <div className="flex items-center gap-2" title={new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}>
                                <Calendar size={18} />
                                {formatRelativeTime(date, lang as 'ar' | 'en')}
                            </div>
                            {author && (
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    {author}
                                </div>
                            )}
                            {readTime && (
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    {readTime}
                                </div>
                            )}
                            <div className="flex-1" />
                            <div className="flex items-center gap-4">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors" title="Print">
                                    <Printer size={18} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors" title="Share">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content Body */}
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gov-forest dark:text-white mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* T047: AI Smart Summary */}
                        <div className="mb-8">
                            <button
                                onClick={handleSmartSummary}
                                disabled={summaryLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gov-gold/10 text-gov-gold hover:bg-gov-gold/20 dark:bg-gov-gold/20 dark:hover:bg-gov-gold/30 transition-colors disabled:opacity-60"
                            >
                                {summaryLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Sparkles size={16} />
                                )}
                                {lang === 'ar' ? 'ملخص ذكي' : 'Smart Summary'}
                                {summaryText && (summaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                            </button>

                            {summaryError && (
                                <div className="mt-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                                    {summaryError}
                                </div>
                            )}

                            {summaryText && summaryOpen && (
                                <div className="mt-3 p-5 rounded-2xl bg-gov-gold/5 dark:bg-gov-gold/10 border border-gov-gold/20 dark:border-gov-gold/30">
                                    <div className="flex items-center gap-2 text-gov-gold font-bold text-sm mb-2">
                                        <Sparkles size={14} />
                                        {lang === 'ar' ? 'ملخص ذكي' : 'AI Summary'}
                                    </div>
                                    <p className="text-gray-700 dark:text-white/70 leading-relaxed text-sm">
                                        {summaryText}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-gov-forest dark:prose-headings:text-gov-gold prose-p:text-gray-600 dark:prose-p:text-white/70">
                            {content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Image Gallery */}
                        {galleryImages.length > 1 && (
                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gov-border/15">
                                <h2 className="text-xl font-display font-bold text-gov-forest dark:text-white mb-6 flex items-center gap-2">
                                    <Images size={22} className="text-gov-gold" />
                                    {language === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
                                    <span className="text-sm font-normal text-gray-400 mr-2">({galleryImages.length} {language === 'ar' ? 'صورة' : 'photos'})</span>
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {galleryImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-all"
                                            onClick={() => openLightbox(idx)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${title} - ${idx + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Related Items */}
                {relatedItems && relatedItems.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-8 border-r-4 border-gov-gold pr-4">
                            {language === 'ar' ? 'مواضيع ذات صلة' : 'Related Topics'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 hover:shadow-lg transition-all overflow-hidden group"
                                >
                                    {item.imageUrl && (
                                        <div className="relative h-40 w-full overflow-hidden">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <h3 className="font-bold text-gov-charcoal dark:text-white mb-2 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500" title={new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}>
                                            <Calendar size={14} />
                                            {formatRelativeTime(item.date, lang as 'ar' | 'en')}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && galleryImages.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        onClick={closeLightbox}
                    >
                        <X size={24} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {lightboxIndex + 1} / {galleryImages.length}
                    </div>

                    {/* Previous */}
                    <button
                        className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    >
                        <ChevronLeft size={28} />
                    </button>

                    {/* Image */}
                    <div
                        className="relative w-full max-w-5xl h-[80vh] mx-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={galleryImages[lightboxIndex]}
                            alt={`${title} - ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>

                    {/* Next */}
                    <button
                        className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    >
                        <ChevronRight size={28} />
                    </button>

                    {/* Thumbnail strip */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
                        {galleryImages.map((img, idx) => (
                            <div
                                key={idx}
                                className={`relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all ${
                                    idx === lightboxIndex ? 'border-gov-gold scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                            >
                                <Image
                                    src={img}
                                    alt={`thumb-${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleDetail;

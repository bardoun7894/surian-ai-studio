'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Share2, Printer, ChevronRight, ChevronLeft, X, ZoomIn, Images, Sparkles, ChevronDown, ChevronUp, Loader2, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { formatRelativeTime, formatDate as formatDateUtil, copyToClipboard } from '@/lib/utils';
import { toast } from 'sonner';
import ShareMenu from '@/components/ShareMenu';
import PrintHeader from '@/components/PrintHeader';
import PrintFooter from '@/components/PrintFooter';

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
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    /** Optional: render a custom favorite button (e.g., FavoriteButton component) next to share/print */
    favoriteButtonSlot?: React.ReactNode;
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
    language,
    backLink,
    relatedItems,
    isFavorite,
    onToggleFavorite,
    favoriteButtonSlot
}) => {
    const { language: ctxLanguage } = useLanguage();
    const lang = language || ctxLanguage || 'ar';

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [shareMenuOpen, setShareMenuOpen] = useState(false);

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
            const result = await API.ai.summarize(content, lang);
            setSummaryText(result.summary);
            setSummaryOpen(true);
            toast.success(lang === 'ar' ? 'تم إنشاء الملخص بنجاح' : 'Summary generated successfully');
        } catch (err) {
            console.error('AI Summary Error:', err);
            const errorMsg = lang === 'ar' ? 'فشل في إنشاء الملخص. يرجى المحاولة لاحقاً.' : 'Failed to generate summary. Please try again later.';
            setSummaryError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleShare = async () => {
        // On mobile devices that support native share, use it directly
        if (navigator.share) {
            try {
                await navigator.share({ title, url: window.location.href });
                return;
            } catch (err: any) {
                // User cancelled - do nothing
                if (err?.name === 'AbortError') return;
                // Native share failed, fall through to ShareMenu
            }
        }
        // Open the ShareMenu modal for desktop / fallback
        setShareMenuOpen(true);
    };

    const handlePrint = () => {
        window.print();
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

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextImage();
            else if (e.key === 'ArrowLeft') prevImage();
            else if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, galleryImages.length]);

    const formattedDate = date && !isNaN(new Date(date).getTime())
        ? new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

    return (
        <div className="bg-gov-beige dark:bg-dm-bg min-h-screen pb-20 print:bg-white print:pb-0 print:min-h-0">
            {/* Official Ministry Print Header */}
            <PrintHeader
                documentTitle={category}
                date={formattedDate}
                language={lang as 'ar' | 'en'}
            />

            <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 md:pt-12 print:pt-4 print:px-0">

                {/* Back Link */}
                <Link
                    href={backLink.href}
                    className="inline-flex items-center gap-2 text-gov-teal dark:text-gov-teal font-bold mb-5 md:mb-8 hover:gap-3 transition-all print:hidden"
                >
                    <ChevronRight size={20} className="rtl:rotate-0 rotate-180" />
                    {backLink.label}
                </Link>

                <article className="bg-white dark:bg-gov-card/10 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gov-border/15 print:shadow-none print:border-none print:rounded-none print:bg-white">

                    {/* Featured Image */}
                    {imageUrl && (
                        <div
                            className="relative h-[250px] md:h-[500px] w-full cursor-pointer group print-featured-image"
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent print:hidden" />
                            <div className="absolute bottom-6 right-6 rtl:right-auto rtl:left-6 print:hidden">
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

                    <div className="p-4 md:p-12">
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-y-3 gap-x-4 text-sm text-gray-500 dark:text-white/70 mb-8 pb-8 border-b border-gray-100 dark:border-gov-border/15">
                            <div className="flex items-center gap-2" title={date && !isNaN(new Date(date).getTime()) ? new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}>
                                <Calendar size={16} className="text-gov-gold" />
                                <span className="font-medium">{formatRelativeTime(date, lang as 'ar' | 'en')}</span>
                            </div>

                            {author && (
                                <>
                                    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-white/30" />
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gov-gold" />
                                        <span>{author}</span>
                                    </div>
                                </>
                            )}

                            {readTime && (
                                <>
                                    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-white/30" />
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gov-gold" />
                                        <span>{readTime}</span>
                                    </div>
                                </>
                            )}

                            <div className="flex-1" />

                            <div className="flex items-center gap-2 print:hidden" data-print-hide="true">
                                {onToggleFavorite && (
                                    <button
                                        onClick={onToggleFavorite}
                                        className={`p-2.5 rounded-full transition-all duration-300 ${isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-900/20 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-red-500'}`}
                                        title={isFavorite ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from Favorites') : (lang === 'ar' ? 'إضافة للمفضلة' : 'Add to Favorites')}
                                    >
                                        <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                                    </button>
                                )}
                                {favoriteButtonSlot && (
                                    <>
                                        {favoriteButtonSlot}
                                    </>
                                )}
                                {(onToggleFavorite || favoriteButtonSlot) && (
                                    <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
                                )}
                                <button
                                    onClick={handleShare}
                                    className="p-2.5 text-gray-400 hover:text-gov-teal hover:bg-gov-teal/5 dark:hover:bg-white/10 rounded-full transition-colors"
                                    title={lang === 'ar' ? 'مشاركة' : 'Share'}
                                >
                                    <Share2 size={18} />
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="p-2.5 text-gray-400 hover:text-gov-teal hover:bg-gov-teal/5 dark:hover:bg-white/10 rounded-full transition-colors"
                                    title={lang === 'ar' ? 'طباعة' : 'Print'}
                                >
                                    <Printer size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content Body */}
                        <h1 className="text-2xl md:text-4xl font-display font-bold text-gov-forest dark:text-white mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* T047: AI Smart Summary */}
                        <div className="mb-8 p-1 bg-gradient-to-br from-gov-gold/20 to-gov-forest/5 rounded-2xl border border-gov-gold/30" data-print-hide="true">
                            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 md:p-4 transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-gov-forest dark:text-gov-gold font-bold">
                                        <Sparkles size={18} className="text-gov-gold" />
                                        <span>{lang === 'ar' ? 'ملخص ذكي' : 'AI Smart Summary'}</span>
                                    </div>
                                    <button
                                        onClick={handleSmartSummary}
                                        disabled={summaryLoading}
                                        className="text-xs font-bold px-3 py-1.5 bg-white dark:bg-white/10 text-gov-forest dark:text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {summaryLoading ? <Loader2 size={14} className="animate-spin" /> : (summaryOpen && summaryText ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                        {summaryText ? (summaryOpen ? (lang === 'ar' ? 'إخفاء' : 'Hide') : (lang === 'ar' ? 'عرض' : 'Show')) : (lang === 'ar' ? 'توليد الملخص' : 'Generate')}
                                    </button>
                                </div>

                                {summaryError && (
                                    <div className="text-red-500 text-sm py-2 px-1">
                                        {summaryError}
                                    </div>
                                )}

                                {(summaryText && summaryOpen) ? (
                                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                        {summaryText}
                                    </p>
                                ) : (!summaryText && !summaryLoading && (
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                        {lang === 'ar'
                                            ? 'اضغط على "توليد الملخص" للحصول على ملخص سريع لهذا المقال باستخدام الذكاء الاصطناعي.'
                                            : 'Click "Generate" to get a quick AI-powered summary of this article.'}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-gov-forest dark:prose-headings:text-gov-gold prose-p:text-gov-charcoal dark:prose-p:text-white/70">
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
                    <div className="mt-16 print:hidden">
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
                                        <div className="flex items-center gap-2 text-xs text-gray-500" title={item.date && !isNaN(new Date(item.date).getTime()) ? new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}>
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

            {/* Official Ministry Print Footer */}
            <PrintFooter language={lang as 'ar' | 'en'} />

            {/* Share Menu */}
            <ShareMenu
                isOpen={shareMenuOpen}
                onClose={() => setShareMenuOpen(false)}
                title={title}
                url={shareMenuOpen ? window.location.href : ""}
            />

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
                                className={`relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all ${idx === lightboxIndex ? 'border-gov-gold scale-110' : 'border-transparent opacity-60 hover:opacity-100'
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

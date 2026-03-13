import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
    ShieldAlert,
    Scale,
    HeartPulse,
    BookOpen,
    GraduationCap,
    Zap,
    Droplets,
    Plane,
    Wifi,
    Banknote,
    Map,
    Factory,
    Handshake,
    Building2,
    TrendingUp,
    ShieldCheck,
    X,
    ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import Link from 'next/link';
import { SkeletonCard } from '@/components/SkeletonLoader';

const GovernmentPartners: React.FC = () => {
    const { t, language } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const [selectedDirectorate, setSelectedDirectorate] = useState<Directorate | null>(null);
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);

    // Map icon names to components
    const iconMap: Record<string, React.ReactNode> = {
        ShieldAlert: <ShieldAlert size={24} />,
        Scale: <Scale size={24} />,
        HeartPulse: <HeartPulse size={24} />,
        BookOpen: <BookOpen size={24} />,
        GraduationCap: <GraduationCap size={24} />,
        Zap: <Zap size={24} />,
        Droplets: <Droplets size={24} />,
        Plane: <Plane size={24} />,
        Wifi: <Wifi size={24} />,
        Banknote: <Banknote size={24} />,
        Map: <Map size={24} />,
        Factory: <Factory size={24} />,
        TrendingUp: <TrendingUp size={24} />,
        ShieldCheck: <ShieldCheck size={24} />
    };

    // Helper to get localized field - handles LocalizedString objects AND _ar/_en suffixed fields
    const loc = (obj: any, field: string): string => {
        const val = obj?.[field];
        if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
            return val[language] || val['ar'] || '';
        }
        const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
        const en = obj?.[`${field}_en`] || ar;
        return language === 'ar' ? ar : en;
    };

    useEffect(() => {
        const fetchDirectorates = async () => {
            try {
                const data = await API.directorates.getAll();
                setDirectorates(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load directorates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDirectorates();
    }, []);

    useEffect(() => {
        if (!scrollRef.current || directorates.length === 0) return;

        const scrollContainer = scrollRef.current;
        let tween: gsap.core.Tween;

        const ctx = gsap.context(() => {
            tween = gsap.to(scrollContainer, {
                xPercent: -25, // Move one full set (1/4 of the total width)
                duration: 40, // Slower for premium feel
                ease: "none",
                repeat: -1
            });
        });

        const handleMouseEnter = () => tween?.pause();
        const handleMouseLeave = () => tween?.play();

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
            ctx.revert();
        };
    }, [directorates]);

    // Animate Modal Open
    useEffect(() => {
        if (selectedDirectorate && modalRef.current && backdropRef.current) {
            document.body.style.overflow = 'hidden';

            const tl = gsap.timeline();
            tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
                .fromTo(modalRef.current,
                    { scale: 0.9, opacity: 0, y: 20 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' },
                    "-=0.2"
                );

            const items = modalRef.current.querySelectorAll('.modal-item');
            if (items.length) {
                tl.fromTo(items,
                    { opacity: 0, x: -10 },
                    { opacity: 1, x: 0, stagger: 0.05, duration: 0.3 },
                    "-=0.2"
                );
            }

            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [selectedDirectorate]);

    const handleClose = () => {
        if (modalRef.current && backdropRef.current) {
            const tl = gsap.timeline({
                onComplete: () => setSelectedDirectorate(null)
            });
            tl.to(modalRef.current, { scale: 0.95, opacity: 0, duration: 0.2, ease: 'power2.in' })
                .to(backdropRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");
        } else {
            setSelectedDirectorate(null);
        }
    };

    if (loading) {
        return (
            <section className="py-12 md:py-24 bg-white dark:bg-dm-bg border-t border-gray-100 dark:border-gov-border/15 transition-colors">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 md:mb-16">
                        <div className="h-5 w-24 md:h-6 md:w-32 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto mb-4 md:mb-6 animate-pulse" />
                        <div className="h-8 w-48 md:h-12 md:w-64 bg-gray-200 dark:bg-dm-surface rounded mx-auto mb-4 md:mb-6 animate-pulse" />
                        <div className="h-3 w-64 md:h-4 md:w-96 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto animate-pulse" />
                    </div>
                    <div className="flex gap-4 md:gap-6 overflow-hidden py-2 md:py-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0">
                                <SkeletonCard className="h-full w-full rounded-2xl md:rounded-3xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (directorates.length === 0) {
        return null;
    }

    return (
        <section className="py-12 md:py-24 bg-white dark:bg-dm-bg border-t border-gray-100 dark:border-gov-border/15 transition-colors">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

                {/* Centered Header - matching Announcements pattern */}
                <div className="text-center mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gov-gold/10 dark:bg-gov-emerald/20 rounded-full mb-4 md:mb-6">
                        <Handshake className="text-gov-gold w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-gov-gold font-bold text-xs md:text-sm tracking-wide">
                            {t('partners_title')}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gov-forest dark:text-gov-teal mb-4 md:mb-6">
                        {t('partners_title')}
                    </h2>
                    <p className="text-gov-stone/60 dark:text-white/70 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
                        {t('partners_subtitle')}
                    </p>
                </div>

                {/* Partners Carousel (Infinite Marquee) */}
                <div
                    className="relative overflow-hidden w-full group mb-8 md:mb-12 [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]"
                    dir="ltr" // Force LTR for consistent marquee direction regardless of language
                >
                    <div
                        ref={scrollRef}
                        className="flex gap-2 md:gap-6 w-max flex-nowrap py-2 md:py-4"
                    >
                        {/* Duplicate the array multiple times to ensure it covers wide screens and loops seamlessly */}
                        {[...directorates, ...directorates, ...directorates, ...directorates].map((directorate, index) => (
                            <div
                                key={`${directorate.id}-${index}`}
                                className="flex-shrink-0"
                                onClick={() => setSelectedDirectorate(directorate)}
                            >
                                <div className="w-28 h-28 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl md:rounded-3xl bg-white dark:bg-dm-bg border border-gray-200/60 dark:border-gov-border/20 hover:border-gov-gold/30 flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-500 hover:shadow-xl md:hover:shadow-2xl hover:-translate-y-2 md:hover:-translate-y-3 cursor-pointer group/card hover:bg-gov-gold/5 relative overflow-hidden">
                                    {/* Glass reflection effect */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                                    {/* Icon */}
                                    <div className="w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-gov-forest/5 dark:bg-gov-emerald/10 text-gov-forest dark:text-gov-teal flex items-center justify-center mb-3 md:mb-4 group-hover/card:bg-gov-forest group-hover/card:text-white dark:group-hover/card:bg-gov-gold dark:group-hover/card:text-gov-forest transition-all duration-500 transform group-hover/card:scale-110 shadow-sm [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8">
                                        {iconMap[directorate.icon] || <Building2 className="w-6 h-6 md:w-8 md:h-8" />}
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-[9px] md:text-sm lg:text-base font-bold text-gov-forest dark:text-gov-teal text-center leading-tight line-clamp-2 px-1 md:px-2">
                                        {loc(directorate, 'name')}
                                    </h3>

                                    {/* Service Count */}
                                    <div className="flex items-center gap-1 md:gap-1.5 mt-2 md:mt-3 opacity-60 group-hover/card:opacity-100 transition-all duration-300">
                                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-gov-gold" />
                                        <span className="text-[8px] md:text-xs font-medium text-gov-sand dark:text-gov-beige">
                                            {directorate.servicesCount} {language === 'ar' ? 'خدمة' : 'services'}
                                        </span>
                                    </div>

                                    {/* Decorative corner accent */}
                                    <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-gov-gold/10 rounded-tl-full translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-transform duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Gradient Masks */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-dm-bg to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-dm-bg to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* View Full Guide Button */}
                <div className="flex justify-center">
                    <Link
                        href="/directorates"
                        className="inline-flex items-center gap-2 px-6 py-3 md:px-10 md:py-4 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-xl md:rounded-2xl hover:shadow-lg hover:shadow-gov-forest/20 dark:hover:shadow-gov-gold/20 transition-all duration-300 group hover:-translate-y-1 active:translate-y-0 text-xs md:text-base"
                    >
                        <span>{language === 'ar' ? 'عرض دليل الجهات الكامل' : 'View Full Directorates Guide'}</span>
                        <BookOpen className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>

            </div>

            {/* Modal Overlay */}
            {selectedDirectorate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <div
                        ref={backdropRef}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0"
                        onClick={handleClose}
                    ></div>

                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-3xl bg-white dark:bg-dm-surface rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden opacity-0 flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Header / Sidebar Image */}
                        <div className="w-full md:w-1/3 bg-gov-forest relative p-6 md:p-8 flex flex-col items-center justify-center text-center">
                            <div className="absolute inset-0 bg-pattern-islamic opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg [&>svg]:w-10 [&>svg]:h-10 md:[&>svg]:w-12 md:[&>svg]:h-12">
                                    {iconMap[selectedDirectorate.icon] ?
                                        React.cloneElement(iconMap[selectedDirectorate.icon] as React.ReactElement, { className: "text-white" })
                                        : <Building2 className="text-white w-10 h-10 md:w-12 md:h-12" />}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">{loc(selectedDirectorate, 'name')}</h3>
                                <div className="h-1 w-10 md:w-12 bg-gov-gold mx-auto rounded-full"></div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50 dark:bg-zinc-900/50">
                            <div className="flex justify-between items-start mb-4 md:mb-6">
                                <div>
                                    <h4 className="text-base md:text-lg font-bold text-gov-forest dark:text-gov-teal mb-1 md:mb-2">
                                        {language === 'ar' ? 'المديريات والهيئات التابعة' : 'Affiliated Directorates & Bodies'}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gov-stone dark:text-white/70">
                                        {loc(selectedDirectorate, 'description')}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1.5 md:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X className="text-gov-stone dark:text-white w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </div>

                            {/* List of Sub-Directorates */}
                            {selectedDirectorate.subDirectorates && selectedDirectorate.subDirectorates.length > 0 ? (
                                <div className="grid gap-2 md:gap-3">
                                    {selectedDirectorate.subDirectorates.map((sub, idx) => (
                                        <a
                                            key={sub.id}
                                            href={sub.isExternal ? (sub.url || '#') : `/directorates/${selectedDirectorate.id}/sub-directorates`}
                                            target={sub.isExternal ? '_blank' : '_self'}
                                            rel="noreferrer"
                                            className="modal-item group flex items-center justify-between p-3 md:p-4 bg-white dark:bg-gov-card/10 border border-gov-gold/10 dark:border-white/5 rounded-lg md:rounded-xl hover:border-gov-gold/40 hover:shadow-sm md:hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gov-gold group-hover:scale-150 transition-transform"></div>
                                                <span className="font-medium text-[11px] md:text-sm text-gov-forest dark:text-white/70 group-hover:text-gov-gold transition-colors">
                                                    {loc(sub, 'name')}
                                                </span>
                                            </div>
                                            {sub.isExternal ? <ExternalLink className="text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" /> : <TrendingUp className="text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 -translate-x-1 md:-translate-x-2 group-hover:translate-x-0 rtl:translate-x-1 rtl:md:translate-x-2 rtl:group-hover:translate-x-0 transition-all" />}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 md:py-8 text-xs md:text-sm text-gray-400 italic">
                                    {language === 'ar' ? 'لا توجد مديريات فرعية متاحة حالياً' : 'No affiliated directorates available at the moment'}
                                </div>
                            )}

                            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 dark:border-gov-border/15 flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-1.5 md:px-6 md:py-2 rounded-md md:rounded-lg bg-gray-200 dark:bg-white/10 text-gov-forest dark:text-white text-xs md:text-sm font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                                >
                                    {language === 'ar' ? 'إغلاق' : 'Close'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default GovernmentPartners;

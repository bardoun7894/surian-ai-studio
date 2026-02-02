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

    // Helper to get localized field from an API object with _ar/_en suffixes
    const loc = (obj: any, field: string): string => {
        const ar = obj?.[`${field}_ar`] || obj?.[field] || '';
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

    if (loading || directorates.length === 0) {
        return (
            <section className="py-16 bg-gov-beige/30 dark:bg-gov-forest/30 border-t border-gov-gold/20 dark:border-gov-gold/10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6 overflow-hidden py-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-56 h-56 rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gov-beige/30 dark:bg-gov-forest/30 border-t border-gov-gold/20 dark:border-gov-gold/10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-teal/10 dark:bg-gov-gold/10 text-gov-teal dark:text-gov-gold text-sm font-bold mb-4">
                        <Handshake size={16} />
                        <span>{t('partners_title')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gov-charcoal dark:text-gov-gold mb-4">
                        {t('partners_title')}
                    </h2>
                    <p className="text-gov-stone/60 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('partners_subtitle')}
                    </p>
                </div>

                {/* Partners Carousel (Infinite Marquee) */}
                <div
                    className="relative overflow-hidden w-full group mb-12 [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]"
                    dir="ltr" // Force LTR for consistent marquee direction regardless of language
                >
                    <div
                        ref={scrollRef}
                        className="flex gap-6 w-max flex-nowrap py-4"
                    >
                        {/* Duplicate the array multiple times to ensure it covers wide screens and loops seamlessly */}
                        {[...directorates, ...directorates, ...directorates, ...directorates].map((directorate, index) => (
                            <div
                                key={`${directorate.id}-${index}`}
                                className="flex-shrink-0"
                                onClick={() => setSelectedDirectorate(directorate)}
                            >
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-white dark:bg-gov-emeraldStatic border border-gov-gold/10 dark:border-gov-gold/10 hover:border-gov-gold/30 flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer group/card hover:bg-gov-gold/5 relative overflow-hidden">
                                    {/* Glass reflection effect */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold flex items-center justify-center mb-4 group-hover/card:bg-gov-forest group-hover/card:text-white dark:group-hover/card:bg-gov-gold dark:group-hover/card:text-gov-forest transition-all duration-500 transform group-hover/card:scale-110 shadow-sm">
                                        {iconMap[directorate.icon] || <Building2 size={28} />}
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-sm md:text-base font-bold text-gov-charcoal dark:text-gov-gold text-center leading-tight line-clamp-2 px-2">
                                        {loc(directorate, 'name')}
                                    </h3>

                                    {/* Service Count */}
                                    <div className="flex items-center gap-1.5 mt-3 opacity-60 group-hover/card:opacity-100 transition-all duration-300">
                                        <TrendingUp size={12} className="text-gov-gold" />
                                        <span className="text-xs font-medium text-gov-sand dark:text-gov-beige">
                                            {directorate.servicesCount} {language === 'ar' ? 'خدمة' : 'services'}
                                        </span>
                                    </div>

                                    {/* Decorative corner accent */}
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-gov-gold/10 rounded-tl-full translate-x-4 translate-y-4 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-transform duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Gradient Masks */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gov-beige dark:from-gov-forest to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gov-beige dark:from-gov-forest to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* View Full Guide Button */}
                <div className="flex justify-center">
                    <Link
                        href="/directorates"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gov-forest text-white hover:bg-gov-forest/90 dark:bg-gov-gold dark:text-gov-forest dark:hover:bg-gov-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-bold text-sm md:text-base group"
                    >
                        <span>{language === 'ar' ? 'عرض دليل الجهات الكامل' : 'View Full Directorates Guide'}</span>
                        <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
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
                        className="relative w-full max-w-3xl bg-white dark:bg-gov-emeraldStatic rounded-[2rem] shadow-2xl overflow-hidden opacity-0 flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Header / Sidebar Image */}
                        <div className="w-full md:w-1/3 bg-gov-forest relative p-8 flex flex-col items-center justify-center text-center">
                            <div className="absolute inset-0 bg-pattern-islamic opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

                            <div className="relative z-10">
                                <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                                    {iconMap[selectedDirectorate.icon] ?
                                        React.cloneElement(iconMap[selectedDirectorate.icon] as React.ReactElement, { size: 48, className: "text-white" })
                                        : <Building2 size={48} className="text-white" />}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 leading-tight">{loc(selectedDirectorate, 'name')}</h3>
                                <div className="h-1 w-12 bg-gov-gold mx-auto rounded-full"></div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-gray-50 dark:bg-zinc-900/50">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-lg font-bold text-gov-forest dark:text-gov-gold mb-2">
                                        {language === 'ar' ? 'المديريات والهيئات التابعة' : 'Affiliated Directorates & Bodies'}
                                    </h4>
                                    <p className="text-sm text-gov-stone dark:text-gray-400">
                                        {loc(selectedDirectorate, 'description')}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X className="text-gov-stone dark:text-white" size={24} />
                                </button>
                            </div>

                            {/* List of Sub-Directorates */}
                            {selectedDirectorate.subDirectorates && selectedDirectorate.subDirectorates.length > 0 ? (
                                <div className="grid gap-3">
                                    {selectedDirectorate.subDirectorates.map((sub, idx) => (
                                        <a
                                            key={sub.id}
                                            href={sub.isExternal ? (sub.url || '#') : `/directorates/${selectedDirectorate.id}/sub-directorates`}
                                            target={sub.isExternal ? '_blank' : '_self'}
                                            rel="noreferrer"
                                            className="modal-item group flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gov-gold/10 dark:border-white/5 rounded-xl hover:border-gov-gold/40 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gov-gold group-hover:scale-150 transition-transform"></div>
                                                <span className="font-medium text-gov-forest dark:text-gray-200 group-hover:text-gov-gold transition-colors">
                                                    {loc(sub, 'name')}
                                                </span>
                                            </div>
                                            {sub.isExternal ? <ExternalLink size={16} className="text-gray-400" /> : <TrendingUp size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0 transition-all" />}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 italic">
                                    {language === 'ar' ? 'لا توجد مديريات فرعية متاحة حالياً' : 'No affiliated directorates available at the moment'}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-white/10 text-gov-forest dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
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

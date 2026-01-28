import React, { useEffect, useState, useRef } from 'react';
import { Directorate, LocalizedString } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, TrendingUp, ExternalLink } from 'lucide-react';
import { DIRECTORATES } from '@/lib/constants';
import gsap from 'gsap';
import DirectorateCard from './DirectorateCard';

export default function FeaturedDirectorates() {
    const { t, language } = useLanguage();
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDirectorate, setSelectedDirectorate] = useState<Directorate | null>(null);

    // Refs for animation
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    // Helper to get localized string
    const getLocalized = (content: LocalizedString | string) => {
        if (typeof content === 'string') return content;
        return content[language as 'ar' | 'en'];
    };

    useEffect(() => {
        // Use the global constant directly
        // Filter only the first 3 for "Featured" section if needed, or take all
        setDirectorates(DIRECTORATES.slice(0, 3));
        setLoading(false);
    }, []);

    // Animate Modal Open
    useEffect(() => {
        if (selectedDirectorate && modalRef.current && backdropRef.current) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            const tl = gsap.timeline();
            tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
                .fromTo(modalRef.current,
                    { scale: 0.9, opacity: 0, y: 20 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' },
                    "-=0.2"
                );

            // Stagger items
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
            <section className="py-12 bg-gov-beige/50 dark:bg-gov-forest/90 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (directorates.length === 0) return null;

    return (
        <section id="featured-directorates" className="py-16 bg-gov-beige/50 dark:bg-gov-forest/90 relative overflow-hidden scroll-mt-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #b9a779 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10 transform transition-all duration-700 ease-out translate-y-0 opacity-100">
                    <h2 className="text-3xl md:text-4xl font-bold text-gov-forest dark:text-gov-gold mb-3">
                        {t('featured_directorates_title')}
                    </h2>
                    <div className="h-1 bg-gov-gold mx-auto rounded-full w-24 transition-all duration-1000 ease-out"></div>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {directorates.map((directorate, idx) => (
                        <div
                            key={directorate.id}
                            className="transform transition-all duration-500 ease-out w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] max-w-md flex min-h-[400px]"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <DirectorateCard
                                directorate={{
                                    ...directorate,
                                    // Pass localized strings to the stateless card if needed, or update card to handle localization too.
                                    // Wait, the card expects Directorate. If card uses Director prop directly, it will receive the complex object.
                                    // The card component needs to be updated to handle localization OR we localize it here before passing.
                                    // Let's pass localized version here to keep CARD simple? No, changing type of Directorate globally is better.
                                    // But Card expects Directorate.
                                    // Let's check Card implementation.
                                    // Card takes Directorate. Card renders directorate.name directly.
                                    // If name is LocalizedString, React will error.
                                    // So we MUST localize it before passing to Card, OR update Card to handle it.
                                    // Updating Card is cleaner. I will assume Card reads directorate.name. 
                                    // Let's update Card to use getLocalized as well? Or pass prepared object.
                                    // Passing prepared object is easier for now to avoid touching multiple files if possible, 
                                    // BUT directorate type has changed. 
                                    // So passing a "Directorate" that has string for name/description matches the OLD type, but TS expects NEW type.
                                    // To fix this cleanly: I will update the Card to accept the new type properly or handle it here.
                                    // Let's update Card component in next step.
                                    // For now, let's localize it HERE so it matches the expected "shape" visually, but TS might complain if I cast it.
                                    // Let's look at DirectorateCardProps.
                                    // It takes `directorate: Directorate`.
                                    // Directorate now has `name: LocalizedString | string`.
                                    // Card just puts {directorate.name} in JSX. This causes the error!
                                    // So I absolutely MUST update DirectorateCard.tsx as well.
                                    // I'll finish this file file first, assuming Card will be fixed.
                                    ...directorate,
                                }}
                                onOpen={() => setSelectedDirectorate(directorate)}
                            />
                        </div>
                    ))}
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
                        className="relative w-full max-w-3xl bg-white dark:bg-gov-charcoal rounded-[2rem] shadow-2xl overflow-hidden opacity-0 flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Header / Sidebar Image */}
                        <div className="w-full md:w-1/3 bg-gov-forest relative p-8 flex flex-col items-center justify-center text-center">
                            <div className="absolute inset-0 bg-pattern-islamic opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

                            <div className="relative z-10">
                                <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <img src="/assets/logo/22.png" alt="Logo" className="w-24 h-24 object-contain" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{getLocalized(selectedDirectorate.name)}</h3>
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
                                        {getLocalized(selectedDirectorate.description)}
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
                            <div className="grid gap-3">
                                {selectedDirectorate.subDirectorates?.map((sub) => (
                                    <a
                                        key={sub.id}
                                        href={sub.url}
                                        target={sub.isExternal ? '_blank' : '_self'}
                                        rel="noreferrer"
                                        className="modal-item group flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gov-gold/10 dark:border-white/5 rounded-xl hover:border-gov-gold/30 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gov-gold group-hover:scale-150 transition-transform"></div>
                                            <span className="font-medium text-gov-forest dark:text-gray-200 group-hover:text-gov-gold transition-colors">
                                                {getLocalized(sub.name)}
                                            </span>
                                        </div>
                                        {sub.isExternal ? <ExternalLink size={16} className="text-gray-400" /> : <TrendingUp size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0 transition-all" />}
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-white/10 text-gov-forest dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                                >
                                    {t('ui_close') || (language === 'ar' ? 'إغلاق' : 'Close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

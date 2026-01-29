import React, { useEffect, useState } from 'react';
import { Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import DirectorateCard from './DirectorateCard';

export default function FeaturedDirectorates() {
    const { t } = useLanguage();
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading or fetch from API
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await API.directorates.getFeatured();
                setDirectorates(data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load directorates", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-gold/10 text-gov-gold text-sm font-bold mb-4">
                        <span>{t('dir_title_compact')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gov-forest dark:text-gov-gold mb-3">
                        {t('dir_subtitle_compact')}
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
                                directorate={directorate}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

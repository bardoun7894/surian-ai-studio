import React, { useEffect, useState } from 'react';
import { Directorate } from '@/types';
import { API } from '@/lib/repository';
import DirectorateCard from './DirectorateCard';

export default function FeaturedDirectorates() {
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await API.directorates.getFeatured();
                setDirectorates(data);
            } catch (error) {
                console.error('Failed to load featured directorates', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
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
        <section className="py-16 bg-gov-beige/50 dark:bg-gov-forest/90 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #b9a779 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10 transform transition-all duration-700 ease-out translate-y-0 opacity-100">
                    <h2 className="text-3xl md:text-4xl font-bold text-gov-forest dark:text-gov-gold mb-3">
                        المديريات الرئيسية
                    </h2>
                    <div className="h-1 bg-gov-gold mx-auto rounded-full w-24 transition-all duration-1000 ease-out"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {directorates.map((directorate, idx) => (
                        <div
                            key={directorate.id}
                            className="transform transition-all duration-500 ease-out"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <DirectorateCard directorate={directorate} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import {
    Plane,
    Car,
    Zap,
    GraduationCap,
    Banknote,
    Home,
    ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceItem {
    id: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    translationKey: string;
}

const RequestedServices: React.FC<{ onNavigate: (view: any) => void }> = ({ onNavigate }) => {
    const { t, language } = useLanguage();

    const services: ServiceItem[] = [
        {
            id: 'passport',
            icon: <Plane strokeWidth={1.5} size={32} />,
            color: 'text-gov-teal',
            bgColor: 'bg-transparent group-hover:bg-gov-teal/5',
            translationKey: 's_passport'
        },
        {
            id: 'traffic',
            icon: <Car strokeWidth={1.5} size={32} />,
            color: 'text-gov-red',
            bgColor: 'bg-transparent group-hover:bg-gov-red/5',
            translationKey: 's_traffic'
        },
        {
            id: 'electricity',
            icon: <Zap strokeWidth={1.5} size={32} />,
            color: 'text-gov-gold',
            bgColor: 'bg-transparent group-hover:bg-gov-gold/5',
            translationKey: 's_electricity'
        },
        {
            id: 'exams',
            icon: <GraduationCap strokeWidth={1.5} size={32} />,
            color: 'text-gov-forest',
            bgColor: 'bg-transparent group-hover:bg-gov-forest/5',
            translationKey: 's_exams'
        },
        {
            id: 'clearance',
            icon: <Banknote strokeWidth={1.5} size={32} />,
            color: 'text-gov-teal',
            bgColor: 'bg-transparent group-hover:bg-gov-teal/5',
            translationKey: 's_finance'
        },
        {
            id: 'property',
            icon: <Home strokeWidth={1.5} size={32} />,
            color: 'text-gov-gold',
            bgColor: 'bg-transparent group-hover:bg-gov-gold/5',
            translationKey: 's_property'
        }
    ];

    return (
        <section className="py-20 bg-white dark:bg-dm-surface border-t border-gray-100 dark:border-gov-border/15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-gov-forest dark:text-gov-teal mb-4">
                        {t('requested_services_title')}
                    </h2>
                    <p className="text-gray-500 dark:text-white/70 max-w-2xl mx-auto text-lg">
                        {t('requested_services_subtitle')}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => onNavigate('SERVICES_GUIDE')}
                            className="group cursor-pointer flex flex-col items-center justify-center p-8 rounded-[2rem] bg-gray-50 dark:bg-dm-surface border border-transparent hover:border-gray-200 dark:hover:border-gov-gold/20 hover:shadow-xl transition-all duration-500"
                        >
                            {/* Icon Container */}
                            <div className={`w-20 h-20 rounded-[1.5rem] ${service.bgColor} ${service.color} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-sm border border-transparent group-hover:border-current/10`}>
                                {service.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-sm md:text-base font-bold text-gov-forest dark:text-gov-teal text-center leading-tight group-hover:text-gov-gold transition-colors">
                                {t(service.translationKey)}
                            </h3>
                            <span className="text-[10px] font-bold text-gov-gold/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                الوصول للخدمة
                            </span>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-16 text-center">
                    <button
                        onClick={() => onNavigate('SERVICES_GUIDE')}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gov-forest dark:bg-gov-button text-white font-bold text-lg rounded-2xl hover:shadow-[0_10px_30px_rgba(9,66,57,0.3)] dark:hover:shadow-[0_10px_30px_rgba(185,167,121,0.3)] transition-all transform hover:-translate-y-1"
                    >
                        {t('view_all_services')}
                        <ChevronLeft size={22} className={language === 'ar' ? '' : 'rotate-180'} />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default RequestedServices;

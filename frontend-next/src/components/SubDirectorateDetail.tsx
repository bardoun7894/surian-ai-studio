'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API } from '@/lib/repository';
import { SubDirectorate, Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    ArrowRight,
    Building2,
    Phone,
    Mail,
    MapPin,
    Globe,
    Clock,
    Calendar,
    ChevronLeft,
    FileText,
    Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SubDirectorateDetail = () => {
    const { id, subId } = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const [subDirectorate, setSubDirectorate] = useState<SubDirectorate | null>(null);
    const [parentDirectorate, setParentDirectorate] = useState<Directorate | null>(null);
    const [ministryContact, setMinistryContact] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !subId) return;

            try {
                setLoading(true);
                const [directorate, contactSettings] = await Promise.all([
                    API.directorates.getById(id as string),
                    API.settings.getByGroup('contact'),
                ]);
                setParentDirectorate(directorate);
                setMinistryContact((contactSettings ?? {}) as Record<string, string>);

                if (directorate && directorate.subDirectorates) {
                    const found = directorate.subDirectorates.find(s => s.id === subId);
                    if (found) {
                        setSubDirectorate(found);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch sub-directorate", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, subId]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gov-beige dark:bg-dm-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-teal"></div>
            </div>
        );
    }

    if (!subDirectorate || !parentDirectorate) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gov-beige dark:bg-dm-bg text-gov-charcoal dark:text-white">
                <Building2 size={64} className="mb-4 text-gov-sand opacity-50" />
                <h2 className="text-2xl font-bold mb-2">{t('ui_no_results')}</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-6 py-2 bg-gov-teal text-white rounded-lg hover:bg-gov-emerald transition-colors"
                >
                    {t('ui_back')}
                </button>
            </div>
        );
    }

    const isAr = language === 'ar';
    const name = typeof subDirectorate.name === 'string' ? subDirectorate.name : (isAr ? subDirectorate.name.ar : subDirectorate.name.en);
    const description = typeof (subDirectorate as any).description === 'string' ? (subDirectorate as any).description : (isAr ? (subDirectorate as any).description?.ar : (subDirectorate as any).description?.en);
    const parentName = typeof parentDirectorate.name === 'string' ? parentDirectorate.name : (isAr ? parentDirectorate.name.ar : parentDirectorate.name.en);

    return (
        <div className="min-h-screen bg-gov-beige dark:bg-dm-bg pb-20 transition-colors duration-500">
            {/* Header */}
            <div className="bg-gov-charcoal text-white pt-32 pb-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="/images/pattern-islamic.png"
                        alt="Pattern"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Link href={`/directorates/${parentDirectorate.id}`} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                            <ChevronLeft size={24} className={isAr ? "" : "rotate-180"} />
                        </Link>

                        <div>
                            <div className="text-gov-gold text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Building2 size={16} />
                                {parentName}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">{name}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Card */}
                        <div className="bg-white dark:bg-dm-surface rounded-3xl p-8 shadow-sm border border-gov-gold/10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gov-forest dark:text-white flex items-center gap-3">
                                    <FileText className="text-gov-teal dark:text-gov-gold" />
                                    {t('about_portal') || (isAr ? "نبذة عامة" : "Overview")}
                                </h3>
                            </div>
                            <div className="prose prose-lg dark:prose-invert max-w-none text-gov-charcoal/80 dark:text-white/80 leading-relaxed">
                                <p>{description}</p>
                            </div>
                        </div>

                        {/* Sections / Responsibilities if available */}
                        {/* Placeholder for future expansion */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        {(() => {
                            // Resolve contact: parent directorate -> ministry settings -> translation fallback
                            const loc = (obj: any, field: string): string => {
                                const val = obj?.[field];
                                if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
                                    return (language in val && val[language]) ? val[language] : val['ar'] || '';
                                }
                                const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
                                const en = obj?.[`${field}_en`] || '';
                                return language === 'en' && en ? en : ar;
                            };

                            const contactAddress = loc(parentDirectorate, 'address')
                                || (parentDirectorate as any)?.contact?.address
                                || (language === 'ar'
                                    ? (ministryContact.contact_address_ar || t('directorate_address'))
                                    : (ministryContact.contact_address_en || t('directorate_address')));
                            const contactPhone = parentDirectorate?.phone
                                || (parentDirectorate as any)?.contact?.phone
                                || ministryContact.contact_phone
                                || t('directorate_phone');
                            const contactEmail = parentDirectorate?.email
                                || (parentDirectorate as any)?.contact?.email
                                || ministryContact.contact_email
                                || t('directorate_email');
                            const contactWorkingHours = (language === 'ar'
                                ? (parentDirectorate?.working_hours_ar || ministryContact.contact_working_hours_ar)
                                : (parentDirectorate?.working_hours_en || ministryContact.contact_working_hours_en))
                                || '';

                            return (
                        <div className="bg-white dark:bg-dm-surface rounded-3xl p-6 shadow-sm border border-gov-gold/10 sticky top-24">
                            <h3 className="text-lg font-bold text-gov-forest dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                                {t('directorate_contact')}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gov-beige/50 dark:bg-white/5 flex items-center justify-center text-gov-teal shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gov-sand font-bold uppercase block mb-1">{t('contact_headquarters')}</span>
                                        <p className="text-sm text-gov-charcoal dark:text-white font-medium">{contactAddress}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gov-beige/50 dark:bg-white/5 flex items-center justify-center text-gov-teal shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gov-sand font-bold uppercase block mb-1">{t('contact_info')}</span>
                                        <p className="text-sm text-gov-charcoal dark:text-white font-medium dir-ltr">
                                            <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="hover:text-gov-teal transition-colors text-lg font-bold">
                                                {contactPhone}
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gov-beige/50 dark:bg-white/5 flex items-center justify-center text-gov-teal shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gov-sand font-bold uppercase block mb-1">{t('contact_email_label')}</span>
                                        <p className="text-sm text-gov-charcoal dark:text-white font-medium">
                                            <a href={`mailto:${contactEmail}`} className="hover:text-gov-teal transition-colors">
                                                {contactEmail}
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gov-beige/50 dark:bg-white/5 flex items-center justify-center text-gov-teal shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gov-sand font-bold uppercase block mb-1">{t('directorate_hours')}</span>
                                        {contactWorkingHours ? (
                                            <p className="text-sm text-gov-charcoal dark:text-white font-medium">{contactWorkingHours}</p>
                                        ) : (
                                            <>
                                                <p className="text-sm text-gov-charcoal dark:text-white font-medium">{t('directorate_hours_sun_thu')}</p>
                                                <p className="text-xs text-gov-charcoal/60 dark:text-white/60 mt-1">{t('directorate_hours_value')}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-gov-teal text-white rounded-xl hover:bg-gov-emerald transition-colors font-bold shadow-lg shadow-gov-teal/20">
                                {t('contact_us')}
                            </button>
                        </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubDirectorateDetail;

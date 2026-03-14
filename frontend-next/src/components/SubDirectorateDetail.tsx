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
import Link from 'next/link';
import { useBreadcrumb } from '@/contexts/BreadcrumbContext';
import Image from 'next/image';

const SubDirectorateDetail = () => {
    const { id, subId } = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const { setLabel, clearLabel } = useBreadcrumb();
    const isAr = language === 'ar';
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

    // Set breadcrumb labels to actual directorate names
    React.useEffect(() => {
        if (parentDirectorate && id) {
            const parentName = isAr
                ? (parentDirectorate.name_ar || parentDirectorate.name)
                : (parentDirectorate.name_en || parentDirectorate.name_ar || parentDirectorate.name);
            if (parentName) setLabel("/directorates/" + id, parentName);
        }
        if (subDirectorate && id && subId) {
            const subName = isAr
                ? (subDirectorate.name_ar || subDirectorate.name)
                : (subDirectorate.name_en || subDirectorate.name_ar || subDirectorate.name);
            if (subName) setLabel("/directorates/" + id + "/" + subId, subName);
        }
        return () => {
            if (id) clearLabel("/directorates/" + id);
            if (id && subId) clearLabel("/directorates/" + id + "/" + subId);
        };
    }, [parentDirectorate, subDirectorate, id, subId, isAr, setLabel, clearLabel]);

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
                <h2 className="text-lg md:text-2xl font-bold mb-2">{t('ui_no_results')}</h2>
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
            <div className="bg-gov-forest dark:bg-gov-charcoal text-white pt-32 pb-12 relative overflow-hidden">
                {/* Background Pattern */}
                                {/* Cover Image - use cover_image if available, else fall back to parent directorate logo */}
                {(() => {
                    const coverSrc = (subDirectorate as any)?.cover_image
                        || (parentDirectorate as any)?.cover_image
                        || parentDirectorate?.logo;
                    if (!coverSrc) return null;
                    // Build full URL: if relative /storage path, prepend backend URL
                    const imgSrc = coverSrc.startsWith('http') ? coverSrc
                        : coverSrc.startsWith('/storage') ? (process.env.NEXT_PUBLIC_BACKEND_URL || '') + coverSrc
                        : coverSrc;
                    return (
                        <Image
                            src={imgSrc}
                            alt={name}
                            fill
                            className="object-cover opacity-30"
                            priority
                            unoptimized
                        />
                    );
                })()}
                <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-10 pointer-events-none mix-blend-overlay"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-row items-start md:items-center gap-4 md:gap-6">
                        <Link
                            href="/directorates"
                            className="p-2 md:p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm flex-shrink-0 self-start mt-1 md:mt-0"
                        >
                            <ChevronLeft size={24} className={isAr ? "rotate-180" : ""} />
                        </Link>

                        <div className="flex-1">
                            <div className="text-gov-gold text-sm sm:text-base font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Building2 size={18} className="flex-shrink-0" />
                                <Link href={`/directorates/${id}`} className="hover:underline">
                                    {parentName}
                                </Link>
                            </div>
                            <h1 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-display font-bold mb-4">{name}</h1>
                        </div>

                        {/* Navigation arrows between sibling sub-directorates */}
                        {parentDirectorate?.subDirectorates && parentDirectorate.subDirectorates.length > 1 && (() => {
                            const subs = parentDirectorate.subDirectorates.filter(s => !s.isExternal);
                            const currentIndex = subs.findIndex(s => s.id === subId);
                            if (currentIndex === -1) return null;
                            const prevSub = currentIndex > 0 ? subs[currentIndex - 1] : null;
                            const nextSub = currentIndex < subs.length - 1 ? subs[currentIndex + 1] : null;
                            return (
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {prevSub ? (
                                        <Link
                                            href={`/directorates/${id}/${prevSub.id}`}
                                            className="p-1 md:p-2 md:bg-white/10 md:rounded-lg md:hover:bg-white/20 transition-colors md:backdrop-blur-sm text-white/70 hover:text-white"
                                            title={typeof prevSub.name === 'string' ? prevSub.name : (isAr ? prevSub.name.ar : prevSub.name.en)}
                                        >
                                            <ArrowRight size={16} className={`md:w-5 md:h-5 ${isAr ? '' : 'rotate-180'}`} />
                                        </Link>
                                    ) : (
                                        <div className="p-1 md:p-2 opacity-30 cursor-not-allowed">
                                            <ArrowRight size={16} className={`md:w-5 md:h-5 ${isAr ? '' : 'rotate-180'}`} />
                                        </div>
                                    )}
                                    <span className="text-white/50 text-xs">
                                        {currentIndex + 1}/{subs.length}
                                    </span>
                                    {nextSub ? (
                                        <Link
                                            href={`/directorates/${id}/${nextSub.id}`}
                                            className="p-1 md:p-2 md:bg-white/10 md:rounded-lg md:hover:bg-white/20 transition-colors md:backdrop-blur-sm text-white/70 hover:text-white"
                                            title={typeof nextSub.name === 'string' ? nextSub.name : (isAr ? nextSub.name.ar : nextSub.name.en)}
                                        >
                                            <ArrowRight size={16} className={`md:w-5 md:h-5 ${isAr ? 'rotate-180' : ''}`} />
                                        </Link>
                                    ) : (
                                        <div className="p-1 md:p-2 opacity-30 cursor-not-allowed">
                                            <ArrowRight size={16} className={`md:w-5 md:h-5 ${isAr ? 'rotate-180' : ''}`} />
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
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
                                <h3 className="text-lg font-bold text-gov-forest dark:text-white flex items-center gap-3">
                                    <FileText className="text-gov-teal dark:text-gov-gold" />
                                    {t('about_portal') || (isAr ? "نبذة عامة" : "Overview")}
                                </h3>
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-gov-charcoal/80 dark:text-white/80 leading-relaxed">
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
                            // Resolve contact: sub-directorate -> parent directorate -> ministry settings -> translation fallback
                            const loc = (obj: any, field: string): string => {
                                const val = obj?.[field];
                                if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
                                    return (language in val && val[language]) ? val[language] : val['ar'] || '';
                                }
                                const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
                                const en = obj?.[`${field}_en`] || '';
                                return language === 'en' && en ? en : ar;
                            };

                            const contactAddress = loc(subDirectorate, 'address')
                                || loc(parentDirectorate, 'address')
                                || (parentDirectorate as any)?.contact?.address
                                || (language === 'ar'
                                    ? (ministryContact.contact_address_ar || t('directorate_address'))
                                    : (ministryContact.contact_address_en || t('directorate_address')));
                            const contactPhone = subDirectorate?.phone
                                || parentDirectorate?.phone
                                || (parentDirectorate as any)?.contact?.phone
                                || ministryContact.contact_phone
                                || t('directorate_phone');
                            const contactEmail = subDirectorate?.email
                                || parentDirectorate?.email
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
                                        <p className="text-sm text-gov-charcoal dark:text-white font-medium" dir="ltr" style={{ direction: "ltr", unicodeBidi: "embed" }}>
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

'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Service, Directorate } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    Loader2,
    ChevronRight,
    ChevronLeft,
    Clock,
    FileText,
    ExternalLink,
    CheckCircle,
    Building,
    Monitor,
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
    Factory
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
    const { language } = useLanguage();
    const [service, setService] = useState<Service | null>(null);
    const [directorate, setDirectorate] = useState<Directorate | null>(null);
    const [loading, setLoading] = useState(true);

    const iconMap: Record<string, React.ReactNode> = {
        ShieldAlert: <ShieldAlert size={40} />,
        Scale: <Scale size={40} />,
        HeartPulse: <HeartPulse size={40} />,
        BookOpen: <BookOpen size={40} />,
        GraduationCap: <GraduationCap size={40} />,
        Zap: <Zap size={40} />,
        Droplets: <Droplets size={40} />,
        Plane: <Plane size={40} />,
        Wifi: <Wifi size={40} />,
        Banknote: <Banknote size={40} />,
        Map: <Map size={40} />,
        Factory: <Factory size={40} />
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const s = await API.services.getById(params.id);
                if (s) {
                    setService(s);
                    const d = await API.directorates.getById(s.directorateId);
                    setDirectorate(d);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-gov-teal" size={40} />
                </main>
                <Footer />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                    <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                        {language === 'ar' ? 'الخدمة غير موجودة' : 'Service Not Found'}
                    </h1>
                    <Link href="/services" className="text-gov-teal dark:text-gov-gold font-bold hover:underline">
                        {language === 'ar' ? 'العودة لدليل الخدمات' : 'Back to Services Guide'}
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
            <Navbar />
            <main className="flex-grow pt-20">
                <div className="bg-gov-forest text-white py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
                        >
                            {language === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            {language === 'ar' ? 'العودة لدليل الخدمات' : 'Back to Services Guide'}
                        </Link>

                        <div className="flex flex-col md:flex-row items-start gap-8">
                            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gov-gold border border-white/20">
                                {directorate ? iconMap[directorate.icon] : <Building size={40} />}
                            </div>
                            <div className="flex-1">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold mb-4 inline-block">
                                    {directorate?.name}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                                    {service.title}
                                </h1>
                                <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                {service.isDigital ? (
                                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-400 font-bold flex items-center gap-2">
                                        <Monitor size={20} />
                                        {language === 'ar' ? 'خدمة رقمية' : 'Digital Service'}
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-2xl text-orange-400 font-bold flex items-center gap-2">
                                        <Building size={20} />
                                        {language === 'ar' ? 'خدمة حضورية' : 'In-Person Service'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-12">
                            <section>
                                <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-6 border-r-4 border-gov-gold pr-4">
                                    {language === 'ar' ? 'حول الخدمة' : 'About the Service'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                    {language === 'ar'
                                        ? "هذه الخدمة تتيح للمواطنين والمقيمين إنجاز المعاملات المتعلقة بوزارة الاقتصاد والتجارة الخارجية بكفاءة عالية. تهدف الحكومة من خلال توفير هذه الخدمات إلكترونياً إلى تبسيط الإجراءات وتقليل الوقت والجهد المطلجين."
                                        : "This service allows citizens and residents to complete transactions related to the Ministry of Economy and Foreign Trade efficiently. The government aims to simplify procedures and reduce the time and effort required by providing these services electronically."}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-6 border-r-4 border-gov-gold pr-4">
                                    {language === 'ar' ? 'المتطلبات والوثائق' : 'Requirements & Documents'}
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        language === 'ar' ? "الهوية الشخصية السورية أو جواز السفر الساري المفعول" : "Syrian National ID or valid Passport",
                                        language === 'ar' ? "صور شخصية حديثة ملونة عدد (2)" : "Recent color personal photos (2)",
                                        language === 'ar' ? "طلبات التقديم المعبأة مسبقاً (إن وجدت)" : "Pre-filled application forms (if any)",
                                        language === 'ar' ? "دفع الرسوم المقررة" : "Payment of designated fees"
                                    ].map((req, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                                            <CheckCircle className="text-green-500 mt-1" size={18} />
                                            <span className="text-gray-700 dark:text-gray-200">{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10">
                                <h3 className="font-bold text-gov-forest dark:text-white mb-6 flex items-center gap-2">
                                    <FileText size={20} className="text-gov-teal" />
                                    {language === 'ar' ? 'بيانات الخدمة' : 'Service Info'}
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500">{language === 'ar' ? 'الوقت المتوقع' : 'Est. Time'}</span>
                                        <span className="font-bold text-gov-charcoal dark:text-white flex items-center gap-1">
                                            <Clock size={14} className="text-gov-teal" />
                                            {language === 'ar' ? 'فوري' : 'Instant'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500">{language === 'ar' ? 'الرسوم' : 'Fees'}</span>
                                        <span className="font-bold text-gov-charcoal dark:text-white">
                                            {language === 'ar' ? 'مجانية' : 'Free'}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-8 py-4 bg-gov-teal hover:bg-gov-emerald text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gov-teal/20">
                                    {service.isDigital ? (
                                        <>
                                            <ExternalLink size={20} />
                                            {language === 'ar' ? 'بدء الخدمة إلكترونياً' : 'Start Digital Service'}
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={20} />
                                            {language === 'ar' ? 'حجز موعد حضوري' : 'Book Appointment'}
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="bg-gov-teal/5 dark:bg-gov-gold/5 p-6 rounded-3xl border border-gov-teal/10 dark:border-gov-gold/10">
                                <h3 className="font-bold text-gov-forest dark:text-white mb-4 flex items-center gap-2">
                                    <ShieldAlert size={20} className="text-gov-gold" />
                                    {language === 'ar' ? 'مساعدة' : 'Support'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    {language === 'ar'
                                        ? "إذا واجهت أي مشكلة أثناء التقديم، يرجى التواصل مع فريق الدعم الفني."
                                        : "If you encounter any issues during application, please contact our technical support team."}
                                </p>
                                <Link
                                    href="/complaints"
                                    className="text-gov-teal dark:text-gov-gold font-bold text-sm hover:underline"
                                >
                                    {language === 'ar' ? 'تقديم بلاغ عن مشكلة' : 'Report an Issue'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

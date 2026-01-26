'use client';

import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Save,
    Loader2,
    ChevronLeft,
    CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API } from '@/lib/repository';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { language } = useLanguage();
    const { user: authUser, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birth_date: '',
        governorate: '',
        password: '',
        password_confirmation: ''
    });

    const governorates = [
        'دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس',
        'دير الزور', 'الحسكة', 'الرقة', 'إدلب', 'درعا', 'السويداء', 'القنيطرة'
    ];

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (authUser) {
            setFormData({
                name: authUser.name || '',
                email: authUser.email || '',
                phone: authUser.phone || '',
                // @ts-ignore - birth_date added to Model but maybe not to User type yet
                birth_date: authUser.birth_date ? new Date(authUser.birth_date).toISOString().split('T')[0] : '',
                // @ts-ignore
                governorate: authUser.governorate || '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [authUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const updateData: any = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.password_confirmation;
            }

            await API.users.updateProfile(updateData);
            await refreshUser();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-gov-forest">
                <Loader2 className="animate-spin text-gov-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors">
            <Navbar onSearch={(q) => window.location.href = `/search?q=${encodeURIComponent(q)}`} />

            <main className="flex-grow pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                            {language === 'ar' ? 'الملف الشخصي' : 'User Profile'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'ar' ? 'إدارة معلوماتك الشخصية وإعدادات الأمان' : 'Manage your personal information and security settings'}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gov-gold/10">
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                                <CheckCircle size={20} />
                                <span className="font-bold">
                                    {language === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Profile updated successfully'}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                                <Shield size={20} />
                                <span className="font-bold">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Section 1: Basic Info */}
                            <div>
                                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
                                    <User size={20} className="text-gov-teal" />
                                    {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                            />
                                            <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="date"
                                                value={formData.birth_date}
                                                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                            />
                                            <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'المحافظة' : 'Governorate'}
                                        </label>
                                        <div className="relative group">
                                            <select
                                                value={formData.governorate}
                                                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all appearance-none"
                                            >
                                                <option value="">{language === 'ar' ? 'اختر المحافظة' : 'Select governorate'}</option>
                                                {governorates.map((gov) => (
                                                    <option key={gov} value={gov}>{gov}</option>
                                                ))}
                                            </select>
                                            <MapPin className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Security */}
                            <div>
                                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
                                    <Lock size={20} className="text-gov-teal" />
                                    {language === 'ar' ? 'الأمان وكلمة المرور' : 'Security & Password'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder={language === 'ar' ? 'اتركه فارغاً للاحتفاظ بالحالي' : 'Leave empty to keep current'}
                                                className="w-full py-3 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password_confirmation}
                                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                            />
                                            <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {isLoading ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer
                onIncreaseFont={() => { }}
                onDecreaseFont={() => { }}
                onToggleContrast={() => { }}
            />
        </div>
    );
}

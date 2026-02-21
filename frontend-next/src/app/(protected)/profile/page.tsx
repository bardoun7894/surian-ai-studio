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
    CheckCircle,
    Pencil,
    X,
    Send,
    KeyRound,
    Heart,
    ChevronDown,
    ArrowRight,
    ArrowLeft,
} from 'lucide-react';
import { Ticket, Favorite } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API } from '@/lib/repository';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PhoneInput from '@/components/ui/PhoneInput';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { language, t } = useLanguage();
    const { user: authUser, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Tabs & Complaints State
    const [activeTab, setActiveTab] = useState<'profile' | 'complaints' | 'favorites'>('profile');
    const [myComplaints, setMyComplaints] = useState<Ticket[]>([]);
    const [complaintsLoading, setComplaintsLoading] = useState(false);
    const [myFavorites, setMyFavorites] = useState<Favorite[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(false);

    // Email edit state
    const [emailEditMode, setEmailEditMode] = useState<'view' | 'input' | 'verify'>('view');
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        first_name: '',
        father_name: '',
        last_name: '',
        email: '',
        phone: '',
        birth_date: '',
        governorate: '',
        current_password: '',
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
                first_name: authUser.first_name || '',
                father_name: authUser.father_name || '',
                last_name: authUser.last_name || '',
                email: authUser.email || '',
                phone: authUser.phone || '',
                birth_date: authUser.birth_date ? new Date(authUser.birth_date).toISOString().split('T')[0] : '',
                governorate: authUser.governorate || '',
                current_password: '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [authUser]);

    useEffect(() => {
        const fetchComplaints = async () => {
            setComplaintsLoading(true);
            try {
                const data = await API.complaints.myComplaints();
                setMyComplaints(data);
            } catch (err) {
                console.error("Failed to fetch complaints:", err);
            } finally {
                setComplaintsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchComplaints();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (activeTab === 'favorites') {
                setFavoritesLoading(true);
                try {
                    const data = await API.favorites.list();
                    setMyFavorites(data);
                } catch (err) {
                    console.error("Failed to fetch favorites:", err);
                } finally {
                    setFavoritesLoading(false);
                }
            }
        };

        if (isAuthenticated && activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [isAuthenticated, activeTab]);

    const handleRequestEmailChange = async () => {
        if (!newEmail || !emailPassword) return;
        setEmailLoading(true);
        setEmailError(null);
        setEmailSuccess(null);
        try {
            const result = await API.users.requestEmailChange(newEmail, emailPassword);
            if (result.success) {
                setEmailEditMode('verify');
                setEmailSuccess(t('profile_email_verify_sent'));
            } else {
                setEmailError(result.message || t('error_generic'));
            }
        } catch {
            setEmailError(t('error_generic'));
        } finally {
            setEmailLoading(false);
        }
    };

    const handleVerifyEmailChange = async () => {
        if (!verificationCode || verificationCode.length !== 6) return;
        setEmailLoading(true);
        setEmailError(null);
        setEmailSuccess(null);
        try {
            const result = await API.users.verifyEmailChange(verificationCode);
            if (result.success) {
                setEmailSuccess(t('profile_email_updated'));
                setEmailEditMode('view');
                setNewEmail('');
                setEmailPassword('');
                setVerificationCode('');
                await refreshUser();
                setTimeout(() => setEmailSuccess(null), 5000);
            } else {
                setEmailError(result.message || t('twofa_invalid_code'));
            }
        } catch {
            setEmailError(t('error_generic'));
        } finally {
            setEmailLoading(false);
        }
    };

    const handleCancelEmailEdit = () => {
        setEmailEditMode('view');
        setNewEmail('');
        setEmailPassword('');
        setVerificationCode('');
        setEmailError(null);
        setEmailSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const updateData: any = { ...formData };
            if (!updateData.password) {
                delete updateData.current_password;
                delete updateData.password;
                delete updateData.password_confirmation;
            } else if (!updateData.current_password) {
                setError(language === 'ar' ? 'يجب إدخال كلمة المرور الحالية' : 'Current password is required');
                setIsLoading(false);
                return;
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
            <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-dm-bg">
                <Loader2 className="animate-spin text-gov-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors">
            <Navbar onSearch={(q) => window.location.href = `/search?q=${encodeURIComponent(q)}`} />

            <main className="flex-grow pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                            {language === 'ar' ? 'الملف الشخصي' : 'User Profile'}
                        </h1>
                        <p className="text-gray-500 dark:text-white/70">
                            {language === 'ar' ? 'إدارة معلوماتك الشخصية وإعدادات الأمان' : 'Manage your personal information and security settings'}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'profile'
                                ? 'bg-gov-teal text-white shadow-lg'
                                : 'bg-white dark:bg-gov-card/10 text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gov-border/15'
                                }`}
                        >
                            <User size={18} />
                            {language === 'ar' ? 'بياناتي' : 'My Info'}
                        </button>
                        <button
                            onClick={() => setActiveTab('complaints')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'complaints'
                                ? 'bg-gov-teal text-white shadow-lg'
                                : 'bg-white dark:bg-gov-card/10 text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gov-border/15'
                                }`}
                        >
                            <Shield size={18} />
                            {language === 'ar' ? 'شكاويّ' : 'My Complaints'}
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'favorites'
                                ? 'bg-gov-teal text-white shadow-lg'
                                : 'bg-white dark:bg-gov-card/10 text-gray-600 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gov-border/15'
                                }`}
                        >
                            <Heart size={18} />
                            {language === 'ar' ? 'المفضلة' : 'Favorites'}
                        </button>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white dark:bg-gov-card/10 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gov-border/15 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                    <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gov-border/15 flex items-center gap-2">
                                        <User size={20} className="text-gov-teal" />
                                        {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={formData.first_name}
                                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                    required
                                                />
                                                <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                {language === 'ar' ? 'اسم الأب' : 'Father Name'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={formData.father_name}
                                                    onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                    required
                                                />
                                                <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                {language === 'ar' ? 'الكنية' : 'Last Name'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={formData.last_name}
                                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                    required
                                                />
                                                <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                            </div>
                                        </div>

                                        {/* Email field - read-only with edit button */}
                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                                            </label>
                                            <div className="relative group flex gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        readOnly
                                                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-100 dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white cursor-default"
                                                    />
                                                    <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                </div>
                                                {emailEditMode === 'view' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setEmailEditMode('input')}
                                                        className="px-4 py-3 rounded-xl bg-gov-teal/10 text-gov-teal border border-gov-teal/20 hover:bg-gov-teal hover:text-white transition-all flex items-center gap-2 font-bold text-sm whitespace-nowrap"
                                                    >
                                                        <Pencil size={16} />
                                                        {t('profile_edit_email')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Email edit inline panel */}
                                        {emailEditMode !== 'view' && (
                                            <div className="md:col-span-2 bg-gov-teal/5 dark:bg-gov-teal/10 border border-gov-teal/20 rounded-2xl p-6 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-gov-charcoal dark:text-white flex items-center gap-2">
                                                        <Mail size={18} className="text-gov-teal" />
                                                        {t('profile_edit_email')}
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelEmailEdit}
                                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>

                                                {emailError && (
                                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold flex items-center gap-2">
                                                        <Shield size={16} />
                                                        {emailError}
                                                    </div>
                                                )}

                                                {emailSuccess && (
                                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold flex items-center gap-2">
                                                        <CheckCircle size={16} />
                                                        {emailSuccess}
                                                    </div>
                                                )}

                                                {emailEditMode === 'input' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                                {t('profile_new_email')}
                                                            </label>
                                                            <div className="relative group">
                                                                <input
                                                                    type="email"
                                                                    value={newEmail}
                                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                                    placeholder="new@example.com"
                                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                                    required
                                                                />
                                                                <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                                {t('profile_current_password')}
                                                            </label>
                                                            <div className="relative group">
                                                                <input
                                                                    type="password"
                                                                    value={emailPassword}
                                                                    onChange={(e) => setEmailPassword(e.target.value)}
                                                                    placeholder="********"
                                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                                    required
                                                                />
                                                                <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 pt-2">
                                                            <button
                                                                type="button"
                                                                onClick={handleRequestEmailChange}
                                                                disabled={emailLoading || !newEmail || !emailPassword}
                                                                className="px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg"
                                                            >
                                                                {emailLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                                                {emailLoading ? t('profile_sending') : t('profile_send_verification')}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelEmailEdit}
                                                                className="px-6 py-3 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                                                            >
                                                                {t('profile_cancel')}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                {emailEditMode === 'verify' && (
                                                    <>
                                                        <p className="text-sm text-gray-600 dark:text-white/70">
                                                            {t('profile_email_verify_sent')}
                                                        </p>
                                                        <div>
                                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                                {t('profile_verify_code')}
                                                            </label>
                                                            <div className="relative group">
                                                                <input
                                                                    type="text"
                                                                    value={verificationCode}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                                        setVerificationCode(val);
                                                                    }}
                                                                    placeholder={t('profile_verify_code_placeholder')}
                                                                    maxLength={6}
                                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all text-center text-2xl tracking-[0.5em] font-mono"
                                                                />
                                                                <KeyRound className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 pt-2">
                                                            <button
                                                                type="button"
                                                                onClick={handleVerifyEmailChange}
                                                                disabled={emailLoading || verificationCode.length !== 6}
                                                                className="px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg"
                                                            >
                                                                {emailLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                                                {emailLoading ? t('profile_verifying') : t('profile_verify_and_update')}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEmailEditMode('input');
                                                                    setVerificationCode('');
                                                                    setEmailError(null);
                                                                    setEmailSuccess(null);
                                                                }}
                                                                className="px-6 py-3 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all text-sm"
                                                            >
                                                                {t('profile_resend_code')}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelEmailEdit}
                                                                className="px-6 py-3 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                                                            >
                                                                {t('profile_cancel')}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 transition-all"
                                                />
                                                <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold transition-colors" size={20} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                                {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="date"
                                                    value={formData.birth_date}
                                                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 transition-all"
                                                />
                                                <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold transition-colors" size={20} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                                {language === 'ar' ? 'المحافظة' : 'Governorate'}
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    value={formData.governorate}
                                                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                                    className="w-full py-3 ltr:pl-12 ltr:pr-10 rtl:pr-12 rtl:pl-10 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 transition-all appearance-none"
                                                >
                                                    <option value="">{language === 'ar' ? 'اختر المحافظة' : 'Select governorate'}</option>
                                                    {governorates.map((gov) => (
                                                        <option key={gov} value={gov}>{gov}</option>
                                                    ))}
                                                </select>
                                                <MapPin className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold transition-colors pointer-events-none" size={20} />
                                                <ChevronDown className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Security */}
                                <div>
                                    <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gov-border/15 flex items-center gap-2">
                                        <Lock size={20} className="text-gov-teal" />
                                        {language === 'ar' ? 'الأمان وكلمة المرور' : 'Security & Password'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                                {language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.current_password}
                                                    onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                                    placeholder={language === 'ar' ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                                                    className="w-full py-3 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 transition-all"
                                                />
                                                <Lock className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold transition-colors" size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {language === 'ar' ? 'مطلوبة فقط عند تغيير كلمة المرور' : 'Required only when changing password'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                                {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder={language === 'ar' ? 'اتركه فارغاً للاحتفاظ بالحالي' : 'Leave empty to keep current'}
                                                    className={`w-full py-3 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white focus:outline-none transition-all
                                                        ${formData.password && formData.password.length >= 8
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : formData.password && formData.password.length > 0 && formData.password.length < 8
                                                                ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                                : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                        }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-teal transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password_confirmation}
                                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                                    className={`w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white focus:outline-none transition-all
                                                        ${formData.password_confirmation && formData.password_confirmation === formData.password && formData.password.length >= 8
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : formData.password_confirmation && formData.password_confirmation !== formData.password
                                                                ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                                : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                        }`}
                                                />
                                                <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold transition-colors" size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6 border-t border-gray-100 dark:border-gov-border/15 flex justify-end">
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
                    )}

                    {/* Complaints Tab */}
                    {activeTab === 'complaints' && (
                        <div className="bg-white dark:bg-gov-card/10 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gov-border/15 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gov-border/15 flex items-center gap-2">
                                <Shield size={20} className="text-gov-teal" />
                                {language === 'ar' ? 'شكاويّ' : 'My Complaints'}
                            </h3>

                            {complaintsLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="animate-spin text-gov-teal" size={32} />
                                </div>
                            ) : myComplaints.length > 0 ? (
                                <div className="space-y-4">
                                    {myComplaints.map((complaint) => (
                                        <div key={complaint.id} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gov-border/15 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold text-gov-charcoal dark:text-white">
                                                        {complaint.tracking_number || complaint.id}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        complaint.status === 'validated' || complaint.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            complaint.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                        {complaint.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-white/70 line-clamp-2">
                                                    {complaint.description || complaint.title || (language === 'ar' ? 'لا يوجد تفاصيل' : 'No details available')}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-white/50">
                                                    <span>{complaint.created_at || complaint.lastUpdate || ''}</span>
                                                    {complaint.directorate && (
                                                        <span>• {complaint.directorate}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => router.push(`/complaints?track=${complaint.tracking_number || complaint.id}`)}
                                                    className="w-full md:w-auto px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 rounded-lg text-sm font-bold text-gov-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 dark:text-white/50">
                                    <Shield size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>{language === 'ar' ? 'لا يوجد شكاوى مسجلة' : 'No complaints found'}</p>
                                    <button
                                        onClick={() => router.push('/complaints')}
                                        className="mt-4 px-6 py-2 bg-gov-teal/10 text-gov-teal rounded-lg font-bold hover:bg-gov-teal hover:text-white transition-all flex items-center gap-2"
                                    >
                                        {language === 'ar' ? 'تقديم شكوى جديدة' : 'Submit New Complaint'}
                                        {language === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div className="bg-white dark:bg-gov-card/10 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gov-border/15 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-gov-border/15 flex items-center gap-2">
                                <Heart size={20} className="text-gov-teal fill-gov-teal" />
                                {language === 'ar' ? 'المفضلة' : 'Favorites'}
                            </h3>

                            {favoritesLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="animate-spin text-gov-teal" size={32} />
                                </div>
                            ) : myFavorites.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myFavorites.map((fav) => (
                                        <div key={fav.id} className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-gov-border/15 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                            {/* Image if available in metadata */}
                                            {fav.metadata?.image && (
                                                <div className="h-40 overflow-hidden">
                                                    <img
                                                        src={fav.metadata.image}
                                                        alt={fav.metadata.title || 'Favorite item'}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <span className="px-2 py-1 rounded-lg bg-gov-teal/10 text-gov-teal text-xs font-bold uppercase">
                                                        {(() => {
                                                            const labels: Record<string, string> = {
                                                                news: language === 'ar' ? 'أخبار' : 'News',
                                                                announcement: language === 'ar' ? 'إعلان' : 'Announcement',
                                                                service: language === 'ar' ? 'خدمة' : 'Service',
                                                                services: language === 'ar' ? 'خدمة' : 'Service',
                                                                law: language === 'ar' ? 'قانون' : 'Law',
                                                                decree: language === 'ar' ? 'مرسوم' : 'Decree',
                                                                decrees: language === 'ar' ? 'مرسوم' : 'Decree',
                                                            };
                                                            return labels[fav.content_type] || fav.content_type;
                                                        })()}
                                                    </span>
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (confirm(language === 'ar' ? 'هل أنت متأكد من إزالة هذا العنصر من المفضلة؟' : 'Are you sure you want to remove this item from favorites?')) {
                                                                await API.favorites.remove(fav.content_type, fav.content_id);
                                                                setMyFavorites(prev => prev.filter(f => f.id !== fav.id));
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                    >
                                                        <Heart size={18} className="fill-current" />
                                                    </button>
                                                </div>

                                                <h4 className="font-bold text-gov-charcoal dark:text-white mb-2 line-clamp-2">
                                                    {fav.metadata?.title || (language === 'ar' ? 'عنصر مفضل' : 'Favorite Item')}
                                                </h4>

                                                {fav.metadata?.description && (
                                                    <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2 mb-4">
                                                        {fav.metadata.description}
                                                    </p>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        if (fav.metadata?.url) {
                                                            router.push(fav.metadata.url);
                                                        } else {
                                                            const routeMap: Record<string, string> = {
                                                                news: 'news',
                                                                announcement: 'announcements',
                                                                service: 'services',
                                                                services: 'services',
                                                                law: 'decrees',
                                                                decree: 'decrees',
                                                                decrees: 'decrees',
                                                            };
                                                            const route = routeMap[fav.content_type] || fav.content_type;
                                                            router.push(`/${route}/${fav.content_id}`);
                                                        }
                                                    }}
                                                    className="w-full mt-2 py-2 bg-gray-50 dark:bg-white/10 text-gov-charcoal dark:text-white rounded-lg text-sm font-bold hover:bg-gov-teal hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 dark:text-white/50">
                                    <Heart size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>{language === 'ar' ? 'قائمة المفضلة فارغة حالياً' : 'Your favorites list is currently empty'}</p>
                                    <p className="text-sm mt-2 max-w-md mx-auto">
                                        {language === 'ar'
                                            ? 'يمكنك إضافة الأخبار والخدمات والقرارات إلى المفضلة للوصول إليها بسرعة هنا.'
                                            : 'You can add news, services, and decrees to your favorites to access them quickly here.'}
                                    </p>
                                    <button
                                        onClick={() => router.push('/news')}
                                        className="mt-6 px-6 py-2 bg-gov-teal/10 text-gov-teal rounded-lg font-bold hover:bg-gov-teal hover:text-white transition-all"
                                    >
                                        {language === 'ar' ? 'تصفح الأخبار' : 'Browse News'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

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

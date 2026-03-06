import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Fingerprint,
  Shield,
  CheckCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewState } from '../types';

interface RegisterPageProps {
  onNavigate: (view: ViewState) => void;
  onLogin?: (user: { name: string; email: string }) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onLogin }) => {
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nationalId: '',
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    governorate: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const governorates = [
    'دمشق',
    'ريف دمشق',
    'حلب',
    'حمص',
    'حماة',
    'اللاذقية',
    'طرطوس',
    'دير الزور',
    'الحسكة',
    'الرقة',
    'إدلب',
    'درعا',
    'السويداء',
    'القنيطرة'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      // Simulate registration & auto-login
      const newUser = {
        name: formData.fullName || 'New User',
        email: formData.email
      };

      if (onLogin) {
        onLogin(newUser);
      } else {
        onNavigate('LOGIN');
      }
    }, 1500);
  };

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const steps = [
    { num: 1, title: t('reg_step_personal') },
    { num: 2, title: t('reg_step_contact') },
    { num: 3, title: t('reg_step_password') }
  ];

  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <img
            src="/assets/logo/Asset-14@3x.png"
            alt="Emblem"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-2">
            {t('auth_register_title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('auth_register_subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.num
                  ? 'bg-gov-gold text-gov-forest'
                  : currentStep === step.num
                    ? 'bg-gov-teal text-white'
                    : 'bg-gray-200 dark:bg-white/20 text-gray-500 dark:text-gray-400'
                  }`}>
                  {currentStep > step.num ? <CheckCircle size={20} /> : step.num}
                </div>
                <span className={`text-xs mt-1 ${currentStep >= step.num ? 'text-gov-teal dark:text-gov-gold' : 'text-gray-400'
                  }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 rounded ${currentStep > step.num ? 'bg-gov-gold' : 'bg-gray-200 dark:bg-white/20'
                  }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-white/5 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                {/* National ID */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('auth_national_id')} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      placeholder={t('auth_enter_national_id')}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                      required
                    />
                    <Fingerprint className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('reg_full_name')} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={t('reg_full_name_placeholder')}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                      required
                    />
                    <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('reg_birth_date')} *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal transition-colors"
                      required
                    />
                    <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* Governorate */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('reg_governorate')} *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.governorate}
                      onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal transition-colors appearance-none"
                      required
                    >
                      <option value="">{t('reg_select_governorate')}</option>
                      {governorates.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                    <MapPin className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('auth_email')} *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('auth_enter_email')}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                      required
                    />
                    <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('auth_phone')} *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('auth_enter_phone')}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                      required
                    />
                    <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t('reg_verification')}
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Password */}
            {currentStep === 3 && (
              <>
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('auth_password')} *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={t('reg_password_placeholder')}
                      className="w-full py-3 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                      required
                      minLength={8}
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('reg_confirm_password')} *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder={t('reg_reenter_password')}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                      required
                    />
                    <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl space-y-2">
                  <p className="text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                    {t('reg_password_requirements')}
                  </p>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className={formData.password.length >= 8 ? 'text-gov-emeraldLight' : 'text-gray-300'} />
                      {t('reg_password_length')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className={/[A-Z]/.test(formData.password) ? 'text-gov-emeraldLight' : 'text-gray-300'} />
                      {t('reg_password_uppercase')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className={/[0-9]/.test(formData.password) ? 'text-gov-emeraldLight' : 'text-gray-300'} />
                      {t('reg_password_number')}
                    </li>
                  </ul>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-gov-teal focus:ring-gov-teal"
                    required
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('reg_agree_terms')}
                  </span>
                </label>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  {t('reg_previous')}
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-4 bg-gov-gold text-gov-forest font-bold rounded-xl hover:bg-gov-sand transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : currentStep < 3 ? (
                  <>
                    {t('reg_next')}
                    <ArrowIcon size={18} />
                  </>
                ) : (
                  <>
                    {t('reg_create')}
                    <ArrowIcon size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500 dark:text-gray-400">
            <Shield size={14} className="text-gov-emeraldLight" />
            {t('reg_protected')}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-gray-500 dark:text-gray-400">
            {t('reg_already_account')}
          </span>
          <button
            onClick={() => onNavigate('LOGIN')}
            className="text-gov-teal font-bold hover:underline mr-2 rtl:mr-0 rtl:ml-2"
          >
            {t('auth_sign_in_btn')}
          </button>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <button
            onClick={() => onNavigate('HOME')}
            className="text-gray-500 dark:text-gray-400 hover:text-gov-teal transition-colors text-sm"
          >
            {t('reg_back_home')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

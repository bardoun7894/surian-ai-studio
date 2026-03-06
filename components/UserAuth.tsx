import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserAuthProps {
  onBack: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

const UserAuth: React.FC<UserAuthProps> = ({ onBack, onLoginSuccess }) => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    nationalId: ''
  });

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (mode === 'login') {
      // Simulate login
      if (formData.email && formData.password) {
        onLoginSuccess({ name: formData.fullName || 'مستخدم', email: formData.email });
      } else {
        setError(language === 'ar' ? 'يرجى تعبئة جميع الحقول' : 'Please fill all fields');
      }
    } else if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError(language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      } else {
        setSuccess(language === 'ar' ? 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول' : 'Account created! You can now login');
        setMode('login');
      }
    } else if (mode === 'forgot') {
      setSuccess(language === 'ar' ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك' : 'Password reset link sent to your email');
    }

    setIsLoading(false);
  };

  const inputClasses = "w-full py-4 px-12 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-gov-teal dark:focus:border-gov-gold outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pt-8 pb-20 transition-colors">
      <div className="max-w-md mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gov-teal dark:text-gov-gold hover:underline mb-8 font-medium"
        >
          <BackArrow size={18} />
          <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        {/* Auth Card */}
        <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/10">

          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/assets/logo/Asset-14@3x.png"
              alt="Logo"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white">
              {mode === 'login' && (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
              {mode === 'register' && (language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account')}
              {mode === 'forgot' && (language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {mode === 'login' && (language === 'ar' ? 'أدخل بياناتك للوصول لخدماتك' : 'Enter your credentials to access services')}
              {mode === 'register' && (language === 'ar' ? 'سجل الآن للاستفادة من الخدمات الإلكترونية' : 'Register to access e-government services')}
              {mode === 'forgot' && (language === 'ar' ? 'أدخل بريدك لإرسال رابط الاستعادة' : 'Enter your email to receive reset link')}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3 text-green-700 dark:text-green-400">
              <CheckCircle size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name - Register Only */}
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>
            )}

            {/* National ID - Register Only */}
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'الرقم الوطني' : 'National ID'}
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
                required
              />
            </div>

            {/* Phone - Register Only */}
            {mode === 'register' && (
              <div className="relative">
                <Phone className="absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>
            )}

            {/* Password */}
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={inputClasses}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {/* Confirm Password - Register Only */}
            {mode === 'register' && (
              <div className="relative">
                <Lock className="absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>
            )}

            {/* Forgot Password Link */}
            {mode === 'login' && (
              <div className="text-left rtl:text-right">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                  className="text-sm text-gov-teal dark:text-gov-gold hover:underline"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {mode === 'login' && (language === 'ar' ? 'دخول' : 'Sign In')}
                  {mode === 'register' && (language === 'ar' ? 'إنشاء حساب' : 'Create Account')}
                  {mode === 'forgot' && (language === 'ar' ? 'إرسال الرابط' : 'Send Reset Link')}
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {mode === 'login' && (
              <>
                {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <button
                  onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
                  className="text-gov-teal dark:text-gov-gold font-bold hover:underline"
                >
                  {language === 'ar' ? 'سجل الآن' : 'Register'}
                </button>
              </>
            )}
            {(mode === 'register' || mode === 'forgot') && (
              <>
                {language === 'ar' ? 'لديك حساب؟' : 'Already have an account?'}{' '}
                <button
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="text-gov-teal dark:text-gov-gold font-bold hover:underline"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </>
            )}
          </div>

        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          {language === 'ar'
            ? 'بياناتك محمية وفق أعلى معايير الأمان الحكومية'
            : 'Your data is protected with the highest government security standards'
          }
        </p>

      </div>
    </div>
  );
};

export default UserAuth;

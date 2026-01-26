'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Copy, Search, Mail, Phone } from 'lucide-react';
import { API } from '@/lib/repository';
import Link from 'next/link';

export default function SuggestionsForm() {
    const [formData, setFormData] = useState({
        name: '',
        jobTitle: '',
        email: '', // FR-55: Email for notifications
        phone: '', // FR-55: Phone for notifications
        description: '',
        files: [] as File[]
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState<string | null>(null); // FR-55: Store tracking number
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...newFiles].slice(0, 5) // Max 5 files
            }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name || !formData.description) {
            setError('يرجى ملء الحقول الإلزامية');
            setLoading(false);
            return;
        }

        try {
            const result = await API.suggestions.submit(formData);
            // FR-55: Capture tracking number from response (API may return snake_case or camelCase)
            setTrackingNumber(result.trackingNumber || (result as any).tracking_number || null);
            setSuccess(true);
            setFormData({ name: '', jobTitle: '', email: '', phone: '', description: '', files: [] });
        } catch (err) {
            setError('حدث خطأ أثناء إرسال المقترح. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    // FR-55: Copy tracking number to clipboard
    const copyTrackingNumber = () => {
        if (trackingNumber) {
            navigator.clipboard.writeText(trackingNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // FR-55: Success state with tracking number display
    if (success) {
        return (
            <div className="bg-white dark:bg-gov-forest/50 rounded-2xl p-8 text-center border border-gov-gold/20 shadow-lg animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gov-forest dark:text-white mb-2">تم استلام مقترحك بنجاح</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">نشكرك على مساهمتك في تحسين خدماتنا. سيتم مراجعة مقترحك من قبل الفريق المختص.</p>

                {/* FR-55: Tracking Number Display */}
                {trackingNumber && (
                    <div className="bg-gov-beige/50 dark:bg-white/10 border border-gov-gold/30 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">رقم المتابعة الخاص بمقترحك:</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl font-bold font-mono text-gov-forest dark:text-gov-gold tracking-wider">
                                {trackingNumber}
                            </span>
                            <button
                                onClick={copyTrackingNumber}
                                className="p-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
                                title="نسخ رقم المتابعة"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            احتفظ بهذا الرقم لمتابعة حالة مقترحك
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {/* FR-55: Link to track suggestion */}
                    {trackingNumber && (
                        <Link
                            href={`/suggestions/track?id=${trackingNumber}`}
                            className="px-6 py-2 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-lg hover:bg-gov-forest/90 dark:hover:bg-gov-gold/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Search size={18} />
                            متابعة المقترح
                        </Link>
                    )}
                    <button
                        onClick={() => { setSuccess(false); setTrackingNumber(null); }}
                        className="px-6 py-2 bg-gov-gold text-gov-forest font-bold rounded-lg hover:bg-gov-gold/90 transition-colors"
                    >
                        إرسال مقترح آخر
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gov-forest/50 rounded-2xl p-6 md:p-8 border border-gov-gold/20 shadow-lg">
            <h2 className="text-2xl font-bold text-gov-forest dark:text-gov-gold mb-6 border-b border-gov-gold/10 pb-4">
                شاركنا أفكارك
            </h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <X size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                            الاسم الكامل <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all"
                            placeholder="الاسم الثلاثي"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                            المسمى الوظيفي (اختياري)
                        </label>
                        <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all"
                            placeholder="مثال: مهندس برمجيات"
                        />
                    </div>
                </div>

                {/* FR-55: Contact fields for notifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                            البريد الإلكتروني (اختياري)
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all"
                                placeholder="example@email.com"
                            />
                            <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">لإرسال إشعارات عند تحديث حالة المقترح</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                            رقم الهاتف (اختياري)
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all"
                                placeholder="09xxxxxxxx"
                            />
                            <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                        تفاصيل المقترح <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all resize-none"
                        placeholder="اشرح مقترحك بالتفصيل..."
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                        المرفقات (اختياري)
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-gov-gold hover:bg-gov-gold/5 dark:hover:bg-gov-gold/10 transition-all duration-300 group shadow-sm hover:shadow-md"
                    >
                        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500 mb-1">اضغط لرفع ملفات أو قم بسحبها وإفلاتها هنا</p>
                        <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG (Max 5MB)</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                    </div>

                    {/* File List */}
                    {formData.files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {formData.files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
                                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gov-forest text-white font-bold py-4 rounded-xl hover:bg-gov-forest/90 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        <span>{loading ? 'جاري الإرسال...' : 'إرسال المقترح'}</span>
                    </button>
                </div>
            </div>
        </form>
    );
}

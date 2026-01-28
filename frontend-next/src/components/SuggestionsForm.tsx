'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Copy, Search, Mail, Phone, File } from 'lucide-react';
import { API } from '@/lib/repository';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface FileUploadState {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
}

export default function SuggestionsForm() {
    const { executeRecaptcha } = useRecaptcha();
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
    const [uploadProgress, setUploadProgress] = useState(0); // Track overall upload progress
    const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const allFiles = [...formData.files, ...newFiles].slice(0, 5); // Max 5 files
            setFormData(prev => ({
                ...prev,
                files: allFiles
            }));
            // Initialize file states for progress tracking
            setFileStates(allFiles.map(file => ({
                file,
                progress: 0,
                status: 'pending' as const
            })));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
        setFileStates(prev => prev.filter((_, i) => i !== index));
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
            // Execute reCAPTCHA v3
            const recaptchaToken = await executeRecaptcha('submit_suggestion');

            // Update file states to uploading
            if (formData.files.length > 0) {
                setFileStates(prev => prev.map(fs => ({ ...fs, status: 'uploading' as const })));
            }

            const result = await API.suggestions.submitWithProgress({ ...formData, recaptcha_token: recaptchaToken }, (progress) => {
                setUploadProgress(progress);
                // Update individual file progress
                setFileStates(prev => prev.map(fs => ({
                    ...fs,
                    progress,
                    status: progress === 100 ? 'completed' as const : 'uploading' as const
                })));
            });

            // FR-55: Capture tracking number from response (API may return snake_case or camelCase)
            const newTrackingNumber = result.trackingNumber || (result as any).tracking_number || null;
            setTrackingNumber(newTrackingNumber);
            setSuccess(true);
            setFormData({ name: '', jobTitle: '', email: '', phone: '', description: '', files: [] });
            setFileStates([]);
            setUploadProgress(0);

            // Show toast notification
            toast.success('تم استلام مقترحك بنجاح', {
                description: newTrackingNumber
                    ? `رقم المتابعة: ${newTrackingNumber}`
                    : 'نشكرك على مساهمتك في تحسين خدماتنا',
                duration: 8000,
            });
        } catch (err) {
            setError('حدث خطأ أثناء إرسال المقترح. يرجى المحاولة مرة أخرى.');
            toast.error('فشل إرسال المقترح', {
                description: 'يرجى المحاولة مرة أخرى',
            });
            // Mark files as error
            setFileStates(prev => prev.map(fs => ({ ...fs, status: 'error' as const })));
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

    // FR-55: Success modal overlay with tracking number display
    const SuccessModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gov-forest rounded-2xl p-8 text-center border border-gov-gold/20 shadow-2xl max-w-md w-full animate-slide-up">
                <div className="w-16 h-16 bg-gov-emerald/10 text-gov-emerald rounded-full flex items-center justify-center mx-auto mb-4">
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
                                {copied ? <Check size={18} className="text-gov-emerald" /> : <Copy size={18} className="text-gray-500" />}
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
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {success && <SuccessModal />}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gov-forest/50 rounded-2xl p-6 md:p-8 border border-gov-gold/20 shadow-lg">
                <h2 className="text-2xl font-bold text-gov-forest dark:text-gov-gold mb-6 border-b border-gov-gold/10 pb-4">
                    شاركنا أفكارك
                </h2>

                {error && (
                    <div className="bg-gov-cherry/10 text-gov-cherry p-4 rounded-lg mb-6 flex items-center gap-2 border border-gov-cherry/20">
                        <X size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                                الاسم الكامل <span className="text-gov-cherry">*</span>
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
                            تفاصيل المقترح <span className="text-gov-cherry">*</span>
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

                        {/* File List with Progress */}
                        {formData.files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {formData.files.map((file, idx) => {
                                    const fileState = fileStates[idx];
                                    const progress = fileState?.progress || 0;
                                    const status = fileState?.status || 'pending';

                                    return (
                                        <div
                                            key={`${file.name}-${idx}`}
                                            className="relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden"
                                        >
                                            {/* Progress bar background */}
                                            {status === 'uploading' && (
                                                <div
                                                    className="absolute inset-0 bg-gov-gold/10 dark:bg-gov-gold/20 transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            )}

                                            <div className="relative flex items-center justify-between p-3">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <File size={18} className="text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm truncate">{file.name}</span>
                                                </div>

                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    {status === 'uploading' && (
                                                        <div className="flex items-center gap-2">
                                                            <Loader2 size={14} className="animate-spin text-gov-gold" />
                                                            <span className="text-xs text-gov-gold font-bold">{progress}%</span>
                                                        </div>
                                                    )}
                                                    {status === 'completed' && (
                                                        <Check size={16} className="text-gov-emerald" />
                                                    )}

                                                    {!loading && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(idx)}
                                                            className="text-gov-cherry hover:bg-gov-cherry/10 p-1 rounded-full transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Overall Upload Progress */}
                        {loading && uploadProgress > 0 && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>جاري رفع الملفات...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gov-gold transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
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
        </>
    );
}

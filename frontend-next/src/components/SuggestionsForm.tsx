'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { API } from '@/lib/repository';

export default function SuggestionsForm() {
    const [formData, setFormData] = useState({
        name: '',
        jobTitle: '',
        description: '',
        files: [] as File[]
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
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
            await API.suggestions.submit(formData);
            setSuccess(true);
            setFormData({ name: '', jobTitle: '', description: '', files: [] });
        } catch (err) {
            setError('حدث خطأ أثناء إرسال المقترح. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white dark:bg-gov-forest/50 rounded-2xl p-8 text-center border border-gov-gold/20 shadow-lg animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gov-forest dark:text-white mb-2">تم استلام مقترحك بنجاح</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">نشكرك على مساهمتك في تحسين خدماتنا. سيتم مراجعة مقترحك من قبل الفريق المختص.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 bg-gov-gold text-gov-forest font-bold rounded-lg hover:bg-gov-gold/90 transition-colors"
                >
                    إرسال مقترح آخر
                </button>
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
                        className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-gov-gold transition-colors bg-gray-50 dark:bg-white/5"
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Search,
  Upload,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  History,
  ClipboardList,
  Loader2,
  User,
  Fingerprint,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Ticket } from '../types';
import { focusPulse } from '../animations';
import { useLanguage } from '../contexts/LanguageContext';
import { DIRECTORATES } from '../constants';
import { aiService, ComplaintAnalysis } from '../services/aiService';
import { API } from '../services/repository';

const ComplaintPortal: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Submission State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    dob: '',
    nationalId: '',
    email: '',
    phone: '',
    category: '',
    details: '',
    directorate: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<ComplaintAnalysis | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // OCR State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackNationalId, setTrackNationalId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Ticket | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    const inputs = formRef.current.querySelectorAll('input, textarea, select');
    inputs.forEach(el => focusPulse(el as any));
  }, [activeTab]);

  // Handlers
  const handleAIAnalyze = async () => {
    if (formData.details.length < 10) return;
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeComplaint(formData.details);
      if (result) {
        setAiSuggestion(result);
        // Auto-fill form based on AI
        setFormData(prev => ({
          ...prev,
          category: result.category,
          directorate: DIRECTORATES.find(d => d.name.includes(result.category))?.name || ''
        }));
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsOcrProcessing(true);

    try {
      const extractedText = await aiService.extractTextFromImage(file);

      if (extractedText) {
        setFormData(prev => ({
          ...prev,
          details: (prev.details ? prev.details + '\n\n' : '') + `[${t('complaint_extracted')}]: \n${extractedText}`
        }));
      }
    } catch (error) {
      console.error('OCR failed:', error);
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ticketId = await API.complaints.submit(formData);
      setSubmittedTicket(ticketId);
    } catch (e) {
      console.error("Submission failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setTrackError(null);
    setTrackingResult(null);

    try {
      const result = await API.complaints.track(trackId);
      if (result) {
        setTrackingResult(result);
      } else {
        setTrackError(t('complaint_not_found'));
      }
    } catch (e) {
      setTrackError(t('complaint_error'));
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return t('complaint_status_new');
      case 'in_progress': return t('complaint_status_in_progress');
      case 'resolved': return t('complaint_status_resolved');
      case 'rejected': return t('complaint_status_rejected');
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Tabs */}
      <div className="flex bg-white dark:bg-gov-emerald/10 p-1 rounded-2xl shadow-sm border border-gray-200 dark:border-gov-gold/20 mb-8 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'submit'
            ? 'bg-gov-teal text-white shadow-md'
            : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
        >
          {t('complaint_submit_tab')}
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'track'
            ? 'bg-gov-teal text-white shadow-md'
            : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
        >
          {t('complaint_track_tab')}
        </button>
      </div>

      <div className="bg-white dark:bg-gov-emerald/5 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gov-gold/20 overflow-hidden">

        {/* SUBMIT TAB */}
        {activeTab === 'submit' && !submittedTicket && (
          <div className="p-8 md:p-12 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('complaint_form_title')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('complaint_subtitle')}</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

              {/* Document Upload / OCR */}
              <div className="bg-gov-beige/50 dark:bg-white/5 border-2 border-dashed border-gov-gold/40 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {!selectedFile ? (
                  <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gov-emerald/20 flex items-center justify-center text-gov-teal shadow-sm">
                      <Upload size={24} />
                    </div>
                    <div>
                      <span className="block font-bold text-gov-charcoal dark:text-white text-sm">{t('complaint_ocr_upload')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('complaint_ocr_desc')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white dark:bg-gov-emerald/10 p-3 rounded-lg border border-gov-gold/20">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-gov-teal" />
                      <span className="text-sm font-bold text-gov-charcoal dark:text-white truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isOcrProcessing ? (
                        <span className="flex items-center gap-1 text-xs text-gov-gold font-bold">
                          <Loader2 size={12} className="animate-spin" />
                          {t('complaint_processing')}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                          <CheckCircle size={12} />
                          {t('complaint_extracted')}
                        </span>
                      )}
                      <button type="button" onClick={removeFile} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10">
                <h3 className="font-display font-bold text-gov-forest dark:text-white mb-4 text-base border-b border-gov-gold/20 dark:border-white/10 pb-2">{t('complaint_personal_info')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t('complaint_first_name')} <span className="text-gov-red">*</span></label>
                    <div className="relative">
                      <input
                        type="text" required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-teal outline-none transition-colors"
                      />
                      <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t('complaint_father_name')} <span className="text-gov-red">*</span></label>
                    <div className="relative">
                      <input
                        type="text" required
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-teal outline-none transition-colors"
                      />
                      <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t('complaint_last_name')} <span className="text-gov-red">*</span></label>
                    <div className="relative">
                      <input
                        type="text" required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-teal outline-none transition-colors"
                      />
                      <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t('complaint_national_id')} <span className="text-gov-red">*</span></label>
                    <div className="relative">
                      <input
                        type="text" required maxLength={11} minLength={11} placeholder={t('complaint_national_id_hint')}
                        value={formData.nationalId}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, nationalId: val });
                        }}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-teal outline-none font-mono transition-colors"
                      />
                      <Fingerprint className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t('complaint_dob')} <span className="text-gov-red">*</span></label>
                    <div className="relative">
                      <input
                        type="date" required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-teal outline-none transition-colors"
                      />
                      <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description with AI */}
              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">{t('complaint_details')} <span className="text-gov-red">*</span></label>
                <div className="relative">
                  <textarea
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    rows={6}
                    className="w-full p-4 rounded-xl bg-gov-beige dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all outline-none resize-none"
                    placeholder={t('complaint_placeholder')}
                  />
                  <button
                    type="button"
                    onClick={handleAIAnalyze}
                    disabled={isAnalyzing || formData.details.length < 10}
                    className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white dark:bg-gov-emerald border border-gov-gold/30 text-gov-charcoal dark:text-white text-xs font-bold shadow-sm flex items-center gap-2 hover:bg-gov-gold/10 disabled:opacity-50 transition-colors"
                  >
                    {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-gov-gold" />}
                    {isAnalyzing ? t('complaint_analyzing') : t('complaint_ai_analyze')}
                  </button>
                </div>
              </div>

              {/* AI Suggestion Box */}
              {aiSuggestion && (
                <div className="p-4 rounded-xl bg-gov-gold/5 border border-gov-gold/20 flex gap-4 animate-fade-in">
                  <div className="mt-1"><Sparkles className="text-gov-gold" size={20} /></div>
                  <div>
                    <h4 className="font-display font-bold text-gov-forest dark:text-white text-sm mb-1">{t('complaint_ai_result')}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{aiSuggestion.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-md bg-white dark:bg-gov-emerald/20 border border-gray-200 dark:border-gov-gold/20 text-xs text-gray-500 dark:text-gray-300">{t('complaint_priority')}: <span className="font-bold text-gov-teal">{aiSuggestion.priority}</span></span>
                      <span className="px-2 py-1 rounded-md bg-white dark:bg-gov-emerald/20 border border-gray-200 dark:border-gov-gold/20 text-xs text-gray-500 dark:text-gray-300">{t('complaint_category_ai')}: <span className="font-bold text-gov-teal">{aiSuggestion.category}</span></span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">{t('complaint_phone')} <span className="text-gov-red">*</span></label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all outline-none"
                    />
                    <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">{t('complaint_email')} <span className="text-gov-red">*</span></label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all outline-none"
                    />
                    <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">{t('complaint_directorate')}</label>
                  <div className="relative">
                    <select
                      value={formData.directorate}
                      onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
                      className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all outline-none appearance-none"
                    >
                      <option value="" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">{t('complaint_select_directorate')}</option>
                      {DIRECTORATES.map(d => (
                        <option key={d.id} value={d.name} className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <Building2 className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gov-forest text-white font-bold shadow-lg hover:bg-gov-teal transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  {isSubmitting ? t('complaint_sending') : t('complaint_submit')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SUCCESS STATE */}
        {submittedTicket && (
          <div className="p-12 text-center animate-fade-in flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('complaint_success')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">{t('complaint_success_desc')}</p>

            <div className="bg-gov-beige dark:bg-white/10 border-2 border-dashed border-gov-teal/30 p-6 rounded-xl mb-8 w-full max-w-sm">
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('complaint_ticket_number')}</span>
              <span className="block text-3xl font-display font-bold text-gov-teal tracking-wider">{submittedTicket}</span>
            </div>

            <button onClick={() => { setSubmittedTicket(null); setActiveTab('track'); }} className="text-gov-teal font-bold hover:underline">
              {t('complaint_track_now')}
            </button>
          </div>
        )}

        {/* TRACKING TAB */}
        {activeTab === 'track' && (
          <div className="p-8 md:p-12 animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('complaint_track_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400">{t('complaint_track_subtitle')}</p>
            </div>

            <form onSubmit={handleTrack} className="max-w-lg mx-auto mb-10 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t('complaint_ticket_label')}</label>
                <input
                  type="text"
                  placeholder={t('complaint_ticket_placeholder')}
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gov-beige dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{t('complaint_national_id_verify')}</label>
                <input
                  type="text"
                  placeholder={t('complaint_national_id_placeholder')}
                  value={trackNationalId}
                  onChange={(e) => setTrackNationalId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gov-beige dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-gov-forest text-white py-3 rounded-xl font-bold hover:bg-gov-teal transition-colors flex items-center justify-center gap-2">
                {isTracking ? <Loader2 className="animate-spin" /> : <Search />}
                <span>{t('complaint_search')}</span>
              </button>
              {trackError && <p className="text-red-500 text-sm mt-2 text-center">{trackError}</p>}
            </form>

            {trackingResult && (
              <div className="bg-white dark:bg-gov-emerald/10 border border-gray-100 dark:border-gov-gold/20 rounded-2xl p-6 shadow-lg animate-slide-up max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
                  <span className="font-bold text-gov-charcoal dark:text-white">{t('complaint_ticket_prefix')}{trackingResult.tracking_number || trackingResult.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trackingResult.status)}`}>
                    {getStatusLabel(trackingResult.status)}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-gray-400"><AlertCircle size={18} /></div>
                    <div>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('complaint_last_update')}</span>
                      <span className="text-sm font-medium text-gov-charcoal dark:text-white">
                        {trackingResult.updated_at ? new Date(trackingResult.updated_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  {trackingResult.description && (
                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                      <div className="mt-1 text-gray-400"><FileText size={18} /></div>
                      <div>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('admin_action')}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{trackingResult.description}</span>
                      </div>
                    </div>
                  )}
                </div>

                {trackingResult.responses && trackingResult.responses.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 animate-fade-in">
                    <h3 className="text-sm font-bold text-gov-forest dark:text-white mb-4">{t('complaint_responses')}</h3>
                    <div className="space-y-4">
                      {trackingResult.responses.map((response) => (
                        <div key={response.id} className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gov-forest dark:text-blue-100 text-sm">{response.user?.name || t('complaint_responses_subtitle')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(response.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap">{response.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ComplaintPortal;
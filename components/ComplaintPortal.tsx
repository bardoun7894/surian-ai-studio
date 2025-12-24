import React, { useState } from 'react';
import { Send, Search, AlertCircle, CheckCircle, Sparkles, FileText, Loader2 } from 'lucide-react';
import { COMPLAINT_CATEGORIES, DIRECTORATES } from '../constants';
import { analyzeComplaint, AIAnalysisResult } from '../services/geminiService';
import { Ticket } from '../types';

const ComplaintPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  
  // Submission State
  const [formData, setFormData] = useState({
    details: '',
    phone: '',
    category: '',
    directorate: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AIAnalysisResult | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Ticket | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Handlers
  const handleAIAnalyze = async () => {
    if (formData.details.length < 10) return;
    setIsAnalyzing(true);
    const result = await analyzeComplaint(formData.details);
    if (result) {
      setAiSuggestion(result);
      // Auto-fill form based on AI
      setFormData(prev => ({
        ...prev,
        category: result.category,
        directorate: DIRECTORATES.find(d => result.suggestedDirectorate.includes(d.name))?.name || result.suggestedDirectorate
      }));
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    const fakeTicketId = 'GOV-' + Math.floor(Math.random() * 100000);
    setSubmittedTicket(fakeTicketId);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    setTimeout(() => {
      setTrackingResult({
        id: trackId,
        status: 'in_progress',
        lastUpdate: '2024-05-20 10:30 AM',
        notes: 'الطلب قيد المراجعة من قبل القسم الفني.'
      });
      setIsTracking(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new': return 'جديد';
      case 'in_progress': return 'قيد المعالجة';
      case 'resolved': return 'تم الحل';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 mb-8 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'submit' ? 'bg-gov-emerald text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          تقديم شكوى جديدة
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'track' ? 'bg-gov-emerald text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          متابعة حالة الطلب
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        
        {/* SUBMIT TAB */}
        {activeTab === 'submit' && !submittedTicket && (
          <div className="p-8 md:p-12 animate-fade-in">
             <div className="text-center mb-10">
               <h2 className="text-2xl font-bold text-gov-charcoal mb-2">نموذج الشكاوى الموحد</h2>
               <p className="text-gray-500">سيتم التعامل مع بياناتك بسرية تامة وتوجيهها للجهة المعنية.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Description with AI */}
                <div>
                   <label className="block text-sm font-bold text-gov-charcoal mb-2">تفاصيل الشكوى <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <textarea 
                       required
                       value={formData.details}
                       onChange={(e) => setFormData({...formData, details: e.target.value})}
                       rows={5}
                       className="w-full p-4 rounded-xl bg-gov-beige border border-gray-200 focus:border-gov-emerald focus:ring-2 focus:ring-gov-emerald/20 transition-all outline-none resize-none"
                       placeholder="اشرح المشكلة بالتفصيل..."
                     />
                     <button
                        type="button" 
                        onClick={handleAIAnalyze}
                        disabled={isAnalyzing || formData.details.length < 10}
                        className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white border border-gov-gold/30 text-gov-charcoal text-xs font-bold shadow-sm flex items-center gap-2 hover:bg-gov-gold/10 disabled:opacity-50 transition-colors"
                     >
                        {isAnalyzing ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} className="text-gov-gold"/>}
                        {isAnalyzing ? 'جاري التحليل...' : 'تحليل ذكي'}
                     </button>
                   </div>
                </div>

                {/* AI Suggestion Box */}
                {aiSuggestion && (
                   <div className="p-4 rounded-xl bg-gov-gold/5 border border-gov-gold/20 flex gap-4 animate-fade-in">
                      <div className="mt-1"><Sparkles className="text-gov-gold" size={20} /></div>
                      <div>
                         <h4 className="font-bold text-gov-charcoal text-sm mb-1">نتيجة التحليل الذكي</h4>
                         <p className="text-xs text-gray-600 mb-2">{aiSuggestion.summary}</p>
                         <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-500">الأولوية: <span className="font-bold text-gov-emerald">{aiSuggestion.priority}</span></span>
                            <span className="px-2 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-500">التصنيف: <span className="font-bold text-gov-emerald">{aiSuggestion.category}</span></span>
                         </div>
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal mb-2">رقم الهاتف <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gov-beige border border-gray-200 focus:border-gov-emerald focus:ring-2 focus:ring-gov-emerald/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal mb-2">الجهة (اختياري)</label>
                    <select 
                      value={formData.directorate}
                      onChange={(e) => setFormData({...formData, directorate: e.target.value})}
                      className="w-full p-3 rounded-xl bg-gov-beige border border-gray-200 focus:border-gov-emerald focus:ring-2 focus:ring-gov-emerald/20 transition-all outline-none"
                    >
                      <option value="">-- اختر الجهة --</option>
                      {DIRECTORATES.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-4 rounded-xl bg-gov-emerald text-white font-bold shadow-lg hover:bg-gov-emerald/90 transition-all flex items-center justify-center gap-2">
                    <Send size={20} />
                    إرسال الشكوى
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
              <h2 className="text-2xl font-bold text-gov-charcoal mb-2">تم استلام طلبك بنجاح</h2>
              <p className="text-gray-500 mb-8 max-w-md">يرجى الاحتفاظ برقم التذكرة أدناه لمتابعة حالة الطلب. تم إرسال رسالة تأكيد لرقم هاتفك.</p>
              
              <div className="bg-gov-beige border-2 border-dashed border-gov-emerald/30 p-6 rounded-xl mb-8 w-full max-w-sm">
                 <span className="block text-xs text-gray-500 mb-1">رقم التذكرة</span>
                 <span className="block text-3xl font-display font-bold text-gov-emerald tracking-wider">{submittedTicket}</span>
              </div>

              <button onClick={() => {setSubmittedTicket(null); setActiveTab('track');}} className="text-gov-emerald font-bold hover:underline">
                متابعة الطلب الآن
              </button>
           </div>
        )}

        {/* TRACKING TAB */}
        {activeTab === 'track' && (
           <div className="p-8 md:p-12 animate-fade-in">
              <div className="text-center mb-10">
                 <h2 className="text-2xl font-bold text-gov-charcoal mb-2">متابعة الطلبات</h2>
                 <p className="text-gray-500">أدخل رقم التذكرة للاستعلام عن آخر المستجدات.</p>
              </div>

              <form onSubmit={handleTrack} className="max-w-md mx-auto mb-10">
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="مثال: GOV-12345"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="flex-1 p-3 rounded-xl bg-gov-beige border border-gray-200 focus:border-gov-emerald outline-none"
                    />
                    <button type="submit" className="bg-gov-charcoal text-white px-6 rounded-xl font-bold hover:bg-black transition-colors">
                       {isTracking ? <Loader2 className="animate-spin"/> : <Search />}
                    </button>
                 </div>
              </form>

              {trackingResult && (
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg animate-slide-up max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                       <span className="font-bold text-gov-charcoal">تذكرة #{trackingResult.id}</span>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trackingResult.status)}`}>
                         {getStatusLabel(trackingResult.status)}
                       </span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400"><AlertCircle size={18}/></div>
                          <div>
                             <span className="block text-xs text-gray-500 mb-1">آخر تحديث</span>
                             <span className="text-sm font-medium text-gov-charcoal">{trackingResult.lastUpdate}</span>
                          </div>
                       </div>
                       {trackingResult.notes && (
                         <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                            <div className="mt-1 text-gray-400"><FileText size={18}/></div>
                            <div>
                               <span className="block text-xs text-gray-500 mb-1">ملاحظات</span>
                               <span className="text-sm text-gray-700">{trackingResult.notes}</span>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
              )}
           </div>
        )}

      </div>
    </div>
  );
};

export default ComplaintPortal;
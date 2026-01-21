import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Calendar, Scale, Loader2 } from 'lucide-react';
import { API } from '../services/repository';
import { Decree } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const DecreesArchive: React.FC = () => {
   const { t, language } = useLanguage();
   const [searchTerm, setSearchTerm] = useState('');
   const [filterType, setFilterType] = useState<string>('all');
   const [decrees, setDecrees] = useState<Decree[]>([]);
   const [loading, setLoading] = useState(true);

   const DECREE_TYPES = [
      { id: 'مرسوم تشريعي', key: 'decrees_type_legislative' },
      { id: 'قانون', key: 'decrees_type_law' },
      { id: 'قرار رئاسي', key: 'decrees_type_presidential' },
      { id: 'تعميم', key: 'decrees_type_circular' }
   ];

   // Debounce search effect could be added here, but for now we fetch on filter change
   useEffect(() => {
      const fetchDecrees = async () => {
         setLoading(true);
         try {
            const data = await API.decrees.search(searchTerm, filterType);
            setDecrees(data);
         } catch (e) {
            console.error("Failed to fetch decrees", e);
         } finally {
            setLoading(false);
         }
      };

      // Use a timeout to debounce search input typing
      const timeoutId = setTimeout(() => {
         fetchDecrees();
      }, 500);

      return () => clearTimeout(timeoutId);
   }, [searchTerm, filterType]);

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in min-h-screen">

         {/* Header */}
         <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4 flex items-center justify-center gap-3">
               <Scale size={32} className="text-gov-gold" />
               {t('decrees_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
               {t('decrees_subtitle')}
            </p>
         </div>

         {/* Filters & Search */}
         <div className="bg-white dark:bg-gov-emerald/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gov-gold/20 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">

               <div className="relative flex-1 w-full">
                  <input
                     type="text"
                     placeholder={t('decrees_search_placeholder')}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-4 pr-12 rtl:pl-12 rtl:pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal focus:ring-1 focus:ring-gov-teal/20 transition-all outline-none"
                  />
                  <Search className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
               </div>

               <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  <button
                     onClick={() => setFilterType('all')}
                     className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${filterType === 'all' ? 'bg-gov-teal text-white border-gov-teal' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gov-gold/20 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                  >
                     {t('decrees_filter_all')}
                  </button>
                  {DECREE_TYPES.map(type => (
                     <button
                        key={type.id}
                        onClick={() => setFilterType(type.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${filterType === type.id ? 'bg-gov-teal text-white border-gov-teal' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gov-gold/20 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                     >
                        {t(type.key)}
                     </button>
                  ))}
               </div>

            </div>
         </div>

         {/* Results */}
         <div className="space-y-4">
            {loading ? (
               <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-gov-teal" size={32} />
               </div>
            ) : decrees.length === 0 ? (
               <div className="text-center py-16 bg-white dark:bg-gov-emerald/5 rounded-2xl border border-dashed border-gray-200 dark:border-gov-gold/30">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">{t('decrees_no_results')}</p>
               </div>
            ) : (
               decrees.map((decree) => (
                  <div key={decree.id} className="bg-white dark:bg-gov-emerald/5 p-6 rounded-2xl border border-gray-100 dark:border-gov-gold/10 hover:border-gov-gold/50 hover:shadow-lg transition-all duration-300 group">
                     <div className="flex flex-col md:flex-row gap-6 items-start">

                        {/* Icon Box */}
                        <div className="w-16 h-16 rounded-xl bg-gov-beige dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold shrink-0 border border-gray-100 dark:border-gov-gold/10 group-hover:bg-gov-forest group-hover:text-white transition-colors">
                           <FileText size={28} />
                        </div>

                        <div className="flex-1">
                           <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${decree.type === 'قانون' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                 decree.type === 'مرسوم تشريعي' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                    'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
                                 }`}>
                                 {t(DECREE_TYPES.find(d => d.id === decree.type)?.key || 'decrees_type_law')}
                              </span>
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">{t('decrees_number_label')} {decree.number}</span>
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">{t('decrees_year_label')} {decree.year}</span>
                           </div>

                           <h3 className="text-lg font-display font-bold text-gov-forest dark:text-white mb-2 group-hover:text-gov-teal transition-colors">
                              {decree.title}
                           </h3>
                           <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              {decree.description}
                           </p>

                           <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                 <Calendar size={14} />
                                 <span>{t('decrees_issue_date')} {new Date(decree.date).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US')}</span>
                              </div>
                           </div>
                        </div>

                        <div className="self-center md:self-start">
                           <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-beige dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold font-bold hover:bg-gov-forest hover:text-white transition-all text-sm border border-transparent hover:border-gov-forest">
                              <Download size={16} />
                              {t('decrees_download_pdf')}
                           </button>
                        </div>

                     </div>
                  </div>
               ))
            )}
         </div>

      </div>
   );
};

export default DecreesArchive;
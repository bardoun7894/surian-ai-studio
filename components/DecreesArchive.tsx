import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Calendar, Scale, Loader2 } from 'lucide-react';
import { API } from '../services/repository';
import { Decree } from '../types';

const DecreesArchive: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [loading, setLoading] = useState(true);

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
        <h2 className="text-3xl font-display font-bold text-gov-charcoal mb-4 flex items-center justify-center gap-3">
           <Scale size={32} className="text-gov-gold" />
           الجريدة الرسمية والتشريعات
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          البوابة الرسمية للوصول إلى كافة المراسيم التشريعية، القوانين، والقرارات الحكومية الصادرة في الجمهورية العربية السورية.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
         <div className="flex flex-col md:flex-row gap-4 items-center">
            
            <div className="relative flex-1 w-full">
               <input 
                 type="text" 
                 placeholder="بحث برقم المرسوم، السنة، أو العنوان..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gov-emerald focus:ring-1 focus:ring-gov-emerald/20 transition-all outline-none"
               />
               <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <button 
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${filterType === 'all' ? 'bg-gov-emerald text-white border-gov-emerald' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                  الكل
                </button>
                {['مرسوم تشريعي', 'قانون', 'قرار رئاسي', 'تعميم'].map(type => (
                   <button 
                     key={type}
                     onClick={() => setFilterType(type)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${filterType === type ? 'bg-gov-emerald text-white border-gov-emerald' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                   >
                     {type}
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
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
               <FileText size={48} className="mx-auto text-gray-300 mb-4" />
               <p className="text-gray-500">لا توجد وثائق مطابقة للبحث</p>
            </div>
         ) : (
            decrees.map((decree) => (
              <div key={decree.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gov-gold/50 hover:shadow-lg transition-all duration-300 group">
                 <div className="flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* Icon Box */}
                    <div className="w-16 h-16 rounded-xl bg-gov-beige flex items-center justify-center text-gov-emerald shrink-0 border border-gray-100 group-hover:bg-gov-emerald group-hover:text-white transition-colors">
                       <FileText size={28} />
                    </div>

                    <div className="flex-1">
                       <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                             decree.type === 'قانون' ? 'bg-blue-100 text-blue-700' : 
                             decree.type === 'مرسوم تشريعي' ? 'bg-purple-100 text-purple-700' :
                             'bg-gray-100 text-gray-700'
                          }`}>
                             {decree.type}
                          </span>
                          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded">رقم {decree.number}</span>
                          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded">عام {decree.year}</span>
                       </div>
                       
                       <h3 className="text-lg font-bold text-gov-charcoal mb-2 group-hover:text-gov-emerald transition-colors">
                          {decree.title}
                       </h3>
                       <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {decree.description}
                       </p>
                       
                       <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                             <Calendar size={14} />
                             <span>تاريخ الصدور: {decree.date}</span>
                          </div>
                       </div>
                    </div>

                    <div className="self-center md:self-start">
                       <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-beige text-gov-emerald font-bold hover:bg-gov-emerald hover:text-white transition-all text-sm border border-transparent hover:border-gov-emerald">
                          <Download size={16} />
                          تحميل PDF
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
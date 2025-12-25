import React, { useState } from 'react';
import { Database, Download, FileSpreadsheet, FileJson, FileText, Search, Filter } from 'lucide-react';

const OpenDataPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const datasets = [
    { id: 1, title: 'إحصائيات المدارس الحكومية 2023', category: 'التعليم', size: '2.4 MB', updated: '2024-03-15', format: 'CSV' },
    { id: 2, title: 'مواقع المراكز الصحية والمشافي', category: 'الصحة', size: '1.1 MB', updated: '2024-02-10', format: 'JSON' },
    { id: 3, title: 'الميزانية العامة للدولة 2024', category: 'المالية', size: '5.6 MB', updated: '2024-01-05', format: 'PDF' },
    { id: 4, title: 'توزع مشاريع الطاقة المتجددة', category: 'الطاقة', size: '800 KB', updated: '2024-04-20', format: 'CSV' },
    { id: 5, title: 'أعداد السياح والمنشآت السياحية', category: 'السياحة', size: '3.2 MB', updated: '2023-12-30', format: 'XLSX' },
    { id: 6, title: 'مؤشرات جودة الهواء في دمشق', category: 'البيئة', size: '15 MB', updated: 'يومياً', format: 'API' },
  ];

  const getIcon = (format: string) => {
    if (format === 'CSV' || format === 'XLSX') return <FileSpreadsheet className="text-green-600" />;
    if (format === 'JSON' || format === 'API') return <FileJson className="text-yellow-600" />;
    return <FileText className="text-red-600" />;
  };

  const filteredDatasets = datasets.filter(d => d.title.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gov-forest animate-fade-in pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gov-charcoal dark:text-white mb-4 flex items-center justify-center gap-3">
            <Database className="text-gov-teal" size={40} />
            منصة البيانات المفتوحة
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            تعزيزاً للشفافية والابتكار، تتيح الحكومة الوصول إلى مجموعة واسعة من البيانات الحكومية القابلة للمعالجة وإعادة الاستخدام مجاناً.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 mb-8">
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="بحث عن مجموعة بيانات..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-gov-teal outline-none text-gov-charcoal dark:text-white"
                 />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gov-charcoal dark:text-white hover:bg-gray-50 transition-colors">
                 <Filter size={18} />
                 <span>تصفية</span>
              </button>
           </div>
        </div>

        {/* Datasets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredDatasets.map(dataset => (
             <div key={dataset.id} className="bg-white dark:bg-gov-emerald/10 border border-gray-100 dark:border-white/5 rounded-2xl p-6 hover:shadow-lg hover:border-gov-teal/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                      {getIcon(dataset.format)}
                   </div>
                   <span className="px-3 py-1 bg-gov-beige dark:bg-white/5 text-gov-charcoal dark:text-white text-xs font-bold rounded-full">
                      {dataset.category}
                   </span>
                </div>
                
                <h3 className="font-bold text-lg text-gov-charcoal dark:text-white mb-2 group-hover:text-gov-teal transition-colors">
                   {dataset.title}
                </h3>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 space-y-1">
                   <p>الحجم: {dataset.size}</p>
                   <p>آخر تحديث: {dataset.updated}</p>
                   <p>الصيغة: <span className="font-mono font-bold">{dataset.format}</span></p>
                </div>

                <button className="w-full py-2.5 rounded-xl border border-gov-teal text-gov-teal font-bold text-sm hover:bg-gov-teal hover:text-white transition-all flex items-center justify-center gap-2">
                   <Download size={16} />
                   تحميل البيانات
                </button>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default OpenDataPage;
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const ComplaintsManager: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const complaints = [
    { id: 'GOV-2024-001', citizen: 'محمد الأحمد', dept: 'الإدارة العامة للصناعة', status: 'جديد', priority: 'عالية', date: '2024-05-20', subject: 'تأخر إصدار ترخيص صناعي' },
    { id: 'GOV-2024-002', citizen: 'سارة خليل', dept: 'الإدارة العامة للاقتصاد', status: 'قيد المعالجة', priority: 'متوسطة', date: '2024-05-19', subject: 'طلب إجازة استيراد' },
    { id: 'GOV-2024-003', citizen: 'خالد يوسف', dept: 'الإدارة العامة للتجارة الداخلية', status: 'تم الحل', priority: 'منخفضة', date: '2024-05-18', subject: 'شكوى غش تجاري' },
    { id: 'GOV-2024-004', citizen: 'منى زيدان', dept: 'الإدارة العامة للصناعة', status: 'مرفوض', priority: 'متوسطة', date: '2024-05-18', subject: 'طلب تخصيص أرض صناعية' },
    { id: 'GOV-2024-005', citizen: 'رامي سعيد', dept: 'الإدارة العامة للتجارة الداخلية', status: 'جديد', priority: 'طارئة', date: '2024-05-20', subject: 'مخالفة سعرية' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'جديد': return <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1 w-fit"><Clock size={12}/> جديد</span>;
      case 'قيد المعالجة': return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit"><Clock size={12}/> قيد المعالجة</span>;
      case 'تم الحل': return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle size={12}/> تم الحل</span>;
      case 'مرفوض': return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1 w-fit"><XCircle size={12}/> مرفوض</span>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'طارئة': return <span className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertTriangle size={12}/> طارئة</span>;
      case 'عالية': return <span className="text-xs font-bold text-orange-500">عالية</span>;
      case 'متوسطة': return <span className="text-xs font-bold text-blue-500">متوسطة</span>;
      case 'منخفضة': return <span className="text-xs font-bold text-gray-500">منخفضة</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header Actions */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
           {['الكل', 'القسم الخاص بي', 'عاجل', 'قيد المعالجة', 'مغلق'].map(tab => (
             <button 
               key={tab}
               onClick={() => setFilter(tab)}
               className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                 (filter === 'all' && tab === 'الكل') || filter === tab
                 ? 'bg-gov-emerald text-white' 
                 : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
        
        <div className="flex gap-2">
           <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث برقم التذكرة..." 
                className="pl-4 pr-10 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:border-gov-emerald"
              />
           </div>
           <button className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right">
           <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
              <tr>
                 <th className="px-6 py-4">رقم التذكرة</th>
                 <th className="px-6 py-4">المواطن</th>
                 <th className="px-6 py-4">الموضوع</th>
                 <th className="px-6 py-4">الجهة</th>
                 <th className="px-6 py-4">الأولوية</th>
                 <th className="px-6 py-4">الحالة</th>
                 <th className="px-6 py-4">التاريخ</th>
                 <th className="px-6 py-4">إجراءات</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {complaints.map((complaint) => (
                 <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-600 dark:text-gray-300">{complaint.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-white">{complaint.citizen}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{complaint.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{complaint.dept}</td>
                    <td className="px-6 py-4">{getPriorityBadge(complaint.priority)}</td>
                    <td className="px-6 py-4">{getStatusBadge(complaint.status)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{complaint.date}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="عرض التفاصيل">
                             <Eye size={16} />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
                             <MoreHorizontal size={16} />
                          </button>
                       </div>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500">
         <span>عرض 1-5 من أصل 45</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">السابق</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">التالي</button>
         </div>
      </div>
    </div>
  );
};

export default ComplaintsManager;
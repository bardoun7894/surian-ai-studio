import React from 'react';
import { Users, FileText, MessageSquare, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        {Math.abs(change)}%
      </div>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي المستخدمين" 
          value="12,543" 
          change={12.5} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="الشكاوى النشطة" 
          value="45" 
          change={-2.4} 
          icon={MessageSquare} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="المحتوى المنشور اليوم" 
          value="8" 
          change={5.2} 
          icon={FileText} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="جلسات المساعد الذكي" 
          value="1,203" 
          change={18.2} 
          icon={Activity} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area (Simulated) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">تحليل الشكاوى (آخر 7 أيام)</h3>
            <select className="bg-gray-50 dark:bg-gray-700 border-none text-sm rounded-lg p-2 outline-none">
              <option>هذا الأسبوع</option>
              <option>هذا الشهر</option>
            </select>
          </div>
          
          {/* Simple CSS Chart Simulation */}
          <div className="h-64 flex items-end justify-between gap-2 px-4">
             {[40, 65, 30, 85, 50, 75, 60].map((h, i) => (
               <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full max-w-[40px] bg-gov-emerald/10 dark:bg-gov-emerald/20 rounded-t-lg transition-all duration-300 group-hover:bg-gov-emerald h-full flex items-end">
                    <div 
                      style={{ height: `${h}%` }} 
                      className="w-full bg-gov-emerald rounded-t-lg relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'][i]}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
           <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-6">النشاط الحديث</h3>
           <div className="space-y-6">
              {[
                { type: 'complaint', text: 'شكوى جديدة: انقطاع مياه', time: 'منذ 10 دقائق', color: 'bg-amber-100 text-amber-600' },
                { type: 'user', text: 'تسجيل مستخدم جديد: أحمد س.', time: 'منذ 32 دقيقة', color: 'bg-blue-100 text-blue-600' },
                { type: 'content', text: 'نشر خبر: مرسوم رئاسي', time: 'منذ ساعة', color: 'bg-green-100 text-green-600' },
                { type: 'system', text: 'نسخ احتياطي للنظام', time: 'منذ 3 ساعات', color: 'bg-gray-100 text-gray-600' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                   <div className={`w-2 h-full min-h-[40px] rounded-full ${item.color.split(' ')[0]}`}></div>
                   <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.text}</p>
                      <span className="text-xs text-gray-400">{item.time}</span>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-6 py-2 text-sm text-gov-emerald font-bold border border-gov-emerald/20 rounded-xl hover:bg-gov-emerald hover:text-white transition-colors">
              عرض كل النشاطات
           </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Bot, 
  BarChart2, 
  Settings, 
  Bell, 
  Search, 
  LogOut,
  Menu,
  X,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ViewState } from '../../types';
import DashboardHome from './DashboardHome';
import ComplaintsManager from './ComplaintsManager';

interface DashboardLayoutProps {
  onNavigate: (view: ViewState) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onNavigate, toggleTheme, isDarkMode }) => {
  const { language, toggleLanguage } = useLanguage();
  const [activeModule, setActiveModule] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: 'home', label: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users },
    { id: 'content', label: 'إدارة المحتوى', icon: FileText },
    { id: 'complaints', label: 'الشكاوى', icon: MessageSquare },
    { id: 'ai', label: 'المساعد الذكي', icon: Bot },
    { id: 'reports', label: 'التقارير', icon: BarChart2 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'home': return <DashboardHome />;
      case 'complaints': return <ComplaintsManager />;
      default: return (
        <div className="flex items-center justify-center h-[60vh] text-gray-400">
           <div className="text-center">
             <Settings size={48} className="mx-auto mb-4 opacity-50" />
             <p className="text-xl font-bold">هذا القسم قيد التطوير</p>
           </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex text-gray-800 dark:text-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-gov-forest text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
           {/* Sidebar Header */}
           <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gov-gold font-bold text-xl">
                 S
              </div>
              <div>
                 <h1 className="font-bold text-lg leading-none">البوابة الحكومية</h1>
                 <span className="text-xs text-white/50">لوحة التحكم الإدارية</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="lg:hidden mr-auto text-white/70"
              >
                <X size={20} />
              </button>
           </div>

           {/* Navigation */}
           <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeModule === item.id 
                    ? 'bg-gov-emerald text-white font-bold shadow-lg' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                   <item.icon size={20} />
                   <span>{item.label}</span>
                </button>
              ))}
           </nav>

           {/* Sidebar Footer */}
           <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                 <div className="w-8 h-8 rounded-full bg-gov-gold flex items-center justify-center font-bold text-gov-forest">
                    AD
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">Admin User</p>
                    <p className="text-xs text-white/50 truncate">admin@gov.sy</p>
                 </div>
                 <button onClick={() => onNavigate('HOME')} title="تسجيل الخروج" className="text-white/70 hover:text-red-400">
                    <LogOut size={18} />
                 </button>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
         
         {/* Top Header */}
         <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-500">
                  <Menu size={24} />
               </button>
               <h2 className="font-bold text-xl text-gray-800 dark:text-white hidden sm:block">
                  {sidebarItems.find(i => i.id === activeModule)?.label}
               </h2>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
               <div className="hidden md:flex relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="بحث شامل..." 
                    className="pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-gov-emerald w-64"
                  />
               </div>
               
               <button onClick={toggleLanguage} className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Globe size={20} />
               </button>
               
               <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               
               <button className="relative p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
               </button>
            </div>
         </header>

         {/* Content Scroll Area */}
         <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {renderContent()}
         </main>
         
      </div>

    </div>
  );
};

export default DashboardLayout;
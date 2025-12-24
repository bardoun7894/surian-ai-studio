import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ComplaintPortal from './components/ComplaintPortal';
import DirectoratesList from './components/DirectoratesList';
import Footer from './components/Footer';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');

  const renderContent = () => {
    switch (currentView) {
      case 'COMPLAINTS':
        return (
          <div className="animate-fade-in pt-12 pb-20">
            <div className="text-center mb-4">
               <h1 className="text-3xl font-display font-bold text-gov-charcoal">بوابة الشكاوى الذكية</h1>
            </div>
            <ComplaintPortal />
          </div>
        );
      case 'DIRECTORATES':
        return (
          <div className="animate-fade-in">
             <DirectoratesList />
          </div>
        );
      case 'HOME':
      default:
        return (
          <>
            <HeroSection onNavigate={setCurrentView} />
            <div className="py-20 bg-white">
               <div className="max-w-7xl mx-auto px-4 text-center">
                  <h2 className="text-3xl font-display font-bold text-gov-charcoal mb-12">لماذا المنصة الموحدة؟</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[
                       { title: 'سهولة الوصول', desc: 'كافة الخدمات الحكومية في مكان واحد بضغطة زر.' },
                       { title: 'سرعة الإنجاز', desc: 'تقنيات ذكاء اصطناعي لتسريع معالجة الطلبات والشكاوى.' },
                       { title: 'شفافية كاملة', desc: 'تتبع حالة طلباتك لحظة بلحظة مع إشعارات فورية.' }
                     ].map((feat, i) => (
                       <div key={i} className="p-8 rounded-2xl bg-gov-beige border border-gray-100 hover:border-gov-gold/30 transition-colors">
                          <h3 className="text-xl font-bold text-gov-emerald mb-4">{feat.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
            
            {/* Quick Access to Directorates */}
            <div className="bg-gray-50 py-16">
              <DirectoratesList />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-grow pt-20">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

export default App;
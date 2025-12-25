import React from 'react';
import { Phone, Mail, MapPin, Network } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
  onIncreaseFont?: () => void;
  onDecreaseFont?: () => void;
  onToggleContrast?: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onIncreaseFont, 
  onDecreaseFont, 
  onToggleContrast 
}) => {
  const { t, language } = useLanguage();
  
  const handleLinkClick = (e: React.MouseEvent, view: ViewState) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-white dark:bg-gov-forest text-gov-forest dark:text-white pt-20 pb-8 border-t-4 border-gov-gold relative overflow-hidden transition-colors duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
             <div className="flex flex-col items-start gap-4 mb-6">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Emblem_of_Syria_%282025%E2%80%93present%29.svg" 
                  alt="Emblem" 
                  className="h-24 w-auto drop-shadow-lg"
                />
                <div className="flex flex-col">
                   <span className="font-display font-bold text-xl text-gov-forest dark:text-white transition-colors">{t('republic_name')}</span>
                   <span className="text-xs text-gov-gold tracking-[0.2em] font-serif uppercase mt-1">
                     {language === 'ar' ? 'Syrian Arab Republic' : 'الجمهورية العربية السورية'}
                   </span>
                </div>
             </div>
             <p className="text-gov-stone dark:text-gov-beige/70 text-sm leading-relaxed max-w-xs transition-colors">
               {t('footer_desc')}
             </p>
          </div>

          <div>
             <h4 className="font-display font-bold text-lg mb-6 text-gov-gold relative inline-block">
               {t('quick_links')}
               <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-gold rounded-full`}></span>
             </h4>
             <ul className="space-y-3 text-sm text-gov-stone dark:text-gov-beige/80 transition-colors">
               <li><a href="#" onClick={(e) => handleLinkClick(e, 'ABOUT')} className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('about_portal')}</a></li>
               <li><a href="#" onClick={(e) => handleLinkClick(e, 'DIRECTORATES')} className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('nav_directory')}</a></li>
               <li><a href="#" onClick={(e) => handleLinkClick(e, 'DECREES')} className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('nav_decrees')}</a></li>
               <li><a href="#" onClick={(e) => handleLinkClick(e, 'OPEN_DATA')} className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('open_data')}</a></li>
               <li><a href="#" className="hover:text-gov-gold transition-colors flex items-center gap-2 font-bold"><Network size={12}/> {t('site_map')}</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-display font-bold text-lg mb-6 text-gov-gold relative inline-block">
               {t('contact_us')}
               <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-gold rounded-full`}></span>
             </h4>
             <ul className="space-y-4 text-sm text-gov-stone dark:text-gov-beige/80 transition-colors">
               <li className="flex items-start gap-3">
                  <Phone size={16} className="text-gov-gold mt-1" />
                  <div>
                    <span className="block text-xs text-gov-gold/70">{t('contact_center')}</span>
                    <span className="font-bold text-gov-forest dark:text-white text-lg transition-colors">19999</span>
                  </div>
               </li>
               <li className="flex items-center gap-3">
                  <Mail size={16} className="text-gov-gold" />
                  <span>info@egov.sy</span>
               </li>
               <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-gov-gold mt-1" />
                  <span>{t('damascus_address')}</span>
               </li>
             </ul>
          </div>

          <div>
             <h4 className="font-display font-bold text-lg mb-6 text-gov-gold relative inline-block">
               {t('accessibility')}
               <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-gold rounded-full`}></span>
             </h4>
             <p className="text-sm text-gov-stone dark:text-gov-beige/70 mb-4 transition-colors">
               {language === 'ar' 
                ? 'تلتزم البوابة بتوفير إمكانية الوصول الرقمي لجميع فئات المجتمع (WCAG 2.1).'
                : 'The portal is committed to providing digital accessibility for all (WCAG 2.1).'
               }
             </p>
             <div className="flex gap-2">
                <button 
                  onClick={onIncreaseFont}
                  className="px-3 py-1 bg-gray-100 dark:bg-gov-emeraldLight rounded hover:bg-gov-gold hover:text-white dark:hover:text-gov-forest transition-colors text-xs font-bold border border-gov-gold/20"
                  title="Increase Font"
                >
                  A+
                </button>
                <button 
                  onClick={onDecreaseFont}
                  className="px-3 py-1 bg-gray-100 dark:bg-gov-emeraldLight rounded hover:bg-gov-gold hover:text-white dark:hover:text-gov-forest transition-colors text-xs font-bold border border-gov-gold/20"
                  title="Decrease Font"
                >
                  A-
                </button>
                <button 
                  onClick={onToggleContrast}
                  className="px-3 py-1 bg-gray-100 dark:bg-gov-emeraldLight rounded hover:bg-gov-gold hover:text-white dark:hover:text-gov-forest transition-colors text-xs font-bold border border-gov-gold/20"
                  title="High Contrast"
                >
                  {language === 'ar' ? 'تباين' : 'Contrast'}
                </button>
             </div>
          </div>

        </div>
        
        <div className="pt-8 border-t border-gov-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-sm text-gov-stone dark:text-gov-beige/50 font-light transition-colors">{t('copyright')}</p>
           <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Emblem_of_Syria_%282025%E2%80%93present%29.svg" className="h-8 w-auto opacity-30 grayscale" alt="logo footer" />
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
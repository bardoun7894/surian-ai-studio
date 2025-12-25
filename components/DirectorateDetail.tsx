import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileCheck,
  Newspaper,
  ExternalLink,
  ShieldAlert,
  Scale,
  HeartPulse,
  BookOpen,
  GraduationCap,
  Zap,
  Droplets,
  Plane,
  Wifi,
  Banknote,
  Map,
  Factory,
  Landmark,
  Loader2
} from 'lucide-react';
import { API } from '../services/repository';
import { Directorate, Service, NewsItem } from '../types';

interface DirectorateDetailProps {
  directorateId: string;
  onBack: () => void;
}

const DirectorateDetail: React.FC<DirectorateDetailProps> = ({ directorateId, onBack }) => {
  const [directorate, setDirectorate] = useState<Directorate | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [dir, servs, news] = await Promise.all([
                API.directorates.getById(directorateId),
                API.directorates.getServicesByDirectorate(directorateId),
                API.news.getOfficialNews() // Optimally filter by directorate in a real API
            ]);
            setDirectorate(dir);
            setServices(servs);
            setRelatedNews(news.slice(0, 2)); // Mock related news logic
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [directorateId]);

  // Icon mapping helper (duplicate from list, ideally utility)
  const getIcon = (iconName: string) => {
    const props = { size: 40 };
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'Wifi': return <Wifi {...props} />;
      case 'Banknote': return <Banknote {...props} />;
      case 'Map': return <Map {...props} />;
      case 'Factory': return <Factory {...props} />;
      default: return <Landmark {...props} />;
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gov-teal" size={40} /></div>;
  if (!directorate) return <div className="p-20 text-center">Ministry not found</div>;

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50 pb-20">
       
       {/* Hero Header */}
       <div className="bg-gov-emerald text-white pt-12 pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
             <button 
               onClick={onBack}
               className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold"
             >
                <ArrowRight size={16} />
                العودة إلى الدليل
             </button>
             
             <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gov-gold border border-white/20 shadow-2xl">
                   {getIcon(directorate.icon)}
                </div>
                <div>
                   <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">{directorate.name}</h1>
                   <p className="text-lg text-white/80 max-w-3xl leading-relaxed">{directorate.description}</p>
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Main Content */}
             <div className="lg:col-span-2 space-y-8">
                
                {/* Services Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                   <h2 className="text-xl font-bold text-gov-charcoal mb-6 flex items-center gap-2">
                      <FileCheck className="text-gov-emerald" />
                      الخدمات الإلكترونية المتاحة
                   </h2>
                   
                   {services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {services.map(service => (
                            <div key={service.id} className="p-4 rounded-xl border border-gray-100 hover:border-gov-emerald hover:shadow-md transition-all group bg-gray-50 cursor-pointer">
                               <div className="flex items-start justify-between mb-2">
                                  <div className={`w-2 h-2 rounded-full mt-1.5 ${service.isDigital ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                  <ExternalLink size={16} className="text-gray-300 group-hover:text-gov-emerald transition-colors" />
                               </div>
                               <h3 className="font-bold text-gray-800 group-hover:text-gov-emerald transition-colors">{service.title}</h3>
                               <p className="text-xs text-gray-500 mt-2">{service.isDigital ? 'خدمة رقمية فورية' : 'تتطلب مراجعة المركز'}</p>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-8 text-gray-400">لا توجد خدمات إلكترونية مضافة حالياً.</div>
                   )}
                   
                   <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                      <button className="text-gov-emerald font-bold text-sm hover:underline">عرض دليل المعاملات الورقية</button>
                   </div>
                </div>

                {/* News Section for this Ministry */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                   <h2 className="text-xl font-bold text-gov-charcoal mb-6 flex items-center gap-2">
                      <Newspaper className="text-gov-emerald" />
                      آخر أخبار الوزارة
                   </h2>
                   <div className="space-y-6">
                      {relatedNews.map(news => (
                         <div key={news.id} className="flex gap-4 group cursor-pointer">
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                               <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div>
                               <span className="text-xs text-gov-emerald font-bold mb-1 block">{news.category}</span>
                               <h3 className="font-bold text-gray-800 mb-2 leading-tight group-hover:text-gov-emerald transition-colors">{news.title}</h3>
                               <p className="text-xs text-gray-500 line-clamp-2">{news.summary}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

             </div>

             {/* Sidebar Info */}
             <div className="space-y-6">
                
                {/* Contact Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                   <h3 className="font-bold text-gov-charcoal mb-6 border-b border-gray-100 pb-2">معلومات التواصل</h3>
                   <div className="space-y-4">
                      <div className="flex items-start gap-3 text-sm text-gray-600">
                         <MapPin className="shrink-0 text-gov-emerald" size={18} />
                         <span>دمشق، ساحة يوسف العظمة، مبنى الوزارة</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                         <Phone className="shrink-0 text-gov-emerald" size={18} />
                         <span dir="ltr">+963 11 222 3333</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                         <Mail className="shrink-0 text-gov-emerald" size={18} />
                         <span>contact@ministry.gov.sy</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                         <Globe className="shrink-0 text-gov-emerald" size={18} />
                         <a href="#" className="hover:text-gov-emerald underline">www.ministry.gov.sy</a>
                      </div>
                   </div>
                </div>

                {/* Working Hours */}
                <div className="bg-gov-emerald text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                   <h3 className="font-bold mb-4 relative z-10">أوقات الدوام الرسمي</h3>
                   <div className="space-y-2 text-sm text-white/80 relative z-10">
                      <div className="flex justify-between">
                         <span>الأحد - الخميس</span>
                         <span>08:00 ص - 03:30 م</span>
                      </div>
                      <div className="flex justify-between">
                         <span>الجمعة - السبت</span>
                         <span>عطلة رسمية</span>
                      </div>
                   </div>
                </div>

             </div>

          </div>
       </div>

    </div>
  );
};

export default DirectorateDetail;
import React from 'react';
import { Target, Eye, ShieldCheck, Users, Globe, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest animate-fade-in pb-20">
      
      {/* Hero Header */}
      <div className="bg-gov-emerald relative overflow-hidden py-24 text-center text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gov-forest/90"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">عن البوابة الإلكترونية</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            المنصة الوطنية الموحدة للخدمات الحكومية في الجمهورية العربية السورية. 
            رؤية طموحة لمستقبل رقمي يخدم المواطن ويعزز الشفافية.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        
        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gov-emerald/20 p-8 rounded-3xl shadow-xl border border-gov-gold/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gov-teal/10 rounded-2xl flex items-center justify-center text-gov-teal mb-6">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-4">رسالتنا</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              تقديم خدمات حكومية ذكية، متكاملة، وآمنة، تتيح للمواطنين إتمام معاملاتهم بسهولة ويسر من أي مكان وفي أي وقت، مما يساهم في رفع كفاءة العمل الحكومي وتقليل البيروقراطية.
            </p>
          </div>

          <div className="bg-white dark:bg-gov-emerald/20 p-8 rounded-3xl shadow-xl border border-gov-gold/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gov-gold/10 rounded-2xl flex items-center justify-center text-gov-gold mb-6">
              <Eye size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-4">رؤيتنا</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              حكومة بلا ورق بحلول عام 2030، تعتمد على البيانات والتقنيات الحديثة لصنع القرار، وتضع رضا المواطن في قلب أولوياتها من خلال تجربة مستخدم سلسة وشفافة.
            </p>
          </div>
        </div>

        {/* Strategic Pillars */}
        <div className="mb-16">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-4">ركائزنا الاستراتيجية</h2>
             <div className="w-24 h-1 bg-gov-gold mx-auto rounded-full"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, title: 'الأمان والخصوصية', desc: 'حماية بيانات المواطنين وفق أعلى المعايير العالمية.' },
                { icon: Users, title: 'الشمولية', desc: 'خدمات متاحة لجميع فئات المجتمع بما في ذلك ذوي الاحتياجات الخاصة.' },
                { icon: Globe, title: 'التحول الرقمي', desc: 'أتمتة شاملة للإجراءات وربط المؤسسات الحكومية.' },
                { icon: Zap, title: 'الكفاءة والسرعة', desc: 'تقليص زمن إنجاز المعاملات ورفع جودة الأداء.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors text-center group">
                   <div className="w-12 h-12 bg-gray-50 dark:bg-white/10 rounded-full flex items-center justify-center text-gov-forest dark:text-white mx-auto mb-4 group-hover:bg-gov-gold group-hover:text-white transition-colors">
                     <item.icon size={24} />
                   </div>
                   <h3 className="font-bold text-lg text-gov-charcoal dark:text-white mb-2">{item.title}</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gov-charcoal text-white rounded-[3rem] p-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-gov-emerald/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-gov-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
           
           <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                 <div className="text-4xl font-bold text-gov-gold mb-2">3.5M+</div>
                 <div className="text-sm text-gray-400">مستخدم نشط</div>
              </div>
              <div>
                 <div className="text-4xl font-bold text-gov-gold mb-2">1,200+</div>
                 <div className="text-sm text-gray-400">خدمة إلكترونية</div>
              </div>
              <div>
                 <div className="text-4xl font-bold text-gov-gold mb-2">98%</div>
                 <div className="text-sm text-gray-400">نسبة الرضا</div>
              </div>
              <div>
                 <div className="text-4xl font-bold text-gov-gold mb-2">24/7</div>
                 <div className="text-sm text-gray-400">دعم فني</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
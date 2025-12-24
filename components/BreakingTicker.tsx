import React from 'react';
import { Zap } from 'lucide-react';
import { BREAKING_NEWS } from '../constants';

const BreakingTicker: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-zinc-900/50 border-y border-white/5 py-3 backdrop-blur-sm">
      <div className="absolute top-0 right-0 bottom-0 z-10 w-32 bg-gradient-to-l from-surian-dark to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 bottom-0 z-10 w-32 bg-gradient-to-r from-surian-dark to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex items-center px-4 relative">
        <div className="flex items-center gap-2 text-surian-red font-bold whitespace-nowrap z-20 ps-2 pe-6 border-l border-white/10 bg-surian-dark/80 rounded-e-lg">
          <Zap size={18} className="animate-pulse" />
          <span className="font-display">عاجل</span>
        </div>
        
        <div className="flex overflow-hidden relative w-full">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm text-zinc-300 items-center">
            {/* Repeat the list to ensure smooth looping */}
            {[...BREAKING_NEWS, ...BREAKING_NEWS].map((news, index) => (
              <span key={index} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                {news}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); } /* Positive for RTL movement logic if needed, but standard CSS translate usually moves left. For RTL infinite scroll we might need to adjust direction */
        }
        /* Override specifically for RTL layout if needed */
        html[dir='rtl'] .animate-marquee {
           animation: marquee-rtl 40s linear infinite;
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); } /* Move Right to Left in visual space? Actually in RTL translateX(50%) moves right. We want to move right (start) to left (end). */
          /* Let's try standard Marquee logic: text flows across screen. */
        }
      `}</style>
    </div>
  );
};

export default BreakingTicker;
import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export interface MenuItem {
  label: string;
  href: string;
  description?: string;
  icon?: React.ElementType;
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

interface MegaMenuProps {
  label: string;
  sections: MenuSection[];
  active?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  label,
  sections,
  active,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const { language } = useLanguage();

  // Single section = simple dropdown, multi-section = wider panel
  const isMultiSection = sections.length > 1;

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={onClick}
        onFocus={onMouseEnter}
        className={`flex items-center gap-1.5 py-2 ${language === "en" ? "px-2 text-xs" : "px-3 text-sm"} font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 whitespace-nowrap ${active ? "bg-white/15 text-white" : ""}`}
        aria-expanded={active}
      >
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${active ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-full mt-1 bg-white dark:bg-dm-surface rounded-xl shadow-2xl border border-gray-200/80 dark:border-gov-border/25 z-50 overflow-hidden start-0 ${isMultiSection ? "w-[480px] max-w-[90vw]" : "w-[260px] max-w-[90vw]"}`}
          >
            <div
              className={`${isMultiSection ? "flex divide-x rtl:divide-x-reverse divide-gray-100 dark:divide-white/5" : ""}`}
            >
              {sections.map((section, idx) => (
                <div
                  key={idx}
                  className={`pt-2 pb-1 ${isMultiSection ? "flex-1 min-w-[200px]" : ""}`}
                >
                  {section.title && (
                    <div className="px-4 pt-2 pb-2 mb-1">
                      <span className="text-[10px] font-bold text-gov-sand dark:text-gov-gold/70 uppercase tracking-wider">
                        {section.title}
                      </span>
                    </div>
                  )}

            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute top-full mt-1 bg-white dark:bg-dm-surface rounded-xl shadow-2xl border border-gray-200/80 dark:border-gov-border/25 z-50 overflow-visible ${language === 'ar' ? 'right-0' : 'left-0'
                            } ${isMultiSection ? 'w-auto min-w-[520px]' : 'w-auto min-w-[220px]'}`}
                    >
                        <div className={`${isMultiSection ? 'flex divide-x rtl:divide-x-reverse divide-gray-100 dark:divide-white/5' : ''}`}>
                            {sections.map((section, idx) => (
                                <div key={idx} className={`py-2.5 pb-5 ${isMultiSection ? "flex-1 min-w-[200px]" : ""}`}>
                                    {section.title && (
                                        <div className="px-4 pt-3 pb-2 mb-1">
                                            <span className="text-[10px] font-bold text-gov-sand dark:text-gov-gold/70 uppercase tracking-wider">
                                                {section.title}
                                            </span>
                                        </div>
                                    )}

                                    {section.items.map((item, itemIdx) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={itemIdx}
                                                href={item.href}
                                                onClick={onClick}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gov-charcoal dark:text-white/90 hover:bg-gov-beige/50 dark:hover:bg-white/10 transition-colors group"
                                            >
                                                {Icon && (
                                                    <div className="w-8 h-8 rounded-lg bg-gov-beige/60 dark:bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gov-gold/15 dark:group-hover:bg-gov-gold/15 transition-colors">
                                                        <Icon size={16} className="text-gov-forest dark:text-white group-hover:text-gov-gold dark:group-hover:text-gov-gold transition-colors" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <span className="block font-semibold text-sm leading-tight group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors ">
                                                        {item.label}
                                                    </span>
                                                    {item.description && (
                                                        <span className="block text-xs text-gray-400 dark:text-white/40 mt-0.5 ">
                                                            {item.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu;

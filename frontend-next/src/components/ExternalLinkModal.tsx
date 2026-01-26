import React from 'react';
import { ExternalLink, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ExternalLinkModalProps {
    isOpen: boolean;
    url: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ExternalLinkModal: React.FC<ExternalLinkModalProps> = ({ isOpen, url, onClose, onConfirm }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gov-charcoal/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gov-emerald/10 w-full max-w-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gov-beige/50 dark:bg-white/5">
                    <h2 className="text-xl font-display font-bold text-gov-forest dark:text-white flex items-center gap-2">
                        <AlertTriangle className="text-gov-gold" />
                        {t('external_link_warning_title')}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {t('external_link_warning_desc')}
                    </p>
                    <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10 mb-6 flex items-center gap-2 text-sm text-gov-teal break-all">
                        <ExternalLink size={16} className="shrink-0" />
                        <span dir="ltr">{url}</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 dark:bg-white/10 text-gov-forest dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                        >
                            {t('external_link_stay')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 bg-gov-forest text-white font-bold rounded-xl hover:bg-gov-teal transition-colors flex items-center justify-center gap-2"
                        >
                            {t('external_link_continue')}
                            <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExternalLinkModal;

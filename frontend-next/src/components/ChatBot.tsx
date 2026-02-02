'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, User, Bot, Trash2, Paperclip, FileText, Image as ImageIcon, Minimize2, Sparkles, UserRound } from 'lucide-react';
import { aiService } from '@/lib/aiService';
import { ChatMessage } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper to get XSRF token from cookies
const getXsrfToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
};

interface Attachment {
    name: string;
    data: string;
    mimeType: string;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [sessionId, setSessionId] = useState<string>('');
    const [showWelcome, setShowWelcome] = useState(false); // Default hidden, waits for timer
    const [handoffRequested, setHandoffRequested] = useState(false);
    const [requestingHandoff, setRequestingHandoff] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { language } = useLanguage();

    // Initialize session ID and load history from API
    useEffect(() => {
        const initSession = async () => {
            // Get or create session ID
            let sid = localStorage.getItem('gov_chat_session_id');
            if (!sid) {
                sid = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                localStorage.setItem('gov_chat_session_id', sid);
            }
            setSessionId(sid);

            // Load conversation history from backend
            await loadHistory(sid);
        };
        initSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ChatBot Animation Sequence
    useEffect(() => {
        // 1. Wait 30 seconds before showing
        const startTimer = setTimeout(() => {
            setShowWelcome(true);

            // 2. Show for 30 seconds then hide
            const hideTimer = setTimeout(() => {
                setShowWelcome(false);
            }, 30000);

            return () => clearTimeout(hideTimer);
        }, 30000);

        return () => clearTimeout(startTimer);
    }, []);

    const loadHistory = async (sid: string) => {
        try {
            // Use relative path - Next.js rewrites proxy to backend
            const response = await fetch(`/api/v1/chat/history/${sid}`, {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                if (data.messages && data.messages.length > 0) {
                    const restored = data.messages.map((m: any) => ({
                        id: m.timestamp || Date.now().toString(),
                        text: m.content,
                        sender: m.role === 'user' ? 'user' : 'bot',
                        timestamp: new Date(m.timestamp || Date.now())
                    }));
                    setMessages(restored);
                } else {
                    resetChat();
                }
            } else {
                resetChat();
            }
        } catch (error) {
            console.error('Failed to load chat history', error);
            resetChat();
        }
    };

    const handleRequestHandoff = async () => {
        if (!sessionId || handoffRequested) return;
        setRequestingHandoff(true);
        try {
            const res = await fetch('/api/v1/chat/handoff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId })
            });
            if (res.ok) {
                setHandoffRequested(true);
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant' as const,
                    content: language === 'ar'
                        ? 'تم إرسال طلبك للتحدث مع موظف. سيتم الرد عليك قريباً.'
                        : 'Your request to talk to a staff member has been sent. You will be responded to shortly.',
                    timestamp: new Date().toISOString()
                }]);
            }
        } catch (err) {
            console.error('Handoff request failed:', err);
        } finally {
            setRequestingHandoff(false);
        }
    };

    const resetChat = async () => {
        const welcomeMsg: ChatMessage = {
            id: 'welcome',
            text: language === 'ar' ? 'مرحباً بك في البوابة الإلكترونية لوزارة الاقتصاد والصناعة. أنا المساعد الذكي، كيف يمكنني مساعدتك في خدمات الصناعة والتجارة والاقتصاد؟' : 'Welcome to the Ministry of Economy and Industry portal. I am the smart assistant, how can I help you with industry, trade, and economy services?',
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages([welcomeMsg]);
        setAttachment(null);

        // Clear session on backend
        if (sessionId) {
            try {
                const xsrfToken = getXsrfToken();
                await fetch(`/api/v1/chat/session/${sessionId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {},
                });
            } catch (error) {
                console.error('Failed to clear session', error);
            }
        }

        // Create new session
        const newSid = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('gov_chat_session_id', newSid);
        setSessionId(newSid);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(scrollToBottom, 100);
            // Prevent body scroll on mobile when chat is open
            document.body.style.overflow = window.innerWidth < 640 ? 'hidden' : 'auto';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [messages, isOpen, attachment]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Limit file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(language === 'ar' ? "حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5 ميغابايت." : "File is too large. Please select a file under 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            setAttachment({
                name: file.name,
                mimeType: file.type,
                data: base64Data
            });
        };
        reader.readAsDataURL(file);

        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = () => {
        setAttachment(null);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !attachment) return;

        const attachmentLabel = attachment ? (language === 'ar' ? ` [مرفق: ${attachment.name}]` : ` [Attachment: ${attachment.name}]`) : '';
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text: input + attachmentLabel,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentAttachment = attachment;
        const currentInput = input;
        setInput('');
        setAttachment(null);
        setIsLoading(true);

        try {
            let responseText: string;

            // If there's an attachment and it's an image, use OCR first
            if (currentAttachment && currentAttachment.mimeType.startsWith('image/')) {
                // Convert base64 to File for OCR
                const blob = await fetch(`data:${currentAttachment.mimeType};base64,${currentAttachment.data}`).then(r => r.blob());
                const file = new File([blob], currentAttachment.name, { type: currentAttachment.mimeType });

                const extractedText = await aiService.extractTextFromImage(file);
                const prompt = currentInput || (language === 'ar' ? "قم بتحليل النص المستخرج من الصورة" : "Analyze the text extracted from the image");

                // Send to backend API
                const response = await fetch(`/api/v1/chat/message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: language === 'ar' ? `${prompt}\n\nالنص المستخرج: ${extractedText}` : `${prompt}\n\nExtracted text: ${extractedText}`,
                        session_id: sessionId,
                        language: language === 'ar' ? 'ar' : 'en'
                    })
                });

                if (!response.ok) throw new Error('API request failed');
                const data = await response.json();
                responseText = data.response;
            } else {
                // Regular chat via backend API
                const prompt = currentInput || (currentAttachment ? (language === 'ar' ? "قم بتحليل هذا الملف المرفق." : "Analyze this attached file.") : ".");

                const response = await fetch(`/api/v1/chat/message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: prompt,
                        session_id: sessionId,
                        language: language === 'ar' ? 'ar' : 'en'
                    })
                });

                if (!response.ok) throw new Error('API request failed');
                const data = await response.json();
                responseText = data.response;
            }

            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: language === 'ar' ? 'عذراً، حدث خطأ في الاتصال بالخدمة. يرجى المحاولة مرة أخرى.' : 'Sorry, there was an error connecting to the service. Please try again.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // FR-59: Enhanced AI Assistant button with larger size and AI indicator
    const welcomeText = language === 'ar'
        ? 'مرحباً! أنا مساعدك الذكي'
        : 'Hello! I\'m your AI assistant';

    return (
        <>
            {/* FR-59: Floating Button with Enhanced UI - Professional Flat Design */}
            <div className={`fixed bottom-12 z-[60] flex items-end gap-3 pointer-events-none transition-all duration-500 ${language === 'ar' ? 'right-6 left-auto flex-row-reverse' : 'left-6 right-auto flex-row'} md:bottom-16`}>
                {/* FR-59: Professional Flat Button - Larger size */}
                <button
                    onClick={() => setIsOpen(true)}
                    className={`pointer-events-auto relative bg-gov-forest hover:bg-gov-teal text-white w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex-shrink-0 ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
                >
                    <div className="relative flex items-center justify-center">
                        <MessageSquare size={40} />
                    </div>
                    <span className="absolute bottom-2 right-2 flex h-4 w-4">
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gov-forest"></span>
                    </span>
                </button>

                {/* Hint bubble - appears to the left of button in Arabic, right in English */}
                {!isOpen && showWelcome && (
                    <div
                        className="pointer-events-auto bg-white dark:bg-dm-surface text-gov-forest dark:text-white px-5 py-3 rounded-xl shadow-lg border border-gov-gold/20 transform transition-all duration-500 flex items-center gap-3 animate-fade-in"
                    >
                        <Bot size={18} className="text-gov-forest dark:text-gov-teal" />
                        <span className="text-sm font-bold whitespace-nowrap">{welcomeText}</span>
                        <button
                            onClick={() => setShowWelcome(false)}
                            className="text-gray-400 hover:text-gray-600 dark:text-white/50 dark:hover:text-white/80 ms-1"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Window Container */}
            <div
                className={`fixed z-50 transition-all duration-300 shadow-2xl bg-white/95 dark:bg-dm-surface backdrop-blur-xl sm:rounded-2xl flex flex-col overflow-hidden border border-gov-gold/20 dark:border-dm-border
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-10'}
            inset-0 sm:inset-auto sm:bottom-8 sm:max-h-[80vh] sm:h-[600px] sm:w-[380px]
            ${language === 'ar' ? 'sm:right-6 sm:left-auto' : 'sm:left-6 sm:right-auto'}
        `}
            >
                {/* Header */}
                <div className="bg-gov-forest p-4 flex justify-between items-center text-white shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-wide">{language === 'ar' ? 'المساعد الحكومي الذكي' : 'Smart Government Assistant'}</h3>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                <span className="text-[10px] opacity-80">{language === 'ar' ? 'متصل الآن' : 'Online'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleRequestHandoff}
                            disabled={requestingHandoff || handoffRequested}
                            className={`p-2 rounded-lg transition-colors ${handoffRequested ? 'text-green-500 bg-green-100 dark:bg-green-900/30' : 'text-gray-500 hover:text-gov-gold hover:bg-gov-gold/10'}`}
                            title={language === 'ar' ? 'التحدث مع موظف' : 'Talk to a human'}
                        >
                            {requestingHandoff ? <Loader2 size={18} className="animate-spin" /> : <UserRound size={18} />}
                        </button>
                        <button
                            onClick={resetChat}
                            title={language === 'ar' ? 'مسح المحادثة والبدء من جديد' : 'Clear chat and start over'}
                            className="hover:bg-white/10 p-1.5 rounded transition-colors text-white/80 hover:text-white"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded transition-colors">
                            <span className="sm:hidden"><X size={20} /></span>
                            <span className="hidden sm:inline"><Minimize2 size={20} /></span>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gov-beige dark:bg-dm-surface space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gov-stone text-white' : 'bg-gov-forest text-white'}`}>
                                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                ? 'bg-gov-stone text-white rounded-tl-none shadow-md'
                                : 'bg-white dark:bg-gov-forest/80 text-gov-charcoal dark:text-white border border-gov-gold/20 rounded-tr-none shadow-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gov-forest text-white flex items-center justify-center">
                                <Bot size={14} />
                            </div>
                            <div className="bg-white dark:bg-gov-forest/80 p-3 rounded-2xl rounded-tr-none border border-gov-gold/20 shadow-sm">
                                <Loader2 size={16} className="animate-spin text-gov-gold" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Attachment Preview */}
                {attachment && (
                    <div className="bg-gray-50 dark:bg-dm-surface border-t border-gray-100 dark:border-dm-border p-2 px-4 flex items-center justify-between animate-fade-in shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gov-teal/10 rounded-lg flex items-center justify-center text-gov-teal">
                                {attachment.mimeType.includes('pdf') ? <FileText size={16} /> : <ImageIcon size={16} />}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-gray-700 dark:text-white truncate max-w-[200px]">{attachment.name}</p>
                                <p className="text-[10px] text-gray-400 dark:text-white/70">{language === 'ar' ? 'جاهز للإرسال (OCR)' : 'Ready to send (OCR)'}</p>
                            </div>
                        </div>
                        <button onClick={removeAttachment} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-white/70">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-dm-surface border-t border-gov-gold/10 dark:border-dm-border shrink-0 safe-area-bottom">
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 rounded-xl bg-gov-beige/30 text-gov-sand hover:bg-gov-beige/50 hover:text-gov-teal border border-gov-gold/10 transition-colors"
                            title={language === 'ar' ? 'إرفاق صورة أو مستند' : 'Attach image or document'}
                        >
                            <Paperclip size={18} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={language === 'ar' ? 'اكتب استفسارك هنا...' : 'Type your question here...'}
                            className="flex-1 bg-gov-beige/20 dark:bg-gov-card/10 border border-gov-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gov-gold focus:ring-1 focus:ring-gov-gold/20 text-gov-charcoal dark:text-white placeholder:text-gov-sand/50"
                        />
                        <button
                            type="submit"
                            disabled={(!input.trim() && !attachment) || isLoading}
                            className="bg-gov-forest dark:bg-gov-forest text-white p-3 rounded-xl hover:bg-gov-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="text-center mt-2 hidden sm:block">
                        <p className="text-[10px] text-gov-sand">{language === 'ar' ? 'هذا النظام مدعوم بالذكاء الاصطناعي ويتذكر محادثاتك السابقة.' : 'This system is powered by AI and remembers your previous conversations.'}</p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChatBot;

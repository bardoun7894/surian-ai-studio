import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, User, Bot, Trash2, Paperclip, FileText, Image as ImageIcon, Minimize2 } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load History from LocalStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('gov_chat_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Restore Date objects from strings
        const restored = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(restored);
      } catch (e) {
        console.error("Failed to load chat history", e);
        resetChat();
      }
    } else {
      resetChat();
    }
  }, []);

  // Save History to LocalStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('gov_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const resetChat = () => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      text: 'مرحباً بك في البوابة الإلكترونية للحكومة السورية. أنا المساعد الذكي، كيف يمكنني مساعدتك اليوم؟',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
    setAttachment(null);
    localStorage.removeItem('gov_chat_history');
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
          alert("حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5 ميغابايت.");
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

    const attachmentLabel = attachment ? ` [مرفق: ${attachment.name}]` : '';
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input + attachmentLabel,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentAttachment = attachment; // Capture current state
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    // Format history for API
    // IMPORTANT: Filter out the 'welcome' message from history sent to API
    // because API history cannot start with a 'model' turn.
    const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

    const responseText = await chatWithAssistant(
        input || (currentAttachment ? "قم بتحليل هذا الملف المرفق." : "."), 
        history, 
        currentAttachment ? { data: currentAttachment.data, mimeType: currentAttachment.mimeType } : undefined
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-gov-emerald dark:bg-gov-gold text-white dark:text-gov-forest p-4 rounded-full shadow-2xl hover:bg-gov-emeraldLight dark:hover:bg-white hover:scale-105 transition-all duration-300 group ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-3 bg-gov-charcoal text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          المساعد الذكي
        </span>
      </button>

      {/* Chat Window Container */}
      <div 
        className={`fixed z-50 transition-all duration-300 shadow-2xl bg-white sm:rounded-2xl flex flex-col overflow-hidden border border-gov-gold/20
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-10'}
            inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] sm:max-h-[80vh]
        `}
      >
        {/* Header */}
        <div className="bg-gov-emerald p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full">
                    <Bot size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">المساعد الحكومي الذكي</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        <span className="text-[10px] opacity-80">متصل الآن - يحتفظ بالسياق</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button 
                  onClick={resetChat} 
                  title="مسح المحادثة والبدء من جديد"
                  className="hover:bg-white/10 p-1.5 rounded transition-colors text-white/80 hover:text-white"
                >
                    <Trash2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded transition-colors">
                    {window.innerWidth < 640 ? <X size={20} /> : <Minimize2 size={20} />}
                </button>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gov-beige space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gov-charcoal text-white' : 'bg-gov-emerald text-white'}`}>
                        {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                        ? 'bg-gov-charcoal text-white rounded-tl-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tr-none shadow-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gov-emerald text-white flex items-center justify-center">
                        <Bot size={14} />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tr-none border border-gray-200 shadow-sm">
                        <Loader2 size={16} className="animate-spin text-gov-emerald" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Attachment Preview */}
        {attachment && (
            <div className="bg-gray-50 border-t border-gray-100 p-2 px-4 flex items-center justify-between animate-fade-in shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gov-teal/10 rounded-lg flex items-center justify-center text-gov-teal">
                        {attachment.mimeType.includes('pdf') ? <FileText size={16} /> : <ImageIcon size={16} />}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-700 truncate max-w-[200px]">{attachment.name}</p>
                        <p className="text-[10px] text-gray-400">جاهز للإرسال (OCR)</p>
                    </div>
                </div>
                <button onClick={removeAttachment} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                    <X size={14} />
                </button>
            </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 shrink-0 safe-area-bottom">
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
                    className="p-3 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gov-teal border border-gray-200 transition-colors"
                    title="إرفاق صورة أو مستند"
                >
                    <Paperclip size={18} />
                </button>
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب استفسارك هنا..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gov-emerald focus:ring-1 focus:ring-gov-emerald/20"
                />
                <button 
                    type="submit" 
                    disabled={(!input.trim() && !attachment) || isLoading}
                    className="bg-gov-emerald text-white p-3 rounded-xl hover:bg-gov-emeraldLight disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
            <div className="text-center mt-2 hidden sm:block">
                <p className="text-[10px] text-gray-400">هذا النظام مدعوم بالذكاء الاصطناعي ويتذكر محادثاتك السابقة.</p>
            </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, User, Bot } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'مرحباً بك في البوابة الإلكترونية للحكومة السورية. أنا المساعد الذكي، كيف يمكنني مساعدتك اليوم؟',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for API
    const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithAssistant(userMsg.text, history);

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
        className={`fixed bottom-6 right-6 z-40 bg-gov-emerald text-white p-4 rounded-full shadow-2xl hover:bg-gov-emeraldLight hover:scale-105 transition-all duration-300 group ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-3 bg-gov-charcoal text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          المساعد الذكي
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-full sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gov-gold/20 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ height: '550px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-gov-emerald p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full">
                    <Bot size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">المساعد الحكومي الذكي</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        <span className="text-[10px] opacity-80">متصل الآن</span>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gov-beige space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gov-charcoal text-white' : 'bg-gov-emerald text-white'}`}>
                        {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
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

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب استفسارك هنا..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gov-emerald focus:ring-1 focus:ring-gov-emerald/20"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="bg-gov-emerald text-white p-3 rounded-xl hover:bg-gov-emeraldLight disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-[10px] text-gray-400">هذا النظام مدعوم بالذكاء الاصطناعي وقد يرتكب أخطاء.</p>
            </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
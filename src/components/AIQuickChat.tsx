import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Mic, MicOff, Minimize2 } from 'lucide-react';
import { useAppSelector } from '../store';
import { Message } from '../types';

export default function AIQuickChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi! I am OmniAI, your premium ticket booking assistant. Ask me anything about flights, trains, seat selections, or today\'s events!', timestamp: 'Just now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { currentUser } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call server proxy route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userName: currentUser?.name || 'Guest' }),
      });
      const data = await response.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || 'Sorry, I am having trouble connecting right now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback response
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `I understand you asked about "${text}". For booking inquiries, please explore our Flights, Trains, and Movies search tabs! You can select premium seats directly from our seat map and apply coupon OMNI50 for a 50% discount.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Mock voice recognition after 3 seconds
      setTimeout(() => {
        if (isListening) return; // if already cancelled
        setInputText('Show me the best flight options to Mumbai for tomorrow');
        setIsListening(false);
      }, 3000);
    }
  };

  const suggestions = [
    'Suggest flights to Mumbai',
    'Any movie ticket discounts?',
    'What is coupon OMNI50?',
    'Show Coldplay details'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-quick-chat">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 active:scale-95 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/20 transition-transform cursor-pointer group"
        >
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
            </span>
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-32 transition-all duration-300 ease-out text-sm font-semibold whitespace-nowrap">
            Ask OmniAI
          </span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[380px] h-[520px] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Sparkles className="h-5 w-5 text-emerald-300 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center space-x-1">
                  <span>OmniAI Assistant</span>
                </h4>
                <p className="text-[10px] text-emerald-100 flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span>Online • Gemini Powered</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition">
                <Minimize2 className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/30">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className={`text-[9px] block mt-1.5 text-right ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400 font-mono'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <div className="flex space-x-1.5 items-center py-1">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">Quick Prompts</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 px-2.5 py-1 rounded-full transition text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2">
            <button
              onClick={handleVoiceToggle}
              className={`p-2 rounded-xl transition ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              title={isListening ? 'Listening...' : 'Voice Search'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(inputText); }}
              placeholder={isListening ? 'Listening for command...' : 'Type message...'}
              className="w-full text-sm py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              onClick={() => handleSend(inputText)}
              className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-xl shadow-md cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

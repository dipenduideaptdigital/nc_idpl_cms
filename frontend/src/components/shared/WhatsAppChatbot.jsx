import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, MessageCircle } from 'lucide-react';
import SubhaakritiLogo from '../../assets/logos/Subhaakriti_Logo.svg';

const chatbotSteps = {
  welcome: {
    text: "Hi there! 👋 Welcome to Subhaakritee. I'm your virtual assistant. How can I help you today?",
    options: [
      { text: "🏠 Residential Design", nextStep: "residential" },
      { text: "🏢 Commercial Design", nextStep: "commercial" },
      { text: "📅 Book a Consultation", nextStep: "consultation" },
      { text: "❓ General Inquiry", nextStep: "general" }
    ]
  },
  residential: {
    text: "Residential design is our passion! 🏡 What kind of space are you planning to transform?",
    options: [
      { text: "Full House Design", nextStep: "res_full" },
      { text: "Modular Kitchen / Wardrobe", nextStep: "res_modular" },
      { text: "Living / Bedroom Decor", nextStep: "res_decor" },
      { text: "⬅️ Back", nextStep: "welcome" }
    ]
  },
  res_full: {
    text: "Amazing! A full home design project is an exciting journey. Let's connect on WhatsApp with our residential designer to discuss your floor plan and ideas! 🛋️✨",
    finalMessage: "Hi Subhaakritee, I'm interested in a Full House Interior Design. Please connect me with a designer.",
    options: [
      { text: "💬 Continue to WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back to Menu", nextStep: "residential" }
    ]
  },
  res_modular: {
    text: "Fabulous! Modular kitchens and smart wardrobes combine aesthetics and functionality. Let's discuss layouts and finishes on WhatsApp. 🍳🚪",
    finalMessage: "Hi Subhaakritee, I'm looking for Modular Kitchen & Wardrobe design solutions. Please guide me.",
    options: [
      { text: "💬 Continue to WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back to Menu", nextStep: "residential" }
    ]
  },
  res_decor: {
    text: "Lovely! Accent pieces, lighting, and decor make all the difference. Let's discuss your styling requirements on WhatsApp. 🪴💡",
    finalMessage: "Hi Subhaakritee, I'm looking for decoration services for my living/bedroom. Let's discuss details.",
    options: [
      { text: "💬 Continue to WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back to Menu", nextStep: "residential" }
    ]
  },
  commercial: {
    text: "Excellent! We design workspace environments that inspire and engage. What is the scope of your commercial project? 🏢💡",
    options: [
      { text: "Office Workspace Design", nextStep: "comm_office" },
      { text: "Retail / Showroom Design", nextStep: "comm_retail" },
      { text: "Cafe / Restaurant Design", nextStep: "comm_cafe" },
      { text: "⬅️ Back", nextStep: "welcome" }
    ]
  },
  comm_office: {
    text: "Great! A productive workplace starts with smart ergonomics and layout. Let's connect on WhatsApp to discuss your office layout. 💻🏢",
    finalMessage: "Hi Subhaakritee, I want to discuss interior design for my office space. Please get in touch.",
    options: [
      { text: "💬 Continue to WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back to Menu", nextStep: "commercial" }
    ]
  },
  comm_retail: {
    text: "Wonderful! We'll help you design an inviting retail environment that showcases your products beautifully. Let's discuss on WhatsApp. 🛍️✨",
    finalMessage: "Hi Subhaakritee, I'm interested in retail/showroom design services for my business.",
    options: [
      { text: "💬 Continue to WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back to Menu", nextStep: "commercial" }
    ]
  },
  comm_cafe: {
    text: "Delicious! A great cafe or restaurant design shapes the entire customer experience. Let's chat on WhatsApp to cook up some ideas. ☕🍕",
    finalMessage: "Hi Subhaakritee, I'm planning to design/renovate a cafe/restaurant. Let's connect.",
    options: [
      { text: "💬 Continue to WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back to Menu", nextStep: "commercial" }
    ]
  },
  consultation: {
    text: "Perfect! We offer a free initial design consultation to explore your style and budget. Let's connect on WhatsApp to book a slot. 📅🤝",
    finalMessage: "Hi Subhaakritee, I'd like to book a free design consultation. Please share the available slots.",
    options: [
      { text: "📅 Book via WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back", nextStep: "welcome" }
    ]
  },
  general: {
    text: "No problem! We're here to answer any questions you have about pricing, timelines, or our work. Let's chat on WhatsApp. 💬ℹ️",
    finalMessage: "Hi Subhaakritee, I have a few questions about your design services. Could you please help?",
    options: [
      { text: "💬 Ask on WhatsApp", action: "whatsapp" },
      { text: "⬅️ Back", nextStep: "welcome" }
    ]
  }
};

const WhatsAppChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);
  const phoneNumber = '919831637409';
  const defaultWhatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hi Subhaakritee, I am interested in your interior design services.")}`;

  // Helper to format current time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 'welcome_bot',
            sender: 'bot',
            text: chatbotSteps.welcome.text,
            timestamp: getCurrentTime()
          }
        ]);
        setIsTyping(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOptionClick = (option) => {
    if (isTyping) return;

    // 1. Add User selection bubble
    const userMsgId = `user_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: option.text,
      timestamp: getCurrentTime()
    };
    
    setMessages(prev => [...prev, userMsg]);

    // 2. Perform actions or load next step
    if (option.action === 'whatsapp') {
      const stepData = chatbotSteps[currentStep];
      const textMessage = stepData.finalMessage || 'Hi Subhaakritee, I would like to connect with a designer.';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (option.nextStep) {
      setCurrentStep(option.nextStep);
      setIsTyping(true);

      // Simulate typing indicator
      const timer = setTimeout(() => {
        const stepData = chatbotSteps[option.nextStep];
        const botMsgId = `bot_${Date.now()}`;
        const botMsg = {
          id: botMsgId,
          sender: 'bot',
          text: stepData.text,
          timestamp: getCurrentTime()
        };
        
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setIsTyping(true);
    setMessages([
      {
        id: `user_restart_${Date.now()}`,
        sender: 'user',
        text: '🔄 Restart Conversation',
        timestamp: getCurrentTime()
      }
    ]);

    const timer = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot_welcome_${Date.now()}`,
          sender: 'bot',
          text: chatbotSteps.welcome.text,
          timestamp: getCurrentTime()
        }
      ]);
      setIsTyping(false);
    }, 600);

    return () => clearTimeout(timer);
  };

  if (!isOpen) return null;

  // Active options based on current step
  const activeOptions = chatbotSteps[currentStep]?.options || [];

  return (
    <div className="fixed bottom-24 right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] bg-zinc-50 rounded-2xl shadow-2xl flex flex-col border border-zinc-200/80 overflow-hidden animate-fade-in-down select-none font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-inner overflow-hidden border border-emerald-500">
            <img src={SubhaakritiLogo} alt="Subhaakritee Logo" className="w-8 h-8 object-contain" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight">Subhaakritee Support</h4>
            <p className="text-xs text-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
              Online (Typically replies instantly)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRestart}
            title="Restart conversation"
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/90 hover:text-white cursor-pointer"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={onClose}
            title="Close chat"
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/90 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 hide-scrollbar bg-[#efeae2] relative">
        {/* Subtle WhatsApp-style wallpaper background detail */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className={`px-3 py-2 rounded-2xl shadow-sm text-sm ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none'
                : 'bg-white text-zinc-800 rounded-tl-none border border-zinc-200/50'
            }`}>
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
              <span className={`block text-[10px] text-right mt-1 ${
                msg.sender === 'user' ? 'text-emerald-100' : 'text-zinc-400'
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start max-w-[85%] mr-auto">
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-zinc-200/50 shadow-sm">
              <div className="flex gap-1 items-center h-2">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Interactive Options list */}
      <div className="p-3 bg-white border-t border-zinc-100 flex flex-col gap-2 shrink-0">
        {!isTyping && activeOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {activeOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className={`px-3 py-2 text-left text-xs font-medium rounded-xl border border-zinc-200 transition-all text-zinc-700 cursor-pointer shadow-sm ${
                    opt.action === 'whatsapp'
                      ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-300 text-emerald-800 font-semibold'
                      : 'bg-white hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Persistent, Always Available Direct Chat Option */}
        <div className="mt-1 pt-2 border-t border-zinc-100/80">
          <a
            href={defaultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 w-full text-xs font-semibold rounded-xl text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100 hover:border-emerald-200 cursor-pointer text-center"
          >
            <MessageCircle size={14} className="fill-current animate-pulse" />
            Chat Directly on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatbot;
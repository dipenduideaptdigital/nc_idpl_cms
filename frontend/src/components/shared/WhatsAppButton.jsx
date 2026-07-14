import React, { useState, useEffect } from 'react';
import WhatsAppChatbot from './WhatsAppChatbot';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);

  useEffect(() => {
    let timeoutId;

    const triggerPulse = () => {
      // Only pulse if the chat widget is closed
      if (!isOpen) {
        setShowPulse(true);
        // Turn off after 1 second (matching the animate-ping duration)
        timeoutId = setTimeout(() => {
          setShowPulse(false);
          // Wait 3 seconds before pulsing again
          timeoutId = setTimeout(triggerPulse, 3000);
        }, 1000);
      } else {
        setShowPulse(false);
      }
    };

    // Initial delay of 3 seconds before the first pulse
    timeoutId = setTimeout(triggerPulse, 3000);

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Handle welcome bubble timing (4 seconds after load)
  useEffect(() => {
    const dismissed = sessionStorage.getItem('wa_welcome_dismissed');
    const openedBefore = sessionStorage.getItem('wa_chatbot_opened');
    
    if (dismissed || openedBefore || isOpen) {
      setShowWelcomeBubble(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowWelcomeBubble(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(prev => {
      const nextState = !prev;
      if (nextState) {
        setShowWelcomeBubble(false);
        sessionStorage.setItem('wa_chatbot_opened', 'true');
      }
      return nextState;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Interactive Chatbot Dialog */}
      <WhatsAppChatbot isOpen={isOpen} onClose={handleClose} />

      <div className="flex items-center group relative mt-2">
        {/* Welcome Popup Bubble (nudges user to chat) */}
        {showWelcomeBubble && !isOpen && (
          <div className="absolute right-16 bottom-1 hidden sm:flex items-center gap-2 bg-white text-zinc-800 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-lg border border-zinc-200/60 whitespace-nowrap animate-fade-in-right z-[9999]">
            {/* Little pointer arrow */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rotate-45 bg-white border-r border-t border-zinc-200/60"></div>
            <span>💬 Chat with us for design services!</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWelcomeBubble(false);
                sessionStorage.setItem('wa_welcome_dismissed', 'true');
              }}
              className="p-0.5 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer flex items-center justify-center"
              title="Dismiss"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Regular Tooltip text (only when welcome bubble is hidden) */}
        {!showWelcomeBubble && !isOpen && (
          <span className="mr-3 px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-md translate-x-2 group-hover:translate-x-0">
            Chat with us
          </span>
        )}

        {/* Main Floating Action Button */}
        <button
          onClick={handleToggle}
          aria-label={isOpen ? "Close Chatbot" : "Open WhatsApp Chatbot"}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
            isOpen ? 'bg-zinc-800 hover:bg-zinc-900 text-white' : 'bg-[#25D366] hover:bg-[#20ba5a] text-white'
          }`}
        >
          {/* Pulse effect (only active when closed and pulsing is triggered) */}
          {showPulse && !isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"></span>
          )}

          {/* Animated Icon Rotation */}
          <div className={`transition-transform duration-300 flex items-center justify-center ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
            {isOpen ? (
              // Close X Icon
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // WhatsApp Brand Icon
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 fill-current z-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.797.001-2.618-1.01-5.078-2.852-6.92C16.386 2.05 13.927.817 11.32.817c-5.41 0-9.81 4.395-9.813 9.797-.002 1.83.476 3.62 1.39 5.2l-.233.851-.62 2.266 2.314-.607.889-.234zM16.5 13.568c-.244-.122-1.443-.712-1.667-.793-.223-.081-.385-.122-.547.122-.162.244-.63.793-.772.955-.143.162-.285.183-.528.061-.243-.122-1.028-.379-1.958-1.208-.724-.647-1.213-1.447-1.355-1.691-.143-.244-.015-.376.107-.497.11-.11.244-.285.365-.427.122-.142.162-.244.244-.406.081-.162.041-.305-.02-.427-.06-.122-.547-1.32-.75-1.81-.197-.477-.397-.412-.547-.419-.14-.007-.301-.008-.461-.008-.16 0-.423.06-.643.3-.22.24-.84.82-.84 2.002 0 1.183.86 2.325.98 2.487.12.162 1.695 2.587 4.105 3.62.573.246 1.02.393 1.368.503.576.183 1.1.157 1.514.096.462-.069 1.443-.59 1.647-1.162.203-.572.203-1.061.142-1.163-.06-.102-.223-.162-.467-.284z" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppButton;
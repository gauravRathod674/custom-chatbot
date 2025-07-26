import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// JSDoc for type-hinting in JS environments
/**
 * @typedef {Object} ChatBotTheme
 * @property {Object} launcher - Launcher button styles.
 * @property {string} launcher.backgroundColor - Background color for the launcher.
 * @property {string} launcher.iconColor - Color of the icon in the launcher.
 * @property {string} launcher.size - Size of the launcher button (e.g., '3rem').
 * @property {Object} header - Header styles.
 * @property {string} header.backgroundColor - Background color for the header.
 * @property {string} header.textColor - Text color for the header.
 * @property {string} header.fontFamily - Font family for the header.
 * @property {string} header.fontWeight - Font weight for the header.
 * @property {Object} messages - Message bubble styles.
 * @property {string} messages.userBackgroundColor - Background color for user messages.
 * @property {string} messages.userTextColor - Text color for user messages.
 * @property {string} messages.botBackgroundColor - Background color for bot messages.
 * @property {string} messages.botTextColor - Text color for bot messages.
 * @property {string} messages.fontFamily - Font family for messages.
 * @property {string} messages.fontSize - Font size for messages.
 * @property {boolean} messages.showAvatars - Whether to show avatars next to messages.
 * @property {string} messages.bubbleShape - Shape of the message bubbles ('rounded', 'square').
 * @property {boolean} messages.bubblePointer - Whether to show a pointer on the message bubble.
 * @property {Object} input - Input area styles.
 * @property {string} input.backgroundColor - Background color for the input bar.
 * @property {string} input.textColor - Text color for the input field.
 * @property {string} input.placeholderTextColor - Placeholder text color.
 * @property {string} input.borderColor - Border color for the input field.
 * @property {string} input.focusRingColor - Color of the focus ring on the input.
 * @property {Object} window - Main chat window styles.
 * @property {string} window.backgroundColor - Background color for the chat window.
 * @property {string} window.borderColor - Border color for the chat window.
 * @property {string} window.borderRadius - Border radius for the main window.
 * @property {string} window.width - Width of the chat window.
 * @property {string} window.height - Height of the chat window.
 * @property {string} window.placement - Placement on screen ('bottom-right', 'bottom-left').
 */

// --- Helper Components & Icons ---

const DefaultBotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" />
    <path d="M16.5 14C16.5 14 15 15.5 12 15.5C9 15.5 7.5 14 7.5 14" strokeLinecap="round" />
    <circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" />
  </svg>
);

const DefaultUserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" strokeLinecap="round" />
    <path d="M19.21 17.14C19.21 17.14 19 19 12 19C5 19 4.79 17.14 4.79 17.14C4.79 17.14 6.33 15 12 15C17.67 15 19.21 17.14 19.21 17.14Z" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

// --- Main ChatBot Component ---

/**
 * A highly customizable and performant React ChatBot component.
 * @param {object} props - The component props.
 * @param {string} [props.botName='ChatBot'] - The name displayed in the header.
 * @param {React.ReactNode} [props.botAvatar=<DefaultBotIcon />] - Avatar for the bot. Can be a component or a URL string.
 * @param {React.ReactNode} [props.userAvatar=<DefaultUserIcon />] - Avatar for the user.
 * @param {string} [props.welcomeMessage='Hello! How can I help?'] - The initial message from the bot.
 * @param {string} [props.placeholderText='Type a message...'] - Placeholder for the text input.
 * @param {boolean} [props.isOpen=false] - Controls if the chat window is open initially.
 * @param {boolean} [props.disabled=false] - Disables the input field.
 * @param {boolean} [props.isTyping=false] - Shows a typing indicator.
 * @param {function(string): void} [props.onSend] - Callback function when a user sends a message. Receives the message text.
 * @param {ChatBotTheme} [props.theme] - Theming options for the chatbot.
 */
const ChatBot = ({
  botName = 'ChatBot',
  botAvatar = <DefaultBotIcon />,
  userAvatar = <DefaultUserIcon />,
  welcomeMessage = 'Hello! How can I help?',
  placeholderText = 'Type a message...',
  isOpen: initialIsOpen = false,
  disabled = false,
  isTyping = false,
  onSend = () => {},
  theme = {},
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [messages, setMessages] = useState([{ id: 1, text: welcomeMessage, sender: 'bot' }]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const launcherRef = useRef(null);
  const windowRef = useRef(null);

  // --- Theming Engine ---
  const mergedTheme = useMemo(() => {
    const defaultTheme = {
      launcher: { backgroundColor: '#4f46e5', iconColor: '#ffffff', size: '3.5rem' },
      header: { backgroundColor: '#4f46e5', textColor: '#ffffff', fontFamily: 'inherit', fontWeight: '600' },
      messages: {
        userBackgroundColor: '#4f46e5', userTextColor: '#ffffff',
        botBackgroundColor: '#f3f4f6', botTextColor: '#1f2937',
        fontFamily: 'inherit', fontSize: '0.9rem',
        showAvatars: true, bubbleShape: 'rounded', bubblePointer: true,
      },
      input: {
        backgroundColor: '#ffffff', textColor: '#1f2937',
        placeholderTextColor: '#9ca3af', borderColor: '#e5e7eb',
        focusRingColor: '#4f46e5',
      },
      window: {
        backgroundColor: '#ffffff', borderColor: '#e5e7eb',
        borderRadius: '0.75rem', width: '22rem', height: '30rem',
        placement: 'bottom-right',
      },
    };
    // Deep merge user theme with defaults
    return {
      launcher: { ...defaultTheme.launcher, ...theme.launcher },
      header: { ...defaultTheme.header, ...theme.header },
      messages: { ...defaultTheme.messages, ...theme.messages },
      input: { ...defaultTheme.input, ...theme.input },
      window: { ...defaultTheme.window, ...theme.window },
    };
  }, [theme]);

  // --- CSS Variables for Performant Theming ---
  const cssVariables = useMemo(() => ({
    // Launcher
    '--chatbot-launcher-bg': mergedTheme.launcher.backgroundColor,
    '--chatbot-launcher-icon-color': mergedTheme.launcher.iconColor,
    '--chatbot-launcher-size': mergedTheme.launcher.size,
    // Header
    '--chatbot-header-bg': mergedTheme.header.backgroundColor,
    '--chatbot-header-text-color': mergedTheme.header.textColor,
    '--chatbot-header-font-family': mergedTheme.header.fontFamily,
    '--chatbot-header-font-weight': mergedTheme.header.fontWeight,
    // Messages
    '--chatbot-user-msg-bg': mergedTheme.messages.userBackgroundColor,
    '--chatbot-user-msg-text-color': mergedTheme.messages.userTextColor,
    '--chatbot-bot-msg-bg': mergedTheme.messages.botBackgroundColor,
    '--chatbot-bot-msg-text-color': mergedTheme.messages.botTextColor,
    '--chatbot-msg-font-family': mergedTheme.messages.fontFamily,
    '--chatbot-msg-font-size': mergedTheme.messages.fontSize,
    // Input
    '--chatbot-input-bg': mergedTheme.input.backgroundColor,
    '--chatbot-input-text-color': mergedTheme.input.textColor,
    '--chatbot-input-placeholder-color': mergedTheme.input.placeholderTextColor,
    '--chatbot-input-border-color': mergedTheme.input.borderColor,
    '--chatbot-input-focus-ring': mergedTheme.input.focusRingColor,
    // Window
    '--chatbot-window-bg': mergedTheme.window.backgroundColor,
    '--chatbot-window-border-color': mergedTheme.window.borderColor,
    '--chatbot-window-border-radius': mergedTheme.window.borderRadius,
    '--chatbot-window-width': mergedTheme.window.width,
    '--chatbot-window-height': mergedTheme.window.height,
  }), [mergedTheme]);

  // --- Effects ---

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  // Handle 'Escape' key to close chat
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // --- Handlers ---

  const handleSend = useCallback(() => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || disabled) return;

    const newMessage = { id: Date.now(), text: trimmedInput, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    onSend(trimmedInput);
    setInputValue('');
  }, [inputValue, disabled, onSend]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  // --- Sub-Components ---

  const renderAvatar = (avatar) => {
    if (typeof avatar === 'string') {
      return <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />;
    }
    return <div className="w-8 h-8 rounded-full text-gray-500">{avatar}</div>;
  };

  const placementClasses = {
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
  };

  const bubbleShapeClasses = {
    rounded: `rounded-xl`,
    square: `rounded-md`,
  };

  return (
    <div style={cssVariables} className="font-sans">
      {/* --- Launcher Button --- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            onClick={() => setIsOpen(true)}
            aria-label="Open Chat"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed ${placementClasses[mergedTheme.window.placement] || placementClasses['bottom-right']} z-50 rounded-full shadow-lg flex items-center justify-center cursor-pointer border-2 border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--chatbot-launcher-bg]`}
            style={{
              backgroundColor: 'var(--chatbot-launcher-bg)',
              color: 'var(--chatbot-launcher-icon-color)',
              width: 'var(--chatbot-launcher-size)',
              height: 'var(--chatbot-launcher-size)',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2/3 h-2/3"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.15c-.81.033-1.534.626-1.744 1.416l-1.02 3.988c-.382 1.48-.M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- Chat Window --- */}
      <AnimatePresence>
        {isOpen && (
          <div
            ref={windowRef}
            aria-modal="true"
            role="dialog"
            className={`fixed ${placementClasses[mergedTheme.window.placement] || placementClasses['bottom-right']} z-50 flex flex-col overflow-hidden shadow-2xl border`}
            style={{
                width: 'var(--chatbot-window-width)',
                height: 'var(--chatbot-window-height)',
                borderRadius: 'var(--chatbot-window-border-radius)',
                backgroundColor: 'var(--chatbot-window-bg)',
                borderColor: 'var(--chatbot-window-border-color)',
            }}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-3 flex-shrink-0" style={{ background: 'var(--chatbot-header-bg)', color: 'var(--chatbot-header-text-color)' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center p-1">{renderAvatar(botAvatar)}</div>
                <span style={{ fontFamily: 'var(--chatbot-header-font-family)', fontWeight: 'var(--chatbot-header-font-weight)' }} className="text-lg">{botName}</span>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close Chat" className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>

            {/* Message List */}
            <div role="log" aria-live="polite" className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end max-w-[85%] gap-2 ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                  {mergedTheme.messages.showAvatars && <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">{renderAvatar(msg.sender === 'user' ? userAvatar : botAvatar)}</div>}
                  <div
                    className={`px-3 py-2 ${bubbleShapeClasses[mergedTheme.messages.bubbleShape] || bubbleShapeClasses.rounded} ${mergedTheme.messages.bubblePointer ? (msg.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none') : ''}`}
                    style={{
                      backgroundColor: msg.sender === 'user' ? 'var(--chatbot-user-msg-bg)' : 'var(--chatbot-bot-msg-bg)',
                      color: msg.sender === 'user' ? 'var(--chatbot-user-msg-text-color)' : 'var(--chatbot-bot-msg-text-color)',
                      fontFamily: 'var(--chatbot-msg-font-family)',
                      fontSize: 'var(--chatbot-msg-font-size)',
                    }}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end max-w-[85%] gap-2 mr-auto">
                  {mergedTheme.messages.showAvatars && <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">{renderAvatar(botAvatar)}</div>}
                  <div className={`px-3 py-2 ${bubbleShapeClasses[mergedTheme.messages.bubbleShape] || bubbleShapeClasses.rounded} rounded-bl-none`} style={{ backgroundColor: 'var(--chatbot-bot-msg-bg)' }}>
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input / Composer */}
            <footer className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--chatbot-window-border-color)', backgroundColor: 'var(--chatbot-input-bg)' }}>
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholderText}
                  disabled={disabled || isTyping}
                  aria-label="Chat input"
                  className="flex-1 w-full px-4 py-2 bg-transparent rounded-full border focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    color: 'var(--chatbot-input-text-color)',
                    borderColor: 'var(--chatbot-input-border-color)',
                    '--tw-ring-color': 'var(--chatbot-input-focus-ring)',
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || disabled || isTyping}
                  aria-label="Send Message"
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--chatbot-user-msg-bg)',
                    color: 'var(--chatbot-user-msg-text-color)',
                    '--tw-ring-color': 'var(--chatbot-user-msg-bg)',
                  }}
                >
                  <SendIcon />
                </button>
              </div>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;

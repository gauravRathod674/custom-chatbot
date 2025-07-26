import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ——— Default Icons ——————————————————————————————

const DefaultBotAvatar = () => (
  <svg className="w-full h-full text-gray-500" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 11h.01M15 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 15c1.333-1.333 5.333-1.333 6.667 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const DefaultUserAvatar = () => (
  <svg className="w-full h-full text-gray-500" viewBox="0 0 24 24" fill="none">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

// ——— ChatBot Component ——————————————————————————

const ChatBot = ({
  // — Core copy & behavior
  botName            = 'ChatBot',
  welcomeMessage     = 'Hello! How can I assist you today?',
  placeholderText    = 'Type your message…',
  sendButtonLabel    = null,              // text instead of icon
  sendIcon           = null,              // custom ReactNode icon
  showTimestamps     = false,
  timestampFormat    = ts => new Date(ts).toLocaleTimeString(),
  autoFocus          = true,
  sendOnEnter        = true,

  // — Avatars & icons
  botAvatar          = <DefaultBotAvatar />,
  userAvatar         = <DefaultUserAvatar />,

  // — Theming & typography
  theme: {
    primaryColor         = '#4f46e5',
    secondaryColor       = '#e5e7eb',
    backgroundColor      = '#ffffff',
    userTextColor        = '#ffffff',
    botTextColor         = '#111827',
    headerTextColor      = '#ffffff',
    placeholderTextColor = '#6b7280',
    fontFamily           = 'system-ui, sans-serif',
    fontSize             = '14px',
    lineHeight           = '1.5',
    headerFontSize       = '16px',
    headerFontWeight     = '600',
    bubbleFontWeight     = '400',
    bubbleShape          = 'pill',         // 'pill'|'rounded'|'square'
    bubblePointer        = true,
    bubblePadding        = '0.5rem 1rem',
    bubbleMargin         = '0.25rem 0',
    windowPadding        = '0',
    inputHeight          = '2.5rem',
    inputPadding         = '0.5rem 1rem',
    borderRadius         = '1rem',
    inputBorderRadius    = '9999px',
    borderColor          = '#d1d5db',
    shadowIntensity      = '0 4px 12px rgba(0,0,0,0.1)',
    transitionDuration   = 0.2,
    typingIndicatorStyle = 'dots',         // 'dots'|'bar'|'none'
    typingDelay          = 500,            // ms
    openCloseAnimation   = 'scale',        // 'fade'|'slide'|'scale'
    placement            = 'bottom-right', // 'bottom-left','top-right','top-left'
    launcherSize         = '3rem',
    launcherIcon         = '💬',
    mode                 = 'light',        // 'light'|'dark'
  } = {},

  // — Layout & wrapper
  isOpen: initialOpen = true,
  showLauncher        = true,
  launcherPosition    = null,             // override placement
  backdrop            = false,
  zIndex              = 1000,

  // — ClassName & style overrides
  wrapperClassName    = '',
  headerClassName     = '',
  messageClassName    = '',
  userMessageClassName= '',
  botMessageClassName = '',
  inputClassName      = '',
  launcherClassName   = '',

  // — Callbacks
  onSend              = () => {},
  onReceive           = () => {},
  onError             = () => {},
}) => {
  const [isOpen, setIsOpen]     = useState(initialOpen)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: welcomeMessage, timestamp: Date.now() }
  ])
  const [inputValue, setInputValue] = useState('')
  const scrollRef               = useRef()

  // auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Placement classes
  const placementMap = {
    'bottom-right': 'bottom-5 right-5',
    'bottom-left':  'bottom-5 left-5',
    'top-right':    'top-5 right-5',
    'top-left':     'top-5 left-5',
  }
  const containerPos = placementMap[launcherPosition || placement] || placementMap['bottom-right']

  // Add message helper
  const addMessage = (sender, text) => {
    const msg = { id: Date.now(), sender, text, timestamp: Date.now() }
    setMessages(m => [...m, msg])
    return msg
  }

  // Handle send
  const handleSend = () => {
    if (!inputValue.trim()) return
    const userMsg = addMessage('user', inputValue.trim())
    setInputValue('')
    onSend(userMsg)
    // stub typing & bot reply
    if (typingIndicatorStyle !== 'none') {
      addMessage('bot', '…') // show typing
      setTimeout(() => {
        setMessages(m => m.filter(x => x.text !== '…'))
        const botMsg = addMessage('bot', 'This is a placeholder reply.')
        onReceive(botMsg)
      }, typingDelay)
    }
  }

  // Render avatars
  const renderAvatar = avatar =>
    typeof avatar === 'string'
      ? <img src={avatar} className="w-8 h-8 rounded-full" />
      : <div className="w-8 h-8 rounded-full overflow-hidden">{avatar}</div>

  // Styles
  const wrapperStyle = {
    fontFamily,
    fontSize,
    lineHeight,
    zIndex,
  }
  const headerStyle = {
    backgroundColor: primaryColor,
    color: headerTextColor,
    fontSize: headerFontSize,
    fontWeight: headerFontWeight,
    padding: '0.75rem 1rem',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  }
  const windowStyle = {
    backgroundColor,
    padding: windowPadding,
    boxShadow: shadowIntensity,
    border: `1px solid ${borderColor}`,
    borderRadius,
    display: 'flex',
    flexDirection: 'column',
    width: '20rem',
    height: '24rem',
    overflow: 'hidden',
  }
  const bubbleBase = {
    borderRadius: bubbleShape === 'pill' ? '9999px' : borderRadius,
    padding: bubblePadding,
    margin: bubbleMargin,
    maxWidth: '80%',
    transition: `background-color ${transitionDuration}s`,
    fontWeight: bubbleFontWeight,
  }
  const bubbleStyle = sender => ({
    ...bubbleBase,
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' ? primaryColor : secondaryColor,
    color: sender === 'user' ? userTextColor : botTextColor,
  })
  const inputWrapperStyle = {
    display: 'flex',
    borderTop: `1px solid ${borderColor}`,
    padding: '0.5rem',
    alignItems: 'center',
  }
  const inputStyle = {
    flex: 1,
    height: inputHeight,
    padding: inputPadding,
    borderRadius: inputBorderRadius,
    border: `1px solid ${borderColor}`,
    outline: 'none',
    color: mode === 'dark' ? '#f3f4f6' : '#111827',
    backgroundColor: mode === 'dark' ? '#1f2937' : '#f9fafb',
    fontSize,
  }
  const sendBtnStyle = {
    backgroundColor: primaryColor,
    color: userTextColor,
    width: inputHeight,
    height: inputHeight,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.5rem',
    cursor: 'pointer',
    transition: `background-color ${transitionDuration}s`,
  }
  const launcherStyle = {
    backgroundColor: primaryColor,
    color: userTextColor,
    width: launcherSize,
    height: launcherSize,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: shadowIntensity,
  }

  return (
    <div style={wrapperStyle} className={`fixed ${containerPos} ${wrapperClassName}`}>
      {/* Optional backdrop */}
      {backdrop && isOpen && (
        <div className="fixed inset-0 bg-black opacity-30"></div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={openCloseAnimation === 'scale' ? { scale: 0.8, opacity: 0 } : openCloseAnimation === 'fade' ? { opacity: 0 } : { x: 100, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={openCloseAnimation === 'scale' ? { scale: 0.8, opacity: 0 } : openCloseAnimation === 'fade' ? { opacity: 0 } : { x: 100, opacity: 0 }}
            transition={{ duration: transitionDuration }}
            style={windowStyle}
          >
            {/* Header */}
            <div style={headerStyle} className={`flex items-center justify-between ${headerClassName}`}>
              <div className="flex items-center space-x-2">
                {renderAvatar(botAvatar)}
                <span>{botName}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:opacity-80 focus:outline-none">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: transitionDuration }}
                  style={bubbleStyle(msg.sender)}
                  className={`${messageClassName} ${msg.sender === 'user' ? userMessageClassName : botMessageClassName}`}
                >
                  <div className="flex items-end">
                    {msg.sender === 'bot' && renderAvatar(botAvatar)}
                    <div className="mx-2 break-words">{msg.text}</div>
                    {msg.sender === 'user' && renderAvatar(userAvatar)}
                  </div>
                  {showTimestamps && (
                    <div className="text-xs mt-1 text-gray-400 text-right">
                      {timestampFormat(msg.timestamp)}
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div style={inputWrapperStyle}>
              <input
                type="text"
                autoFocus={autoFocus}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={placeholderText}
                style={inputStyle}
                className={inputClassName}
                onKeyDown={e => sendOnEnter && e.key === 'Enter' && handleSend()}
              />
              <div style={sendBtnStyle} onClick={handleSend}>
                {sendButtonLabel || sendIcon || <span className="text-xl select-none">➤</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      {showLauncher && !isOpen && (
        <div style={launcherStyle} className={launcherClassName} onClick={() => setIsOpen(true)}>
          {launcherIcon}
        </div>
      )}
    </div>
  )
}

export default ChatBot

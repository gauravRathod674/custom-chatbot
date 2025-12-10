import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faTimes,
  faFileAlt,
  faPaperclip,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";

// ==========================================
// SECTION 1: UTILITIES & ICONS
// Motivation: Extract "dumb" helpers out of the main logic
// ==========================================

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });

const DefaultBotIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-full h-full"
  >
    <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" />
    <path
      d="M16.5 14C16.5 14 15 15.5 12 15.5C9 15.5 7.5 14 7.5 14"
      strokeLinecap="round"
    />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
  </svg>
);

const DefaultUserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-full h-full"
  >
    <path
      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
      strokeLinecap="round"
    />
    <path
      d="M19.21 17.14C19.21 17.14 19 19 12 19C5 19 4.79 17.14 4.79 17.14C4.79 17.14 6.33 15 12 15C17.67 15 19.21 17.14 19.21 17.14Z"
      strokeLinecap="round"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9" />
  </svg>
);

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

// ==========================================
// SECTION 2: ANIMATION COMPONENTS
// Motivation: Separation of concerns (Presentation vs Logic)
// ==========================================

const DynamicTypingEffect = ({ fullText, onComplete, components }) => {
  const safeText = typeof fullText === "string" ? fullText : "";
  const [textToDisplay, setTextToDisplay] = useState("");

  useEffect(() => {
    if (safeText.length === 0) {
      onComplete?.();
      return;
    }
    let i = 0;
    setTextToDisplay("");
    const intervalId = setInterval(() => {
      if (i < safeText.length) {
        setTextToDisplay((prev) => prev + safeText.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, 25);
    return () => clearInterval(intervalId);
  }, [safeText, onComplete]);

  return (
    <div
      className="prose prose-sm max-w-none text-inherit prose-p:my-0 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5"
      style={{ color: "inherit" }}
    >
      <ReactMarkdown components={components}>
        {textToDisplay || ""}
      </ReactMarkdown>
    </div>
  );
};

// Refactoring: Replace Conditional with Polymorphism (in UI rendering)
const AnimatedResponseMessage = ({ text, animationType, components }) => {
  const markdownClasses =
    "prose prose-sm max-w-none text-inherit prose-p:my-0 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5";
  const content = (
    <div className={markdownClasses}>
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );

  switch (animationType) {
    case "typing":
      return <DynamicTypingEffect fullText={text} components={components} />;
    case "fade-in":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      );
    case "slide-up":
      return (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "anticipate" }}
        >
          {content}
        </motion.div>
      );
    case "zoom-in":
      return (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
        >
          {content}
        </motion.div>
      );
    case "flip":
      return (
        <motion.div
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformPerspective: 400 }}
        >
          {content}
        </motion.div>
      );
    default:
      return content;
  }
};

// ==========================================
// SECTION 3: SERVICES & LOGIC HOOKS
// Motivation: "Move Function" & "Extract Class" - Clean Service Layer
// ==========================================

const formatHistoryForApi = (messages) => {
  if (!messages || messages.length === 0) return [];

  // Refactoring: "Split Loop" - Merging messages logic isolated here
  const mergedMessages = messages.reduce((acc, current) => {
    const lastMessage = acc[acc.length - 1];
    if (lastMessage && lastMessage.sender === current.sender) {
      acc[acc.length - 1] = {
        ...lastMessage,
        text: `${lastMessage.text}\n${current.text}`,
      };
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, []);

  let apiHistory = mergedMessages.map((msg) => ({
    role: msg.sender === "bot" ? "model" : "user",
    parts: [{ text: msg.text }],
  }));

  const firstUserIndex = apiHistory.findIndex((msg) => msg.role === "user");
  return firstUserIndex > -1 ? apiHistory.slice(firstUserIndex) : [];
};

// Refactoring: Custom Hook for Theme Logic (Extract Method)
const useChatTheme = (theme, chatbotId) => {
  return useMemo(() => {
    const isCenter = theme?.window?.placement === "center";
    const defaults = {
      launcher: {
        backgroundColor: "#4f46e5",
        iconColor: "#ffffff",
        size: "3.5rem",
      },
      header: {
        backgroundColor: "#4f46e5",
        textColor: "#ffffff",
        fontFamily: "inherit",
        fontWeight: "600",
      },
      messages: {
        userBackgroundColor: "#4f46e5",
        userTextColor: "#ffffff",
        botBackgroundColor: "#f3f4f6",
        botTextColor: "#1f2937",
        fontFamily: "inherit",
        fontSize: "0.9rem",
        showAvatars: true,
        bubbleShape: "rounded",
        bubblePointer: true,
        animation: "fade-in",
        markdownStyles: {},
      },
      input: {
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        placeholderTextColor: "#9ca3af",
        borderColor: "#e5e7eb",
        focusRingColor: "#4f46e5",
      },
      window: {
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderRadius: "0.75rem",
        width: isCenter ? "80vw" : "22rem",
        height: isCenter ? "80vh" : "30rem",
        placement: "bottom-right",
        backdrop: false,
        backdropColor: "rgba(0,0,0,0.4)",
        backdropBlur: "4px",
        scrollbarThumbColor: "#a1a1aa",
        scrollbarTrackColor: "#f1f5f9",
      },
    };

    const merged = {
      launcher: { ...defaults.launcher, ...theme.launcher },
      header: { ...defaults.header, ...theme.header },
      messages: { ...defaults.messages, ...theme.messages },
      input: { ...defaults.input, ...theme.input },
      window: { ...defaults.window, ...theme.window },
    };

    const cssVars = {
      "--chatbot-launcher-bg": merged.launcher.backgroundColor,
      "--chatbot-launcher-icon-color": merged.launcher.iconColor,
      "--chatbot-launcher-size": merged.launcher.size,
      "--chatbot-header-bg": merged.header.backgroundColor,
      "--chatbot-header-text-color": merged.header.textColor,
      "--chatbot-header-font-family": merged.header.fontFamily,
      "--chatbot-header-font-weight": merged.header.fontWeight,
      "--chatbot-user-msg-bg": merged.messages.userBackgroundColor,
      "--chatbot-user-msg-text-color": merged.messages.userTextColor,
      "--chatbot-bot-msg-bg": merged.messages.botBackgroundColor,
      "--chatbot-bot-msg-text-color": merged.messages.botTextColor,
      "--chatbot-msg-font-family": merged.messages.fontFamily,
      "--chatbot-msg-font-size": merged.messages.fontSize,
      "--chatbot-input-bg": merged.input.backgroundColor,
      "--chatbot-input-text-color": merged.input.textColor,
      "--chatbot-input-placeholder-color": merged.input.placeholderTextColor,
      "--chatbot-input-border-color": merged.input.borderColor,
      "--chatbot-input-focus-ring": merged.input.focusRingColor,
      "--chatbot-window-bg": merged.window.backgroundColor,
      "--chatbot-window-border-color": merged.window.borderColor,
      "--chatbot-window-border-radius": merged.window.borderRadius,
      "--chatbot-window-width": merged.window.width,
      "--chatbot-window-height": merged.window.height,
    };

    return { mergedTheme: merged, cssVariables: cssVars };
  }, [theme]);
};

// Refactoring: Custom Hook for Speech (Separation of Concerns)
const useSpeechRecognition = (onResult) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = false;
      recog.lang = "en-US";
      recog.onstart = () => setIsRecording(true);
      recog.onresult = (evt) => {
        const transcript = evt.results[evt.results.length - 1][0].transcript;
        onResult(transcript);
      };
      recognitionRef.current = recog;
    }
  }, [onResult]);

  const startRecording = () => recognitionRef.current?.start();
  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return { isRecording, startRecording, stopRecording };
};

// ==========================================
// SECTION 4: SUB-COMPONENTS
// Motivation: "Extract Component" - Breaking the monolithic render
// ==========================================

const FilePreview = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  if (!file) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative inline-flex items-center gap-2 p-2 mb-2 bg-[--chatbot-bot-msg-bg] rounded-lg border border-[--chatbot-input-border-color] max-w-xs">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black/20 rounded-md">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <FontAwesomeIcon
              icon={faFileAlt}
              className="w-5 h-5 text-white/70"
            />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p
            className="text-sm font-medium text-[--chatbot-input-text-color] truncate"
            title={file.name}
          >
            {file.name}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 w-2 h-2 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

const ChatHeader = ({ botName, botAvatar, onClose, theme }) => (
  <header
    className="flex items-center justify-between p-3 flex-shrink-0"
    style={{
      background: "var(--chatbot-header-bg)",
      color: "var(--chatbot-header-text-color)",
    }}
  >
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center p-1">
        {typeof botAvatar === "string" ? (
          <img
            src={botAvatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full text-gray-500">{botAvatar}</div>
        )}
      </div>
      <span
        style={{
          fontFamily: "var(--chatbot-header-font-family)",
          fontWeight: "var(--chatbot-header-font-weight)",
        }}
        className="text-lg"
      >
        {botName}
      </span>
    </div>
    <button
      onClick={onClose}
      className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </header>
);

const MessageList = ({
  messages,
  isTyping,
  theme,
  botAvatar,
  userAvatar,
  messagesEndRef,
  markdownComponents,
}) => {
  const bubbleShapeClasses = { rounded: `rounded-xl`, square: `rounded-md` };

  const renderAvatar = (avatar) =>
    typeof avatar === "string" ? (
      <img
        src={avatar}
        alt="avatar"
        className="w-7 h-7 rounded-full object-cover"
      />
    ) : (
      <div className="w-7 h-7 rounded-full text-gray-500">{avatar}</div>
    );

  return (
    <div
      role="log"
      aria-live="polite"
      className="chatbot-message-list flex-1 p-4 overflow-y-auto space-y-4"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex items-end max-w-[85%] gap-2 ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {theme.messages.showAvatars && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                {renderAvatar(msg.sender === "user" ? userAvatar : botAvatar)}
              </div>
            )}

            <div
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Attachment */}
              {msg.sender === "user" && msg.attachment && (
                <div
                  className={`p-2 mb-1 max-w-full self-end ${
                    bubbleShapeClasses[theme.messages.bubbleShape] ||
                    bubbleShapeClasses.rounded
                  } ${
                    !msg.text && theme.messages.bubblePointer
                      ? "rounded-br-none"
                      : ""
                  }`}
                  style={{
                    backgroundColor: "var(--chatbot-user-msg-bg)",
                    color: "var(--chatbot-user-msg-text-color)",
                  }}
                >
                  {msg.attachment.previewUrl ? (
                    <img
                      src={msg.attachment.previewUrl}
                      alt={msg.attachment.name}
                      className="w-full h-auto object-cover rounded-md max-w-[200px]"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                      <span className="truncate">{msg.attachment.name}</span>
                    </div>
                  )}
                </div>
              )}
              {/* Text */}
              {msg.text && (
                <motion.div
                  layout="position"
                  className={`px-3 py-2 ${
                    bubbleShapeClasses[theme.messages.bubbleShape] ||
                    bubbleShapeClasses.rounded
                  } ${
                    theme.messages.bubblePointer
                      ? msg.sender === "user"
                        ? "rounded-br-none"
                        : "rounded-bl-none"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      msg.sender === "user"
                        ? "var(--chatbot-user-msg-bg)"
                        : "var(--chatbot-bot-msg-bg)",
                    color:
                      msg.sender === "user"
                        ? "var(--chatbot-user-msg-text-color)"
                        : "var(--chatbot-bot-msg-text-color)",
                    fontFamily: "var(--chatbot-msg-font-family)",
                    fontSize: "var(--chatbot-msg-font-size)",
                  }}
                >
                  {msg.sender === "bot" && index === messages.length - 1 ? (
                    <AnimatedResponseMessage
                      text={msg.text}
                      animationType={theme.messages.animation}
                      components={markdownComponents}
                    />
                  ) : (
                    <div
                      className="prose prose-sm max-w-none text-inherit prose-p:my-0"
                      style={{ color: "inherit" }}
                    >
                      <ReactMarkdown components={markdownComponents}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isTyping && (
        <div className="flex items-end max-w-[85%] gap-2 mr-auto">
          {theme.messages.showAvatars && (
            <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
              {renderAvatar(botAvatar)}
            </div>
          )}
          <div
            className={`px-3 py-2 ${
              bubbleShapeClasses[theme.messages.bubbleShape] ||
              bubbleShapeClasses.rounded
            } rounded-bl-none`}
            style={{ backgroundColor: "var(--chatbot-bot-msg-bg)" }}
          >
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

const ChatInput = ({
  inputValue,
  setInputValue,
  handleSend,
  handleKeyPress,
  isRecording,
  startRecording,
  stopRecording,
  file,
  setFile,
  fileInputRef,
  enableFileUpload,
  enableMicrophone,
  fileUploadAccept,
  onFileUpload,
  disabled,
  placeholderText,
}) => {
  const inputRef = useRef(null);

  // Auto-resize textarea logic
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    const threshold = 4;
    const needsScrollbar =
      textarea.scrollHeight - textarea.clientHeight > threshold;
    textarea.style.overflowY = needsScrollbar ? "auto" : "hidden";
  }, [inputValue]);

  return (
    <footer
      className="p-3 border-t flex-shrink-0"
      style={{
        borderColor: "var(--chatbot-window-border-color)",
        backgroundColor: "var(--chatbot-input-bg)",
      }}
    >
      <AnimatePresence>
        {file && <FilePreview file={file} onRemove={() => setFile(null)} />}
      </AnimatePresence>

      <div className="flex items-end space-x-2">
        {enableFileUpload && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "var(--chatbot-user-msg-bg)",
                color: "var(--chatbot-user-msg-text-color)",
              }}
            >
              <FontAwesomeIcon icon={faPaperclip} className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  onFileUpload(f);
                }
                e.target.value = null;
              }}
              accept={fileUploadAccept}
              style={{ display: "none" }}
            />
          </>
        )}
        <textarea
          ref={inputRef}
          rows="1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholderText}
          disabled={disabled}
          className="chatbot-textarea-input flex-1 w-full px-4 py-2 bg-transparent rounded-xl border focus:outline-none focus:ring-2 resize-none"
          style={{
            color: "var(--chatbot-input-text-color)",
            borderColor: "var(--chatbot-input-border-color)",
            "--tw-ring-color": "var(--chatbot-input-focus-ring)",
            maxHeight: "100px",
            lineHeight: "1.5",
          }}
        />

        {isRecording ? (
          <motion.button
            onClick={stopRecording}
            animate={{ opacity: [1, 0.8, 1], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="px-4 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors"
            style={{
              backgroundColor: "var(--chatbot-user-msg-bg)",
              color: "var(--chatbot-user-msg-text-color)",
            }}
          >
            <FontAwesomeIcon icon={faMicrophoneSlash} className="w-5 h-5" />
          </motion.button>
        ) : enableMicrophone && !inputValue.trim() ? (
          <motion.button
            onClick={startRecording}
            className="px-4 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors"
            style={{
              backgroundColor: "var(--chatbot-user-msg-bg)",
              color: "var(--chatbot-user-msg-text-color)",
            }}
          >
            <FontAwesomeIcon icon={faMicrophone} className="w-5 h-5" />
          </motion.button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
            className="px-4 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "var(--chatbot-user-msg-bg)",
              color: "var(--chatbot-user-msg-text-color)",
            }}
          >
            <SendIcon />
          </button>
        )}
      </div>
    </footer>
  );
};

// ==========================================
// SECTION 5: MAIN CHATBOT COMPONENT
// Motivation: "Controller" component - Only handles coordination
// ==========================================

const ChatBot = ({
  botName = "ChatBot",
  botAvatar = <DefaultBotIcon />,
  userAvatar = <DefaultUserIcon />,
  welcomeMessage = "Hello! How can I help?",
  placeholderText = "Type a message...",
  customInstruction = "",
  isOpen: initialIsOpen = false,
  disabled = false,
  isTyping: parentIsTyping = false,
  onSend = () => {},
  theme = {},
  geminiApiKey,
  geminiModelName = "gemini-1.5-flash",
  openaiApiKey,
  openaiModelName = "gpt-4o-mini",
  anthropicApiKey,
  anthropicModelName = "claude-3-haiku-20240307",
  grokApiKey,
  grokModelName = "llama3-8b-8192",
  messages: controlledMessages,
  enableMicrophone,
  enableFileUpload = false,
  fileUploadAccept = "*",
  onFileUpload = () => {},
}) => {
  // State Initialization
  const [chatbotId] = useState(
    () => `chatbot-${Math.random().toString(36).substring(2, 9)}`
  );
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [internalMessages, setInternalMessages] = useState(() =>
    welcomeMessage ? [{ id: 1, text: welcomeMessage, sender: "bot" }] : []
  );
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [file, setFile] = useState(null);

  // Controlled vs Uncontrolled State
  const isControlled = typeof controlledMessages !== "undefined";
  const messages = isControlled ? controlledMessages : internalMessages;
  const setMessages = isControlled ? () => {} : setInternalMessages;

  // Hooks & Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const windowRef = useRef(null);
  const launcherRef = useRef(null);

  // Use Custom Hooks (Logic moved out of component)
  const { mergedTheme, cssVariables } = useChatTheme(theme, chatbotId);
  const { isRecording, startRecording, stopRecording } = useSpeechRecognition(
    (text) => setInputValue((prev) => prev + (prev ? " " : "") + text)
  );

  // Markdown Styling
  const markdownComponents = useMemo(() => {
    const styles = mergedTheme.messages.markdownStyles || {};
    return {
      strong: (props) => (
        <strong style={{ color: styles.boldColor || "inherit" }} {...props} />
      ),
      em: (props) => (
        <em style={{ color: styles.italicColor || "inherit" }} {...props} />
      ),
      a: (props) => (
        <a style={{ color: styles.linkColor || "#3b82f6" }} {...props} />
      ),
      code: (props) => (
        <code
          style={{
            color: styles.codeColor || "inherit",
            backgroundColor: styles.codeBackgroundColor || "rgba(0,0,0,0.1)",
            padding: "0.1rem 0.3rem",
            borderRadius: "0.25rem",
          }}
          {...props}
        />
      ),
    };
  }, [mergedTheme.messages.markdownStyles]);

  // Scrollbar Styles Injection (Logic preserved)
  useEffect(() => {
    const styleId = `scrollbar-${chatbotId}`;
    const { scrollbarThumbColor, scrollbarTrackColor } = mergedTheme.window;
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      #${chatbotId} .chatbot-message-list, #${chatbotId} .chatbot-textarea-input { scrollbar-width: thin; scrollbar-color: ${scrollbarThumbColor} ${scrollbarTrackColor}; }
      #${chatbotId} ::-webkit-scrollbar { width: 8px; }
      #${chatbotId} ::-webkit-scrollbar-track { background: ${scrollbarTrackColor}; border-radius: 4px; }
      #${chatbotId} ::-webkit-scrollbar-thumb { background: ${scrollbarThumbColor}; border-radius: 4px; border: 2px solid ${scrollbarTrackColor}; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(styleId)?.remove();
  }, [chatbotId, mergedTheme.window]);

  // Effects for focus and scrolling
  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages, isBotTyping, parentIsTyping]
  );
  useEffect(() => {
    if (!isOpen) launcherRef.current?.focus();
  }, [isOpen]);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);
  useEffect(() => setIsBotTyping(parentIsTyping), [parentIsTyping]);

  // API Clients (Memoized)
  const gemini = useMemo(
    () =>
      geminiApiKey
        ? new GoogleGenerativeAI(geminiApiKey).getGenerativeModel({
            model: geminiModelName,
            systemInstruction: customInstruction,
          })
        : null,
    [geminiApiKey, geminiModelName, customInstruction]
  );
  const openai = useMemo(
    () =>
      openaiApiKey
        ? new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true })
        : null,
    [openaiApiKey]
  );
  const anthropic = useMemo(
    () =>
      anthropicApiKey
        ? new Anthropic({
            apiKey: anthropicApiKey,
            dangerouslyAllowBrowser: true,
          })
        : null,
    [anthropicApiKey]
  );
  const grok = useMemo(
    () =>
      grokApiKey
        ? new Groq({ apiKey: grokApiKey, dangerouslyAllowBrowser: true })
        : null,
    [grokApiKey]
  );

  // Main Handle Send (Logic Refactored but preserved)
  const handleSend = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if ((!trimmedInput && !file) || disabled || isBotTyping || parentIsTyping)
      return;

    const attachmentData = file
      ? {
          name: file.name,
          type: file.type,
          size: file.size,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        }
      : null;
    const userMessage = {
      id: `user-${Date.now()}`,
      text: trimmedInput,
      sender: "user",
      attachment: attachmentData,
    };

    if (!isControlled) setMessages((prev) => [...prev, userMessage]);
    onSend(trimmedInput, file);
    setInputValue("");
    setIsBotTyping(true);
    const fileToSend = file;
    setFile(null);

    let botText = "Sorry, an error occurred.";
    try {
      if (gemini) {
        const chat = gemini.startChat({
          history: formatHistoryForApi(messages),
        });
        const parts = [trimmedInput];
        if (fileToSend)
          parts.push({
            inlineData: {
              data: await fileToBase64(fileToSend),
              mimeType: fileToSend.type,
            },
          });
        const result = await chat.sendMessage(parts);
        botText = (await result.response).text();
      } else if (openai) {
        const content = [{ type: "text", text: trimmedInput }];
        if (fileToSend && fileToSend.type.startsWith("image/"))
          content.push({
            type: "image_url",
            image_url: {
              url: `data:${fileToSend.type};base64,${await fileToBase64(
                fileToSend
              )}`,
            },
          });
        const resp = await openai.chat.completions.create({
          model: openaiModelName,
          messages: [
            ...messages.map((m) => ({
              role: m.sender === "bot" ? "assistant" : "user",
              content: m.text,
            })),
            { role: "user", content },
          ],
        });
        botText = resp.choices?.[0]?.message?.content || "";
      } else if (anthropic) {
        const content = [{ type: "text", text: trimmedInput }];
        if (fileToSend && fileToSend.type.startsWith("image/"))
          content.unshift({
            type: "image",
            source: {
              type: "base64",
              media_type: fileToSend.type,
              data: await fileToBase64(fileToSend),
            },
          });
        const resp = await anthropic.messages.create({
          model: anthropicModelName,
          system: customInstruction,
          messages: [
            ...messages.map((m) => ({
              role: m.sender === "bot" ? "assistant" : "user",
              content: m.text,
            })),
            { role: "user", content },
          ],
          max_tokens: 1024,
        });
        botText = resp.content?.[0]?.text || "";
      } else if (grok) {
        if (fileToSend) botText = "Note: Groq does not support files.\n\n";
        const resp = await grok.chat.completions.create({
          model: grokModelName,
          messages: [
            ...messages.map((m) => ({
              role: m.sender === "bot" ? "assistant" : "user",
              content: m.text,
            })),
            { role: "user", content: trimmedInput },
          ],
        });
        botText += resp.choices[0]?.message?.content || "";
      } else {
        await new Promise((r) => setTimeout(r, 800));
        botText = `You said: "${trimmedInput}"${
          fileToSend ? ` (with file: ${fileToSend.name})` : ""
        }`;
      }
    } catch (e) {
      console.error(e);
      botText = "Error processing request.";
    } finally {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, text: botText, sender: "bot" },
      ]);
      setIsBotTyping(false);
    }
  }, [
    inputValue,
    file,
    disabled,
    isBotTyping,
    parentIsTyping,
    messages,
    gemini,
    openai,
    anthropic,
    grok,
    customInstruction,
    geminiModelName,
    openaiModelName,
    anthropicModelName,
    grokModelName,
    isControlled,
    onSend,
    setMessages,
  ]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isCenter = mergedTheme.window.placement === "center";
  const placementClasses = {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div id={chatbotId} style={cssVariables} className="font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={launcherRef}
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-10 right-10 z-50 rounded-full shadow-lg flex items-center justify-center cursor-pointer border-2 border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--chatbot-launcher-bg]"
            style={{
              backgroundColor: "var(--chatbot-launcher-bg)",
              color: "var(--chatbot-launcher-icon-color)",
              width: "var(--chatbot-launcher-size)",
              height: "var(--chatbot-launcher-size)",
            }}
          >
            <FontAwesomeIcon icon={faCommentDots} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && isCenter && mergedTheme.window.backdrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: mergedTheme.window.backdropColor,
              backdropFilter: `blur(${mergedTheme.window.backdropBlur})`,
              WebkitBackdropFilter: `blur(${mergedTheme.window.backdropBlur})`,
            }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {isOpen && (
          <div
            ref={windowRef}
            role="dialog"
            className={`fixed ${
              placementClasses[mergedTheme.window.placement] ||
              placementClasses["bottom-right"]
            } z-50 flex flex-col overflow-hidden shadow-2xl border`}
            style={{
              width: "var(--chatbot-window-width)",
              height: "var(--chatbot-window-height)",
              borderRadius: "var(--chatbot-window-border-radius)",
              backgroundColor: "var(--chatbot-window-bg)",
              borderColor: "var(--chatbot-window-border-color)",
            }}
          >
            <ChatHeader
              botName={botName}
              botAvatar={botAvatar}
              onClose={() => setIsOpen(false)}
              theme={mergedTheme}
            />

            <MessageList
              messages={messages}
              isTyping={isBotTyping || parentIsTyping}
              theme={mergedTheme}
              botAvatar={botAvatar}
              userAvatar={userAvatar}
              messagesEndRef={messagesEndRef}
              markdownComponents={markdownComponents}
            />

            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSend={handleSend}
              handleKeyPress={handleKeyPress}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              file={file}
              setFile={setFile}
              fileInputRef={fileInputRef}
              enableFileUpload={enableFileUpload}
              enableMicrophone={enableMicrophone}
              fileUploadAccept={fileUploadAccept}
              onFileUpload={onFileUpload}
              disabled={disabled || isBotTyping || parentIsTyping}
              placeholderText={placeholderText}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;

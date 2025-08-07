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
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";

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
 * @property {('fade-in' | 'typing' | 'none')} [messages.animation='fade-in'] - Animation for new bot messages.
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
 * @property {string} [window.scrollbarThumbColor] - Color of the scrollbar thumb.
 * @property {string} [window.scrollbarTrackColor] - Color of the scrollbar track.
 * @property {string} input.micBackgroundColor - background of mic button
 * @property {string} input.micIconColor - color of mic icon
 */

// --- Helper Components & Icons ---
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

// --- Animation Components ---
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
        const nextChar = safeText.charAt(i);
        setTextToDisplay((prev) => prev + nextChar);
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

const AnimatedResponseMessage = ({ text, animationType, components }) => {
  const markdownClasses =
    "prose prose-sm max-w-none text-inherit prose-p:my-0 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5";

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
          <div className={markdownClasses}>
            <ReactMarkdown components={components}>{text}</ReactMarkdown>
          </div>
        </motion.div>
      );
    case "slide-up":
      return (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "anticipate" }}
        >
          <div className={markdownClasses}>
            <ReactMarkdown components={components}>{text}</ReactMarkdown>
          </div>
        </motion.div>
      );
    case "zoom-in":
      return (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
        >
          <div className={markdownClasses}>
            <ReactMarkdown components={components}>{text}</ReactMarkdown>
          </div>
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
          <div className={markdownClasses}>
            <ReactMarkdown components={components}>{text}</ReactMarkdown>
          </div>
        </motion.div>
      );
    default:
      return (
        <div className={markdownClasses}>
          <ReactMarkdown components={components}>{text}</ReactMarkdown>
        </div>
      );
  }
};

const formatHistoryForApi = (messages) => {
  const history = [];
  if (!messages || messages.length === 0) {
    return history;
  }

  // Merge consecutive messages from the same sender
  const mergedMessages = messages.reduce((acc, current) => {
    const lastMessage = acc.length > 0 ? acc[acc.length - 1] : null;

    if (lastMessage && lastMessage.sender === current.sender) {
      // Create a new object with the updated text
      const updatedLastMessage = {
        ...lastMessage,
        text: `${lastMessage.text}\n${current.text}`,
      };
      // Replace the last item with the new, updated object
      acc[acc.length - 1] = updatedLastMessage;
    } else {
      // Push a shallow copy of the current message
      acc.push({ ...current });
    }
    return acc;
  }, []);

  // Map to the Gemini API format
  let apiHistory = mergedMessages.map((msg) => ({
    role: msg.sender === "bot" ? "model" : "user",
    parts: [{ text: msg.text }],
  }));

  // Ensure the history starts with a user message
  const firstUserIndex = apiHistory.findIndex((msg) => msg.role === "user");
  if (firstUserIndex > -1) {
    apiHistory = apiHistory.slice(firstUserIndex);
  } else {
    // If no user messages exist at all, return an empty history
    return [];
  }

  return apiHistory;
};

// --- Main ChatBot Component ---

/**
 * A highly customizable and performant React ChatBot component.
 * @param {object} props - The component props.
 * @param {string} [props.botName='ChatBot'] - The name displayed in the header.
 * @param {React.ReactNode} [props.botAvatar=<DefaultBotIcon />] - Avatar for the bot. Can be a component or a URL string.
 * @param {React.ReactNode} [props.userAvatar=<DefaultUserIcon />] - Avatar for the user.
 * @param {string} [props.welcomeMessage='Hello! How can I help?'] - The initial message from the bot.
 * @param {string} [props.placeholderText='Type a message...'] - Placeholder for the text input.
 * @param {string} [props.customInstruction] - A system prompt to define the bot's persona or behavior.
 * @param {boolean} [props.isOpen=false] - Controls if the chat window is open initially.
 * @param {boolean} [props.disabled=false] - Disables the input field.
 * @param {boolean} [props.isTyping=false] - Shows a typing indicator controlled by the parent.
 * @param {function(string): void} [props.onSend] - Callback function when a user sends a message. Receives the message text.
 * @param {ChatBotTheme} [props.theme] - Theming options for the chatbot.
 */
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
  googleSTTCredentialsPath,
}) => {
  const [chatbotId] = useState(
    () => `chatbot-instance-${Math.random().toString(36).substring(2, 9)}`
  );
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [internalMessages, setInternalMessages] = useState(() => {
    return welcomeMessage
      ? [{ id: 1, text: welcomeMessage, sender: "bot" }]
      : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const isControlled = typeof controlledMessages !== "undefined";
  const messages = isControlled ? controlledMessages : internalMessages;
  const setMessages = isControlled ? () => {} : setInternalMessages;

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const launcherRef = useRef(null);
  const windowRef = useRef(null);

  const recognitionRef = useRef(null);

  // Gemini client
  const geminiModel = useMemo(() => {
    if (!geminiApiKey) return null;
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      // Embed the custom instruction directly into the model's configuration
      return genAI.getGenerativeModel({
        model: geminiModelName,
        systemInstruction: customInstruction,
      });
    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
      return null;
    }
  }, [geminiApiKey, geminiModelName, customInstruction]); // Re-initialize if instruction changes

  // OpenAI client
  const openai = useMemo(() => {
    if (!openaiApiKey) return null;
    return new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true });
  }, [openaiApiKey]);

  // Anthropic (Claude) client
  const anthropic = useMemo(() => {
    if (!anthropicApiKey) return null;
    return new Anthropic({
      apiKey: anthropicApiKey,
      dangerouslyAllowBrowser: true,
    });
  }, [anthropicApiKey]);

  // Groq client
  const grok = useMemo(() => {
    if (!grokApiKey) return null;
    return new Groq({ apiKey: grokApiKey, dangerouslyAllowBrowser: true });
  }, [grokApiKey]);

  // --- Theming Engine ---
  const mergedTheme = useMemo(() => {
    const isCenterPlacement = theme?.window?.placement === "center";

    const defaultTheme = {
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
        width: isCenterPlacement ? "80vw" : "22rem",
        height: isCenterPlacement ? "80vh" : "30rem",
        placement: "bottom-right",

        backdrop: false,
        backdropColor: "rgba(0, 0, 0, 0.4)",
        backdropBlur: "4px",

        scrollbarThumbColor: "#a1a1aa", // neutral-400
        scrollbarTrackColor: "#f1f5f9", // slate-100
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
  const cssVariables = useMemo(
    () => ({
      // Launcher
      "--chatbot-launcher-bg": mergedTheme.launcher.backgroundColor,
      "--chatbot-launcher-icon-color": mergedTheme.launcher.iconColor,
      "--chatbot-launcher-size": mergedTheme.launcher.size,
      // Header
      "--chatbot-header-bg": mergedTheme.header.backgroundColor,
      "--chatbot-header-text-color": mergedTheme.header.textColor,
      "--chatbot-header-font-family": mergedTheme.header.fontFamily,
      "--chatbot-header-font-weight": mergedTheme.header.fontWeight,
      // Messages
      "--chatbot-user-msg-bg": mergedTheme.messages.userBackgroundColor,
      "--chatbot-user-msg-text-color": mergedTheme.messages.userTextColor,
      "--chatbot-bot-msg-bg": mergedTheme.messages.botBackgroundColor,
      "--chatbot-bot-msg-text-color": mergedTheme.messages.botTextColor,
      "--chatbot-msg-font-family": mergedTheme.messages.fontFamily,
      "--chatbot-msg-font-size": mergedTheme.messages.fontSize,
      // Input
      "--chatbot-input-bg": mergedTheme.input.backgroundColor,
      "--chatbot-input-text-color": mergedTheme.input.textColor,
      "--chatbot-input-placeholder-color":
        mergedTheme.input.placeholderTextColor,
      "--chatbot-input-border-color": mergedTheme.input.borderColor,
      "--chatbot-input-focus-ring": mergedTheme.input.focusRingColor,
      // Window
      "--chatbot-window-bg": mergedTheme.window.backgroundColor,
      "--chatbot-window-border-color": mergedTheme.window.borderColor,
      "--chatbot-window-border-radius": mergedTheme.window.borderRadius,
      "--chatbot-window-width": mergedTheme.window.width,
      "--chatbot-window-height": mergedTheme.window.height,
    }),
    [mergedTheme]
  );

  const markdownComponents = useMemo(() => {
    const styles = mergedTheme.messages.markdownStyles || {};
    return {
      strong: ({ node, ...props }) => (
        <strong style={{ color: styles.boldColor || "inherit" }} {...props} />
      ),
      em: ({ node, ...props }) => (
        <em style={{ color: styles.italicColor || "inherit" }} {...props} />
      ),
      a: ({ node, ...props }) => (
        <a style={{ color: styles.linkColor || "#3b82f6" }} {...props} />
      ),
      code: ({ node, ...props }) => (
        <code
          style={{
            color: styles.codeColor || "inherit",
            backgroundColor: styles.codeBackgroundColor || "rgba(0, 0, 0, 0.1)",
            padding: "0.1rem 0.3rem",
            borderRadius: "0.25rem",
          }}
          {...props}
        />
      ),
    };
  }, [mergedTheme.messages.markdownStyles]);

  // --- Effects ---

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true; // 🔁 Keep listening until stopped manually
      recog.interimResults = false;
      recog.lang = "en-US";

      recog.onstart = () => setIsRecording(true);

      recog.onresult = (evt) => {
        const transcript = evt.results[evt.results.length - 1][0].transcript;
        setInputValue((prev) => prev + (prev ? " " : "") + transcript);
      };

      recog.onerror = (e) => {
        console.error("Speech error:", e);
      };

      recog.onend = () => {
        // ❌ DO NOT set isRecording false here
        // We'll stop explicitly with stopRecording
      };

      recognitionRef.current = recog;
    }
  }, []);

  useEffect(() => {
    const thumbColor = mergedTheme.window.scrollbarThumbColor;
    const trackColor = mergedTheme.window.scrollbarTrackColor;
    const styleId = `scrollbar-style-${chatbotId}`;

    // Remove any old style element before adding a new one
    document.getElementById(styleId)?.remove();

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.innerHTML = `
      /* Target both the message list and the textarea input */
      #${chatbotId} .chatbot-message-list,
      #${chatbotId} .chatbot-textarea-input {
        scrollbar-width: thin;
        scrollbar-color: ${thumbColor} ${trackColor};
      }
      /* WebKit-based browsers (Chrome, Safari, Edge) */
      #${chatbotId} .chatbot-message-list::-webkit-scrollbar,
      #${chatbotId} .chatbot-textarea-input::-webkit-scrollbar {
        width: 8px;
      }
      #${chatbotId} .chatbot-message-list::-webkit-scrollbar-track,
      #${chatbotId} .chatbot-textarea-input::-webkit-scrollbar-track {
        background: ${trackColor};
        border-radius: 4px;
      }
      #${chatbotId} .chatbot-message-list::-webkit-scrollbar-thumb,
      #${chatbotId} .chatbot-textarea-input::-webkit-scrollbar-thumb {
        background-color: ${thumbColor};
        border-radius: 4px;
        border: 2px solid ${trackColor};
      }
    `;
    document.head.appendChild(styleElement);

    // Cleanup function to remove the style when the component unmounts
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [
    chatbotId,
    mergedTheme.window.scrollbarThumbColor,
    mergedTheme.window.scrollbarTrackColor,
  ]);

  useEffect(() => {
    setIsBotTyping(parentIsTyping);
  }, [parentIsTyping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping, parentIsTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    // Show scrollbar only if scrollHeight exceeds clientHeight significantly
    const threshold = 4; // 4px buffer for browser quirks
    const needsScrollbar =
      textarea.scrollHeight - textarea.clientHeight > threshold;

    textarea.style.overflowY = needsScrollbar ? "auto" : "hidden";
  }, [inputValue]);

  // --- Handlers ---

  const handleSend = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || disabled || isBotTyping || parentIsTyping) return;

    const newUserMessage = {
      id: Date.now(),
      text: trimmedInput,
      sender: "user",
    };
    const newMessages = [...messages, newUserMessage];

    if (!isControlled) {
      setMessages((prev) => [...prev, newUserMessage]);
    }
    onSend(trimmedInput);
    setInputValue("");

    if (geminiModel) {
      setIsBotTyping(true);
      try {
        const chatHistory = formatHistoryForApi(newMessages);

        const historyForContext = chatHistory.slice(0, -1);
        const lastUserMessage =
          chatHistory[chatHistory.length - 1]?.parts[0]?.text || "";

        const chat = geminiModel.startChat({ history: historyForContext });
        const result = await chat.sendMessage(lastUserMessage);

        const response = await result.response;
        const text = (await response.text()) || "(no response)";

        const botResponse = { id: Date.now() + 1, text, sender: "bot" };
        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error("Gemini API Error:", error);
        const errorResponse = {
          id: Date.now() + 1,
          text: "Sorry, an error occurred. Please try again.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorResponse]);
      } finally {
        setIsBotTyping(false);
      }
    } else if (openai) {
      setIsBotTyping(true);
      try {
        const systemMessage = customInstruction
          ? [{ role: "system", content: customInstruction }]
          : [];

        const historyForContext = messages.map((msg) => ({
          role: msg.sender === "bot" ? "assistant" : "user",
          content: msg.text,
        }));

        const resp = await openai.chat.completions.create({
          model: openaiModelName,
          messages: [
            ...systemMessage,
            ...historyForContext,
            { role: "user", content: trimmedInput },
          ],
        });
        const text =
          resp.choices?.[0]?.message?.content?.trim() || "(no response)";

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text, sender: "bot" },
        ]);
      } catch (err) {
        console.error("OpenAI Error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "Sorry, something went wrong with OpenAI.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsBotTyping(false);
      }
    } else if (anthropic) {
      setIsBotTyping(true);
      try {
        const anthropicHistory = messages.map((msg) => ({
          role: msg.sender === "bot" ? "assistant" : "user",
          content: msg.text,
        }));

        const msg = await anthropic.messages.create({
          model: anthropicModelName,
          system: customInstruction, // Pass instruction to the dedicated 'system' parameter
          messages: [
            ...anthropicHistory,
            { role: "user", content: trimmedInput },
          ],
          max_tokens: 1024,
        });

        const text = msg.content[0]?.text?.trim() || "(no response)";

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text, sender: "bot" },
        ]);
      } catch (err) {
        console.error("Anthropic API Error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "Sorry, an error occurred with Claude.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsBotTyping(false);
      }
    } else if (grok) {
      setIsBotTyping(true);
      try {
        const systemMessage = customInstruction
          ? [{ role: "system", content: customInstruction }]
          : [];

        const grokHistory = messages.map((msg) => ({
          role: msg.sender === "bot" ? "assistant" : "user",
          content: msg.text,
        }));

        const chatCompletion = await grok.chat.completions.create({
          messages: [
            ...systemMessage,
            ...grokHistory,
            { role: "user", content: trimmedInput },
          ],
          model: grokModelName,
        });

        const text =
          chatCompletion.choices[0]?.message?.content?.trim() ||
          "(no response)";

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text, sender: "bot" },
        ]);
      } catch (err) {
        console.error("Groq API Error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "Sorry, an error occurred with Groq.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsBotTyping(false);
      }
    } else if (!isControlled) {
      setIsBotTyping(true);
      setTimeout(() => {
        const defaultBotResponse = {
          id: Date.now() + 1,
          text: `You said: "${trimmedInput}"`,
          sender: "bot",
        };
        setMessages((prev) => [...prev, defaultBotResponse]);
        setIsBotTyping(false);
      }, 800);
    }
  }, [
    inputValue,
    disabled,
    isBotTyping,
    parentIsTyping,
    onSend,
    geminiModel,
    openai,
    anthropic,
    grok,
    isControlled,
    messages,
    setMessages,
    openaiModelName,
    anthropicModelName,
    grokModelName,
    customInstruction, // Add to dependency array
  ]);

  const handleKeyPress = useCallback(
    (e) => {
      // Send message on Enter, but allow new lines with Shift+Enter
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevents adding a new line
        handleSend();
      }
    },
    [handleSend]
  );

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- Sub-Components ---

  const renderAvatar = (avatar) => {
    if (typeof avatar === "string") {
      return (
        <img
          src={avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return <div className="w-8 h-8 rounded-full text-gray-500">{avatar}</div>;
  };

  const totalTypingStatus = isBotTyping || parentIsTyping;

  const placementClasses = {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const isCenterPlacement = mergedTheme.window.placement === "center";

  const bubbleShapeClasses = {
    rounded: `rounded-xl`,
    square: `rounded-md`,
  };

  return (
    <div id={chatbotId} style={cssVariables} className="font-sans">
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
            transition={{ duration: 0.2, ease: "easeOut" }}
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

      {/* --- Chat Window --- */}
      <AnimatePresence>
        {isOpen && isCenterPlacement && mergedTheme.window.backdrop && (
          <motion.div
            key="chatbot-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: mergedTheme.window.backdropColor,
              backdropFilter: `blur(${mergedTheme.window.backdropBlur})`,
              // For Safari compatibility
              WebkitBackdropFilter: `blur(${mergedTheme.window.backdropBlur})`,
            }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {isOpen && (
          <div
            key="chatbot-window"
            ref={windowRef}
            aria-modal="true"
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
            {/* Header */}
            <header
              className="flex items-center justify-between p-3 flex-shrink-0"
              style={{
                background: "var(--chatbot-header-bg)",
                color: "var(--chatbot-header-text-color)",
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center p-1">
                  {renderAvatar(botAvatar)}
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
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
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

            {/* Message List */}
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
                      msg.sender === "user"
                        ? "ml-auto flex-row-reverse"
                        : "mr-auto"
                    }`}
                  >
                    {mergedTheme.messages.showAvatars && (
                      <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                        {renderAvatar(
                          msg.sender === "user" ? userAvatar : botAvatar
                        )}
                      </div>
                    )}
                    <motion.div
                      layout="position"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`px-3 py-2 ${
                        bubbleShapeClasses[mergedTheme.messages.bubbleShape] ||
                        bubbleShapeClasses.rounded
                      } ${
                        mergedTheme.messages.bubblePointer
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
                          animationType={mergedTheme.messages.animation}
                          components={markdownComponents}
                        />
                      ) : (
                        <div
                          className="prose prose-sm max-w-none text-inherit prose-p:my-0 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5"
                          style={{ color: "inherit" }}
                        >
                          <ReactMarkdown components={markdownComponents}>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {totalTypingStatus && (
                <div
                  key="typing-indicator"
                  className="flex items-end max-w-[85%] gap-2 mr-auto"
                >
                  {" "}
                  {mergedTheme.messages.showAvatars && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                      {renderAvatar(botAvatar)}
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 ${
                      bubbleShapeClasses[mergedTheme.messages.bubbleShape] ||
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

            {/* Input / Composer */}
            <footer
              className="p-3 border-t flex-shrink-0"
              style={{
                borderColor: "var(--chatbot-window-border-color)",
                backgroundColor: "var(--chatbot-input-bg)",
              }}
            >
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  rows="1"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress} // Use onKeyDown instead of onKeyPress
                  placeholder={placeholderText}
                  disabled={disabled || totalTypingStatus}
                  aria-label="Chat input"
                  className="chatbot-textarea-input flex-1 w-full px-4 py-2 bg-transparent rounded-xl border focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 resize-none overflow-hidden"
                  style={{
                    color: "var(--chatbot-input-text-color)",
                    borderColor: "var(--chatbot-input-border-color)",
                    "--tw-ring-color": "var(--chatbot-input-focus-ring)",
                    maxHeight: "100px", // Set a max-height before scrollbar appears
                    overflowY: "hidden", // Add scrollbar when content exceeds max-height
                    lineHeight: "1.5",
                  }}
                />
                {!googleSTTCredentialsPath || inputValue.trim() ? (
                  // **SEND** button when there is text
                  <button
                    onClick={handleSend}
                    disabled={
                      !inputValue.trim() || disabled || totalTypingStatus
                    }
                    aria-label="Send Message"
                    className="px-4 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--chatbot-user-msg-bg)",
                      color: "var(--chatbot-user-msg-text-color)",
                      "--tw-ring-color": "var(--chatbot-user-msg-bg)",
                    }}
                  >
                    <SendIcon />
                  </button>
                ) : (
                  // Show Mic if no text and STT is enabled
                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    aria-label={
                      isRecording ? "Stop Recording" : "Start Recording"
                    }
                    className="px-4 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--chatbot-user-msg-bg)",
                      color: "var(--chatbot-user-msg-text-color)",
                      "--tw-ring-color": "var(--chatbot-user-msg-bg)",
                    }}
                    animate={
                      isRecording
                        ? { opacity: [1, 0.8, 1], scale: [1, 1.1, 1] }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={
                      isRecording
                        ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                        : {}
                    }
                  >
                    <FontAwesomeIcon
                      icon={isRecording ? faMicrophoneSlash : faMicrophone}
                      className="w-5 h-5"
                    />
                  </motion.button>
                )}
              </div>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;

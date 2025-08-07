import React from "react";
import ChatBot from "./components/ChatBot";
import "./App.css";

const GEMINI_API_KEY = "GEMINI_API_KEY";

// --- SVG Icons for Feature Cards ---
const IconApi = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
    />
  </svg>
);
const IconTheme = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 01-3.388-1.62m-16.5 7.499a15.993 15.993 0 0016.5 0m-16.5 0a15.993 15.993 0 0116.5 0m0 0a15.993 15.993 0 00-16.5 0"
    />
  </svg>
);
const IconBrain = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.4-1.4l-1.188-.648 1.188-.648a2.25 2.25 0 011.4-1.4l.648-1.188.648 1.188a2.25 2.25 0 011.4 1.4l1.188.648-1.188.648a2.25 2.25 0 01-1.4 1.4z"
    />
  </svg>
);
const IconAnimate = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
    />
  </svg>
);
const IconMarkdown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    />
  </svg>
);
const IconMore = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
  </svg>
);

const FeatureCard = ({ icon, title, children }) => (
  <div className="relative p-6 bg-slate-900/70 border border-blue-500/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-blue-400/50 hover:bg-slate-900 hover:-translate-y-1 shadow-lg shadow-slate-950/50 hover:shadow-xl hover:shadow-violet-500/20">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-200">{title}</h3>
    </div>
    <p className="mt-4 text-slate-400 text-left">{children}</p>
  </div>
);

const GlowingOrbIcon = () => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient
        id="orbGradient"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" style={{ stopColor: "#e9d5ff", stopOpacity: 1 }} />
        <stop offset="60%" style={{ stopColor: "#c084fc", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <g filter="url(#glow)">
      <circle cx="50" cy="50" r="30" fill="url(#orbGradient)" />
      <path
        d="M 25 50 A 25 25 0 0 1 75 50"
        stroke="#f5d0fe"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(45 50 50)"
      />
      <path
        d="M 25 50 A 25 25 0 0 0 75 50"
        stroke="#f5d0fe"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(-45 50 50)"
      />
      <path
        d="M 50 20 A 30 30 0 0 1 50 80"
        stroke="#f5d0fe"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(90 50 50)"
      />
    </g>
  </svg>
);

function App() {
  const glassTheme = {
    launcher: { backgroundColor: "#a855f7", iconColor: "#ffffff" },
    header: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      textColor: "#f9fafb",
      fontFamily: "'Inter', sans-serif",
    },
    window: {
      backgroundColor: "rgba(17, 24, 39, 0.7)",
      borderColor: "rgba(168, 85, 247, 0.3)",
      borderRadius: "1rem",
      placement: "center",
      width: "min(640px, 90vw)",
      height: "min(720px, 80vh)",
      backdrop: true,
      backdropColor: "rgba(0, 0, 0, 0.6)",
      backdropBlur: "12px",
      scrollbarThumbColor: "#a855f7",
      scrollbarTrackColor: "rgba(255, 255, 255, 0.05)",
    },
    messages: {
      userBackgroundColor: "#7e22ce",
      userTextColor: "#ffffff",
      botBackgroundColor: "rgba(255, 255, 255, 0.1)",
      botTextColor: "#f3f4f6",
      fontFamily: "'Inter', sans-serif",
      bubbleShape: "rounded",
      animation: "typing",
      // **NEW:** Complete Markdown styling for a cohesive look
      markdownStyles: {
        boldColor: "#c084fc",
        italicColor: "#a78bfa",
        linkColor: "#818cf8",
        codeColor: "#f5d0fe",
        codeBackgroundColor: "rgba(0, 0, 0, 0.3)",
      },
    },
    input: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      textColor: "#f9fafb",
      placeholderTextColor: "#9ca3af",
      borderColor: "rgba(168, 85, 247, 0.3)",
      focusRingColor: "#d8b4fe",
    },
  };

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,#000,rgba(0,0,0,0.6))]"></div>
      <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3)_0,rgba(139,92,246,0)_50%)] animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
            Super Customizable ChatBot
          </h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl">
            A live demonstration of the component's powerful features and
            theming capabilities.
          </p>
        </header>

        <div className="w-full max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<IconApi />} title="Multi-API Support">
              Integrates with Gemini, OpenAI, Claude, and Groq. Just provide
              your API key and select a model.
            </FeatureCard>
            <FeatureCard icon={<IconTheme />} title="Deep Theming">
              Customize every color, font, border, and size using a simple theme
              object to match your brand.
            </FeatureCard>
            <FeatureCard icon={<IconBrain />} title="Custom Instructions">
              Define a unique persona and set of rules for your chatbot using
              the `customInstruction` prop.
            </FeatureCard>
            <FeatureCard icon={<IconAnimate />} title="Engaging Animations">
              Choose from multiple message animations, including a smooth
              "typing" effect to enhance user experience.
            </FeatureCard>
            <FeatureCard icon={<IconMarkdown />} title="Markdown Rendering">
              Automatically renders rich, formatted messages from the AI's
              response, including lists and bold text.
            </FeatureCard>
            <FeatureCard icon={<IconMore />} title="And Much More...">
              Includes controlled/uncontrolled modes, accessibility features,
              flexible placement, and much more.
            </FeatureCard>
          </div>
        </div>

        <div className="h-24"></div>

        <ChatBot
          botName="Aura AI"
          botAvatar={<GlowingOrbIcon />}
          isOpen={false}
          geminiApiKey={GEMINI_API_KEY}
          geminiModelName="gemini-1.5-pro-latest"
          customInstruction="You are Aura AI, a cutting-edge assistant. Your answers should be clear, concise, and have a slightly futuristic tone. Use markdown like **bold**, *italics*, and lists where appropriate."
          welcomeMessage="System online. I am Aura AI. How may I assist you with your query?"
          placeholderText="Enter your query..."
          theme={glassTheme}
          googleSTTCredentialsPath="src/nexus-text-to-speech-50d75f778774.json"
        />
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { ChatBot } from './index'; // Use the library's barrel file export
import './App.css'; // Keep this for any global playground styles

// --- Custom Icon Component for the "Power User" Bot ---
const GeniusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 5.25v13.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a9 9 0 018.883 9.75H3.117A9 9 0 0112 3.75z" />
  </svg>
);


function App() {
  // --- State Management for the "Power User" Bot ---
  // This demonstrates how a real app would manage the conversation flow.
  const [powerUserMessages, setPowerUserMessages] = useState([
    { id: 1, text: "I am a fully controlled bot. Ask me anything!", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- API Simulation for the "Power User" Bot ---
  const handlePowerUserSend = (userMessage) => {
    // 1. Add the user's message to the state
    setPowerUserMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);

    // 2. Show the typing indicator
    setIsTyping(true);

    // 3. Simulate a network request to an AI API
    setTimeout(() => {
      const botResponse = `This is my simulated AI response to: "${userMessage}"`;
      
      // 4. Add the bot's response
      setPowerUserMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
      
      // 5. Hide the typing indicator
      setIsTyping(false);
    }, 2000); // 2-second delay
  };

  // --- Theme for the "Themer" Bot ---
  const corporateTheme = {
    launcher: { backgroundColor: '#1e3a8a', iconColor: '#dbeafe' },
    header: { backgroundColor: '#1e3a8a', textColor: '#eff6ff' },
    messages: {
      userBackgroundColor: '#2563eb',
      botBackgroundColor: '#eef2ff',
      botTextColor: '#1e3a8a',
      bubbleShape: 'square',
      bubblePointer: false,
    },
    input: {
      focusRingColor: '#2563eb',
    },
    window: {
      placement: 'bottom-left',
      borderRadius: '0.25rem',
      borderColor: '#dbeafe',
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full font-sans text-gray-800 p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-900">ChatBot Component Playground</h1>
        <p className="text-gray-600 mt-3 text-lg">
          A showcase of the <code>ChatBot</code> library's versatility and customization.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        
        {/* --- Example 1: Zero-Config User --- */}
        {/* <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-blue-800">1. The "Plug & Play" User</h2>
          <p className="mb-4 text-gray-600">This developer wants a chatbot that just works. No props are passed, so the component uses its beautiful, built-in defaults.</p>
          <code className="block bg-gray-100 p-2 rounded-md text-sm mb-4 text-gray-700">&lt;ChatBot /&gt;</code>
          <ChatBot />
        </div> */}

        {/* --- Example 2: Minimalist User --- */}
        {/* <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-green-800">2. The "Minimalist" User</h2>
          <p className="mb-4 text-gray-600">This developer only needs to change the bot's identity. They pass a few simple props to set the name and welcome message.</p>
          <code className="block bg-gray-100 p-2 rounded-md text-sm mb-4 text-gray-700">&lt;ChatBot botName="Greeter" ... /&gt;</code>
          <ChatBot
            botName="Greeter"
            welcomeMessage="Hi there! Just wanted to say hello."
          />
        </div> */}

        {/* --- Example 3: The Themer --- */}
        {/* <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-indigo-800">3. The "Brand-Conscious" Themer</h2>
          <p className="mb-4 text-gray-600">This developer needs the chatbot to match their corporate branding. They pass a comprehensive `theme` object to control all colors and styles.</p>
          <code className="block bg-gray-100 p-2 rounded-md text-sm mb-4 text-gray-700">&lt;ChatBot theme={'{...}'} ... /&gt;</code>
          <ChatBot
            botName="CorpBot"
            botAvatar="https://placehold.co/40x40/1e3a8a/ffffff?text=C"
            welcomeMessage="Welcome. How may I be of assistance to your enterprise today?"
            placeholderText="Enter corporate inquiry..."
            theme={corporateTheme}
          />
        </div> */}

        {/* --- Example 4: The Power User --- */}
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-purple-800">4. The "Power User"</h2>
          <p className="mb-4 text-gray-600">This developer is integrating a live API. They manage the conversation state and use `onSend`, `isTyping`, and `disabled` props for full control.</p>
          <code className="block bg-gray-100 p-2 rounded-md text-sm mb-4 text-gray-700">&lt;ChatBot onSend={'{handleSend}'} ... /&gt;</code>
          {/* This component is special: it's controlled by the App's state */}
          <ChatBot
            botName="Genius Bot"
            botAvatar={<GeniusIcon />}
            isOpen={true}
            isTyping={isTyping}
            disabled={isTyping} // Disable input while the bot is "typing"
            onSend={handlePowerUserSend}
            theme={{ 
              window: { placement: 'bottom-right' },
              messages: { userBackgroundColor: '#8b5cf6', botBackgroundColor: '#f5f3ff', botTextColor: '#5b21b6' },
              header: { backgroundColor: '#8b5cf6' },
              launcher: { backgroundColor: '#8b5cf6' },
              input: { focusRingColor: '#8b5cf6' }
            }}
          />
          {/* Note: We don't pass 'messages' to the ChatBot. The App manages them externally. */}
          {/* This is a common pattern for controlled components. */}
        </div>

      </main>
    </div>
  );
}

export default App;
import React from 'react';
import { ChatBot } from './index'; // Using the library's main export file
import './App.css';

// Custom SVG Icon for the second bot
const SupportIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.33919 14.8932 3.93939 16.1419" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 10.4C16 10.4 14.5 12 12 12C9.5 12 8 10.4 8 10.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 7.5C9.27614 7.5 9.5 7.27614 9.5 7C9.5 6.72386 9.27614 6.5 9 6.5C8.72386 6.5 8.5 6.72386 8.5 7C8.5 7.27614 8.72386 7.5 9 7.5Z" fill="currentColor" stroke="currentColor"/>
    <path d="M15 7.5C15.2761 7.5 15.5 7.27614 15.5 7C15.5 6.72386 15.2761 6.5 15 6.5C14.7238 6.5 14.5 6.72386 14.5 7C14.5 7.27614 14.7238 7.5 15 7.5Z" fill="currentColor" stroke="currentColor"/>
    <path d="M3 21L3 18L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


function App() {
  // --- Configuration for the first ChatBot instance ---
  const salesBotConfig = {
    botName: 'Sales Pro',
    welcomeMessage: 'Welcome to our store! How can I help you find the perfect product today?',
    placeholderText: 'Ask about products, prices, or shipping...',
    botAvatar: "https://placehold.co/40x40/34d399/ffffff?text=S",
    userAvatar: "https://placehold.co/40x40/f472b6/ffffff?text=U",
    theme: {
      primaryColor: '#34d399', // Emerald 400
      secondaryColor: '#ecfdf5', // Emerald 50
      backgroundColor: '#ffffff',
      textColor: '#ffffff',
      fontFamily: 'Georgia, serif',
      placement: 'bottom-right',
    },
    isOpen: true,
  };

  // --- Configuration for the second ChatBot instance ---
  const supportBotConfig = {
    botName: 'Support Hero',
    welcomeMessage: 'Having an issue? I am here to help you solve it!',
    placeholderText: 'Describe your problem...',
    botAvatar: <SupportIcon />, // Using a React component for the avatar
    theme: {
      primaryColor: '#fb923c', // Orange 400
      secondaryColor: '#fff7ed', // Orange 50
      backgroundColor: '#fafafa',
      textColor: '#1f2937',
      fontFamily: '"Courier New", monospace',
      placement: 'bottom-left',
    },
    isOpen: true,
    showLauncher: false, // Hiding the launcher for this instance
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen w-full">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          ChatBot Component Playground
        </h1>
        <p className="text-center text-gray-600 mt-2">
          This is the testing area for the <code>CustomChatBot</code> library component.
        </p>
      </div>

      {/* Render the two ChatBot instances with their unique configs */}
      <ChatBot {...salesBotConfig} />
      <ChatBot {...supportBotConfig} />
    </div>
  );
}

export default App;

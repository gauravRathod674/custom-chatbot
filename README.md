# Super Customizable React ChatBot

[![npm](https://img.shields.io/npm/v/@gauravrathod674/super-customizable-chatbot.svg)](https://www.npmjs.com/package/@gauravrathod674/super-customizable-chatbot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A highly customizable, performant, and intelligent React chatbot component. Drop it into any project to add a powerful conversational AI interface, powered by **Google Gemini, OpenAI, Anthropic (Claude), and Groq**.

![ChatBot Demo](https://i.imgur.com/g0QkY7G.png)

## ✨ Features

-   🤖 **Multi-API Support**: Integrates directly with Google Gemini, OpenAI, Anthropic (Claude), and Groq.
-   🧠 **Custom Instructions**: Provide a system prompt to define the bot's persona, role, and rules.
-   🚀 **Model Selection**: Choose the exact AI model you want to use from any supported provider (e.g., `gemini-1.5-flash`, `gpt-4o-mini`, `claude-3-haiku`, `llama3-8b-8192`).
-   🎨 **Deeply Customizable**: Use a comprehensive `theme` object to control every color, font, border, and size.
-   🎬 **Typing Animation**: Engage users with a smooth, character-by-character typing animation for bot responses.
-   🧩 **Flexible Placement**: Display as a classic corner widget or a large, focused modal.
-   💅 **Markdown Rendering**: Automatically renders lists, bold/italic text, headers, and more.
-   💪 **Controlled & Uncontrolled Modes**: Use it as a simple plug-and-play component or take full control over its state.
-   ♿ **Accessible**: Designed with accessibility in mind, including focus management and ARIA attributes.

## 📦 Installation

Install the package and its core peer dependencies from NPM.

```bash
npm install @gauravrathod674/super-customizable-chatbot @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core framer-motion react-markdown
```

### AI Provider SDKs

You also need to install the SDK for the specific AI provider you want to use. You only need to install the ones you plan to use.

```bash
# For Google Gemini
npm install @google/generative-ai

# For OpenAI
npm install openai

# For Anthropic (Claude)
npm install @anthropic-ai/sdk

# For Groq
npm install groq-sdk
```

## 🚀 Usage

Import the component and its stylesheet, then render it with the appropriate API key.

### Example: Google Gemini

```jsx
import React from 'react';
import ChatBot from '@gauravrathod674/super-customizable-chatbot';
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function App() {
  const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

  return (
    <ChatBot
      botName="Gemini Bot"
      geminiApiKey={GEMINI_API_KEY}
      geminiModelName="gemini-1.5-flash"
      welcomeMessage="I am powered by Gemini. How can I help?"
    />
  );
}
```

### Example: OpenAI

```jsx
import React from 'react';
import ChatBot from '@gauravrathod674/super-customizable-chatbot';
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function App() {
  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

  return (
    <ChatBot
      botName="OpenAI Bot"
      openaiApiKey={OPENAI_API_KEY}
      openaiModelName="gpt-4o-mini"
      welcomeMessage="I am powered by OpenAI. How can I help?"
    />
  );
}
```

### Example: Anthropic (Claude)

```jsx
import React from 'react';
import ChatBot from '@gauravrathod674/super-customizable-chatbot';
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function App() {
  const ANTHROPIC_API_KEY = "YOUR_ANTHROPIC_API_KEY";

  return (
    <ChatBot
      botName="Claude Bot"
      anthropicApiKey={ANTHROPIC_API_KEY}
      anthropicModelName="claude-3-haiku-20240307"
      welcomeMessage="I am powered by Claude. How can I help?"
    />
  );
}
```

### Example: Groq

```jsx
import React from 'react';
import ChatBot from '@gauravrathod674/super-customizable-chatbot';
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function App() {
  const GROQ_API_KEY = "YOUR_GROQ_API_KEY";

  return (
    <ChatBot
      botName="Groq Bot"
      grokApiKey={GROQ_API_KEY}
      grokModelName="llama3-8b-8192"
      welcomeMessage="I am powered by Groq. I am very fast. How can I help?"
    />
  );
}
```

## 🧠 Custom Instructions (System Prompts)

Define a persona or set of rules for the AI using the `customInstruction` prop. The chatbot will adhere to this instruction throughout the conversation.

```jsx
<ChatBot
  botName="Pirate Bot"
  openaiApiKey="YOUR_OPENAI_API_KEY"
  customInstruction="You are a helpful assistant who speaks like a pirate. Keep your answers brief and witty."
  welcomeMessage="Ahoy there, matey! What be yer question?"
/>
```

## 🎨 Theming & Customization

The component's biggest strength is its customizability. You can override any default style by passing a `theme` object.

### Example: Typing Animation & Custom Theme

This example creates a large, centered chatbot with a blurred backdrop, a unique color scheme, and the new typing animation.

```jsx
import React from 'react';
import ChatBot from '@gauravrathod674/super-customizable-chatbot';
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function ChatPage() {
  const corporateTheme = {
    header: { backgroundColor: '#1e3a8a' },
    messages: {
      userBackgroundColor: '#2563eb',
      botBackgroundColor: '#eef2ff',
      botTextColor: '#1e3a8a',
      animation: 'typing', // <-- Enable the typing animation
    },
    window: {
      placement: 'center',
      backdrop: true,
      backdropBlur: '3px',
    },
    input: { focusRingColor: '#2563eb' },
    launcher: { backgroundColor: '#1e3a8a' },
  };

  return (
    <ChatBot
      botName="CorpBot"
      openaiApiKey="YOUR_OPENAI_API_KEY"
      theme={corporateTheme}
    />
  );
}
```

## API Reference

### Component Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `geminiApiKey` | `string` | `undefined` | Your Google Gemini API key. |
| `openaiApiKey` | `string` | `undefined` | Your OpenAI API key. |
| `anthropicApiKey`| `string` | `undefined` | Your Anthropic (Claude) API key. |
| `grokApiKey` | `string` | `undefined` | Your Groq API key. |
| `geminiModelName`| `string` | `'gemini-1.5-flash'` | The Gemini model to use. |
| `openaiModelName`| `string` | `'gpt-4o-mini'` | The OpenAI model to use. |
| `anthropicModelName`| `string` | `'claude-3-haiku-20240307'` | The Anthropic model to use. |
| `grokModelName` | `string` | `'llama3-8b-8192'` | The Groq model to use. |
| `customInstruction`| `string` | `''` | A system prompt to define the bot's persona or behavior. |
| `botName` | `string` | `'ChatBot'` | The name displayed in the header. |
| `welcomeMessage` | `string` | `'Hello! How can I help?'` | The initial message displayed by the bot. |
| `placeholderText`| `string` | `'Type a message...'` | The placeholder text in the input field. |
| `botAvatar` | `React.ReactNode` | `<DefaultBotIcon />` | An icon or image URL for the bot's avatar. |
| `userAvatar` | `React.ReactNode` | `<DefaultUserIcon />` | An icon or image URL for the user's avatar. |
| `isOpen` | `boolean` | `false` | Controls whether the chat window is open initially. |
| `disabled` | `boolean` | `false` | Disables the input field and send button. |
| `onSend` | `(message: string) => void` | `() => {}` | Callback when a user sends a message. |
| `theme` | `object` | `{}` | A theme object to customize the UI. See table below. |
| `messages` | `Array<{id, text, sender}>` | `undefined` | **Advanced:** A controlled array of message objects. |
| `isTyping` | `boolean` | `false` | **Advanced:** Manually controls the bot's typing indicator. |

### Theming Options (`theme` object)

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| `launcher.backgroundColor` | `string` | `#4f46e5` | Background color of the launcher button. |
| `launcher.iconColor` | `string` | `#ffffff` | Color of the icon in the launcher. |
| `messages.animation` | `string` | `'fade-in'` | `'fade-in'`, `'typing'`, `'slide-up'`, `'zoom-in'`, `'flip'`, or `'none'`. |
| `messages.userBackgroundColor` | `string` | `#4f46e5` | Background color for user message bubbles. |
| `messages.botBackgroundColor` | `string` | `#f3f4f6` | Background color for bot message bubbles. |
| `window.placement` | `string` | `'bottom-right'`| `'bottom-right'`, `'bottom-left'`, or `'center'`. |
| `window.backdrop` | `boolean` | `false` | Show blurred backdrop (only for `center` placement). |
| *...and many more!* | | | |

## License

This project is licensed under the MIT License.
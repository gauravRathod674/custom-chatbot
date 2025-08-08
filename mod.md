Of course\! It's important to keep the documentation updated with the latest features. Based on the capabilities outlined in the `ChatBot.jsx` file you provided, here is the updated source code for your `README.md`.

This version includes the new "Speech-to-Text" and "File Uploads" features, along with usage examples and updated API documentation.

````markdown
# Super Customizable React ChatBot

[![npm](https://img.shields.io/npm/v/@gauravrathod674/super-customizable-chatbot.svg)](https://www.npmjs.com/package/@gauravrathod674/super-customizable-chatbot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A highly customizable, performant, and intelligent React chatbot component. Drop it into any project to add a powerful conversational AI interface, powered by **Google Gemini, OpenAI, Anthropic (Claude), and Groq**.

## 🎥 Demo Preview

Here’s how beautiful and functional this chatbot can look in your React app:

[![Watch the Demo on YouTube](https://github.com/gauravRathod674/custom-chatbot/raw/main/image.png)](https://youtu.be/F8KLmFdN7wE?si=qD5w6proq_iC15hd)

🔗 [Watch the full video on YouTube](https://youtu.be/F8KLmFdN7wE?si=qD5w6proq_iC15hd)

This demo showcases:

- Seamless integration in React
- Clean modal and widget views
- Typing animation with customizable themes
- Usage with OpenAI/Gemini/Claude/Groq APIs

## ✨ Features

-   🤖 **Multi-API Support**: Integrates directly with Google Gemini, OpenAI, Anthropic (Claude), and Groq.
-   🧠 **Custom Instructions**: Provide a system prompt to define the bot's persona, role, and rules.
-   🚀 **Model Selection**: Choose the exact AI model you want to use from any supported provider (e.g., `gemini-1.5-flash`, `gpt-4o-mini`, `claude-3-haiku`, `llama3-8b-8192`).
-   🎤 **Speech-to-Text**: Built-in voice input using the browser's Web Speech API for hands-free interaction.
-   📎 **File Uploads**: Allow users to upload images and files for multi-modal conversations with compatible models (Gemini, GPT-4o, Claude 3).
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
````

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

### Example: Enabling Advanced Features

Easily enable speech-to-text and file uploads with a few simple props. The `googleSTTCredentialsPath` prop acts as a feature flag to turn on the microphone, and `enableFileUpload` adds the attachment button.

**Note:** The Speech-to-Text feature uses the browser's native Web Speech API and does not actually require Google credentials. It is best supported on Chrome and Edge.

```jsx
import React from 'react';
import ChatBot from '@gauravrathod674/super-customizable-chatbot';
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function App() {
  const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

  return (
    <ChatBot
      botName="Vision Bot"
      geminiApiKey={GEMINI_API_KEY}
      // --- Enable Advanced Features ---
      googleSTTCredentialsPath="enable" // Any non-empty string enables the microphone
      enableFileUpload={true}
      fileUploadAccept="image/*" // Allow only images for vision models
      placeholderText="Ask me about an image..."
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

This example creates a large, centered chatbot with a blurred backdrop, a unique color scheme, and the typing animation.

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

The component can be customized through two main avenues: direct `props` for behavior and a `theme` object for appearance.

### Component Props

These props control the chatbot's functionality, identity, and AI integration.

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
| **`googleSTTCredentialsPath`** | **`string`** | **`undefined`** | **Any truthy string to enable the Speech-to-Text microphone.** Does not require actual credentials. |
| **`enableFileUpload`** | **`boolean`** | **`false`** | **Enables the file attachment button.** |
| **`fileUploadAccept`** | **`string`** | **`*`** | **A string of accepted file types for the upload dialog** (e.g., `"image/*, .pdf"`). |
| **`onFileUpload`** | **`(file: File) => void`** | **`() => {}`** | **Callback that fires when a user selects a file.** |
| `onSend` | `(message: string) => void` | `() => {}` | Callback when a user sends a message. |
| `theme` | `object` | `{}` | A theme object to customize the UI. See table below. |
| `messages` | `Array<{id, text, sender}>` | `undefined` | **Advanced:** A controlled array of message objects. |
| `isTyping` | `boolean` | `false` | **Advanced:** Manually controls the bot's typing indicator. |

-----

### Theming Options (`theme` object)

Pass a `theme` object to customize the chatbot's appearance. Any property you don't provide will fall back to its default value.

#### Launcher Button

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| `launcher.backgroundColor` | `string` | `'#4f46e5'` | Background color of the launcher button. |
| `launcher.iconColor` | `string` | `'#ffffff'` | Color of the icon inside the launcher. |
| `launcher.size` | `string` | `'3.5rem'` | The width and height of the launcher button. |

#### Chat Window

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| `window.placement` | `string` | `'bottom-right'` | Position on screen. Options: `'bottom-right'`, `'bottom-left'`, `'center'`. |
| `window.width` | `string` | `'22rem'` | Width of the chat window. (Defaults to `'80vw'` if placement is `'center'`). |
| `window.height` | `string` | `'30rem'` | Height of the chat window. (Defaults to `'80vh'` if placement is `'center'`). |
| `window.backgroundColor` | `string` | `'#ffffff'` | Background color of the main chat window. |
| `window.borderColor` | `string` | `'#e5e7eb'` | Border color of the main chat window. |
| `window.borderRadius` | `string` | `'0.75rem'` | Border radius of the main chat window. |
| `window.backdrop` | `boolean` | `false` | Show blurred backdrop (only for `'center'` placement). |
| `window.backdropColor` | `string` | `'rgba(0,0,0,0.4)'` | Color of the backdrop overlay. |
| `window.backdropBlur` | `string` | `'4px'` | CSS blur value for the backdrop. |
| `window.scrollbarThumbColor`| `string` | `'#a1a1aa'` | Color of the message list's scrollbar thumb. |
| `window.scrollbarTrackColor`| `string` | `'#f1f5f9'` | Color of the message list's scrollbar track. |

#### Header

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| `header.backgroundColor` | `string` | `'#4f46e5'` | Background color of the header. |
| `header.textColor` | `string` | `'#ffffff'` | Text color for the bot's name in the header. |
| `header.fontFamily` | `string` | `'inherit'` | Font family for the header text. |
| `header.fontWeight` | `string` | `'600'` | Font weight for the header text. |

#### Messages

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| `messages.userBackgroundColor` | `string` | `'#4f46e5'` | Background color for user message bubbles. |
| `messages.userTextColor` | `string` | `'#ffffff'` | Text color for user messages. |
| `messages.botBackgroundColor`| `string` | `'#f3f4f6'` | Background color for bot message bubbles. |
| `messages.botTextColor` | `string` | `'#1f2937'` | Text color for bot messages. |
| `messages.fontFamily` | `string` | `'inherit'` | Font family for all message text. |
| `messages.fontSize` | `string` | `'0.9rem'` | Font size for all message text. |
| `messages.showAvatars` | `boolean` | `true` | Whether to display avatars next to messages. |
| `messages.bubbleShape` | `string` | `'rounded'` | Shape of bubbles. Options: `'rounded'`, `'square'`. |
| `messages.bubblePointer` | `boolean` | `true` | Show a small pointer on the message bubbles. |
| `messages.animation` | `string` | `'fade-in'` | Bot response animation. Options: `'fade-in'`, `'typing'`, `'slide-up'`, `'zoom-in'`, `'flip'`, `'none'`. |

#### Markdown Customization (`messages.markdownStyles`)

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| `markdownStyles.boldColor` | `string` | `inherit` | Color for `**bold**` text. |
| `markdownStyles.italicColor` | `string` | `inherit` | Color for `*italic*` text. |
| `markdownStyles.linkColor` | `string` | `'#3b82f6'` | Color for `[links](...)`. |
| `markdownStyles.codeColor` | `string` | `inherit` | Text color for `inline code`. |
| `markdownStyles.codeBackgroundColor` | `string` | `rgba(0,0,0,0.1)` | Background color for `inline code`. |

#### Input Area

| Path | Type | Default | Description |
| --- | --- | --- | --- |
| `input.backgroundColor` | `string` | `'#ffffff'` | Background color for the input footer area. |
| `input.textColor` | `string` | `'#1f2937'` | Text color for the user's typed input. |
| `input.placeholderTextColor`| `string` | `'#9ca3af'` | Color of the placeholder text. |
| `input.borderColor` | `string` | `'#e5e7eb'` | Border color for the text input field. |
| `input.focusRingColor` | `string` | `'#4f46e5'` | Color of the focus ring when the input is selected. |

## License

This project is licensed under the MIT License.

```
```
# Super Customizable React ChatBot

[![npm](https://img.shields.io/npm/v/@gauravrathod674/super-customizable-chatbot.svg)](https://www.npmjs.com/package/@gauravrathod674/super-customizable-chatbot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A highly customizable, performant, and intelligent React chatbot component. Drop it into any project to add a powerful conversational AI interface, powered by Google Gemini.

![ChatBot Demo](https://i.imgur.com/g0QkY7G.png)

## ✨ Features

-   🤖 **AI-Powered**: Integrates directly with Google Gemini for intelligent, human-like conversations.
-   🎨 **Deeply Customizable**: Use a comprehensive theme object to control every color, font, border, size, and even the scrollbar.
-   🧩 **Flexible Placement**: Display as a classic corner widget or as a large, focused modal in the center of the screen.
-   💅 **Markdown Rendering**: Automatically renders formatted lists, bold/italic text, headers, and more from the AI's response.
-   🚀 **Lightweight & Performant**: Built with Vite and optimized for production.
-   ♿ **Accessible**: Designed with accessibility in mind, including focus management and ARIA attributes.
-   💪 **Controlled & Uncontrolled Modes**: Use it as a simple plug-and-play component or take full control over its state and messages.

## 📦 Installation

To get started, install the package from NPM. You will also need to install its peer dependencies if you don't already have them in your project.

```bash
npm install @gauravrathod674/super-customizable-chatbot
```

```bash
npm install @gauravrathod674/super-customizable-chatbot @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core react-markdown
```

## 🚀 Getting Started

Using the chatbot is simple. Import the component and its stylesheet, then render it with your Google Gemini API key.

```jsx
import React from 'react';
import { ChatBot } from '@gauravrathod674/super-customizable-chatbot';

// Don't forget to import the styles!
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function App() {
  // Get your API key from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
  const GEMINI_API_KEY = "YOUR_API_KEY_HERE";

  return (
    <div>
      <h1>My Awesome App</h1>
      <ChatBot geminiApiKey={GEMINI_API_KEY} />
    </div>
  );
}

export default App;
```

## 🎨 Theming & Customization

The component's biggest strength is its customizability. You can override any default style by passing a `theme` object.

### Example: Centered Modal with a Custom Theme

This example creates a large, centered chatbot with a blurred backdrop and a unique color scheme.

```jsx
import React from 'react';
import { ChatBot } from '@gauravrathod674/super-customizable-chatbot';
import '@gauravrathod674/super-customizable-chatbot/dist/style.css';

function ChatPage() {
  const GEMINI_API_KEY = "YOUR_API_KEY_HERE";

  const corporateTheme = {
    header: {
      backgroundColor: '#0e7490', // A nice cyan
      textColor: '#ffffff',
    },
    messages: {
      userBackgroundColor: '#06b6d4',
      botBackgroundColor: '#f0f9ff',
      botTextColor: '#083344',
    },
    window: {
      placement: 'center',
      backdrop: true, // Enable the blur effect
      backdropBlur: '3px',
      scrollbarThumbColor: '#0891b2',
      scrollbarTrackColor: '#f0f9ff',
    },
    input: {
      focusRingColor: '#06b6d4',
    },
    launcher: {
      backgroundColor: '#0e7490',
    },
  };

  return (
    <ChatBot
      botName="Central Intelligence"
      geminiApiKey={GEMINI_API_KEY}
      theme={corporateTheme}
    />
  );
}
```

## API Reference

### Component Props

| Prop               | Type                                    | Default                               | Description                                                                                             |
| ------------------ | --------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `geminiApiKey`     | `string`                                | `undefined`                           | **Required.** Your Google Gemini API key. If not provided, the bot will simply echo user messages.       |
| `botName`          | `string`                                | `'ChatBot'`                           | The name displayed in the header.                                                                       |
| `welcomeMessage`   | `string`                                | `'Hello! How can I help?'`            | The initial message displayed by the bot when it opens.                                                 |
| `placeholderText`  | `string`                                | `'Type a message...'`                 | The placeholder text in the input field.                                                                |
| `botAvatar`        | `React.ReactNode`                       | `<DefaultBotIcon />`                  | An icon or image URL for the bot's avatar.                                                              |
| `userAvatar`       | `React.ReactNode`                       | `<DefaultUserIcon />`                 | An icon or image URL for the user's avatar.                                                             |
| `isOpen`           | `boolean`                               | `false`                               | Controls whether the chat window is open or closed initially.                                           |
| `disabled`         | `boolean`                               | `false`                               | Disables the input field and send button.                                                               |
| `onSend`           | `(message: string) => void`             | `() => {}`                            | Callback function triggered when a user sends a message.                                                |
| `theme`            | `object`                                | `{}`                                  | A theme object to customize the UI. See the Theming Options table below.                                |
| `messages`         | `Array<{id, text, sender}>`             | `undefined`                           | **For advanced use.** A controlled array of message objects.                                            |
| `isTyping`         | `boolean`                               | `false`                               | **For advanced use.** Manually controls the typing indicator for the bot.                               |

### Theming Options (`theme` object)

You can customize the following properties within the `theme` object.

| Path                                  | Type      | Default        | Description                                       |
| ------------------------------------- | --------- | -------------- | ------------------------------------------------- |
| `launcher.backgroundColor`            | `string`  | `#4f46e5`      | Background color of the launcher button.          |
| `launcher.iconColor`                  | `string`  | `#ffffff`      | Color of the icon in the launcher.                |
| `launcher.size`                       | `string`  | `'3.5rem'`     | Size (width & height) of the launcher button.     |
| `header.backgroundColor`              | `string`  | `#4f46e5`      | Background color of the chat window header.       |
| `header.textColor`                    | `string`  | `#ffffff`      | Text color in the header.                         |
| `messages.userBackgroundColor`        | `string`  | `#4f46e5`      | Background color for user message bubbles.        |
| `messages.userTextColor`              | `string`  | `#ffffff`      | Text color for user messages.                     |
| `messages.botBackgroundColor`         | `string`  | `#f3f4f6`      | Background color for bot message bubbles.         |
| `messages.botTextColor`               | `string`  | `#1f2937`      | Text color for bot messages.                      |
| `messages.bubbleShape`                | `string`  | `'rounded'`    | Shape of message bubbles (`'rounded'` or `'square'`). |
| `messages.showAvatars`                | `boolean` | `true`         | Whether to display avatars next to messages.      |
| `window.placement`                    | `string`  | `'bottom-right'` | `'bottom-right'`, `'bottom-left'`, or `'center'`. |
| `window.width`                        | `string`  | `'22rem'`      | Width of the chat window.                         |
| `window.height`                       | `string`  | `'30rem'`      | Height of the chat window.                        |
| `window.backdrop`                     | `boolean` | `false`        | Show blurred backdrop (only for `center` placement). |
| `window.backdropBlur`                 | `string`  | `'4px'`        | CSS blur value for the backdrop.                  |
| `window.backdropColor`                | `string`  | `rgba(0,0,0,0.4)` | Color of the backdrop overlay.                  |
| `window.scrollbarThumbColor`          | `string`  | `#a1a1aa`      | Color of the message list's scrollbar thumb.      |
| `window.scrollbarTrackColor`          | `string`  | `#f1f5f9`      | Color of the message list's scrollbar track.      |
| `input.focusRingColor`                | `string`  | `#4f46e5`      | Color of the focus ring on the input field.       |

## License

This project is licensed under the MIT License.
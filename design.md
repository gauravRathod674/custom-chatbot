# Project Design Commentary: Super Customizable Chatbot

## 1. How you have improved design of software?

The original software design suffered from a **Monolithic Architecture** (specifically the "God Component" anti-pattern). The `ChatBot` component was responsible for:
1.  **State Management:** (Messages, Inputs, Files, Speech, API Config).
2.  **Business Logic:** (API calls, Theme merging, Speech Recognition handling).
3.  **UI Rendering:** (Header, Message List, Input Area, Scrollbars).

I improved the design by refactoring to a **Component-Based, Compositional Architecture**.

* **Decoupling:** I separated the *Logic* (how the bot works) from the *View* (how the bot looks). The `ChatBot` component now acts strictly as a "Controller," coordinating data between specialized sub-components.
* **Abstraction:** Complex imperative logic (like setting up `window.SpeechRecognition` or calculating CSS variables) is now hidden behind custom hooks. The main component reads like a declarative list of steps rather than a script.

---

## 2. Where you have applied what design principles?

### A. Single Responsibility Principle (SRP)
**Principle:** A module/component should have one, and only one, reason to change.
* **Application:**
    * **Before:** If I wanted to change how the *Header* looked, I risked breaking the *Message List* scrolling logic because they shared the same scope.
    * **After (Refactored):**
        * `ChatInput`: Handles only user input, file selection, and auto-resizing.
        * `MessageList`: Handles only the rendering of bubbles and scrolling.
        * `ChatHeader`: Handles only the top bar display.
    * **Benefit:** Changes to the input UI are now isolated from the message display logic.

### B. Separation of Concerns (SoC)
**Principle:** Distinct sections of the computer program should address distinct concerns.
* **Application:**
    * **Theming Concern:** The logic for merging user themes with defaults and generating CSS variables was extracted from the render cycle into the **`useChatTheme`** hook.
    * **Hardware Concern:** The imperative, event-driven logic for the microphone was extracted into the **`useSpeechRecognition`** hook.
    * **Benefit:** The main component code focuses purely on "Chat Flow" rather than "CSS calculations" or "Browser APIs."

---

## 3. Key refactoring you have done to improve the design of your project

### Refactoring 1: Extract Component (Resolves "Long Function")
* **The Problem:** The `ChatBot` return statement was a deeply nested tree of `div`s (Header, List, Input, Launcher) making it hard to read.
* **The Solution:** I identified logical UI boundaries and extracted them into named components.
* **Code Evidence:**
    * Created `ChatHeader` component.
    * Created `MessageList` component.
    * Created `ChatInput` component.

### Refactoring 2: Extract Hook (Resolves "Tangling Logic")
* **The Problem:** The top of the `ChatBot` component was cluttered with `useEffect` and `useMemo` calls for unrelated tasks (Theming vs. Speech vs. API).
* **The Solution:** I moved these related clusters of code into Custom React Hooks.
* **Code Evidence:**
    * **`useChatTheme`** (Lines 155-205): Encapsulates 50 lines of theme merging logic.
    * **`useSpeechRecognition`** (Lines 207-234): Encapsulates the browser Speech API setup and event listeners.

### Refactoring 3: Move Function (Resolves "Feature Envy")
* **The Problem:** Helper functions like `fileToBase64` were defined inside the main file scope or mixed with component logic.
* **The Solution:** I moved "dumb" utility functions to the top of the file (Section 1), clearly separating pure utility functions from the component rendering logic.

---

## Summary of Impact

| Metric | Original Code | Refactored Code | Improvement |
| :--- | :--- | :--- | :--- |
| **Main Component Logic** | ~510 Lines | ~210 Lines | **58% Reduction** in complexity |
| **Responsibility** | Everything (UI + Logic) | Orchestration Only | Clear Separation of Concerns |
| **Readability** | Low (Deep Nesting) | High (Semantic Tags) | Code describes *what* it does, not *how* |
| **Maintainability** | Risky (Side effects) | Safe (Isolated Components) | Easier to test and update |

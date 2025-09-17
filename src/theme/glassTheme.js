// src/theme/glassTheme.js
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
export default glassTheme;

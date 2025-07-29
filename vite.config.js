import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import packageJson from './package.json';

// This function reads peerDependencies from package.json and prepares them for Rollup
const getExternalDeps = (pkg) => {
  const peerDeps = Object.keys(pkg.peerDependencies || {});
  // Use a regex to also capture sub-paths, e.g., '@fortawesome/free-solid-svg-icons'
  return peerDeps.map(dep => new RegExp(`^${dep}(/.*)?`));
};

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Use process.cwd() to get the current working directory for robustness
      entry: resolve(process.cwd(), 'src/index.js'), 
      name: 'SuperCustomizableChatbot',
      // Update the file name to match the package name
      fileName: (format) => `super-customizable-chatbot.${format}.js`,
    },
    rollupOptions: {
      // Automatically externalize all peer dependencies
      external: getExternalDeps(packageJson),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'framerMotion',
          'react-markdown': 'ReactMarkdown',
          '@fortawesome/react-fontawesome': 'ReactFontAwesome',
          '@fortawesome/free-solid-svg-icons': 'FreeSolidIcons',
          '@fortawesome/fontawesome-svg-core': 'FontAwesomeCore',
          // AI SDKs don't typically have UMD builds, but it's good practice
          // to define them as globals.
          'openai': 'OpenAI',
          '@google/generative-ai': 'GoogleGenerativeAI',
          '@anthropic-ai/sdk': 'Anthropic',
          'groq-sdk': 'Groq'
        },
      },
    },
  },
});
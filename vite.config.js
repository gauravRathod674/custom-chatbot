import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'CustomChatBot',
      fileName: (format) => `custom-chatbot.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'react-markdown',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fortawesome/fontawesome-svg-core': 'FontAwesomeCore',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeIcons',
          '@fortawesome/react-fontawesome': 'ReactFontAwesome',
          'react-markdown': 'ReactMarkdown',
        },
      },
    },
  },
});

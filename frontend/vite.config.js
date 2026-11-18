import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Put the built file where Django looks for static files.
    outDir: '../labs/static/labs/react',
    emptyOutDir: true,
    rolldownOptions: {
      // Start from our JavaScript file (not an index.html, because Django makes the page).
      input: 'src/main.jsx',
      // Always name the output workspace.js, so the Django template can find it.
      output: { entryFileNames: 'workspace.js' },
    },
  },
});
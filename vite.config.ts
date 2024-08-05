import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  resolve: {
    alias: {
      // Ensuring `buffer` is available in the browser environment
      buffer: 'Buffer'
      
    }
  }
});
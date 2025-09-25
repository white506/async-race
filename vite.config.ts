import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // We're using manual imports in each file instead of global additionalData
      },
    },
  },
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@store': path.resolve(__dirname, './src/store'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
});

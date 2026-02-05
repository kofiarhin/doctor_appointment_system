import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/tests/**'],
      lines: 100,
      functions: 100,
      statements: 100,
      branches: 100
    }
  }
});

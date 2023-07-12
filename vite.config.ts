import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mermaid-quadrant-chart-ui-builder/',
  plugins: [react()],
});

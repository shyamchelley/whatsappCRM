import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    // Inline React as part of the bundle so the widget is truly self-contained
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    outDir: 'dist-widget',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'widget/index.jsx'),
      name: 'CRMWidget',
      fileName: 'crm-widget',
      formats: ['iife'], // Single self-executing bundle — no module system needed
    },
    rollupOptions: {
      // Bundle React inside the widget — keeps it truly self-contained
      external: [],
    },
    minify: true,
  },
});

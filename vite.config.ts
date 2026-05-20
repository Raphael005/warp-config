import { defineConfig } from 'vite';

export default defineConfig({
  // index.html lives at the project root
  root: '.',

  build: {
    // Output separate from tsc's dist/ output
    outDir: 'dist/pwa',
    emptyOutDir: true,

    // Oxc minification (Vite 8+ default, replaces esbuild)

    target: 'esnext',

    rollupOptions: {
      input: 'index.html',
    },
  },

  // Copy sw.js, manifest.json, and icons/ as static assets (not bundled)
  publicDir: false,
});

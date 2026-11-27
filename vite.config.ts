import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: 'es2020',
    // Hashed JS/CSS/font bundles go to /static (cached immutably); brand images live in /public/assets.
    assetsDir: 'static',
    // Brand PNGs in /public are copied as-is; only bundled assets are hashed.
    assetsInlineLimit: 0,
    // The SSR bundle (dist-ssr/) is only used at build time to pre-render pages.
    copyPublicDir: !isSsrBuild,
  },
}));

import copy from 'rollup-plugin-copy';
import { defineConfig, UserConfigExport } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

const manifest: any = {
  short_name: 'Ghost',
  name: 'Project Ghost',
  description: '',
  start_url: '.',
  display: 'standalone',
  theme_color: '#1d3461',
  background_color: '#ebebeb',
  orientation: 'portrait-primary',
  categories: ['productivity', 'business', 'utilities'],
  scope: '/',
  icons: [
    {
      src: 'icons/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'icons/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: 'icons/apple-touch-icon.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'icons/maskable_icon_x1.png',
      sizes: '196x196',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
};

export default () => {
  const config: UserConfigExport = {
    plugins: [
      react(),
      copy({
        targets: [
          {
            src: './node_modules/@fluentui/font-icons-mdl2/fonts',
            dest: 'public',
          },
        ],
        hook: 'buildStart',
        copyOnce: true,
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1024,
    },
    server: {
      cors: true,
      strictPort: true,
      host: '0.0.0.0',
      port: 3000,
    },
  };
  config.plugins.push(
    VitePWA({
      minify: true,
      registerType: 'autoUpdate',
      manifest: manifest,
      base: '/',
      workbox: {
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        globDirectory: 'dist/',
        navigateFallbackDenylist: [
        ],
        globPatterns: [
          '**/*.{json,js,html,jpg,png,svg,css,ico,woff,woff2,ttf,otf,etf,gif,tiff,cur,ani,jpeg,webmanifest,manifest}',
        ],
        swDest: 'dist/sw.js',
        clientsClaim: true,
        skipWaiting: true,
        importScripts: ['./sw-push-notifications.js'],
      },
    })
  );
  return defineConfig(config);
};

/// <reference types="vitest/config" />
// https://vitejs.dev/config/
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import {coverageConfigDefaults} from 'vitest/config';

import {cjsTokens, ejsPlugin} from './build/plugins.mjs';
import {packageRegexes} from './build/utils.mjs';

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [
    // BIG DISCLAIMER - Vite only processes files with the .jsx or .tsx extension with
    // babel, and changing this configuration is... cumbersome and comes with a performance
    // penalty. This manifests if you're using react-intl in .js/.mjs/.ts files etc., as
    // they don't get transformed to inject the message ID. The solution is to rename the
    // file extension to .jsx/.tsx
    react({babel: {babelrc: true}}),
    jsconfigPaths(),
    cjsTokens(),
    ejsPlugin(),
  ],
  build: {
    target: 'modules', // the default
    outDir: 'dist-vite',
    assetsInlineLimit: 8 * 1024, // 8 KiB
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/sdk.jsx',
      external: packageRegexes,
      output: {
        dir: 'dist-vite/esm',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: ({name}) => {
          if (name?.endsWith('.css')) {
            return '[name].[ext]';
          }
          return 'static/media/[name].[hash:8].[ext]';
        },
        sourcemap: false,
      },
      preserveEntrySignatures: 'strict',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$fa-font-path: '@fortawesome/fontawesome-free/webfonts/';`,
        charset: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
    globals: true, // for compatibility with jest
    setupFiles: ['./src/vitest.setup.mjs'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/api-mocks/*',
        'src/story-utils/*',
        ...coverageConfigDefaults.exclude,
      ],
      reporter: ['text', 'cobertura', 'html'],
    },
  },
});

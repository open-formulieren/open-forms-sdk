/// <reference types="vitest/config" />
// https://vitejs.dev/config/
import react from '@vitejs/plugin-react';
import type {OutputOptions} from 'rollup';
import {defineConfig} from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import eslint from 'vite-plugin-eslint2';
import {coverageConfigDefaults} from 'vitest/config';

import {cjsTokens, ejsPlugin} from './build/plugins.mjs';
import {packageRegexes} from './build/utils.mjs';

// type definition for our custom envvars
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUILD_TARGET: 'umd' | 'esm';
    }
  }
}

const buildTarget = process.env.BUILD_TARGET || 'umd';

/**
 * Rollup output options for ESM build, which is what we package in the NPM package
 * under the 'esm' subdirectory.
 *
 * The ESM package is experimental. Known issues:
 * @fixme
 *
 * - the react-intl translations are not distributed yet (also broken in CRA/babel build!)
 */
const esmOutput = {
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
} satisfies OutputOptions;

/**
 * Rollup output options for UMD bundle, included in the NPM package but
 * the primary distribution mechanism is in a Docker image.
 *
 * @todo - optimize with bundle splitting/chunk management.
 */
const umdOutput = {
  dir: 'dist-vite',
  format: 'umd',
  exports: 'named',
  name: 'OpenForms',
  generatedCode: 'es2015',
  entryFileNames: 'open-forms-sdk.js',
  assetFileNames: ({name}) => {
    if (name === 'style.css') {
      return 'open-forms-sdk.css';
    }
    return 'static/media/[name].[hash:8].[ext]';
  },
  inlineDynamicImports: true,
} satisfies OutputOptions;

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
    eslint({
      build: true,
    }),
    cjsTokens(),
    ejsPlugin(),
  ],
  build: {
    target: 'modules', // the default
    assetsInlineLimit: 8 * 1024, // 8 KiB
    cssCodeSplit: false,
    sourcemap: buildTarget !== 'esm',
    outDir: 'dist-vite/umd',
    rollupOptions: {
      input: 'src/sdk.jsx',
      // do not externalize anything in UMD build - bundle everything
      external: buildTarget === 'esm' ? packageRegexes : undefined,
      output: buildTarget === 'esm' ? esmOutput : umdOutput,
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

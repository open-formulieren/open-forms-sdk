/// <reference types="vitest/config" />
// https://vitejs.dev/config/
import react from '@vitejs/plugin-react';
import lodashTemplate from 'lodash/template';
import {readFile} from 'node:fs/promises';
import {defineConfig} from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import {coverageConfigDefaults} from 'vitest/config';

// inspired on https://dev.to/koistya/using-ejs-with-vite-48id and
// https://github.com/difelice/ejs-loader/blob/master/index.js
const ejsPlugin = () => ({
  name: 'compile-ejs',
  async transform(_, id) {
    const options = {
      variable: 'ctx',
      evaluate: /\{%([\s\S]+?)%\}/g,
      interpolate: /\{\{([\s\S]+?)\}\}/g,
      escape: /\{\{\{([\s\S]+?)\}\}\}/g,
    };
    if (id.endsWith('.ejs')) {
      const src = await readFile(id, 'utf-8');
      // @ts-ignore
      const code = lodashTemplate(src, options);
      return `export default ${code}`;
    }
  },
});

export default defineConfig({
  base: '/',
  plugins: [
    // BIG DISCLAIMER - Vite only processes files with the .jsx or .tsx extension with
    // babel, and changing this configuration is... cumbersome and comes with a performance
    // penalty. This manifests if you're using react-intl in .js/.mjs/.ts files etc., as
    // they don't get transformed to inject the message ID. The solution is to rename the
    // file extension to .jsx/.tsx
    react({babel: {babelrc: true}}),
    jsconfigPaths(),
    ejsPlugin(),
  ],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
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

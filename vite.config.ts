import react from '@vitejs/plugin-react';
import lodashTemplate from 'lodash/template';
import {readFile} from 'node:fs/promises';
import {defineConfig} from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    jsconfigPaths(),

    // inspired on https://dev.to/koistya/using-ejs-with-vite-48id and
    // https://github.com/difelice/ejs-loader/blob/master/index.js
    {
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
          const code = lodashTemplate(src, options);
          return `export default ${code}`;
        }
      },
    },
  ],
});

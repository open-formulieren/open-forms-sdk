import lodashTemplate from 'lodash/template';

// inspired on https://dev.to/koistya/using-ejs-with-vite-48id and
// https://github.com/difelice/ejs-loader/blob/master/index.js
export const ejsPlugin = () => ({
  name: 'compile-ejs',
  async transform(src: string, id: string) {
    const options = {
      variable: 'ctx',
      evaluate: /\{%([\s\S]+?)%\}/g,
      interpolate: /\{\{([\s\S]+?)\}\}/g,
      escape: /\{\{\{([\s\S]+?)\}\}\}/g,
    };
    if (id.endsWith('.ejs')) {
      // @ts-ignore
      const code = lodashTemplate(src, options);
      return {code: `export default ${code}`, map: null};
    }
  },
});

export const cjsTokens = () => ({
  name: 'process-cjs-tokens',
  async transform(src, id) {
    if (
      id.endsWith('/design-tokens/dist/tokens.js') ||
      id.endsWith('node_modules/@utrecht/design-tokens/dist/tokens.cjs')
    ) {
      return {
        code: src.replace('module.exports = ', 'export default '),
        map: null,
      };
    }
  },
});

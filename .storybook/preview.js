import { Formio, Templates } from 'react-formio';
import OpenFormsModule from 'formio/module';
import OFLibrary from 'formio/templates';

import 'styles.scss';

import {reactIntl} from './reactIntl.js';

export const parameters = {
  reactIntl,
  locale: reactIntl.defaultLocale,
  locales: {
    nl: 'Nederlands',
    en: 'English',
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// Use our custom Form.io components
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

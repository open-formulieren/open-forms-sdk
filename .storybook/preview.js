import { Formio, Templates } from 'react-formio';

import { ConfigContext } from 'Context';
import OpenFormsModule from 'formio/module';
import OFLibrary from 'formio/templates';

import '@gemeente-denhaag/design-tokens-components/dist/theme/index.css';
import '@utrecht/design-tokens/dist/index.css';
import 'styles.scss';

// Include NL Design System component in Storybook only, until migration is complete
import 'scss/nl-design-system-community.scss';

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
  themes: {
    default: "Open Forms",
    target: 'root',
    list: [
      { name: 'Open Forms', class: 'openforms-theme', color: '#01689B' },
      { name: 'Gemeente Den Haag', class: 'denhaag-theme', color: 'hsl(138 58% 33%)' },
      { name: 'Gemeente Utrecht', class: 'utrecht-theme', color: '#cc0000' }
    ],
  },
};

export const decorators = [
];

// Use our custom Form.io components
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

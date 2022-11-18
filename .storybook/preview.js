import { Formio, Templates } from 'react-formio';

import OpenFormsModule from 'formio/module';
import OFLibrary from 'formio/templates';

import '@gemeente-denhaag/design-tokens-components/dist/theme/index.css';
import '@utrecht/design-tokens/dist/index.css';

// Include NL Design System component in Storybook only, until migration is complete
import 'scss/nl-design-system-community.scss';

// load these AFTER the community styles, which is closer in simulating the CSS loading
// order of our own components
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
  themes: {
    default: "Open Forms",
    target: 'root',
    list: [
      { name: 'Open Forms', class: 'openforms-theme', color: '#01689B' },
      { name: 'Gemeente Den Haag', class: 'denhaag-theme', color: 'hsl(138 58% 33%)' },
      { name: 'Gemeente Utrecht', class: 'utrecht-theme', color: '#cc0000' }
    ],
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: [
        'Introduction',
        'Pure React components',
        'Composites',
        'Form.io components',
        'Private API',
      ],
    }
  },
};

// Use our custom Form.io components
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

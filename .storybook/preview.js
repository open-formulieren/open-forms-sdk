import '@gemeente-denhaag/design-tokens-components/dist/theme/index.css';
import '@nl-design-system-unstable/rotterdam-design-tokens/dist/index.css';
import '@utrecht/design-tokens/dist/index.css';
import 'design-token-editor/lib/css/dte.css';
import 'design-token-editor/lib/css/root.css';
import 'flatpickr';
import 'flatpickr/dist/l10n/nl.js';
import {fixIconUrls as fixLeafletIconUrls} from 'map';
import {initialize, mswLoader} from 'msw-storybook-addon';
import {Formio, Templates} from 'react-formio';
import {setAppElement} from 'react-modal';
import 'scss/dte-theme.scss';
import {withThemeProvider} from 'storybook-addon-theme-provider';
// load these AFTER the community styles, which is closer in simulating the CSS loading
// order of our own components
import 'styles.scss';

// ensure NL locale is included
import OpenFormsModule from 'formio/module';
import OFLibrary from 'formio/templates';
import {withModalDecorator} from 'story-utils/decorators';

import {
  utrechtDocumentDecorator,
  withClearSessionStorage,
  withClearSubmissionLocalStorage,
} from './decorators';
import {reactIntl} from './reactIntl.js';
import ThemeProvider from './theme';

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: './mockServiceWorker.js',
  },
});

fixLeafletIconUrls();

// Added because of the warning for the react-modal
// This is needed so screen readers don't see main content when modal is opened
setAppElement('#storybook-root');

// Use our custom Form.io components
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

export default {
  decorators: [
    withThemeProvider(ThemeProvider),
    withClearSessionStorage,
    withClearSubmissionLocalStorage,
    withModalDecorator,
    utrechtDocumentDecorator,
  ],
  parameters: {
    viewport: {
      // These are the viewports that are shown in Storybook
      viewports: {
        smallMobile: {name: 'Small mobile', styles: {width: '320px', height: '568px'}},
        largeMobile: {name: 'Large mobile', styles: {width: '414px', height: '896px'}},
        tablet: {name: 'Tablet', styles: {width: '834px', height: '1112px'}},
        desktop: {name: 'Desktop', styles: {width: '1024px', height: '1000px'}},
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    reactIntl,
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'Developers',
          'Pure React components',
          'Composites',
          'Form.io components',
          ['Docs', 'Vanilla', ['Docs'], 'Custom', ['Docs']],
          'Private API',
        ],
      },
    },
    chromatic: {
      // Here we specify the viewports of which we want snapshots in Chromatic
      modes: {
        mobile: {viewport: 'smallMobile'},
        desktop: {viewport: 'desktop'},
      },
    },
  },
  loaders: [mswLoader],
  initialGlobals: {
    // react-intl
    locale: reactIntl.defaultLocale,
    locales: {
      nl: 'Nederlands',
      en: 'English',
    },
    // themes
    selectedTheme: 'Open Forms', // default
    themes: [
      {
        name: 'Open Forms',
        color: '#01689B',
        themeObject: {className: 'openforms-theme'},
      },
      {
        name: 'Gemeente Den Haag',
        color: '#238541',
        themeObject: {className: 'denhaag-theme'},
      },
      {
        name: 'Gemeente Rotterdam',
        color: '#00811F',
        themeObject: {className: 'rotterdam-theme'},
      },
      {
        name: 'Gemeente Utrecht',
        color: '#cc0000',
        themeObject: {className: 'utrecht-theme'},
      },
    ],
  },
};

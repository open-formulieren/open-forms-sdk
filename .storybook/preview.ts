import '@gemeente-denhaag/design-tokens-components/dist/theme/index.css';
import '@gemeente-rotterdam/design-tokens/dist/index.css';
import {withThemeByClassName} from '@storybook/addon-themes';
import type {Preview, ReactRenderer} from '@storybook/react-vite';
import '@utrecht/design-tokens/dist/index.css';
import 'design-token-editor/lib/css/dte.css';
import 'design-token-editor/lib/css/root.css';
import 'flatpickr';
import 'flatpickr/dist/l10n/nl.js';
import lodash from 'lodash';
import {initialize, mswLoader} from 'msw-storybook-addon';
// @ts-expect-error formio has poor TS support
import {Formio, Templates} from 'react-formio';
import 'scss/dte-theme.scss';
// load these AFTER the community styles, which is closer in simulating the CSS loading
// order of our own components
import 'styles.scss';

// ensure NL locale is included
import OpenFormsModule from 'formio/module';
import OFLibrary from 'formio/templates';

import {
  withClearSessionStorage,
  withConfig,
  withGeolocationMocking,
  withModalDecorator,
  withUtrechtDocument,
} from './decorators';
import {allModes} from './modes.mjs';
import {reactIntl} from './reactIntl.mjs';

window._ = lodash;

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: './mockServiceWorker.js',
  },
  quiet: true, // don't output logs
});

// Use our custom Form.io components
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

const preview: Preview = {
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        'Open Forms': 'openforms-theme',
        'Gemeente Utrecht': 'utrecht-theme',
        'Gemeente Den Haag': 'denhaag-theme',
        'Gemeente Rotterdam': 'rotterdam-theme',
      },
      defaultTheme: 'Open Forms',
    }),
    withClearSessionStorage,
    withModalDecorator,
    withConfig,
    withUtrechtDocument,
    withGeolocationMocking,
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
        mobile: allModes.smallMobile,
        desktop: allModes.desktop,
      },
    },
    geolocation: {
      permission: 'granted',
      latitude: 52.3857386,
      longitude: 4.8417475,
      updatePermission: () => {}, // Is set by withGeolocationMocking
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
  },
};

export default preview;

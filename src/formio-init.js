/**
 * This module is intended to be lazy loaded so that Vite can split the bundle in
 * separate chunks.
 */
import ProtectedEval from '@formio/protected-eval';
import lodash from 'lodash';
import {Form, Formio, Templates} from 'react-formio';

import OpenFormsModule from './formio/module';
import {AddFetchAuth} from './formio/plugins';
import OFLibrary from './formio/templates';

let initialized = false;

/**
 * Initialize our Formio customization.
 */
export const initializeFormio = () => {
  if (initialized) return;

  // lodash must be bundled for Formio templates to work properly...
  if (typeof window !== 'undefined') {
    window._ = lodash;
  }

  // use protected eval to not rely on unsafe-eval (CSP)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Formio.use(ProtectedEval);

  // use custom component overrides
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Formio.use(OpenFormsModule);

  // use our own template library
  Templates.current = OFLibrary;

  Formio.registerPlugin(AddFetchAuth, 'addFetchAuth');

  Formio.libraries = {
    // The flatpickr css is added as part of our scss build so add empty attribute to
    //   prevent Formio trying to get this css from a CDN
    'flatpickr-css': '',
  };

  initialized = true;
};

export {Form};

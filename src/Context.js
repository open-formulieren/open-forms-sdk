import React from 'react';

const ConfigContext = React.createContext({
  baseUrl: '',
  basePath: '',
  displayComponents: {
    app: null,
    form: null,
    progressIndicator: null,
    loginOptions: null,
  },
});
ConfigContext.displayName = 'ConfigContext';

const FormioTranslations = React.createContext({i18n: {}, language: ''});
FormioTranslations.displayName = 'FormioTranslations';

const SubmissionContext = React.createContext({submission: null});
SubmissionContext.displayName = 'SubmissionContext';

export {ConfigContext, FormioTranslations, SubmissionContext};

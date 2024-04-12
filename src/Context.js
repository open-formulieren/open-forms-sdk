import React from 'react';

import {DEBUG} from 'utils';

const FormContext = React.createContext({
  uuid: '',
  name: '',
  slug: '',
  url: '',
  loginRequired: false,
  loginOptions: [],
  maintenanceMode: false,
  showProgressIndicator: true,
  submissionAllowed: 'yes',
  submissionStatementsConfiguration: [],
  literals: {
    beginText: {value: '', resolved: 'Begin'},
    changeText: {value: '', resolved: 'Change'},
    confirmText: {value: '', resolved: 'Confirm'},
    previousText: {value: '', resolved: 'Previous'},
  },
  steps: [],
});
FormContext.displayName = 'FormContext';

const AnalyticsToolsConfigContext = React.createContext({
  govmetricSourceIdFormFinished: '',
  govmetricSourceIdFormAborted: '',
  govmetricSecureGuidFormFinished: '',
  govmetricSecureGuidFormAborted: '',
  enableGovmetricAnalytics: false,
});

const ConfigContext = React.createContext({
  baseUrl: '',
  clientBaseUrl: window.location.href,
  basePath: '',
  baseTitle: '',
  requiredFieldsWithAsterisk: true,
  displayComponents: {
    app: null,
    loginOptions: null,
  },
  debug: DEBUG,
});
ConfigContext.displayName = 'ConfigContext';

const FormioTranslations = React.createContext({i18n: {}, language: ''});
FormioTranslations.displayName = 'FormioTranslations';

const SubmissionContext = React.createContext({submission: null});
SubmissionContext.displayName = 'SubmissionContext';

export {
  FormContext,
  ConfigContext,
  FormioTranslations,
  SubmissionContext,
  AnalyticsToolsConfigContext,
};

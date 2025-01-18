import React from 'react';

import {DEBUG} from 'utils';

const FormContext = React.createContext({
  uuid: '',
  name: '',
  slug: '',
  url: '',
  introductionPageContent: '',
  loginRequired: false,
  loginOptions: [],
  cosignLoginOptions: [],
  maintenanceMode: false,
  showProgressIndicator: true,
  showSummaryProgress: false,
  submissionAllowed: 'yes',
  sendConfirmationEmail: true,
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

const ConfigContext = React.createContext({
  baseUrl: '',
  clientBaseUrl: window.location.href,
  basePath: '',
  baseTitle: '',
  requiredFieldsWithAsterisk: true,
  debug: DEBUG,
});
ConfigContext.displayName = 'ConfigContext';

const FormioTranslations = React.createContext({i18n: {}, language: ''});
FormioTranslations.displayName = 'FormioTranslations';

const SubmissionContext = React.createContext({submission: null});
SubmissionContext.displayName = 'SubmissionContext';

export {FormContext, ConfigContext, FormioTranslations, SubmissionContext};

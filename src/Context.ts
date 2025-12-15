import React from 'react';

import type {Form} from '@/data/forms';
import type {Submission} from '@/data/submissions';
import {DEBUG} from '@/utils';

const FormContext = React.createContext<Form>({
  uuid: '',
  name: '',
  loginRequired: false,
  translationEnabled: false,
  loginOptions: [],
  autoLoginAuthenticationBackend: '',
  paymentRequired: false,
  literals: {
    beginText: {resolved: 'Begin'},
    changeText: {resolved: 'Change'},
    confirmText: {resolved: 'Confirm'},
    previousText: {resolved: 'Previous'},
  },
  slug: '',
  url: '',
  steps: [],
  showProgressIndicator: true,
  showSummaryProgress: false,
  maintenanceMode: false,
  active: true,
  introductionPageContent: '',
  explanationTemplate: '',
  submissionAllowed: 'yes',
  submissionLimitReached: false,
  suspensionAllowed: true,
  sendConfirmationEmail: true,
  displayMainWebsiteLink: true,
  requiredFieldsWithAsterisk: true,
  resumeLinkLifetime: 1,
  hideNonApplicableSteps: false,
  cosignLoginOptions: [],
  cosignHasLinkInEmail: true,
  submissionStatementsConfiguration: [],
  submissionReportDownloadLinkTitle: '',
  appointmentOptions: {
    isAppointment: false,
    supportsMultipleProducts: null,
  },
  newRendererEnabled: false,
  communicationPreferencesPortalUrl: '',
});
FormContext.displayName = 'FormContext';

export interface ConfigContextType {
  baseUrl: string;
  clientBaseUrl: string;
  basePath: string;
  baseTitle: string;
  /**
   * @deprecated - use FormContext instead
   */
  requiredFieldsWithAsterisk: boolean;
  debug: boolean;
}

const ConfigContext = React.createContext<ConfigContextType>({
  baseUrl: '',
  clientBaseUrl: window.location.href,
  basePath: '',
  baseTitle: '',
  requiredFieldsWithAsterisk: true,
  debug: DEBUG,
});
ConfigContext.displayName = 'ConfigContext';

type LanguageCode = string;

export interface FormioTranslationsContext {
  i18n: Record<LanguageCode, Record<string, string>>;
  language: LanguageCode;
}

const FormioTranslations = React.createContext<FormioTranslationsContext>({i18n: {}, language: ''});
FormioTranslations.displayName = 'FormioTranslations';

export interface SubmissionContext {
  submission: Submission | null;
}

const SubmissionContext = React.createContext<SubmissionContext>({submission: null});
SubmissionContext.displayName = 'SubmissionContext';

export {FormContext, ConfigContext, FormioTranslations, SubmissionContext};

import {produce} from 'immer';
import {HttpResponse, http} from 'msw';

import {PRIVACY_POLICY_ACCEPTED} from '@/components/SummaryConfirmation/mocks';
import type {Form, FormStep} from '@/data/forms';

import {BASE_URL, getDefaultFactory} from './base';
import {DEFAULT_FORMIO_CONFIGURATION} from './submissions';

export const FORM_DEFAULTS = {
  uuid: 'e450890a-4166-410e-8d64-0a54ad30ba01',
  name: 'Mock form',
  slug: 'mock',
  type: 'regular',
  url: `${BASE_URL}forms/mock`,
  loginRequired: false,
  loginOptions: [],
  showProgressIndicator: true,
  showSummaryProgress: false,
  maintenanceMode: false,
  active: true,
  submissionAllowed: 'yes',
  submissionLimitReached: false,
  suspensionAllowed: true,
  sendConfirmationEmail: true,
  displayMainWebsiteLink: true,
  submissionStatementsConfiguration: [PRIVACY_POLICY_ACCEPTED],
  appointmentOptions: {
    supportsMultipleProducts: null,
  },
  literals: {
    beginText: {resolved: 'Begin', value: ''},
    changeText: {resolved: 'Change', value: ''},
    confirmText: {resolved: 'Confirm', value: ''},
    previousText: {resolved: 'Previous', value: ''},
  },
  steps: [
    {
      uuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
      slug: 'step-1',
      formDefinition: 'Step 1',
      index: 0,
      literals: {
        previousText: {resolved: 'Previous', value: ''},
        saveText: {resolved: 'Save', value: ''},
        nextText: {resolved: 'Next', value: ''},
      },
      url: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
    },
    {
      uuid: '98980oi8-e5a4-4abf-b64a-76j3j3ki897',
      slug: 'step-2',
      formDefinition: 'Step 2',
      index: 1,
      literals: {
        previousText: {resolved: 'Previous', value: ''},
        saveText: {resolved: 'Save', value: ''},
        nextText: {resolved: 'Next', value: ''},
      },
      url: `${BASE_URL}forms/mock/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
    },
  ],
  introductionPageContent: '',
  explanationTemplate: '',
  requiredFieldsWithAsterisk: true,
  resumeLinkLifetime: 7,
  autoLoginAuthenticationBackend: '',
  translationEnabled: false,
  hideNonApplicableSteps: false,
  cosignLoginOptions: [],
  cosignHasLinkInEmail: false,
  paymentRequired: false,
  submissionReportDownloadLinkTitle: '',
  communicationPreferencesPortalUrl: '',
} satisfies Form;

export const SINGLE_STEP_FORM_DEFAULTS = {
  uuid: '05c6e422-7f39-4366-ae7a-1da642e1f5ff',
  name: 'Mock single step form',
  slug: 'mock-single-step',
  type: 'single_step',
  url: `${BASE_URL}forms/05c6e422-7f39-4366-ae7a-1da642e1f5ff`,
  loginRequired: false,
  loginOptions: [],
  showProgressIndicator: false,
  showSummaryProgress: false,
  maintenanceMode: false,
  active: true,
  submissionAllowed: 'yes',
  submissionLimitReached: false,
  suspensionAllowed: false,
  sendConfirmationEmail: true,
  displayMainWebsiteLink: true,
  submissionStatementsConfiguration: [PRIVACY_POLICY_ACCEPTED],
  appointmentOptions: {
    supportsMultipleProducts: null,
  },
  literals: {
    beginText: {resolved: 'Begin', value: ''},
    changeText: {resolved: 'Change', value: ''},
    confirmText: {resolved: 'Confirm', value: ''},
    previousText: {resolved: 'Previous', value: ''},
  },
  steps: [
    {
      uuid: '3ad1734b-d095-4da0-8b7e-9f6900ffda17',
      slug: 'step-1',
      formDefinition: 'Step 1',
      index: 0,
      literals: {
        previousText: {resolved: 'Previous', value: ''},
        saveText: {resolved: 'Save', value: ''},
        nextText: {resolved: 'Next', value: ''},
      },
      url: `${BASE_URL}forms/05c6e422-7f39-4366-ae7a-1da642e1f5ff/steps/3ad1734b-d095-4da0-8b7e-9f6900ffda17`,
    },
  ],
  introductionPageContent: '',
  explanationTemplate: '',
  requiredFieldsWithAsterisk: true,
  resumeLinkLifetime: 7,
  autoLoginAuthenticationBackend: '',
  translationEnabled: false,
  hideNonApplicableSteps: false,
  cosignLoginOptions: [],
  cosignHasLinkInEmail: false,
  paymentRequired: false,
  submissionReportDownloadLinkTitle: '',
  communicationPreferencesPortalUrl: '',
} satisfies Form;

const FORM_STEP_DETAILS_DEFAULT = {
  uuid: '3ad1734b-d095-4da0-8b7e-9f6900ffda17',
  index: 0,
  slug: 'single-step',
  configuration: DEFAULT_FORMIO_CONFIGURATION,
  formDefinition: `${BASE_URL}/form-definitions/65e2a836-cd31-45b0-adfd-5fc68afe2038`,
  name: 'Single step',
  url: `${BASE_URL}/forms/05c6e422-7f39-4366-ae7a-1da642e1f5ff/steps/3ad1734b-d095-4da0-8b7e-9f6900ffda17`,
  isApplicable: true,
  loginRequired: false,
  literals: {
    previousText: {
      resolved: 'Previous page',
      value: '',
    },
    saveText: {
      resolved: 'Save current information',
      value: '',
    },
    nextText: {
      resolved: 'Next',
      value: '',
    },
  },
  translations: {
    nl: {
      previousText: '',
      saveText: '',
      nextText: '',
    },
    en: {
      previousText: '',
      saveText: '',
      nextText: '',
    },
  },
};

/**
 * Return a form object as if it would be returned from the form detail API endpoint.
 * @param  overrides Key-value mapping with overrides from the defaults. These
 *                   are deep-assigned via lodash.set to the defaults, so use
 *                   '.'-joined strings as keys for deep paths.
 * @return            A form detail object conforming to the Form proptype spec.
 */
export const buildForm = getDefaultFactory<Form>(FORM_DEFAULTS);

export const mockFormGet = (formDetail = buildForm(), once = false) =>
  http.get(
    `${BASE_URL}forms/:uuid`,
    ({request}) => {
      const url = new URL(request.url);

      // update with request details for consistent response
      const uuid = url.pathname.split('/').slice(-1)[0];
      formDetail = produce(formDetail, draft => {
        draft.url = url.href;
        draft.uuid = uuid;
        for (const step of draft.steps) {
          step.url = `${draft.url}/steps/${step.uuid}`;
        }
      });
      return HttpResponse.json(formDetail);
    },
    {once: once}
  );

export const mockFormStepGet = (formStepDetails: FormStep = FORM_STEP_DETAILS_DEFAULT) =>
  http.get(`${BASE_URL}forms/:uuid/steps/:stepUuid`, () => {
    return HttpResponse.json(formStepDetails, {status: 200});
  });

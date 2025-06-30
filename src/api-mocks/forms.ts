import {produce} from 'immer';
import {HttpResponse, http} from 'msw';

import {PRIVACY_POLICY_ACCEPTED} from 'components/SummaryConfirmation/mocks';
import {SUBMISSION_ALLOWED} from 'components/constants';

import type {Form} from '@/data/forms';

import {BASE_URL, getDefaultFactory} from './base';

export const FORM_DEFAULTS = {
  uuid: 'e450890a-4166-410e-8d64-0a54ad30ba01',
  name: 'Mock form',
  slug: 'mock',
  url: `${BASE_URL}forms/mock`,
  loginRequired: false,
  loginOptions: [],
  showProgressIndicator: true,
  showSummaryProgress: false,
  maintenanceMode: false,
  active: true,
  submissionAllowed: SUBMISSION_ALLOWED.yes,
  submissionLimitReached: false,
  suspensionAllowed: true,
  sendConfirmationEmail: true,
  displayMainWebsiteLink: true,
  submissionStatementsConfiguration: [PRIVACY_POLICY_ACCEPTED],
  appointmentOptions: {
    isAppointment: false,
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
} satisfies Form;

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

import produce from 'immer';
import {rest} from 'msw';

import {PRIVACY_POLICY_ACCEPTED} from 'components/SummaryConfirmation/mocks';

import {BASE_URL, getDefaultFactory} from './base';

export const FORM_DEFAULTS = {
  uuid: 'e450890a-4166-410e-8d64-0a54ad30ba01',
  name: 'Mock form',
  slug: 'mock',
  url: `${BASE_URL}forms/mock`,
  loginRequired: false,
  loginOptions: [],
  cosignLoginInfo: undefined,
  product: '',
  showProgressIndicator: true,
  maintenanceMode: false,
  active: true,
  submissionAllowed: 'yes',
  suspensionAllowed: true,
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
  explanationTemplate: '',
  requiredFieldsWithAsterisk: true,
  resumeLinkLifetime: 7,
  autoLoginAuthenticationBackend: '',
  translationEnabled: false,
  hideNonApplicableSteps: false,
  paymentRequired: false,
  paymentOptions: [],
};

/**
 * Return a form object as if it would be returned from the form detail API endpoint.
 * @param  {Object} overrides Key-value mapping with overrides from the defaults. These
 *                            are deep-assigned via lodash.set to the defaults, so use
 *                            '.'-joined strings as keys for deep paths.
 * @return {Object}           A form detail object conforming to the Form proptype spec.
 */
export const buildForm = getDefaultFactory(FORM_DEFAULTS);

export const mockFormGet = (formDetail = buildForm(), once = false) =>
  rest.get(`${BASE_URL}forms/:uuid`, (req, res, ctx) => {
    // update with request details for consistent response
    const uuid = req.url.pathname.split('/').slice(-1)[0];
    formDetail = produce(formDetail, draft => {
      draft.url = req.url.href;
      draft.uuid = uuid;
      for (const step of draft.steps) {
        step.url = `${draft.url}/steps/${step.uuid}`;
      }
    });
    if (once) {
      res = res.once;
    }
    return res(ctx.json(formDetail));
  });

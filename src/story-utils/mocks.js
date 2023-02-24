import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export const BASE_URL = process.env.REACT_APP_BASE_API_URL || 'http://localhost:8000/api/v2/';

const FORM_DEFAULTS = {
  uuid: 'e450890a-4166-410e-8d64-0a54ad30ba01',
  name: 'Mock form',
  slug: 'mock',
  url: `${BASE_URL}forms/mock`,
  loginRequired: false,
  loginOptions: [],
  product: '',
  maintenanceMode: false,
  showProgressIndicator: true,
  submissionAllowed: 'yes',
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
  autoLoginAuthenticationBackend: '',
  translationEnabled: false,
};

/**
 * Return a form object as if it would be returned from the form detail API endpoint.
 * @param  {Object} overrides Key-value mapping with overrides from the defaults. These
 *                            are deep-assigned via lodash.set to the defaults, so use
 *                            '.'-joined strings as keys for deep paths.
 * @return {Object}           A form detail object conforming to the Form proptype spec.
 */
export const getForm = (overrides = {}) => {
  const form = cloneDeep(FORM_DEFAULTS);
  for (const [key, value] in Object.entries(overrides)) {
    set(form, key, value);
  }
  return form;
};

// FIXME - this is incomplete, the prop types aren't detailed enough.
const SUBMISSION_DETAILS = {
  id: '458b29ae-5baa-4132-a0d7-8c7071b8152a',
  url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a`,
  form: `${BASE_URL}forms/mock`,
  steps: [
    {
      id: '6ca342af-86c7-451c-a19f-65050b2eee5c',
      name: 'Step 1',
      url: `${BASE_URL}submissions/458b29ae-5baa-4132-a0d7-8c7071b8152a/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
      formStep: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
      isApplicable: true,
      completed: false,
      canSubmit: true,
    },
  ],
};

/**
 * Return a submission object as if it would be returned from the backend API.
 * @param  {Object} overrides Key-value mapping with overrides from the defaults. These
 *                            are deep-assigned via lodash.set to the defaults, so use
 *                            '.'-joined strings as keys for deep paths.
 * @return {Object}           A submission object.
 */
export const getSubmission = (overrides = {}) => {
  const submission = cloneDeep(SUBMISSION_DETAILS);
  for (const [key, value] in Object.entries(overrides)) {
    set(submission, key, value);
  }
  return submission;
};

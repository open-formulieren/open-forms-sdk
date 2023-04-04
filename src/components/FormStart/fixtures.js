import {SUBMISSION_ALLOWED} from 'components/constants';

export const testForm = {
  literals: {
    confirmText: {value: '', resolved: 'Confirm'},
    changeText: {value: '', resolved: 'Change'},
    beginText: {value: '', resolved: 'Begin form'},
    previousText: {value: '', resolved: 'Previous page'},
  },
  loginOptions: [],
  maintenanceMode: false,
  isDeleted: false,
  submissionConfirmationTemplate: '',
  url: 'http://testserver/api/v1/forms/33af5a1c-552e-4e8f-8b19-287cf35b9edd',
  steps: [
    {
      literals: {
        confirmText: {value: '', resolved: 'Confirm'},
        changeText: {value: '', resolved: 'Change'},
        beginText: {value: '', resolved: 'Begin form'},
        previousText: {value: '', resolved: 'Previous page'},
        nextText: {value: '', resolved: 'Next page'},
        saveText: {value: '', resolved: 'Save'},
      },
      uuid: '0c2a1816-a7d7-4193-b431-918956744038',
      slug: 'test-step',
      index: 0,
      formDefinition: 'Test Definition',
      url: 'http://testserver/api/v1/forms/33af5a1c-552e-4e8f-8b19-287cf35b9edd/steps/0c2a1816-a7d7-4193-b431-918956744038',
    },
  ],
  active: true,
  showProgressIndicator: true,
  authenticationBackends: ['digid'],
  product: null,
  slug: 'test-form',
  loginRequired: false,
  name: 'Test Form',
  uuid: '33af5a1c-552e-4e8f-8b19-287cf35b9edd',
  submissionAllowed: SUBMISSION_ALLOWED.yes,
};

export const testLoginForm = {
  literals: {
    confirmText: {value: '', resolved: 'Confirm'},
    changeText: {value: '', resolved: 'Change'},
    beginText: {value: '', resolved: 'Begin form'},
    previousText: {value: '', resolved: 'Previous page'},
  },
  loginOptions: [
    {
      identifier: 'digid',
      label: 'DigiD',
      url: 'https://openforms.nl/auth/form-name/digid/start',
      logo: {
        title: 'DigiD',
        imageSrc: 'https://openforms.nl/static/img/digid-46x46.71ea68346bbb.png',
        href: 'https://www.digid.nl/',
        appearance: 'dark',
      },
      isForGemachtigde: false,
    },
  ],
  maintenanceMode: false,
  isDeleted: false,
  submissionConfirmationTemplate: '',
  url: 'http://testserver/api/v1/forms/33af5a1c-552e-4e8f-8b19-287cf35b9edd',
  steps: [
    {
      literals: {
        confirmText: {value: '', resolved: 'Confirm'},
        changeText: {value: '', resolved: 'Change'},
        beginText: {value: '', resolved: 'Begin form'},
        previousText: {value: '', resolved: 'Previous page'},
        nextText: {value: '', resolved: 'Next page'},
        saveText: {value: '', resolved: 'Save'},
      },
      uuid: '0c2a1816-a7d7-4193-b431-918956744038',
      slug: 'test-step',
      index: 0,
      formDefinition: 'Test Definition',
      url: 'http://testserver/api/v1/forms/33af5a1c-552e-4e8f-8b19-287cf35b9edd/steps/0c2a1816-a7d7-4193-b431-918956744038',
    },
  ],
  active: true,
  showProgressIndicator: true,
  authenticationBackends: ['digid'],
  product: null,
  slug: 'test-form',
  loginRequired: false,
  name: 'Test Form',
  uuid: '33af5a1c-552e-4e8f-8b19-287cf35b9edd',
  submissionAllowed: SUBMISSION_ALLOWED.yes,
};

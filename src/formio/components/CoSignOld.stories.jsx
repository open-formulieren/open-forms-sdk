import {HttpResponse, http} from 'msw';

import {BASE_URL} from '@/api-mocks';
import {SingleFormioComponent} from '@/formio/components/story-util';

const SUBMISSION_UUID = '426c8d33-6dcb-4578-8208-f17071a4aebe';
const mockGetCosignStatus = (coSigned = false, representation = '') =>
  http.get(`${BASE_URL}submissions/${SUBMISSION_UUID}/co-sign`, () => {
    return HttpResponse.json({coSigned, representation});
  });

export default {
  title: 'Form.io components / Custom / Cosign (old)',
  render: SingleFormioComponent,
  args: {
    ofContext: {
      submissionUuid: SUBMISSION_UUID,
      form: {
        loginOptions: [
          {
            identifier: 'digid-mock-without-logo',
            label: 'DigiD',
            url: 'https://example.com',
            isForGemachtigde: false,
          },
          {
            identifier: 'digid-mock',
            label: 'DigiD',
            url: 'https://example.com',
            isForGemachtigde: false,
            logo: {
              title: 'DigiD simulatie',
              imageSrc: './digid.png',
              href: 'https://www.digid.nl/',
              appearance: 'dark',
            },
          },
        ],
      },
    },
  },
};

export const MinimalConfiguration = {
  args: {
    type: 'coSign',
    key: 'coSign',
    label: 'Cosign',
    extraComponentProperties: {
      authPlugin: 'digid-mock',
      description: 'This is a description!',
    },
  },
};

export const WithoutLogo = {
  args: {
    type: 'coSign',
    key: 'coSign',
    label: 'Cosign',
    extraComponentProperties: {
      authPlugin: 'digid-mock-without-logo',
      description: 'This is a description!',
    },
  },
};

export const AlreadyCosigned = {
  parameters: {
    msw: {handlers: [mockGetCosignStatus(true, 'Hans Worst')]},
  },
  args: {
    type: 'coSign',
    key: 'coSign',
    label: 'Cosign',
    extraComponentProperties: {
      authPlugin: 'digid-mock',
      description: 'This is a description!',
    },
  },
};

export const AlreadyCosignedWithoutRepresentation = {
  parameters: {
    msw: {handlers: [mockGetCosignStatus(true, '')]},
  },
  args: {
    type: 'coSign',
    key: 'coSign',
    label: 'Cosign',
    extraComponentProperties: {
      authPlugin: 'digid-mock',
      description: 'This is a description!',
    },
  },
};

export const LoginOptionsNotAvailable = {
  args: {
    type: 'coSign',
    key: 'coSign',
    label: 'Cosign',
    extraComponentProperties: {
      authPlugin: 'digid-mock',
      description: 'This is a description!',
    },
    ofContext: {
      form: {
        loginOptions: [],
      },
    },
  },
};

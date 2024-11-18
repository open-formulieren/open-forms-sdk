import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from 'api-mocks';
import {withForm} from 'story-utils/decorators';

import CosignStart from './CosignStart';

export default {
  title: 'Views / Cosign / Start',
  component: CosignStart,
  decorators: [withForm, withRouter],
  parameters: {
    formContext: {
      form: buildForm({
        loginRequired: true,
        loginOptions: [
          {
            identifier: 'digid',
            label: 'DigiD',
            url: '#',
            logo: {
              title: 'DigiD simulatie',
              imageSrc: './digid.png',
              href: 'https://www.digid.nl/',
              appearance: 'dark',
            },
            isForGemachtigde: false,
          },
        ],
        cosignLoginOptions: [
          {
            identifier: 'digid',
            label: 'DigiD',
            url: 'http://localhost:8000/auth/digid/?next=http://localhost:8000/cosign&amp;code=123',
            logo: {
              title: 'DigiD simulatie',
              imageSrc: './digid.png',
              href: 'https://www.digid.nl/',
              appearance: 'dark',
            },
            isForGemachtigde: false,
          },
        ],
      }),
    },
  },
};

export const Default = {
  name: 'CosignStart',
};

import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from '@/api-mocks';
import {withForm} from '@/sb-decorators';

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
} satisfies Meta<typeof CosignStart>;

type Story = StoryObj<typeof CosignStart>;

export const Default: Story = {
  name: 'CosignStart',
};

export const LoginOptional: Story = {
  parameters: {
    formContext: {
      form: {
        loginRequired: false,
      },
    },
  },
};

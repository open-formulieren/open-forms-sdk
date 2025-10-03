import type {Meta, StoryObj} from '@storybook/react';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from '@/api-mocks';
import {withForm} from '@/sb-decorators';

import FormStart from './index';

export default {
  title: 'Private API / FormStart',
  decorators: [withForm, withRouter],
  component: FormStart,
  parameters: {
    formContext: {
      form: buildForm(),
    },
  },
} satisfies Meta<typeof FormStart>;

type Story = StoryObj<typeof FormStart>;

export const Default: Story = {};

export const ExplanationTemplate: Story = {
  parameters: {
    formContext: {
      form: buildForm({
        explanationTemplate: `
          <h2>Important!</h2>
          <p>A WYSIWYG explanation text set by form builders</p>
        `,
      }),
    },
  },
};

export const LoginRequired: Story = {
  parameters: {
    formContext: {
      form: buildForm({
        loginRequired: true,
        loginOptions: [
          {
            identifier: 'digid',
            label: 'DigiD',
            logo: {
              appearance: 'dark',
              href: 'https://www.digid.nl/',
              title: 'DigiD',
              imageSrc: './digid.png',
            },
            url: '#',
            isForGemachtigde: false,
          },
        ],
      }),
    },
  },
};

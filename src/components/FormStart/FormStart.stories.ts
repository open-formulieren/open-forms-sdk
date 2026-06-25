import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';
import {expect, within} from 'storybook/test';

import {buildForm} from '@/api-mocks';
import {withForm, withNuqs} from '@/sb-decorators';

import FormStart from './index';

export default {
  title: 'Private API / FormStart',
  decorators: [withForm, withNuqs, withRouter],
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
            visible: true,
          },
        ],
      }),
    },
  },
};

export const WithHiddenFormTitle: Story = {
  parameters: {
    config: {
      showFormTitle: false,
    },
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
            visible: true,
          },
        ],
      }),
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByText('Mock form')).not.toBeInTheDocument();
  },
};

import type {Meta, StoryObj} from '@storybook/react-vite';
import {withRouter} from 'storybook-addon-remix-react-router';
import {expect, within} from 'storybook/test';

import {buildForm} from '@/api-mocks';
import {mockFormProductDetails} from '@/api-mocks/form-product-details';
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
          <ul>
            <li>It can have unordered lists too</li>
          </ul>
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

export const WithProductDetails: Story = {
  parameters: {
    formContext: {
      form: buildForm({
        showProductDetails: true,
      }),
    },
    msw: {
      handlers: [mockFormProductDetails('e450890a-4166-410e-8d64-0a54ad30ba01')],
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const productName = await canvas.findByText('A product name');
    const productContent = await canvas.findByText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );

    await expect(productName).toBeInTheDocument();
    await expect(productContent).toBeInTheDocument();
  },
};

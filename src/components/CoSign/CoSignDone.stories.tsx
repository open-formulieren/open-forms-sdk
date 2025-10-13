import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from '@/api-mocks';
import {withForm} from '@/sb-decorators';

import {CosignProvider} from './Context';
import CosignDone from './CosignDone';

export default {
  title: 'Views / Cosign / Done',
  component: CosignDone,
  decorators: [
    Story => (
      <CosignProvider reportDownloadUrl="#" onCosignComplete={fn()}>
        <Story />
      </CosignProvider>
    ),
    withForm,
    withRouter,
  ],
  parameters: {
    formContext: {
      form: buildForm({sendConfirmationEmail: true}),
    },
  },
} satisfies Meta<typeof CosignDone>;

type Story = StoryObj<typeof CosignDone>;

export const EmailConfirmationEnabled: Story = {
  parameters: {
    formContext: {
      form: buildForm({sendConfirmationEmail: true}),
    },
  },
};

export const EmailConfirmationDisabled: Story = {
  parameters: {
    formContext: {
      form: buildForm({sendConfirmationEmail: false}),
    },
  },
};

export const WithBackToTopButton: Story = {
  parameters: {
    config: {backToTopText: 'Back to top', backToTopRef: 'storybook-root'},
  },
};

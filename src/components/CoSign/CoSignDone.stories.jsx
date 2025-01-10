import {fn} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from 'api-mocks';
import {withForm} from 'story-utils/decorators';

import {CosignProvider} from './Context';
import CosignDone from './CosignDone';

export default {
  title: 'Views / Cosign / Done',
  component: CosignDone,
  decorators: [
    (Story, {args}) => (
      <CosignProvider reportDownloadUrl={args.reportDownloadUrl} onCosignComplete={fn()}>
        <Story />
      </CosignProvider>
    ),
    withForm,
    withRouter,
  ],
  args: {
    reportDownloadUrl: '#',
  },
  parameters: {
    formContext: {
      form: buildForm({sendConfirmationEmail: true}),
    },
  },
};

export const EmailConfirmationEnabled = {
  parameters: {
    formContext: {
      form: buildForm({sendConfirmationEmail: true}),
    },
  },
};

export const EmailConfirmationDisabled = {
  parameters: {
    formContext: {
      form: buildForm({sendConfirmationEmail: false}),
    },
  },
};

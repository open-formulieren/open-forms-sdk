import {withRouter} from 'storybook-addon-remix-react-router';

import {buildForm} from 'api-mocks';
import {withForm} from 'story-utils/decorators';

import CosignDone from './CosignDone';

export default {
  title: 'Views / Cosign / Done',
  component: CosignDone,
  decorators: [withForm, withRouter],
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

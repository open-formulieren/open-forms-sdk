import {expect} from '@storybook/jest';
import {waitFor, within} from '@storybook/testing-library';
import {withRouter} from 'storybook-addon-react-router-v6';

import {buildForm} from 'api-mocks';

import ExistingSubmissionOptions from './ExistingSubmissionOptions';

export default {
  title: 'Private API / Existing Submission Options',
  component: ExistingSubmissionOptions,
  decorators: [withRouter],
  args: {
    form: buildForm(),
  },
  argTypes: {
    form: {control: false},
  },
};

export const Default = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      const abortButton = await canvas.queryByRole('button', {name: 'Opnieuw starten'});
      await expect(abortButton).toBeVisible();
    });
  },
};

import {expect} from '@storybook/jest';
import {waitFor, within} from '@storybook/testing-library';

import {BASE_URL} from 'api-mocks';
import {buildForm} from 'api-mocks';
import {mockSubmissionProcessingStatusGet} from 'api-mocks/submissions';
import {LayoutDecorator, withCard} from 'story-utils/decorators';

import SubmissionConfirmation from './SubmissionConfirmation';

export default {
  title: 'Private API / SubmissionConfirmation',
  component: SubmissionConfirmation,
  decorators: [LayoutDecorator, withCard],
  args: {
    statusUrl: `${BASE_URL}submissions/4b0e86a8-dc5f-41cc-b812-c89857b9355b/-token-/status`,
    donwloadPDFText: 'Download your details as PDF',
  },
  argTypes: {
    statusUrl: {control: false},
  },
  parameters: {
    msw: {
      handlers: [mockSubmissionProcessingStatusGet],
    },
  },
};

export const Success = {
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await waitFor(
      async () => {
        expect(canvas.getByRole('button', {name: 'Terug naar de website'})).toBeVisible();
      },
      {
        timeout: 2000,
        interval: 100,
      }
    );
    expect(canvas.getByText(/OF-L337/)).toBeVisible();
    expect(args.onConfirmed).toBeCalledTimes(1);
  },
};

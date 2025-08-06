import {expect, fn, userEvent, within} from '@storybook/test';
import {withRouter} from 'storybook-addon-remix-react-router';

import {ConfigDecorator, withForm} from 'story-utils/decorators';

import {buildForm} from '@/api-mocks';
import {
  buildSubmission,
  mockSubmissionCompleteInvalidPost,
  mockSubmissionGet,
  mockSubmissionSummaryGet,
} from '@/api-mocks/submissions';
import SubmissionProvider from '@/components/SubmissionProvider';

import SubmissionSummary from './SubmissionSummary';

const form = buildForm();
const submission = buildSubmission();

export default {
  title: 'Private API / SubmissionSummary',
  component: SubmissionSummary,
  decorators: [
    (Story, {args}) => (
      <SubmissionProvider
        submission={args.submission}
        onSubmissionObtained={fn()}
        onDestroySession={fn()}
        removeSubmissionId={fn()}
      >
        <Story />
      </SubmissionProvider>
    ),
    withRouter,
    ConfigDecorator,
    withForm,
  ],
  args: {
    form,
    submission,
  },
  argTypes: {
    form: {table: {disable: true}},
    submission: {table: {disable: true}},
  },
  parameters: {
    msw: {
      handlers: {
        loadSubmission: [mockSubmissionGet(submission), mockSubmissionSummaryGet()],
      },
    },
  },
};

export const Overview = {};

export const BackendValidationErrors = {
  parameters: {
    msw: {
      handlers: {
        completeSubmission: [
          mockSubmissionCompleteInvalidPost([
            {
              name: 'steps.0.nonFieldErrors.0',
              code: 'invalid',
              reason: 'Your carpet is ugly.',
            },
            {
              name: 'steps.0.nonFieldErrors.1',
              code: 'invalid',
              reason: "And your veg ain't in season.",
            },
            {
              name: 'steps.0.data.component1',
              code: 'existential-nightmare',
              reason: 'I was waiting in line for ten whole minutes.',
            },
          ]),
        ],
      },
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Submit form submission to backend', async () => {
      await userEvent.click(
        await canvas.findByRole('checkbox', {name: /I accept the privacy policy/})
      );
      await userEvent.click(canvas.getByRole('button', {name: 'Confirm'}));
    });

    await step('Check validation errors from backend', async () => {
      const genericMessage = await canvas.findByText('De opgestuurde gegevens zijn ongeldig.');
      expect(genericMessage).toBeVisible();

      expect(await canvas.findByText(/Your carpet is ugly/)).toBeVisible();
      expect(await canvas.findByText(/And your veg/)).toBeVisible();
      expect(await canvas.findByText(/I was waiting in line for ten whole minutes/)).toBeVisible();
    });
  },
};

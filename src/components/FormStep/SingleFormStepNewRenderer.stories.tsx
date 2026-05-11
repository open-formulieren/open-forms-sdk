import type {Meta, StoryObj} from '@storybook/react-vite';
import {useMemo} from 'react';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {expect, within} from 'storybook/test';

import {buildForm, buildSubmission} from '@/api-mocks';
import {mockAnalyticsToolConfigGet} from '@/api-mocks';
import {SINGLE_STEP_FORM_DEFAULTS, mockFormStepGet} from '@/api-mocks/forms';
import {
  SINGLE_STEP_SUBMISSION_DETAILS,
  SINGLE_STEP_SUBMISSION_STEP_DETAILS,
  mockSubmissionCompletePost,
  mockSubmissionGet,
  mockSubmissionPost,
  mockSubmissionProcessingStatusGet,
  mockSubmissionStepGet,
  mockSubmissionStepPut,
  mockSubmissionStepValidatePost,
} from '@/api-mocks/submissions';
import routes, {FUTURE_FLAGS} from '@/routes';
import {withForm, withNuqs} from '@/sb-decorators';

import SingleFormStepNewRenderer from './SingleFormStepNewRenderer';

const DEFAULT_SUBMISSION = buildSubmission();

interface SingleStepWrapperProps {
  initialEntry: '/sp' | '/bevestiging';
}

const SingleStepWrapper: React.FC<SingleStepWrapperProps> = ({initialEntry = '/sp'}) => {
  const router = useMemo(
    () =>
      createMemoryRouter(routes, {
        initialEntries: [initialEntry],
        initialIndex: 0,
        future: FUTURE_FLAGS,
      }),
    [initialEntry]
  );

  return <RouterProvider router={router} />;
};

export default {
  title: 'Private API / FormStep / New Renderer / Single step',
  render: () => <SingleStepWrapper initialEntry="/sp" />,
  decorators: [withNuqs, withForm],
  component: SingleFormStepNewRenderer,
  parameters: {
    msw: {
      handlers: {
        submission: [
          mockSubmissionGet(DEFAULT_SUBMISSION),
          mockSubmissionPost(buildSubmission(SINGLE_STEP_SUBMISSION_DETAILS)),
          mockSubmissionCompletePost(SINGLE_STEP_SUBMISSION_DETAILS.id),
          mockSubmissionProcessingStatusGet,
        ],
        submissionStep: [
          mockSubmissionStepGet(SINGLE_STEP_SUBMISSION_STEP_DETAILS),
          mockSubmissionStepPut(SINGLE_STEP_SUBMISSION_STEP_DETAILS, 201),
        ],
        validate: [mockSubmissionStepValidatePost(undefined)],
        formStep: [mockFormStepGet()],
      },
    },
    formContext: {
      form: buildForm(SINGLE_STEP_FORM_DEFAULTS),
    },
  },
} satisfies Meta<typeof SingleFormStepNewRenderer>;

type Story = StoryObj<typeof SingleFormStepNewRenderer>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const nextButton = await canvas.findByRole('button', {name: 'Next'});
    expect(nextButton).toBeVisible();
  },
};

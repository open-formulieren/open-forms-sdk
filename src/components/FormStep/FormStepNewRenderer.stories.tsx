import type {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';
import {reactRouterParameters, withRouter} from 'storybook-addon-remix-react-router';

import {AnalyticsToolsDecorator, ConfigDecorator, withForm} from 'story-utils/decorators';

import {BASE_URL, buildForm, buildSubmission} from '@/api-mocks';
import {
  mockSubmissionCheckLogicPost,
  mockSubmissionGet,
  mockSubmissionStepGet,
  mockSubmissionStepPut,
} from '@/api-mocks/submissions';
import {
  mockEmailVerificationPost,
  mockEmailVerificationVerifyCodePost,
} from '@/components/EmailVerification/mocks';
import SubmissionProvider, {type SubmissionContextType} from '@/components/SubmissionProvider';

import FormStepNewRenderer from './FormStepNewRenderer';
import {getSubmissionStepDetail, mockSubmissionValidatePost} from './mocks';

const DEFAULT_SUBMISSION = buildSubmission();

const DEFAULT_SUBMISSION_STEP_DETAIL_BODY: any = getSubmissionStepDetail({
  formioConfiguration: {
    display: 'form',
    components: [
      // @ts-expect-error need to convert mocks to TS
      {
        type: 'textfield',
        key: 'text1',
        label: 'Simple text field',
        description: 'A help text for the text field',
      },
      // @ts-expect-error need to convert mocks to TS
      {
        type: 'radio',
        key: 'radio1',
        label: 'Radio choices',
        values: [
          {value: 'option1', label: 'Option1'},
          {value: 'option2', label: 'Option2'},
        ],
      },
    ],
  },
});

export default {
  title: 'Private API / FormStep / New Renderer',
  decorators: [
    (Story, {parameters}) => (
      <SubmissionProvider {...(parameters.submissionContext as SubmissionContextType)}>
        <Story />
      </SubmissionProvider>
    ),
    ConfigDecorator,
    withRouter,
    withForm,
    AnalyticsToolsDecorator,
  ],
  component: FormStepNewRenderer,
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: {step: 'step-1'},
      },
      routing: '/stap/:step',
    }),
    msw: {
      handlers: {
        submission: [mockSubmissionGet(DEFAULT_SUBMISSION)],
        submissionStep: [
          mockSubmissionStepGet(DEFAULT_SUBMISSION_STEP_DETAIL_BODY),
          mockSubmissionStepPut(DEFAULT_SUBMISSION_STEP_DETAIL_BODY, 201),
        ],
        logicCheck: [
          mockSubmissionCheckLogicPost(DEFAULT_SUBMISSION, DEFAULT_SUBMISSION_STEP_DETAIL_BODY),
        ],
        // no validation errors by default
        validate: [mockSubmissionValidatePost(undefined)],
        emailVerification: [mockEmailVerificationPost, mockEmailVerificationVerifyCodePost],
      },
    },
    config: {
      debug: false,
    },
    formContext: {
      form: buildForm({
        steps: [
          {
            uuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
            slug: 'step-1',
            formDefinition: 'Step 1',
            index: 0,
            literals: {
              previousText: {resolved: 'Previous', value: ''},
              saveText: {resolved: 'Save', value: ''},
              nextText: {resolved: 'Next', value: ''},
            },
            url: `${BASE_URL}forms/mock/steps/9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5`,
          },
          {
            uuid: '98980oi8-e5a4-4abf-b64a-76j3j3ki897',
            slug: 'step-2',
            formDefinition: 'Step 2',
            index: 1,
            literals: {
              previousText: {resolved: 'Previous', value: ''},
              saveText: {resolved: 'Save', value: ''},
              nextText: {resolved: 'Next', value: ''},
            },
            url: `${BASE_URL}forms/mock/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
          },
        ],
      }),
    },
    submissionContext: {
      submission: DEFAULT_SUBMISSION,
      onSubmissionObtained: fn(),
      onDestroySession: fn(),
      removeSubmissionId: fn(),
    } satisfies SubmissionContextType,
  },
} satisfies Meta<typeof FormStepNewRenderer>;

type Story = StoryObj<typeof FormStepNewRenderer>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const abortButton = await canvas.findByRole('button', {name: 'Annuleren'});
    expect(abortButton).toBeVisible();
  },
};

const VALIDATION_ERRORS_STEP_DETAIL_BODY: any = getSubmissionStepDetail({
  formioConfiguration: {
    display: 'form',
    components: [
      // @ts-expect-error need to convert mocks to TS
      {
        type: 'textfield',
        key: 'text1',
        label: 'Simple text field',
      },
    ],
  },
});

export const BackendValidationError: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(VALIDATION_ERRORS_STEP_DETAIL_BODY),
          mockSubmissionStepPut(VALIDATION_ERRORS_STEP_DETAIL_BODY, 201),
        ],
        validate: [
          // @ts-expect-error need to convert to TS
          mockSubmissionValidatePost({
            text1: 'Server side validation error',
          }),
        ],
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Once submitted and server side validation errors are displayed, the submit
    // button remains disabled until the input is corrected.
    const submitButton = await canvas.findByRole('button', {name: 'Next'});
    await userEvent.click(submitButton);
    expect(await canvas.findByText('Server side validation error')).toBeVisible();
    await waitFor(() => {
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');
    });

    //   // check that modifying the input enables the submit button again
    //   await userEvent.type(canvas.getByLabelText('Simple text field'), 'Foo');
    //   await waitFor(
    //     () => {
    //       expect(submitButton).toHaveAttribute('aria-disabled', 'false');
    //     },
    //     {timeout: 2000}
    //   );
  },
};

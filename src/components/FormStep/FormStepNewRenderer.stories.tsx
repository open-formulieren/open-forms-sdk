import type {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';
import {reactRouterParameters, withRouter} from 'storybook-addon-remix-react-router';

import {AnalyticsToolsDecorator, withForm} from 'story-utils/decorators';

import {BASE_URL, buildForm, buildSubmission, buildSubmissionStep} from '@/api-mocks';
import {
  mockSubmissionCheckLogicPost,
  mockSubmissionGet,
  mockSubmissionStepGet,
  mockSubmissionStepPut,
  mockSubmissionStepValidatePost,
} from '@/api-mocks/submissions';
import {
  mockEmailVerificationPost,
  mockEmailVerificationVerifyCodePost,
} from '@/components/EmailVerification/mocks';
import SubmissionProvider, {type SubmissionContextType} from '@/components/SubmissionProvider';

import FormStepNewRenderer from './FormStepNewRenderer';

const DEFAULT_SUBMISSION = buildSubmission();

const DEFAULT_SUBMISSION_STEP_DETAIL_BODY = buildSubmissionStep({
  components: [
    {
      id: 'text1',
      type: 'textfield',
      key: 'text1',
      label: 'Simple text field',
      description: 'A help text for the text field',
    },
    {
      id: 'radio1',
      type: 'radio',
      key: 'radio1',
      label: 'Radio choices',
      values: [
        {value: 'option1', label: 'Option1'},
        {value: 'option2', label: 'Option2'},
      ],
      defaultValue: '',
      openForms: {translations: {}, dataSrc: 'manual'},
    },
  ],
});

export default {
  title: 'Private API / FormStep / New Renderer',
  decorators: [
    (Story, {parameters}) => (
      <SubmissionProvider {...(parameters.submissionContext as SubmissionContextType)}>
        <Story />
      </SubmissionProvider>
    ),
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
          mockSubmissionCheckLogicPost(
            DEFAULT_SUBMISSION,
            DEFAULT_SUBMISSION_STEP_DETAIL_BODY,
            400
          ),
        ],
        // no validation errors by default
        validate: [mockSubmissionStepValidatePost(undefined)],
        emailVerification: [mockEmailVerificationPost, mockEmailVerificationVerifyCodePost],
      },
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

const LOGIC_CHECK_STEP_DETAIL_BODY = buildSubmissionStep({
  components: [
    {
      id: 'text1',
      type: 'textfield',
      key: 'text1',
      label: 'Simple text field',
      description: 'A help text for the text field',
    },
    {
      id: 'extraField',
      type: 'checkbox',
      key: 'checkbox',
      label: 'Field shown via logic check',
      hidden: true,
      defaultValue: true,
    },
  ],
});

// TODO: check what happens when the user input doesn't pass client side validation!
export const PerformServerLogicCheck: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(LOGIC_CHECK_STEP_DETAIL_BODY),
          mockSubmissionStepPut(LOGIC_CHECK_STEP_DETAIL_BODY, 201),
        ],
        logicCheck: [
          mockSubmissionCheckLogicPost(
            DEFAULT_SUBMISSION,
            buildSubmissionStep({
              components: [
                {
                  id: 'text1',
                  type: 'textfield',
                  key: 'text1',
                  label: 'Simple text field',
                  description: 'A help text for the text field',
                },
                {
                  id: 'extraField',
                  type: 'checkbox',
                  key: 'checkbox',
                  label: 'Field shown via logic check',
                  hidden: false, // toggled!
                  defaultValue: true,
                },
              ],
              data: {
                text1: 'Updated text field',
              },
            }),
            200
          ),
        ],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const textField = await canvas.findByLabelText('Simple text field');
    await userEvent.type(textField, 'Trigger logic evaluation');

    // allow 2s for the new field to be rendered
    const dynamicallyAddedCheckbox = await canvas.findByLabelText(
      'Field shown via logic check',
      undefined,
      {timeout: 2 * 1000}
    );
    await waitFor(() => {
      expect(dynamicallyAddedCheckbox).toBeChecked();
    });
    expect(textField).toHaveDisplayValue('Updated text field');
  },
};

const SUBMISSION_STEP_WITH_DATA_DETAIL_BODY = buildSubmissionStep({
  components: [
    {
      id: 'text1',
      type: 'textfield',
      key: 'text1',
      label: 'Simple text field',
      description: 'A help text for the text field',
    },
  ],
  data: {
    text1: 'Backend data',
  },
});

export const DisplayDataLoadedFromBackend: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(SUBMISSION_STEP_WITH_DATA_DETAIL_BODY),
          mockSubmissionStepPut(SUBMISSION_STEP_WITH_DATA_DETAIL_BODY, 201),
        ],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByLabelText('Simple text field');
    expect(input).toHaveDisplayValue('Backend data');
  },
};

const VALIDATION_ERRORS_STEP_DETAIL_BODY = buildSubmissionStep({
  components: [
    {
      id: 'text1',
      type: 'textfield',
      key: 'text1',
      label: 'Simple text field',
    },
  ],
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
          mockSubmissionStepValidatePost({
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

    // check that modifying the input enables the submit button again
    const input = canvas.getByLabelText('Simple text field');
    await userEvent.type(input, 'Foo');
    input.blur();
    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute('aria-disabled', 'false');
      },
      {timeout: 2000}
    );
  },
};

export const SummaryProgressVisible: Story = {
  parameters: {
    formContext: {
      form: buildForm({showSummaryProgress: true}),
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText(/Stap 1 van 1/)).toBeVisible();
  },
};

export const SummaryProgressNotVisible: Story = {
  parameters: {
    formContext: {
      form: buildForm({showSummaryProgress: false}),
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByText(/Stap 1 van 1/)).toBeNull();
  },
};

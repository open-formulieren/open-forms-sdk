import type {Meta, StoryObj} from '@storybook/react-vite';
import {reactRouterParameters, withRouter} from 'storybook-addon-remix-react-router';
import {expect, fn, userEvent, waitFor, within} from 'storybook/test';

import {BASE_URL, buildForm, buildSubmission, buildSubmissionStep} from '@/api-mocks';
import {mockAddressAutoComplete} from '@/api-mocks/geo';
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
import {withForm} from '@/sb-decorators';
import {sleep} from '@/utils';

import {LOCATION_AUTOCOMPLETE_DEBOUNCE} from './AddressAutoFillObservers';
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

export const DisableStepSubmissionWithServerLogic: Story = {
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
              canSubmit: false, // Disable the step submission
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

    // allow 2s for the "next" button to be finished loading
    const nextButton = await canvas.findByRole('button', {name: 'Next'}, {timeout: 2 * 1000});
    await waitFor(() => {
      // Expect the "next" button to be disabled.
      expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    });
  },
};

const FRONTEND_LOGIC_STEP_DETAIL_BODY = buildSubmissionStep({
  formStepUuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5',
  components: [
    {
      id: 'checkbox',
      type: 'checkbox',
      key: 'checkbox',
      label: 'Checkbox',
      defaultValue: true,
    },
  ],
  requireBackendLogicEvaluation: false,
  logicRules: [
    {
      jsonLogicTrigger: {'==': [{var: 'checkbox'}, true]},
      actions: [
        {formStepUuid: '9e6eb3c5-e5a4-4abf-b64a-73d3243f2bf5', action: {type: 'disable-next'}},
      ],
    },
  ],
  canSubmit: true,
  data: {},
});

export const DisableStepSubmissionWithFrontendLogic: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(FRONTEND_LOGIC_STEP_DETAIL_BODY),
          mockSubmissionStepPut(FRONTEND_LOGIC_STEP_DETAIL_BODY, 201),
        ],
        logicCheck: [
          // @ts-expect-error Return nonsense data on purpose, to make sure a crash will occur if
          // a backend logic check was scheduled anyway.
          mockSubmissionCheckLogicPost('nonsense', 'data'),
        ],
      },
    },
    formContext: {
      form: buildForm({
        newLogicEvaluationEnabled: true,
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
        ],
      }),
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Initial state of the checkbox must be checked.
    const checkbox = await canvas.findByLabelText('Checkbox');
    expect(checkbox).toBeChecked();

    // This ensures (frontend) logic was invoked upon loading the step, because a step can be
    // submitted by default, but the is checked by default causing the rule to be triggered.
    const nextButton = await canvas.findByRole('button', {name: 'Next'});
    await waitFor(() => {
      expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    });

    // Unchecking the checkbox should allow step submission again.
    await userEvent.click(checkbox);
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  },
};

export const NextButtonDisabledInitially: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(
            buildSubmissionStep({
              canSubmit: false,
              components: [
                {
                  id: 'text',
                  type: 'textfield',
                  key: 'text',
                  label: 'Simple text field',
                  description: 'A help text for the text field',
                },
              ],
            })
          ),
        ],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const nextButton = await canvas.findByRole('button', {name: 'Next'});
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
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
        logicCheck: [
          mockSubmissionCheckLogicPost(
            DEFAULT_SUBMISSION,
            SUBMISSION_STEP_WITH_DATA_DETAIL_BODY,
            200
          ),
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
        logicCheck: [
          mockSubmissionCheckLogicPost(DEFAULT_SUBMISSION, VALIDATION_ERRORS_STEP_DETAIL_BODY, 200),
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

const LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY = buildSubmissionStep({
  components: [
    {
      id: 'postcode',
      type: 'postcode',
      key: 'postcode',
      label: 'Postcode',
      validate: {pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$'},
    },
    {
      id: 'houseNumber',
      type: 'number',
      key: 'houseNumber',
      label: 'House number',
    },
    {
      id: 'street',
      type: 'textfield',
      key: 'street',
      label: 'Street',
      deriveStreetName: true,
      derivePostcode: 'postcode',
      deriveHouseNumber: 'houseNumber',
    },
    {
      id: 'city',
      type: 'textfield',
      key: 'city',
      label: 'City',
      deriveCity: true,
      derivePostcode: 'postcode',
      deriveHouseNumber: 'houseNumber',
    },
    {
      id: 'editgrid',
      type: 'editgrid',
      key: 'editgrid',
      label: 'Repeating group',
      groupLabel: 'Address',
      disableAddingRemovingRows: false,
      components: [
        {
          id: 'postcode2',
          type: 'postcode',
          key: 'postcode2',
          label: 'Nested postcode',
          validate: {pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$'},
        },
        {
          id: 'houseNumber2',
          type: 'number',
          key: 'houseNumber2',
          label: 'Nested house number',
        },
        {
          id: 'street2',
          type: 'textfield',
          key: 'street2',
          label: 'Nested street',
          deriveStreetName: true,
          derivePostcode: 'editgrid.postcode',
          deriveHouseNumber: 'editgrid.houseNumber',
        },
        {
          id: 'city2',
          type: 'textfield',
          key: 'city2',
          label: 'Nested city',
          deriveCity: true,
          derivePostcode: 'editgrid.postcode',
          deriveHouseNumber: 'editgrid.houseNumber',
        },
      ],
    },
  ],
});

export const LocationDerivation: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY),
          mockSubmissionStepPut(LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY, 201),
        ],
        logicCheck: [
          mockSubmissionCheckLogicPost(
            DEFAULT_SUBMISSION,
            LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY,
            400
          ),
        ],
        addressAutoComplete: [
          mockAddressAutoComplete({streetName: 'Kingsfordweg', city: 'Amsterdam'}),
        ],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const postcode = await canvas.findByLabelText('Postcode');
    await userEvent.type(postcode, '1234 AB');
    const houseNumber = canvas.getByLabelText('House number');
    await userEvent.type(houseNumber, '99');

    await waitFor(() => {
      expect(canvas.getByLabelText('Street')).toHaveDisplayValue('Kingsfordweg');
      expect(canvas.getByLabelText('City')).toHaveDisplayValue('Amsterdam');
    });
  },
};

export const LocationDerivationDoesNotOverwriteValues: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY),
          mockSubmissionStepPut(LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY, 201),
        ],
        logicCheck: [
          mockSubmissionCheckLogicPost(
            DEFAULT_SUBMISSION,
            LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY,
            400
          ),
        ],
        addressAutoComplete: [
          mockAddressAutoComplete({streetName: 'Kingsfordweg', city: 'Amsterdam'}),
        ],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // fill out some dummy values in the street name & city fields that should not be
    // cleared
    const street = await canvas.findByLabelText('Street');
    await userEvent.type(street, 'Stationsstraat');
    const city = await canvas.findByLabelText('City');
    await userEvent.type(city, 'Vlerckendam');

    // now fill out postcode & house nummer as well - we expect the values not to change
    const postcode = await canvas.findByLabelText('Postcode');
    await userEvent.type(postcode, '1234 AB');
    const houseNumber = canvas.getByLabelText('House number');
    await userEvent.type(houseNumber, '99');

    // wait for the debounce to complete
    await sleep(LOCATION_AUTOCOMPLETE_DEBOUNCE + 20);

    await waitFor(() => {
      expect(canvas.getByLabelText('Street')).toHaveDisplayValue('Stationsstraat');
      expect(canvas.getByLabelText('City')).toHaveDisplayValue('Vlerckendam');
    });
  },
};

export const LocationDerivationInRepeatingGroup: Story = {
  parameters: {
    msw: {
      handlers: {
        submissionStep: [
          mockSubmissionStepGet(LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY),
          mockSubmissionStepPut(LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY, 201),
        ],
        logicCheck: [
          mockSubmissionCheckLogicPost(
            DEFAULT_SUBMISSION,
            LOCATION_DERIVATION_SUBMISSION_STEP_DETAIL_BODY,
            400
          ),
        ],
        addressAutoComplete: [
          mockAddressAutoComplete({streetName: 'Kingsfordweg', city: 'Amsterdam'}),
        ],
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', {name: 'Nog één toevoegen'}));

    const postcode = await canvas.findByLabelText('Nested postcode');
    await userEvent.type(postcode, '1234 AB');
    const houseNumber = canvas.getByLabelText('Nested house number');
    await userEvent.type(houseNumber, '99');
    await userEvent.tab();

    await userEvent.click(await canvas.findByRole('button', {name: 'Opslaan'}));
  },
};

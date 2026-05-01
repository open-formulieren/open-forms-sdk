import type {AnyComponentSchema} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {expect, userEvent, within} from 'storybook/test';

import {FormContext} from '@/Context';
import {BASE_URL, buildForm, mockAnalyticsToolConfigGet} from '@/api-mocks';
import {
  buildSubmission,
  mockSubmissionCheckLogicPost,
  mockSubmissionPost,
  mockSubmissionStepGet,
} from '@/api-mocks/submissions';
import type {SubmissionStep} from '@/data/submission-steps';
import routes, {FUTURE_FLAGS} from '@/routes';
import {withNuqs} from '@/sb-decorators';

const FORM = buildForm({
  explanationTemplate: `<p>This form demonstrates the client-side evaluation of backend logic rules.</p>
    <p>No calls to the check-logic endpoint are expected - hence the msw mock not being
    configured for it.</p>`,
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
      isApplicable: true,
    },
    {
      uuid: '98980oi8-e5a4-4abf-b64a-76j3j3ki897',
      slug: 'step-2',
      formDefinition: 'Step 2 (applicable by default)',
      index: 1,
      literals: {
        previousText: {resolved: 'Previous', value: ''},
        saveText: {resolved: 'Save', value: ''},
        nextText: {resolved: 'Next', value: ''},
      },
      url: `${BASE_URL}forms/mock/steps/98980oi8-e5a4-4abf-b64a-76j3j3ki897`,
      isApplicable: true,
    },
    {
      uuid: 'c9e288ad-7cb1-4f88-a6d0-026c3739d13b',
      slug: 'step-3',
      formDefinition: 'Step 3 (not applicable by default)',
      index: 2,
      literals: {
        previousText: {resolved: 'Previous', value: ''},
        saveText: {resolved: 'Save', value: ''},
        nextText: {resolved: 'Next', value: ''},
      },
      url: `${BASE_URL}forms/mock/steps/c9e288ad-7cb1-4f88-a6d0-026c3739d13b`,
      isApplicable: false,
    },
  ],
  showProgressIndicator: true,
});

const SUBMISSION = buildSubmission({
  id: 'aef48fc8-36b4-4c6f-a962-ef227d5b025c',
  steps: [
    {
      id: FORM.steps[0].uuid,
      name: FORM.steps[0].formDefinition,
      url: `${BASE_URL}submissions/aef48fc8-36b4-4c6f-a962-ef227d5b025c/steps/${FORM.steps[0].uuid}`,
      formStep: FORM.steps[0].url,
      defaultIsApplicable: !!FORM.steps[0].isApplicable,
      isApplicable: !!FORM.steps[0].isApplicable,
      completed: false,
      canSubmit: true,
    },
    {
      id: FORM.steps[1].uuid,
      name: FORM.steps[1].formDefinition,
      url: `${BASE_URL}submissions/aef48fc8-36b4-4c6f-a962-ef227d5b025c/steps/${FORM.steps[1].uuid}`,
      formStep: FORM.steps[1].url,
      defaultIsApplicable: !!FORM.steps[1].isApplicable,
      isApplicable: !!FORM.steps[1].isApplicable,
      completed: false,
      canSubmit: true,
    },
    {
      id: FORM.steps[2].uuid,
      name: FORM.steps[2].formDefinition,
      url: `${BASE_URL}submissions/aef48fc8-36b4-4c6f-a962-ef227d5b025c/steps/${FORM.steps[2].uuid}`,
      formStep: FORM.steps[2].url,
      defaultIsApplicable: !!FORM.steps[2].isApplicable,
      isApplicable: !!FORM.steps[2].isApplicable,
      completed: false,
      canSubmit: true,
    },
  ],
  isAuthenticated: false,
});

const STEP_1_COMPONENTS: AnyComponentSchema[] = [
  {
    id: 'fieldsetProperties',
    key: 'fieldsetProperties',
    type: 'fieldset',
    label: 'Modify properties',
    hideHeader: false,
    components: [
      {
        id: 'checkbox',
        type: 'checkbox',
        key: 'checkbox',
        label: 'Checkbox for trigger',
      },
      {
        id: 'textfield1',
        type: 'textfield',
        key: 'textfield1',
        label: 'Textfield 1',
        validate: {required: false},
        defaultValue: '',
        description: 'Editable → readonly',
      },
      {
        id: 'textfield2',
        type: 'textfield',
        key: 'textfield2',
        label: 'Textfield 2',
        validate: {required: false},
        clearOnHide: true,
        defaultValue: 'non-empty default',
        description: 'Visible → hidden',
      },
      {
        id: 'textfield3',
        type: 'textfield',
        key: 'container.textfield3',
        label: 'Textfield 3',
        validate: {required: false},
        defaultValue: '',
        description: 'Optional → required',
      },
      {
        id: 'editgrid1',
        type: 'editgrid',
        key: 'outerEditgrid',
        label: 'Outer editgrid',
        disableAddingRemovingRows: false,
        groupLabel: 'Outer',
        description: 'Hidden → Visible',
        hidden: true,
        components: [
          {
            id: 'editgrid2',
            type: 'editgrid',
            key: 'innerEditgrid',
            label: 'Inner editgrid',
            disableAddingRemovingRows: false,
            groupLabel: 'Inner',
            components: [
              {
                id: 'textfield4',
                type: 'textfield',
                key: 'textfield4',
                label: 'Textfield 4',
                validate: {required: false},
                defaultValue: '',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'fieldsetValue',
    key: 'fieldsetValue',
    type: 'fieldset',
    label: 'Modify values',
    hideHeader: false,
    components: [
      {
        id: 'textfieldValue.input',
        type: 'textfield',
        key: 'textfieldValue.input',
        label: 'Input for "cat" value action',
      },
      {
        id: 'textfieldValueOutput',
        type: 'textfield',
        key: 'textfieldValue.output',
        label: '"Cat" value action output',
      },
    ],
  },
  {
    id: 'fieldsetDisableNext',
    key: 'fieldsetDisableNext',
    type: 'fieldset',
    label: 'Disable next',
    hideHeader: false,
    components: [
      {
        id: 'disableNext',
        type: 'checkbox',
        key: 'disableNext',
        label: 'Disable next',
      },
    ],
  },
  {
    id: 'fieldsetManageStepApplicable',
    key: 'fieldsetManageStepApplicable',
    type: 'fieldset',
    label: 'Step (not) applicable',
    hideHeader: false,
    components: [
      {
        id: 'toggleStepApplicable',
        type: 'checkbox',
        key: 'toggleStepApplicable',
        label: 'Toggle step applicable',
      },
    ],
  },
  {
    id: 'fieldsetValidationErrors',
    key: 'fieldsetValidationErrors',
    type: 'fieldset',
    label: 'Validation errors of hidden fields',
    hideHeader: false,
    components: [
      {
        id: 'fieldsetBeingHidden',
        key: 'fieldsetBeingHidden',
        type: 'fieldset',
        label: 'Parent to show/hide',
        hideHeader: false,
        hidden: false,
        components: [
          {
            id: 'textfield5',
            type: 'textfield',
            key: 'textfield5',
            label: 'Textfield 5',
            validate: {required: false, maxLength: 3},
            defaultValue: '',
            clearOnHide: true,
          },
        ],
      },
      {
        id: 'toggleFieldset',
        type: 'checkbox',
        key: 'toggleFieldsetHidden',
        label: 'Toggle fieldset visibility',
      },
    ],
  },
];

const STEP_DETAILS_MAP: Record<string, SubmissionStep> = {
  // Step 1
  [FORM.steps[0].uuid]: {
    id: SUBMISSION.steps[0].id,
    slug: FORM.steps[0].slug!,
    formStepUuid: FORM.steps[0].uuid,
    configuration: {components: STEP_1_COMPONENTS},
    defaultConfiguration: {components: STEP_1_COMPONENTS},
    requireBackendLogicEvaluation: false,
    logicRules: [
      // component property actions
      {
        jsonLogicTrigger: {var: 'checkbox'},
        actions: [
          {
            action: {
              type: 'property',
              property: {
                value: 'disabled',
                type: 'bool',
              },
              state: true,
            },
            component: 'textfield1',
          },
          {
            action: {
              type: 'property',
              property: {
                value: 'hidden',
                type: 'bool',
              },
              state: true,
            },
            component: 'textfield2',
          },
          {
            action: {
              type: 'property',
              property: {
                value: 'validate.required',
                type: 'bool',
              },
              state: true,
            },
            component: 'container.textfield3',
          },
          {
            action: {
              type: 'property',
              property: {
                value: 'hidden',
                type: 'bool',
              },
              state: false,
            },
            component: 'outerEditgrid',
          },
          {
            action: {
              type: 'property',
              property: {
                value: 'hidden',
                type: 'bool',
              },
              state: true,
            },
            component: 'bad-component-reference',
          },
        ],
      },
      // variable/component actions
      {
        jsonLogicTrigger: {'!!': [{var: 'textfieldValue.input'}]},
        actions: [
          {
            action: {
              type: 'variable',
              // test that JsonLogic is evaluated
              value: {
                cat: [{var: 'textfieldValue.input'}, '-', {var: 'textfieldValue.input'}],
              },
            },
            variable: 'textfieldValue.output',
          },
          {
            action: {
              type: 'variable',
              value: 'I may not cause crashes',
            },
            variable: 'bad-component-reference',
          },
        ],
      },
      // disable next
      {
        jsonLogicTrigger: {var: 'disableNext'},
        actions: [
          {
            action: {type: 'disable-next'},
            formStepUuid: FORM.steps[0].uuid,
          },
          // may not crash if the target is not the current step
          {
            action: {type: 'disable-next'},
            formStepUuid: FORM.steps[1].uuid,
          },
        ],
      },
      // toggle step applicable
      {
        jsonLogicTrigger: {var: 'toggleStepApplicable'},
        actions: [
          {
            action: {type: 'step-not-applicable'},
            formStepUuid: FORM.steps[1].uuid,
          },
          {
            action: {type: 'step-applicable'},
            formStepUuid: FORM.steps[2].uuid,
          },
        ],
      },
      // validation error clearing of component that gets hidden
      {
        jsonLogicTrigger: {var: 'toggleFieldsetHidden'},
        actions: [
          {
            action: {
              type: 'property',
              property: {
                value: 'hidden',
                type: 'bool',
              },
              state: true,
            },
            component: 'fieldsetBeingHidden',
          },
        ],
      },
    ],
    data: null,
    canSubmit: true,
  } satisfies SubmissionStep,
  // Step 2 & 3 are deliberately not defined - they only exist for the
  // applicable/not-applicable begin states.
};

const AppWrapper: React.FC = () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  return (
    <FormContext.Provider value={FORM}>
      <RouterProvider router={router} />
    </FormContext.Provider>
  );
};

export default {
  title: 'Private API / Frontend logic',
  component: AppWrapper,
  decorators: [withNuqs],
  parameters: {
    msw: {
      handlers: {
        analytics: [mockAnalyticsToolConfigGet()],
        submission: [mockSubmissionPost(SUBMISSION)],
        submissionStep: [mockSubmissionStepGet(undefined, STEP_DETAILS_MAP)],
        // requires the endpoint to be wired up for the initial fetch on submission step
        // navigation, so we cannot leave the mock empty, unfortunately
        logicCheck: [
          mockSubmissionCheckLogicPost(SUBMISSION, STEP_DETAILS_MAP[FORM.steps[0].uuid]),
        ],
      },
    },
  },
} satisfies Meta<typeof AppWrapper>;

type Story = StoryObj<typeof AppWrapper>;

export const FrontendLogicRuleEvaluation: Story = {
  parameters: {
    chromatic: {
      modes: {
        mobile: {disable: true},
      },
    },
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Start form submission', async () => {
      const startButton = await canvas.findByRole('button', {name: 'Begin'});
      await userEvent.click(startButton);
      expect(await canvas.findByRole('heading', {name: 'Step 1'}, {timeout: 10000})).toBeVisible();
      // wait for the initially scheduled logic check to complete and the submit button
      // to become available
      expect(await canvas.findByRole('button', {name: 'Next'})).toBeVisible();
    });

    await step('Modify component properties', async () => {
      const textfield1 = await canvas.findByLabelText('Textfield 1');
      const textfield2 = await canvas.findByLabelText('Textfield 2');
      const textfield3 = await canvas.findByLabelText('Textfield 3');
      expect(textfield1).toBeVisible();
      expect(textfield1).not.toHaveAttribute('readonly');
      expect(textfield2).toBeVisible();
      expect(textfield2).not.toHaveAttribute('readonly');
      expect(textfield3).toBeVisible();
      expect(textfield3).not.toHaveAttribute('readonly');

      await userEvent.click(canvas.getByRole('checkbox', {name: 'Checkbox for trigger'}));
      // textfield 1 is made readonly
      expect(textfield1).toHaveAttribute('readonly');
      // there should not be a spinner due to pending check-logic backend calls
      expect(canvas.queryByRole('status')).not.toBeInTheDocument();
      // textfield 2 is made hidden
      expect(textfield2).not.toBeInTheDocument();
      expect(canvas.queryByLabelText('Textfield 2')).not.toBeInTheDocument();
      // submitting the step should not be possible due to the third textfield being
      // made required
      const submitButton = await canvas.findByRole('button', {name: 'Next'});
      expect(textfield3).toBeVisible();
      textfield3.focus();
      await userEvent.click(submitButton);
      expect(await canvas.findByText(/Het verplichte veld.+is niet ingevuld/)).toBeVisible();
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');
    });

    await step('Revert "Modify component properties"', async () => {
      await userEvent.click(canvas.getByRole('checkbox', {name: 'Checkbox for trigger'}));

      const textfield1 = await canvas.findByLabelText('Textfield 1');
      // textfield 1 is made editable again
      expect(textfield1).not.toHaveAttribute('readonly');

      const textfield2 = await canvas.findByLabelText('Textfield 2');
      // textfield 2 is made visible again
      expect(textfield2).toBeInTheDocument();
      expect(textfield2).toHaveDisplayValue('non-empty default');

      const textfield3 = await canvas.findByLabelText('Textfield 3');
      expect(textfield3).toBeVisible();
      // the validation error must be removed again
      expect(canvas.queryByText(/Het verplichte veld.+is niet ingevuld/)).not.toBeInTheDocument();
      const submitButton = canvas.getByRole('button', {name: 'Next'});
      expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
    });

    await step('Set/calculate component value', async () => {
      const inputField = await canvas.findByLabelText('Input for "cat" value action');
      await userEvent.type(inputField, 'repeatMe');
      const outputField = await canvas.findByLabelText('"Cat" value action output');
      expect(outputField).toHaveDisplayValue('repeatMe-repeatMe');
    });

    await step('Disable progressing to the next step', async () => {
      await userEvent.click(await canvas.findByRole('checkbox', {name: 'Disable next'}));

      const submitButton = await canvas.findByRole('button', {name: 'Next'});
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');
    });

    await step('Revert "Disable progressing to the next step"', async () => {
      await userEvent.click(await canvas.findByRole('checkbox', {name: 'Disable next'}));

      const submitButton = await canvas.findByRole('button', {name: 'Next'});
      expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
    });

    await step('Toggle step applicable', async () => {
      await userEvent.click(await canvas.findByRole('checkbox', {name: 'Toggle step applicable'}));

      const step2Title = await canvas.findByRole('link', {
        name: 'Step 2 (applicable by default)',
      });
      expect(step2Title).toBeVisible();
      expect(step2Title).toHaveTextContent('Step 2 (applicable by default) (n.v.t.)');
      const step3Title = await canvas.findByRole('link', {
        name: 'Step 3 (not applicable by default)',
      });
      expect(step3Title).toBeVisible();
      expect(step3Title).toHaveTextContent('Step 3 (not applicable by default)');
    });

    await step('Revert "Toggle step applicable"', async () => {
      await userEvent.click(canvas.getByRole('checkbox', {name: 'Toggle step applicable'}));

      const step2Title = await canvas.findByRole('link', {
        name: 'Step 2 (applicable by default)',
      });
      expect(step2Title).toBeVisible();
      expect(step2Title).toHaveTextContent('Step 2 (applicable by default)');
      const step3Title = await canvas.findByRole('link', {
        name: 'Step 3 (not applicable by default)',
      });
      expect(step3Title).toBeVisible();
      expect(step3Title).toHaveTextContent('Step 3 (not applicable by default) (n.v.t.)');
    });

    await step('Hidden fields get their validation errors removed', async () => {
      // add invalid input to the text field
      const textfield5 = await canvas.findByLabelText('Textfield 5');
      await userEvent.type(textfield5, 'too long');
      textfield5.blur();
      expect(await canvas.findByText('Er zijn te veel karakters opgegeven.')).toBeVisible();
      const submitButton = await canvas.findByRole('button', {name: 'Next'});
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');

      // hide it via logic
      await userEvent.click(canvas.getByRole('checkbox', {name: 'Toggle fieldset visibility'}));
      expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
    });
  },
};

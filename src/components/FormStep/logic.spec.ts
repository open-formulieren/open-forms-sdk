import type {
  AnyComponentSchema,
  JSONObject,
  TextFieldComponentSchema,
} from '@open-formulieren/types';
import {describe, expect, test} from 'vitest';

import {buildSubmission, buildSubmissionStep} from '@/api-mocks';
import type {LogicRule} from '@/data/logic';
import type {SubmissionStep} from '@/data/submission-steps';

import {evaluateBackendRules} from './logic';

// if a second rule depens on the mutated value of a field, this must be reflected
// immediately
test('rule evaluation immediately applies value changes', () => {
  const rules: LogicRule[] = [
    {
      jsonLogicTrigger: {'==': [{var: 'textfield'}, 'foo']},
      actions: [
        {
          action: {
            type: 'property',
            property: {value: 'validate.required', type: 'bool'},
            state: true,
          },
          component: 'number',
        },
        {
          action: {
            type: 'variable',
            value: 67,
          },
          variable: 'number',
        },
      ],
    },
    {
      jsonLogicTrigger: {'==': [{var: 'number'}, 67]},
      actions: [
        {
          action: {
            type: 'variable',
            value: 'b',
          },
          variable: 'radio',
        },
      ],
    },
  ];
  const submission = buildSubmission();
  const components: AnyComponentSchema[] = [
    {
      type: 'textfield',
      id: 'textfield',
      key: 'textfield',
      label: 'Textfield',
    },
    {
      type: 'number',
      id: 'number',
      key: 'number',
      label: 'Number',
      validate: {required: false},
    },
    {
      id: 'radio',
      type: 'radio',
      key: 'radio',
      label: 'Radio',
      values: [
        {value: 'a', label: 'A'},
        {value: 'b', label: 'B'},
      ],
      defaultValue: null,
      openForms: {dataSrc: 'manual'},
    },
  ];
  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };
  let updatedComponents: AnyComponentSchema[] = [];
  let dataUpdates: JSONObject | null = {};

  evaluateBackendRules({
    submission,
    step,
    rules,
    inputData: {textfield: 'foo', number: null, radio: null},
    components: step.defaultConfiguration!.components ?? [],
    onLogicCheckResult: (_, step) => {
      updatedComponents = step.configuration.components;
      dataUpdates = step.data;
    },
  });

  expect(dataUpdates).toEqual({
    number: 67,
    radio: 'b',
  });
  expect(updatedComponents).toEqual([
    {
      type: 'textfield',
      id: 'textfield',
      key: 'textfield',
      label: 'Textfield',
    },
    {
      type: 'number',
      id: 'number',
      key: 'number',
      label: 'Number',
      validate: {required: true},
    },
    {
      id: 'radio',
      type: 'radio',
      key: 'radio',
      label: 'Radio',
      values: [
        {value: 'a', label: 'A'},
        {value: 'b', label: 'B'},
      ],
      defaultValue: null,
      openForms: {dataSrc: 'manual'},
    },
  ]);
});

test('clearOnHide behaviour is applied', () => {
  const rules: LogicRule[] = [
    // mark textfield as hidden when checkbox is checked, which will eventually clear
    // its value because the renderer detects it's hidden and clears it.
    {
      jsonLogicTrigger: {var: 'trigger'},
      actions: [
        {
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: true,
          },
          component: 'textfield',
        },
      ],
    },
    // show number input when textfield is not in the context.
    {
      jsonLogicTrigger: {'==': [{var: ['textfield', 'not-in-context']}, 'not-in-context']},
      actions: [
        {
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: false,
          },
          component: 'number',
        },
      ],
    },
  ];
  const submission = buildSubmission();
  const components: AnyComponentSchema[] = [
    {
      type: 'checkbox',
      id: 'trigger',
      key: 'trigger',
      label: 'Trigger',
    },
    {
      type: 'textfield',
      id: 'textfield',
      key: 'textfield',
      label: 'Textfield',
      hidden: false,
      clearOnHide: true,
    },
    {
      type: 'number',
      id: 'number',
      key: 'number',
      label: 'Number',
      hidden: true,
      defaultValue: 67,
    },
  ];
  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };
  let updatedComponents: AnyComponentSchema[] = [];
  let dataUpdates: JSONObject | null = {};

  evaluateBackendRules({
    submission,
    step,
    rules,
    inputData: {trigger: true, textfield: 'clear-me'},
    components: step.defaultConfiguration!.components ?? [],
    onLogicCheckResult: (_, step) => {
      updatedComponents = step.configuration.components;
      dataUpdates = step.data;
    },
  });

  expect(updatedComponents).toEqual([
    {
      type: 'checkbox',
      id: 'trigger',
      key: 'trigger',
      label: 'Trigger',
    },
    {
      type: 'textfield',
      id: 'textfield',
      key: 'textfield',
      label: 'Textfield',
      hidden: true,
      clearOnHide: true,
    },
    {
      type: 'number',
      id: 'number',
      key: 'number',
      label: 'Number',
      hidden: false,
      defaultValue: 67,
    },
  ]);
  expect(dataUpdates).toEqual({});
});

test('clearOnHide behaviour with hidden parent (already hidden before rule evaluation)', () => {
  const components: AnyComponentSchema[] = [
    {
      type: 'checkbox',
      id: 'trigger',
      key: 'trigger',
      label: 'Trigger',
    },
    {
      type: 'fieldset',
      id: 'fieldsetBecomesHidden',
      key: 'fieldsetBecomesHidden',
      label: 'Hidden fieldset',
      hidden: false,
      hideHeader: false,
      components: [
        {
          type: 'textfield',
          id: 'textfield',
          key: 'textfield',
          label: 'Textfield',
        },
      ],
    },
  ];
  const submission = buildSubmission();
  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };
  const rules: LogicRule[] = [
    // Rule triggers despite the component already being hidden through the hidden
    // parent fieldset.
    {
      jsonLogicTrigger: {var: 'trigger'},
      actions: [
        {
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: true,
          },
          component: 'fieldsetBecomesHidden',
        },
      ],
    },
  ];
  let updatedComponents: AnyComponentSchema[] = [];
  let dataUpdates: JSONObject | null = {};

  evaluateBackendRules({
    submission,
    step,
    rules,
    // because the parent is hidden, the renderer has removed the `textfield` from the
    // input data due to its clearOnHide, leaving only the checkbox as input data
    inputData: {trigger: true},
    components: step.defaultConfiguration!.components ?? [],
    onLogicCheckResult: (_, step) => {
      updatedComponents = step.configuration.components;
      dataUpdates = step.data;
    },
  });

  expect(updatedComponents).toEqual([
    {
      type: 'checkbox',
      id: 'trigger',
      key: 'trigger',
      label: 'Trigger',
    },
    {
      type: 'fieldset',
      id: 'fieldsetBecomesHidden',
      key: 'fieldsetBecomesHidden',
      label: 'Hidden fieldset',
      hidden: true,
      hideHeader: false,
      components: [
        {
          type: 'textfield',
          id: 'textfield',
          key: 'textfield',
          label: 'Textfield',
        },
      ],
    },
  ]);
  expect(dataUpdates).toEqual({});
});

test('clearOnHide behaviour when hiding a parent (not hidden before rule evaluation)', () => {
  const components: AnyComponentSchema[] = [
    {
      type: 'checkbox',
      id: 'trigger',
      key: 'trigger',
      label: 'Trigger',
    },
    {
      type: 'fieldset',
      id: 'fieldsetBeingHidden',
      key: 'fieldsetBeingHidden',
      label: 'Hidden fieldset',
      hidden: false,
      hideHeader: false,
      components: [
        {
          type: 'textfield',
          id: 'textfield',
          key: 'textfield',
          label: 'Textfield',
          hidden: false,
          clearOnHide: true,
          defaultValue: 'default',
        },
      ],
    },
    // used as observer of the second logic rule effect.
    {
      type: 'checkbox',
      id: 'observer',
      key: 'observer',
      label: 'Observer',
      defaultValue: false,
    },
  ];
  const submission = buildSubmission();
  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };

  // Assumes the initial state where:
  // * checkbox is unchecked
  // * user enters value in textfield
  // * user checks checkbox
  const inputData: JSONObject = {
    trigger: true,
    textfield: 'user input',
    observer: false,
  };

  const rules: LogicRule[] = [
    // Rule triggers despite the component already being hidden through the hidden
    // parent fieldset.
    {
      jsonLogicTrigger: {var: 'trigger'},
      actions: [
        {
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: true,
          },
          component: 'fieldsetBeingHidden',
        },
      ],
    },
    {
      jsonLogicTrigger: {'==': [{var: ['textfield', 'not-in-context']}, 'not-in-context']},
      actions: [
        {
          action: {type: 'variable', value: true},
          variable: 'observer',
        },
      ],
    },
  ];

  let updatedComponents: AnyComponentSchema[] = [];
  let dataUpdates: JSONObject | null = {};

  evaluateBackendRules({
    submission,
    step,
    rules,
    inputData,
    components: step.defaultConfiguration!.components ?? [],
    onLogicCheckResult: (_, step) => {
      updatedComponents = step.configuration.components;
      dataUpdates = step.data;
    },
  });

  expect(updatedComponents).toEqual([
    {
      type: 'checkbox',
      id: 'trigger',
      key: 'trigger',
      label: 'Trigger',
    },
    {
      type: 'fieldset',
      id: 'fieldsetBeingHidden',
      key: 'fieldsetBeingHidden',
      label: 'Hidden fieldset',
      hidden: true,
      hideHeader: false,
      components: [
        {
          type: 'textfield',
          id: 'textfield',
          key: 'textfield',
          label: 'Textfield',
          hidden: false,
          clearOnHide: true,
          defaultValue: 'default',
        },
      ],
    },
    {
      type: 'checkbox',
      id: 'observer',
      key: 'observer',
      label: 'Observer',
      defaultValue: false,
    },
  ]);
  expect(dataUpdates).toEqual({observer: true});
});

test('clearOnHide excludes data updates for child components', () => {
  const components: AnyComponentSchema[] = [
    {
      type: 'checkbox',
      id: 'trigger',
      key: 'trigger',
      label: 'Trigger',
    },
    {
      type: 'fieldset',
      id: 'fieldsetBeingHidden',
      key: 'fieldsetBeingHidden',
      label: 'Hidden fieldset',
      hidden: false,
      hideHeader: false,
      components: [
        {
          type: 'textfield',
          id: 'textfield',
          key: 'textfield',
          label: 'Textfield',
        },
        {
          type: 'fieldset',
          id: 'nestedFieldset',
          key: 'nestedFieldset',
          label: 'Nested fieldset',
          hidden: false,
          hideHeader: false,
          components: [
            {
              type: 'textfield',
              id: 'nestedTextfield',
              key: 'nestedTextfield',
              label: 'Nested textfield',
            },
          ],
        },
      ],
    },
  ];
  const submission = buildSubmission();
  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };
  const inputData: JSONObject = {trigger: true};
  const rules: LogicRule[] = [
    {
      jsonLogicTrigger: {var: 'trigger'},
      actions: [
        {
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: true,
          },
          component: 'fieldsetBeingHidden',
        },
      ],
    },
  ];
  let dataUpdates: JSONObject | null = {};

  evaluateBackendRules({
    submission,
    step,
    rules,
    inputData,
    components: step.defaultConfiguration!.components ?? [],
    onLogicCheckResult: (_, step) => {
      dataUpdates = step.data;
    },
  });

  // we expect no updates because they match the initial values.
  expect(dataUpdates).toEqual({});
});

test('layout component with child and two visibility actions doing the opposite', () => {
  const components: AnyComponentSchema[] = [
    {
      type: 'checkbox',
      id: 'showFieldset',
      key: 'showFieldset',
      label: 'Show fieldset',
    },
    {
      type: 'fieldset',
      id: 'fieldset',
      key: 'fieldset',
      label: 'fieldset',
      hidden: true,
      hideHeader: false,
      components: [
        {
          type: 'radio',
          id: 'showTextfield',
          key: 'showTextfield',
          label: 'Show textfield',
          values: [
            {label: 'Yes', value: 'yes'},
            {label: 'No', value: 'no'},
            {label: 'Maybe', value: 'maybe'},
          ],
          openForms: {dataSrc: 'manual'},
        },
        {
          type: 'textfield',
          id: 'textfield',
          key: 'textfield',
          label: 'Textfield',
          hidden: true,
          clearOnHide: true,
        },
      ],
    },
    {
      type: 'textfield',
      id: 'observer',
      key: 'observer',
      label: 'Observer',
      validate: {required: false},
    },
  ];

  const rules: LogicRule[] = [
    {
      jsonLogicTrigger: {'==': [{var: 'showFieldset'}, true]},
      actions: [
        {
          component: 'fieldset',
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: false,
          },
        },
      ],
    },
    // Expected to trigger, because showTextfield should not have a value
    {
      jsonLogicTrigger: {'==': [{var: ['showTextfield', 'no']}, 'no']},
      actions: [
        {
          component: 'textfield',
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: false,
          },
        },
      ],
    },
    // Expected to trigger, because textfield should not have a value
    {
      jsonLogicTrigger: {'==': [{var: ['textfield', 'not-in-context']}, 'not-in-context']},
      actions: [
        {
          component: 'observer',
          action: {
            type: 'property',
            property: {value: 'validate.required', type: 'bool'},
            state: true,
          },
        },
      ],
    },
  ];
  const submission = buildSubmission();

  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };
  let dataUpdates: JSONObject | null = {};
  let updatedComponents: AnyComponentSchema[] = [];

  evaluateBackendRules({
    submission,
    step,
    rules,
    inputData: {showFieldset: false},
    components: step.defaultConfiguration!.components,
    onLogicCheckResult: (_, step) => {
      dataUpdates = step.data;
      updatedComponents = step.configuration.components;
    },
  });

  expect(dataUpdates).toEqual({});
  expect((updatedComponents[2] as TextFieldComponentSchema).validate!.required).toEqual(true);
});

test('layout component with child and two visibility actions doing the opposite (untriggered case)', () => {
  const components: AnyComponentSchema[] = [
    {
      type: 'checkbox',
      id: 'showFieldset',
      key: 'showFieldset',
      label: 'Show fieldset',
    },
    {
      type: 'fieldset',
      id: 'fieldset',
      key: 'fieldset',
      label: 'fieldset',
      hidden: true,
      hideHeader: false,
      components: [
        {
          type: 'checkbox',
          id: 'hideTextfield',
          key: 'hideTextfield',
          label: 'Hide textfield',
        },
        {
          type: 'textfield',
          id: 'textfield',
          key: 'textfield',
          label: 'Textfield',
          hidden: false,
          clearOnHide: true,
        },
      ],
    },
    {
      type: 'textfield',
      id: 'observer',
      key: 'observer',
      label: 'Observer',
      validate: {required: false},
    },
  ];

  const rules: LogicRule[] = [
    {
      jsonLogicTrigger: {'==': [{var: 'showFieldset'}, true]},
      actions: [
        {
          component: 'fieldset',
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: false,
          },
        },
      ],
    },
    // Not expected to trigger, because hideTextfield should not have a value
    {
      jsonLogicTrigger: {'==': [{var: 'hideTextfield'}, true]},
      actions: [
        {
          component: 'textfield',
          action: {
            type: 'property',
            property: {value: 'hidden', type: 'bool'},
            state: true,
          },
        },
      ],
    },
    // Expected to trigger, because textfield should not have a value
    {
      jsonLogicTrigger: {'==': [{var: ['textfield', 'not-in-context']}, 'not-in-context']},
      actions: [
        {
          component: 'observer',
          action: {
            type: 'property',
            property: {value: 'validate.required', type: 'bool'},
            state: true,
          },
        },
      ],
    },
  ];
  const submission = buildSubmission();

  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };
  let dataUpdates: JSONObject | null = {};
  let updatedComponents: AnyComponentSchema[] = [];

  evaluateBackendRules({
    submission,
    step,
    rules,
    inputData: {showFieldset: false},
    components: step.defaultConfiguration!.components,
    onLogicCheckResult: (_, step) => {
      dataUpdates = step.data;
      updatedComponents = step.configuration.components;
    },
  });

  expect(dataUpdates).toEqual({});
  expect((updatedComponents[2] as TextFieldComponentSchema).validate!.required).toEqual(true);
});

// Collection of backend bugs that were encountered, mimick the regression tests to avoid
// introducing the same problem.
describe('backend regression tests', () => {
  test('#6001 - do not clear valid input state', () => {
    const components: AnyComponentSchema[] = [
      {
        type: 'checkbox',
        key: 'checkbox',
        id: 'checkbox',
        label: 'Checkbox',
      },
      {
        type: 'fieldset',
        key: 'fieldset',
        id: 'fieldset',
        label: 'Fieldset',
        hidden: false,
        hideHeader: false,
        components: [
          {
            type: 'textfield',
            key: 'textfieldClientSide',
            id: 'textfieldClientSide',
            label: 'textfieldClientSide',
            hidden: true,
            conditional: {
              show: true,
              when: 'checkbox',
              eq: true,
            },
          },
          {
            type: 'textfield',
            key: 'textfieldServerSide',
            id: 'textfieldServerSide',
            label: 'textfieldServerSide',
            hidden: true,
          },
        ],
      },
      {
        type: 'textarea',
        key: 'calculatedTextarea',
        id: 'calculatedTextarea',
        label: 'Calculated text area content',
        autoExpand: false,
      },
    ];

    const rules: LogicRule[] = [
      {
        jsonLogicTrigger: {var: 'checkbox'},
        actions: [
          {
            component: 'textfieldServerSide',
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
          },
        ],
      },
      // we don't have client-side template interpolation, so use a `cat` value rule
      // instead
      {
        jsonLogicTrigger: {'!!': true},
        actions: [
          {
            action: {
              type: 'variable',
              value: {cat: [{var: 'textfieldClientSide'}, ' ', {var: 'textfieldServerSide'}]},
            },
            variable: 'calculatedTextarea',
          },
        ],
      },
    ];
    const submission = buildSubmission();

    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let dataUpdates: JSONObject | null = {};

    evaluateBackendRules({
      submission,
      step,
      rules,
      inputData: {
        checkbox: true,
        textfieldClientSide: 'client-side-visible',
        textfieldServerSide: 'server-side-visible',
      },
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        dataUpdates = step.data;
      },
    });

    expect(dataUpdates).toEqual({calculatedTextarea: 'client-side-visible server-side-visible'});
  });

  test('#6005 - clearOnHide with component hidden by default', () => {
    const components: AnyComponentSchema[] = [
      {
        type: 'checkbox',
        key: 'checkbox',
        id: 'checkbox',
        label: 'Checkbox',
      },
      {
        key: 'textfield',
        id: 'textfield',
        type: 'textfield',
        label: 'Textfield',
        clearOnHide: true,
        hidden: true,
      },
      {
        type: 'textfield',
        key: 'observer',
        id: 'observer',
        label: 'Observer',
      },
    ];

    const rules: LogicRule[] = [
      {
        jsonLogicTrigger: {'==': [{var: 'checkbox'}, true]},
        actions: [
          {
            component: 'textfield',
            action: {
              type: 'property',
              property: {type: 'bool', value: 'hidden'},
              state: false,
            },
          },
        ],
      },
      {
        jsonLogicTrigger: {'==': [{var: ['textfield', 'not-in-context']}, 'not-in-context']},
        actions: [
          {
            variable: 'observer',
            action: {type: 'variable', value: 'foo'},
          },
        ],
      },
    ];
    const submission = buildSubmission();
    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let dataUpdates: JSONObject | null = {};
    // Initial logic call with data `{checkbox: true}` causing the textfield to be visible
    const inputData = {checkbox: false, textfield: 'user_input', observer: ''};

    evaluateBackendRules({
      submission,
      step,
      rules,
      inputData,
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        dataUpdates = step.data;
      },
    });

    expect(dataUpdates).toEqual({observer: 'foo'});
  });

  test('#6005 - rule 1 triggers rule 2 does not, must not clear value', () => {
    const components: AnyComponentSchema[] = [
      {
        type: 'radio',
        key: 'radio',
        id: 'radio',
        label: '',
        values: [
          {value: 'a', label: 'A'},
          {value: 'b', label: 'B'},
        ],
        openForms: {dataSrc: 'manual'},
      },
      {
        type: 'textfield',
        key: 'show-when-a',
        id: 'show-when-a',
        label: '',
        hidden: true,
      },
      {
        type: 'textfield',
        key: 'observer',
        id: 'observer',
        label: 'Observer',
      },
    ];
    const rules: LogicRule[] = [
      {
        jsonLogicTrigger: {'==': [{var: 'radio'}, 'a']},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'show-when-a',
          },
        ],
      },
      {
        jsonLogicTrigger: {'==': [{var: 'radio'}, 'nonsense-value']},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'show-when-a',
          },
        ],
      },
      {
        jsonLogicTrigger: {'==': [{var: 'show-when-a'}, 'do-not-clear-me']},
        actions: [
          {
            action: {type: 'variable', value: 'foo'},
            variable: 'observer',
          },
        ],
      },
    ];
    const submission = buildSubmission();
    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let updatedComponents: AnyComponentSchema[] = [];
    let dataUpdates: JSONObject | null = {};

    evaluateBackendRules({
      submission,
      step,
      rules,
      inputData: {radio: 'a', 'show-when-a': 'do-not-clear-me', observer: ''},
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        updatedComponents = step.configuration.components;
        dataUpdates = step.data;
      },
    });

    expect(dataUpdates).toEqual({observer: 'foo'});
    expect((updatedComponents[1] as TextFieldComponentSchema).hidden).toBe(false);
  });

  test('#6005 - rule 2 triggers rule 1 does not, must not clear value', () => {
    const components: AnyComponentSchema[] = [
      {
        type: 'radio',
        key: 'radio',
        id: 'radio',
        label: '',
        values: [
          {value: 'a', label: 'A'},
          {value: 'b', label: 'B'},
        ],
        openForms: {dataSrc: 'manual'},
      },
      {
        type: 'textfield',
        key: 'show-when-a',
        id: 'show-when-a',
        label: '',
        hidden: true,
      },
      {
        type: 'textfield',
        key: 'observer',
        id: 'observer',
        label: 'Observer',
      },
    ];
    const rules: LogicRule[] = [
      {
        jsonLogicTrigger: {'==': [{var: 'radio'}, 'nonsense-value']},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'show-when-a',
          },
        ],
      },
      {
        jsonLogicTrigger: {'==': [{var: 'radio'}, 'a']},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'show-when-a',
          },
        ],
      },
      {
        jsonLogicTrigger: {'==': [{var: 'show-when-a'}, 'do-not-clear-me']},
        actions: [
          {
            action: {type: 'variable', value: 'foo'},
            variable: 'observer',
          },
        ],
      },
    ];
    const submission = buildSubmission();
    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let updatedComponents: AnyComponentSchema[] = [];
    let dataUpdates: JSONObject | null = {};

    evaluateBackendRules({
      submission,
      step,
      rules,
      inputData: {radio: 'a', 'show-when-a': 'do-not-clear-me', observer: ''},
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        updatedComponents = step.configuration.components;
        dataUpdates = step.data;
      },
    });

    expect(dataUpdates).toEqual({observer: 'foo'});
    expect((updatedComponents[1] as TextFieldComponentSchema).hidden).toBe(false);
  });

  test('#6005 - rules flip from hidden to visible state must not clear value', () => {
    const components: AnyComponentSchema[] = [
      {
        type: 'radio',
        key: 'radio',
        id: 'radio',
        label: '',
        values: [
          {value: 'a', label: 'A'},
          {value: 'b', label: 'B'},
        ],
        openForms: {dataSrc: 'manual'},
      },
      {
        type: 'checkbox',
        key: 'checkbox',
        id: 'checkbox',
        label: '',
      },
      {
        type: 'textfield',
        key: 'hide-when-a-but-show-when-checkbox-checked',
        id: 'hide-when-a-but-show-when-checkbox-checked',
        label: '',
        hidden: false,
      },
      {
        type: 'fieldset',
        key: 'fieldset',
        id: 'fieldset',
        label: '',
        hidden: false,
        hideHeader: false,
        components: [
          {
            type: 'textfield',
            key: 'nestedTextfield',
            id: 'nestedTextfield',
            label: '',
            hidden: false,
          },
        ],
      },
      {
        type: 'textfield',
        key: 'observer',
        id: 'observer',
        label: '',
        validate: {required: false},
      },
    ];
    const rules: LogicRule[] = [
      // Hide (and clear) the textfield when 'a' is selected in the radio
      {
        jsonLogicTrigger: {'==': [{var: 'radio'}, 'a']},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: true,
            },
            component: 'hide-when-a-but-show-when-checkbox-checked',
          },
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: true,
            },
            component: 'fieldset',
          },
        ],
      },
      // Expected to trigger: the value of the textfield gets cleared because of the
      // above rule.
      {
        jsonLogicTrigger: {
          '==': [
            {var: ['hide-when-a-but-show-when-checkbox-checked', 'not-in-context']},
            'not-in-context',
          ],
        },
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'validate.required', type: 'bool'},
              state: true,
            },
            component: 'observer',
          },
        ],
      },
      // show the textfield when the checkbox is checked
      {
        jsonLogicTrigger: {var: 'checkbox'},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'hide-when-a-but-show-when-checkbox-checked',
          },
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'fieldset',
          },
        ],
      },
      {
        jsonLogicTrigger: {
          '==': [{var: 'hide-when-a-but-show-when-checkbox-checked'}, 'do-not-clear-me'],
        },
        actions: [
          {
            action: {type: 'variable', value: 'foo'},
            variable: 'observer',
          },
        ],
      },
    ];
    const submission = buildSubmission();
    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let updatedComponents: AnyComponentSchema[] = [];
    let dataUpdates: JSONObject | null = {};

    evaluateBackendRules({
      submission,
      step,
      rules,
      inputData: {
        radio: 'a',
        checkbox: true,
        'hide-when-a-but-show-when-checkbox-checked': 'do-not-clear-me',
        nestedTextfield: 'do-not-clear-me',
        observer: '',
      },
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        updatedComponents = step.configuration.components;
        dataUpdates = step.data;
      },
    });

    expect(updatedComponents).toEqual([
      {
        type: 'radio',
        key: 'radio',
        id: 'radio',
        label: '',
        values: [
          {value: 'a', label: 'A'},
          {value: 'b', label: 'B'},
        ],
        openForms: {dataSrc: 'manual'},
      },
      {
        type: 'checkbox',
        key: 'checkbox',
        id: 'checkbox',
        label: '',
      },
      {
        type: 'textfield',
        key: 'hide-when-a-but-show-when-checkbox-checked',
        id: 'hide-when-a-but-show-when-checkbox-checked',
        label: '',
        hidden: false,
      },
      {
        type: 'fieldset',
        key: 'fieldset',
        id: 'fieldset',
        label: '',
        hidden: false,
        hideHeader: false,
        components: [
          {
            type: 'textfield',
            key: 'nestedTextfield',
            id: 'nestedTextfield',
            label: '',
            hidden: false,
          },
        ],
      },
      {
        type: 'textfield',
        key: 'observer',
        id: 'observer',
        label: '',
        validate: {required: true},
      },
    ]);
    expect(dataUpdates).toEqual({observer: 'foo'});
  });

  test('#6005 - rules flip from hidden to visible state must not clear value inverse', () => {
    const components: AnyComponentSchema[] = [
      {
        type: 'radio',
        key: 'radio',
        id: 'radio',
        label: '',
        values: [
          {value: 'a', label: 'A'},
          {value: 'b', label: 'B'},
        ],
        openForms: {dataSrc: 'manual'},
      },
      {
        type: 'checkbox',
        key: 'checkbox',
        id: 'checkbox',
        label: '',
      },
      {
        type: 'textfield',
        key: 'hide-when-a-but-show-when-checkbox-checked',
        id: 'hide-when-a-but-show-when-checkbox-checked',
        label: '',
        hidden: true,
      },
      {
        type: 'fieldset',
        key: 'fieldset',
        id: 'fieldset',
        label: '',
        hidden: true,
        hideHeader: false,
        components: [
          {
            type: 'textfield',
            key: 'nestedTextfield',
            id: 'nestedTextfield',
            label: '',
            hidden: false,
          },
        ],
      },
      {
        type: 'textfield',
        key: 'observer',
        id: 'observer',
        label: '',
        validate: {required: false},
      },
    ];
    const rules: LogicRule[] = [
      // Hide (and clear) the textfield when 'a' is selected in the radio
      {
        jsonLogicTrigger: {'==': [{var: 'radio'}, 'a']},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: true,
            },
            component: 'hide-when-a-but-show-when-checkbox-checked',
          },
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: true,
            },
            component: 'fieldset',
          },
        ],
      },
      // Expected to trigger: the value of the textfield gets cleared because of the
      // above rule.
      {
        jsonLogicTrigger: {
          '==': [
            {var: ['hide-when-a-but-show-when-checkbox-checked', 'not-in-context']},
            'not-in-context',
          ],
        },
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'validate.required', type: 'bool'},
              state: true,
            },
            component: 'observer',
          },
        ],
      },
      // show the textfield when the checkbox is checked
      {
        jsonLogicTrigger: {var: 'checkbox'},
        actions: [
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'hide-when-a-but-show-when-checkbox-checked',
          },
          {
            action: {
              type: 'property',
              property: {value: 'hidden', type: 'bool'},
              state: false,
            },
            component: 'fieldset',
          },
        ],
      },
      {
        jsonLogicTrigger: {
          '==': [{var: 'hide-when-a-but-show-when-checkbox-checked'}, 'do-not-clear-me'],
        },
        actions: [
          {
            action: {type: 'variable', value: 'foo'},
            variable: 'observer',
          },
        ],
      },
    ];
    const submission = buildSubmission();
    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let updatedComponents: AnyComponentSchema[] = [];
    let dataUpdates: JSONObject | null = {};

    evaluateBackendRules({
      submission,
      step,
      rules,
      inputData: {
        radio: 'a',
        checkbox: true,
        'hide-when-a-but-show-when-checkbox-checked': 'do-not-clear-me',
        nestedTextfield: 'do-not-clear-me',
        observer: '',
      },
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        updatedComponents = step.configuration.components;
        dataUpdates = step.data;
      },
    });

    expect(updatedComponents).toEqual([
      {
        type: 'radio',
        key: 'radio',
        id: 'radio',
        label: '',
        values: [
          {value: 'a', label: 'A'},
          {value: 'b', label: 'B'},
        ],
        openForms: {dataSrc: 'manual'},
      },
      {
        type: 'checkbox',
        key: 'checkbox',
        id: 'checkbox',
        label: '',
      },
      {
        type: 'textfield',
        key: 'hide-when-a-but-show-when-checkbox-checked',
        id: 'hide-when-a-but-show-when-checkbox-checked',
        label: '',
        hidden: false,
      },
      {
        type: 'fieldset',
        key: 'fieldset',
        id: 'fieldset',
        label: '',
        hidden: false,
        hideHeader: false,
        components: [
          {
            type: 'textfield',
            key: 'nestedTextfield',
            id: 'nestedTextfield',
            label: '',
            hidden: false,
          },
        ],
      },
      {
        type: 'textfield',
        key: 'observer',
        id: 'observer',
        label: '',
        validate: {required: true},
      },
    ]);
    expect(dataUpdates).toEqual({observer: 'foo'});
  });

  test('#6046 - variable action with non-triggered and property action', () => {
    const components: AnyComponentSchema[] = [
      {
        type: 'checkbox',
        key: 'checkbox',
        id: 'checkbox',
        label: 'Checkbox',
      },
      {
        key: 'textfield',
        id: 'textfield',
        type: 'textfield',
        label: 'Textfield',
        clearOnHide: true,
      },
    ];

    const rules: LogicRule[] = [
      {
        jsonLogicTrigger: true,
        actions: [
          {
            variable: 'textfield',
            action: {
              type: 'variable',
              value: 'foo',
            },
          },
        ],
      },
      {
        jsonLogicTrigger: {'==': [{var: 'checkbox'}, true]},
        actions: [
          {
            component: 'textfield',
            action: {
              type: 'property',
              property: {
                type: 'bool',
                value: 'hidden',
              },
              state: true,
            },
          },
        ],
      },
    ];
    const submission = buildSubmission();
    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let dataUpdates: JSONObject | null = {};

    evaluateBackendRules({
      submission,
      step,
      rules,
      inputData: {checkbox: false, textfield: 'user_input'},
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        dataUpdates = step.data;
      },
    });

    expect(dataUpdates).toEqual({textfield: 'foo'});
  });
});

test('does not crash when editgrid has default hidden component inside and backend logic rule affecting visibility', () => {
  const components: AnyComponentSchema[] = [
    {
      type: 'checkbox',
      key: 'checkbox',
      id: 'checkbox',
      label: 'Checkbox',
    },
    {
      key: 'editgrid',
      id: 'editgrid',
      type: 'editgrid',
      label: 'Editgrid',
      clearOnHide: true,
      disableAddingRemovingRows: false,
      groupLabel: 'Group',
      components: [
        {
          type: 'textfield',
          key: 'textfield',
          id: 'textfield',
          label: 'Textfield',
        },
        {
          type: 'currency',
          key: 'currency',
          id: 'currency',
          label: 'Currency',
          currency: 'EUR',
          hidden: true,
        },
      ],
    },
  ];

  const rules: LogicRule[] = [
    {
      jsonLogicTrigger: {'==': [{var: 'checkbox'}, true]},
      actions: [
        {
          component: 'editgrid',
          action: {
            type: 'property',
            property: {
              type: 'bool',
              value: 'hidden',
            },
            state: true,
          },
        },
      ],
    },
  ];
  const submission = buildSubmission();
  const step: SubmissionStep = {
    ...buildSubmissionStep({components}),
    defaultConfiguration: {components},
  };
  let dataUpdates: JSONObject | null = {};

  evaluateBackendRules({
    submission,
    step,
    rules,
    inputData: {checkbox: false, editgrid: [{textfield: 'foo'}, {textfield: 'bar'}]},
    components: step.defaultConfiguration!.components ?? [],
    onLogicCheckResult: (_, step) => {
      dataUpdates = step.data;
    },
  });
  // Rule was not triggered, so no updates expected.
  expect(dataUpdates).toEqual({});
});

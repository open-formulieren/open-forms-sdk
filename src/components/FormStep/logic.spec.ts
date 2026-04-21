import type {
  AnyComponentSchema,
  JSONObject,
  JSONValue,
  TextFieldComponentSchema,
} from '@open-formulieren/types';
import {describe, expect, test} from 'vitest';

import {buildSubmission, buildSubmissionStep} from '@/api-mocks';
import type {LogicRule} from '@/data/logic';
import type {SubmissionStep} from '@/data/submission-steps';

import {evaluateBackendRules, getComponentEmptyValue} from './logic';

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
    // show number input when textfield is empty.
    {
      jsonLogicTrigger: {'!': [{var: 'textfield'}]},
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
  // the textfield is to be cleared, and the number field doesn't change because the
  // default value already matches with what the update would be
  expect(dataUpdates).toEqual({
    textfield: '',
  });
});

test('clearOnHide behaviour with hidden parent', () => {
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
    // because the parent is hidden, the renderer has remove the `textfield` from the
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
  // we don't expect any data updates to textfield, because that would trigger infinite
  // render cycles, despite it being hidden and getting the empty value assigned for
  // evaluation during/between backend rules
  expect(dataUpdates).toEqual({});
});

// The frontend evaluation of backend logic rules must exactly match the backend
// behaviour, which includes *not* removing hidden component values from default values
// for children of parents that become hidden. Eventually it does end up in that
// situation, but that's entirely because of the *next* render cycle of the renderer.
// See https://github.com/open-formulieren/open-forms/issues/6121 for the novella about
// why this is necessary.
test('clearOnHide behaviour when hiding a parent (match backend behaviour)', () => {
  // set up a component definition without frontend (formio-renderer) logic, which
  // establishes the actual begin state. The nested textfield displays the non-intuitive
  // behaviour.
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
        // despite being hidden (because the parent becomes hidden), the default value
        // will be used as evaluation input.
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
    // broken but current behaviour in backend: this triggers because the textfield being
    // hidden does not remove the input data from the context/submission data. See #6121.
    {
      jsonLogicTrigger: {'==': [{var: 'textfield'}, 'default']},
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
  expect(dataUpdates).toEqual({
    textfield: 'default',
    observer: true,
  });
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

test.each([
  [
    {
      type: 'textfield',
      id: 'textfield',
      key: 'textfield',
      label: '',
      defaultValue: 'ignored',
    },
    '',
  ],
  [
    {
      type: 'textfield',
      id: 'textfield',
      key: 'textfield',
      label: '',
      defaultValue: ['ignored'],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'email',
      id: 'email',
      key: 'email',
      label: '',
    },
    '',
  ],
  [
    {
      type: 'email',
      id: 'email',
      key: 'email',
      label: '',
      defaultValue: [],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'date',
      id: 'date',
      key: 'date',
      label: '',
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'date',
      id: 'date',
      key: 'date',
      label: '',
      defaultValue: [''],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'datetime',
      id: 'datetime',
      key: 'datetime',
      label: '',
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'datetime',
      id: 'datetime',
      key: 'datetime',
      label: '',
      defaultValue: [''],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'time',
      id: 'time',
      key: 'time',
      label: '',
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'time',
      id: 'time',
      key: 'time',
      label: '',
      defaultValue: [''],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'phoneNumber',
      id: 'phoneNumber',
      key: 'phoneNumber',
      label: '',
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'phoneNumber',
      id: 'phoneNumber',
      key: 'phoneNumber',
      label: '',
      defaultValue: [''],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'postcode',
      id: 'postcode',
      key: 'postcode',
      label: '',
      defaultValue: '',
      validate: {
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
    },
    '',
  ],
  [
    {
      type: 'postcode',
      id: 'postcode',
      key: 'postcode',
      label: '',
      defaultValue: [''],
      validate: {
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'file',
      id: 'file',
      key: 'file',
      label: '',
      file: {
        name: '',
        type: [],
        allowedTypesLabels: [],
      },
      filePattern: '',
    },
    [],
  ],
  [
    {
      type: 'file',
      id: 'file',
      key: 'file',
      label: '',
      file: {
        name: '',
        type: [],
        allowedTypesLabels: [],
      },
      filePattern: '',
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'textarea',
      id: 'textarea',
      key: 'textarea',
      label: '',
      defaultValue: '',
      autoExpand: false,
    },
    '',
  ],
  [
    {
      type: 'textarea',
      id: 'textarea',
      key: 'textarea',
      label: '',
      defaultValue: [''],
      autoExpand: false,
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'number',
      id: 'number',
      key: 'number',
      label: '',
      defaultValue: 0,
    },
    null,
  ],
  [
    {
      type: 'checkbox',
      id: 'checkbox',
      key: 'checkbox',
      label: '',
      defaultValue: true,
    },
    false,
  ],
  [
    {
      type: 'selectboxes',
      id: 'selectboxes',
      key: 'selectboxes',
      label: '',
      values: [{value: 'a', label: 'A'}],
      openForms: {dataSrc: 'manual'},
    },
    {a: false},
  ],
  [
    {
      type: 'selectboxes',
      id: 'selectboxes',
      key: 'selectboxes',
      label: '',
      values: [{value: '', label: ''}],
      openForms: {dataSrc: 'manual'},
    },
    {},
  ],
  [
    {
      type: 'select',
      id: 'select',
      key: 'select',
      label: '',
      defaultValue: '',
      openForms: {dataSrc: 'manual'},
      data: {values: []},
    },
    '',
  ],
  [
    {
      type: 'select',
      id: 'select',
      key: 'select',
      label: '',
      defaultValue: [''],
      openForms: {dataSrc: 'manual'},
      data: {values: []},
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'currency',
      id: 'currency',
      key: 'currency',
      label: '',
      currency: 'EUR',
      defaultValue: 0,
    },
    null,
  ],
  [
    {
      type: 'radio',
      id: 'radio',
      key: 'radio',
      label: '',
      values: [{value: 'a', label: 'A'}],
      openForms: {dataSrc: 'manual'},
      defaultValue: null,
    },
    '',
  ],
  [
    {
      type: 'iban',
      id: 'iban',
      key: 'iban',
      label: '',
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'iban',
      id: 'iban',
      key: 'iban',
      label: '',
      defaultValue: [''],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'licenseplate',
      id: 'licenseplate',
      key: 'licenseplate',
      label: '',
      validate: {pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$'},
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'licenseplate',
      id: 'licenseplate',
      key: 'licenseplate',
      label: '',
      validate: {pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$'},
      defaultValue: [''],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'bsn',
      id: 'bsn',
      key: 'bsn',
      label: '',
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'bsn',
      id: 'bsn',
      key: 'bsn',
      label: '',
      defaultValue: [''],
      multiple: true,
    },
    [],
  ],
  [
    {
      type: 'signature',
      id: 'signature',
      key: 'signature',
      label: '',
    },
    '',
  ],
  [
    {
      type: 'cosign',
      id: 'cosign',
      key: 'cosign',
      label: '',
      defaultValue: '',
    },
    '',
  ],
  [
    {
      type: 'map',
      id: 'map',
      key: 'map',
      label: '',
    },
    null,
  ],
  [
    {
      type: 'editgrid',
      id: 'editgrid',
      key: 'editgrid',
      label: '',
      groupLabel: '',
      disableAddingRemovingRows: false,
      components: [],
    },
    [],
  ],
  [
    {
      type: 'addressNL',
      id: 'addressNL',
      key: 'addressNL',
      label: '',
      layout: 'singleColumn',
      deriveAddress: false,
    },
    // this does not make sense, but it's what the backend spits out. See
    // https://github.com/open-formulieren/open-forms/issues/6125
    '',
  ],
  [
    {
      type: 'partners',
      id: 'partners',
      key: 'partners',
      label: '',
    },
    [],
  ],
  [
    {
      type: 'children',
      id: 'children',
      key: 'children',
      label: '',
      enableSelection: false,
    },
    [],
  ],
  [
    {
      type: 'customerProfile',
      id: 'customerProfile',
      key: 'customerProfile',
      label: '',
      shouldUpdateCustomerData: false,
      digitalAddressTypes: [],
    },
    [],
  ],
] satisfies [AnyComponentSchema, JSONValue][])(
  'component empty value is correctly determined (%o)',
  (component: AnyComponentSchema, expectedValue: JSONValue) => {
    const emptyValue = getComponentEmptyValue(component);

    expect(emptyValue).toEqual(expectedValue);
  }
);

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
    ];
    const submission = buildSubmission();
    const step: SubmissionStep = {
      ...buildSubmissionStep({components}),
      defaultConfiguration: {components},
    };
    let dataUpdates: JSONObject | null = {};
    // Initial logic call with data `{checkbox: true}` causing the textfield to be visible
    const inputData = {checkbox: false, textfield: 'user_input'};

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

    expect(dataUpdates).toEqual({textfield: ''});
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
      inputData: {radio: 'a', 'show-when-a': 'do-not-clear-me'},
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        updatedComponents = step.configuration.components;
        dataUpdates = step.data;
      },
    });

    expect(dataUpdates).toEqual({});
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
      inputData: {radio: 'a', 'show-when-a': 'do-not-clear-me'},
      components: step.defaultConfiguration!.components ?? [],
      onLogicCheckResult: (_, step) => {
        updatedComponents = step.configuration.components;
        dataUpdates = step.data;
      },
    });

    expect(dataUpdates).toEqual({});
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
        jsonLogicTrigger: {'==': [{var: 'hide-when-a-but-show-when-checkbox-checked'}, '']},
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
    expect(dataUpdates).toEqual({});
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
        jsonLogicTrigger: {'==': [{var: 'hide-when-a-but-show-when-checkbox-checked'}, '']},
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
    expect(dataUpdates).toEqual({});
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

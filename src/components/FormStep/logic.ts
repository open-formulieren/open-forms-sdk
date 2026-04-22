import {getRegistryEntry} from '@open-formulieren/formio-renderer';
import {getComponentsMap} from '@open-formulieren/formio-renderer/formio.js';
import {deepMergeValues, extractInitialValues} from '@open-formulieren/formio-renderer/values.js';
import type {AnyComponentSchema, JSONObject, JSONValue} from '@open-formulieren/types';
import {getIn, setIn} from 'formik';
import {isEqual} from 'lodash';

import type {LogicRule} from '@/data/logic';
import type {SubmissionStep} from '@/data/submission-steps';
import type {Submission} from '@/data/submissions';
import {
  applyDisableNextAction,
  applyPropertyAction,
  applyStepApplicableAction,
  applyStepNotApplicableAction,
  applyVariableAction,
  evaluateJsonLogic,
  isDisableNextAction,
  isPropertyAction,
  isStepApplicableAction,
  isStepNotApplicableAction,
  isVariableAction,
} from '@/logic';
import type {LogicEvaluationState} from '@/logic';

interface EvaluateArgs {
  /**
   * The submission for which logic is being evaluated.
   */
  submission: Submission;
  /**
   * Current step for which the logic is being evaluated.
   */
  step: SubmissionStep;
  /**
   * Set of logic rules (in order of execution) to evaluate.
   */
  rules: LogicRule[];
  /**
   * The current submission data to use as input. Value mutations are tracked throughout
   * the evaluation and have immediate effect.
   *
   * If this is an empty object literal (happens at the beginning of a form step when no
   * data has been submitted yet), we instead use the extracted initial values from the
   * components (see #6099).
   */
  inputData: JSONObject;
  /**
   * The original form configuration without any logic rule evaluation applied by the
   * backend. Used to determine the 'starting' point of each component when no rule
   * is triggered, and is necessary to revert state if rules are toggling between
   * triggered and not triggered.
   */
  components: AnyComponentSchema[];
  /**
   * Callback to invoke at the end of the evaluation so that the submission state
   * and submission step state can be updated with the rule evaluation side effects.
   */
  onLogicCheckResult: (
    submission: Submission,
    step: SubmissionStep,
    errorsToClear: string[]
  ) => void;
}

/**
 * Given the rules and submission data, evaluate the logic rules and apply the side
 * effects via `onLogicCheckResult`.
 */
export const evaluateBackendRules = ({
  submission,
  step,
  rules,
  inputData,
  components,
  onLogicCheckResult,
}: EvaluateArgs): void => {
  // if there are *no* logic rules, do nothing. It's free real estate!
  if (rules.length === 0) {
    return;
  }

  // create a deep copy that we can mutate without unexpected side-effects & derive the
  // components map from it.
  const updatedComponents = window.structuredClone(components);
  const componentsMap = getComponentsMap(updatedComponents);
  const initialValues = extractInitialValues(components, getRegistryEntry);
  const originalInitialValues = deepMergeValues(initialValues, inputData);

  // empty input data can in principle never happen, unless there's a form definition
  // without any data components *or* the step was initially loaded and no data has been
  // persisted yet. Most of the time, this is okay, but if components have non-empty
  // default values, this can trip up the logic evaluation because there's no change
  // event that fires from the formio-renderer for the Formik initial data setting, only
  // when an actual data change happens this event fires.
  const isEmptyInputData = isEqual(inputData, {});

  // Set up the evaluation state to pass through all rules and actions. It will be
  // mutated throughout the evaluation process.
  let evaluationState: LogicEvaluationState = {
    ruleIsTriggered: false, // will be overriden for each rule
    currentStepUuid: step.formStepUuid,
    componentsMap,
    data: isEmptyInputData ? initialValues : inputData,
    initialValues: originalInitialValues,
    initialValuesForClearOnHide: initialValues,
    errorsToClear: [],
    disableNext: false,
    stepsApplicableUpdates: {},
  };

  for (const rule of rules) {
    evaluationState = evaluateRule(rule, evaluationState);
  }

  // component keys are the equivalent of variable keys in the client, where we don't
  // deal with server-side only variables. Use the variable/component keys to build up
  // the data updates structure.
  // Only keep the keys where the final value is different from the original input
  // values, as otherwise we risk ending up in infinite render cycles.
  let dataUpdates: JSONObject = {};
  for (const key of Object.keys(componentsMap)) {
    const initialValue: JSONValue | undefined = getIn(originalInitialValues, key);
    const currentValue: JSONValue | undefined = getIn(evaluationState.data, key);
    if (!isEqual(currentValue, initialValue)) {
      dataUpdates = setIn(dataUpdates, key, currentValue);
    }
  }

  const {errorsToClear, disableNext, stepsApplicableUpdates} = evaluationState;
  const canSubmit = !disableNext;

  let updatedStep: SubmissionStep = setIn(step, 'configuration.components', updatedComponents);
  updatedStep = setIn(updatedStep, 'data', dataUpdates);
  updatedStep = setIn(updatedStep, 'canSubmit', canSubmit);

  let updatedSubmission = submission;
  // first, reset the `isApplicable` state to its begin and then apply the side effects
  // of the logic actions.
  for (let i = 0; i < updatedSubmission.steps.length; i++) {
    const submissionStep = updatedSubmission.steps[i];
    const isApplicable: boolean =
      submissionStep.id in stepsApplicableUpdates
        ? stepsApplicableUpdates[submissionStep.id]
        : submissionStep.defaultIsApplicable;
    updatedSubmission = setIn(updatedSubmission, `steps.${i}.isApplicable`, isApplicable);
  }
  onLogicCheckResult(updatedSubmission, updatedStep, errorsToClear);
};

/**
 * Evaluate a single logic rule and apply the side effects to the evaluation state.
 *
 * @returns the updated evaluation state.
 */
const evaluateRule = (
  rule: LogicRule,
  evaluationState: LogicEvaluationState
): LogicEvaluationState => {
  const isTriggered = evaluateJsonLogic(rule.jsonLogicTrigger, evaluationState.data);
  // Store the rule trigger check result in the state, and ensure the other object references
  // remain identical so that mutations are not lost.
  const ruleScopedState: LogicEvaluationState = setIn(
    evaluationState,
    'ruleIsTriggered',
    isTriggered
  );

  // FIXME: these deep structures don't type-narrow, so we must use type guards for
  // now. It requires proper backend re-design as well.
  for (const action of rule.actions) {
    if (isPropertyAction(action)) {
      applyPropertyAction(ruleScopedState, action);
    } else if (isVariableAction(action)) {
      applyVariableAction(ruleScopedState, action);
    } else if (isDisableNextAction(action)) {
      applyDisableNextAction(ruleScopedState, action);
    } else if (isStepNotApplicableAction(action)) {
      applyStepNotApplicableAction(ruleScopedState, action);
    } else if (isStepApplicableAction(action)) {
      applyStepApplicableAction(ruleScopedState, action);
    } else {
      const exhaustiveCheck: never = action;
      throw new Error(`Unhandled action type: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
  return ruleScopedState;
};

type DataType = 'string' | 'boolean' | 'object' | 'array' | 'number' | 'datetime' | 'date' | 'time';

const DATA_TYPE_TO_EMPTY_VALUE: Record<DataType, JSONValue> = {
  string: '',
  boolean: false,
  object: {},
  array: [],
  number: null,
  datetime: '',
  date: '',
  time: '',
};

type DataComponentType = Exclude<
  AnyComponentSchema['type'],
  'fieldset' | 'columns' | 'content' | 'softRequiredErrors' | 'coSign' | 'npFamilyMembers'
>;

const COMPONENT_TYPE_TO_DATATYPE: Record<DataComponentType, DataType> = {
  textfield: 'string',
  email: 'string',
  date: 'string',
  datetime: 'string',
  time: 'string',
  phoneNumber: 'string',
  postcode: 'string',
  file: 'array',
  textarea: 'string',
  number: 'number',
  checkbox: 'boolean',
  selectboxes: 'object',
  select: 'string',
  currency: 'number',
  radio: 'string',
  iban: 'string',
  licenseplate: 'string',
  bsn: 'string',
  cosign: 'string',
  map: 'object',
  editgrid: 'array',
  addressNL: 'string',
  partners: 'array',
  children: 'array',
  customerProfile: 'array',
  signature: 'string',
};

/**
 * Determine what the 'empty value' is for the given component configuration.
 *
 * This is the counterpart of `openforms.formio.service.get_component_empty_value` in
 * the backend, and exists only to match the backend logic evaluation behaviour.
 * See {@Link https://github.com/open-formulieren/open-forms/issues/6121} for more
 * details.
 *
 * Each component has an intrinsic value type, and the `multiple` flag also has an
 * impact on it.
 */
export const getComponentEmptyValue = (component: AnyComponentSchema): JSONValue => {
  // get the special cases out of the way
  switch (component.type) {
    case 'selectboxes': {
      const defaultValue = component.defaultValue ?? {};
      if (Object.keys(defaultValue).length > 0) return defaultValue;
      const values = component.values;
      if (values.length === 1 && values[0].label === '') return {};
      return Object.fromEntries(values.map(option => [option.value, false]));
    }
    case 'map': {
      // backend accesses `defaultValue`, but that doesn't exist according to the type :-)
      return null;
    }
  }

  // base this on the component data type, but keep in mind that multi-value components
  // must return arrays -> use empty array.
  if ('multiple' in component && component.multiple) {
    return [];
  }

  const dataType: DataType =
    component.type in COMPONENT_TYPE_TO_DATATYPE
      ? // typecast necessary because the check above doesn't narrow the `component.type`
        // union
        COMPONENT_TYPE_TO_DATATYPE[component.type as DataComponentType]
      : 'string';

  return DATA_TYPE_TO_EMPTY_VALUE[dataType];
};

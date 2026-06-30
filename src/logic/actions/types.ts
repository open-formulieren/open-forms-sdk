import type {AnyComponentSchema, JSONObject} from '@open-formulieren/types';

/**
 * State to pass through logic rule and action evaluation.
 *
 * Members are expected to be modified in place by the logic actions.
 */
export interface LogicEvaluationState {
  /**
   * Marker that indicates whether the parent logic rule was triggered or not. Actions
   * must only execute their side-effects when the rule is triggered, but sometimes a
   * rule not being triggered also implies side-effects (e.g. restoring the value of
   * a component that is no longer hidden because of the rule not being triggered).
   */
  readonly ruleIsTriggered: boolean;
  /**
   * UUID of the currently active submission step. Points to the UUID of the FormStep
   * resource.
   */
  readonly currentStepUuid: string;
  /**
   * Mapping of component key to the component definition itself.
   */
  componentsMap: Record<string, AnyComponentSchema>;
  /**
   * The (input) data, used as context/state for the rule and action evaluations.
   *
   * Actions can mutate this directly so that the result is used in the next rule and/or
   * action. It contains the full view on the input data. Keys may be unset/removed as
   * part of visibility processing.
   */
  data: JSONObject;
  /**
   * The begin state of component values, used to populate the data for components that
   * become visible. Taken from existing submission data, the component default value
   * or the component-specific empty value (in that order).
   *
   * Value updates from logic rule actions can this object.
   */
  initialValues: JSONObject;
  /**
   * List of keys/dotted paths to components for which the validation errors must be
   * cleared. The formio-renderer automatically takes care of managing validation errors
   * for components that become hidden, but other logic interactions like making a
   * component optional should reset validation errors.
   */
  errorsToClear: string[];
  /**
   * Flag to mark whether submitting the current step (see `currentStepUuid`) submission
   * should be disabled, preventing progressing to the next step/summary page.
   */
  disableNext: boolean;
  /**
   * Mapping of step UUID to target state for whether it's applicable or not. `true`
   * means it must be made applicable, `false` means it must be set to not-applicable.
   */
  stepsApplicableUpdates: Record<string, boolean>;
}

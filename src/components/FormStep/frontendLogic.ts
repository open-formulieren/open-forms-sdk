import type {JSONObject, JSONValue} from '@open-formulieren/types/lib/types';
import * as jsonLogic from 'json-logic-js';
import {get, set, merge} from 'lodash';

import type { SubmissionStep } from '@/data/submission-steps';
import type { Submission } from '@/data/submissions';

export const useCheckStepLogicFrontend = (
  submission: Submission,
  step: SubmissionStep | undefined,
  // stepMapRef: React.MutableRefObject<Record<string, SubmissionStep>>,
  allValues: React.MutableRefObject<JSONObject | null>,
  unsavedValues: React.MutableRefObject<JSONObject | null>,
  onLogicCheckResult: (submission: Submission, step: SubmissionStep) => void
): (() => void) => {
  if (step === undefined) return () => {};
  // if (!(step.slug in stepMapRef.current)) return () => {};

  const runFrontendLogic = () => {
    // Apply unsaved values
    const initialValues = merge(allValues.current ?? {}, unsavedValues.current ?? {});
    const values = structuredClone(initialValues);

    // const initialStep = stepMapRef.current[step.slug];
    const stepCopy: SubmissionStep = structuredClone(step);
    // The step.formStep.configuration contains already mutated configuration, because we execute
    // logic in the backend before step serialization. So we set the original configuration manually
    // here.
    stepCopy.formStep.configuration = stepCopy.configuration;

    const components = stepCopy.formStep.configuration.components;
    const logicRules = stepCopy.formStep.logicRules;

    // Execute all rules
    for (let i = 0; i < logicRules.length; i++) {
      const rule = logicRules[i];

      const triggered = jsonLogic.apply(rule.jsonLogicTrigger, values);
      if (!triggered) continue;

      // Execute all actions
      const actions = rule.actions as JSONObject[];
      for (let j = 0; j < actions.length; j++) {
        const action = actions[j];

        switch (action.action.type) {
          case 'variable':
            set(values, action.variable, jsonLogic.apply(action.action.value, values));
            break;
          case 'property':
            const component = components.find(component => component.key === action.component);
            set(component, action.action.property.value, action.action.state);
            break;
        }
      }
    }

    // Create data diff
    const stepVars = components.map(component => component.key);
    const dataDiff: Record<string, JSONValue> = {};
    stepVars.forEach(key => {
      if (key in values && values[key] !== initialValues[key]) {
        dataDiff[key] = values[key];
      }
    });

    // json logic might return a NaN, which the renderer seems to convert to null, so we could get
    // into an infinite loop if we don't convert them here.
    stepCopy.data = nanToNull(dataDiff);

    onLogicCheckResult(submission, stepCopy);
  };

  return runFrontendLogic;
};

function nanToNull(value) {
  if (typeof value === "number" && Number.isNaN(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(nanToNull);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, nanToNull(v)])
    );
  }

  return value;
}

import { AnyComponentSchema } from '@open-formulieren/types';
import type { JSONObject, JSONValue } from '@open-formulieren/types/lib/types';
import * as jsonLogic from 'json-logic-js';
import { get, merge, set } from 'lodash';
import isEqual from 'fast-deep-equal';


import type { SubmissionStep } from '@/data/submission-steps';
import type { Submission } from '@/data/submissions';





export const useCheckStepLogicFrontend = (
  submission: Submission,
  step: SubmissionStep | undefined,
  unsavedValues: React.MutableRefObject<JSONObject | null>,
  onLogicCheckResult: (submission: Submission, step: SubmissionStep) => void
): (() => void) => {
  if (step === undefined) return () => {};
  // if (!(step.slug in stepMapRef.current)) return () => {};

  const runFrontendLogic = () => {
    // Apply unsaved values
    const initialValues = unsavedValues.current ?? {};
    const values = structuredClone(initialValues);

    const stepCopy: SubmissionStep = structuredClone(step);
    // The step.formStep.configuration contains already mutated configuration, because we execute
    // logic in the backend before step serialization. So we set the original configuration manually
    // here.
    stepCopy.formStep.configuration = stepCopy.defaultConfiguration;

    const logicRules = stepCopy.formStep.logicRules;
    const componentMap = getComponentsMap(stepCopy.formStep.configuration.components);

    console.log('values', values);

    // Execute all rules
    for (const rule of logicRules) {
      const triggered = jsonLogic.apply(rule.jsonLogicTrigger, values);
      if (!triggered) continue;

      // Execute all actions
      let component: AnyComponentSchema | null;
      for (const action of rule.actions) {
        switch (action.action.type) {
          case 'variable':
            set(values, action.variable, jsonLogic.apply(action.action.value, values));
            break;
          case 'property':
            // TODO-5692: this does not apply any clearOnHide behavior, so logic rules that use the
            //  value of this component as an input might trigger when they shouldn't (or vice
            //  versa). This is because the clearOnHide is applied by the renderer, which is only
            //  updated after all logic rules have executed. Should we update the renderer after
            //  changing each component separately, instead of once at the end? Or implement
            //  something in the SDK as well (perhaps using routines of the renderer)?
            //  OR perhaps leave it for now? It will only affect rules that cannot be reversed,
            //  which in our case is only setting a value to a field. Other incorrectly triggered
            //  property and disable-next actions will not really be visible, as the renderer
            //  updates very fast, and logic is invoked again by the SDK with the correct (cleared)
            //  value.
            component = componentMap[action.component];
            // Note that `set` does nothing when `component` is undefined.
            set(component, action.action.property.value, action.action.state);
            break;
          case 'disable-next':
            // eslint-disable-next-line max-depth
            if (action.formStepUuid === stepCopy.formStep.uuid) {
              stepCopy.canSubmit = false;
            }
            break;
          default:
            break;
        }
      }
    }

    // Create data diff
    const dataDiff: Record<string, JSONValue> = {};
    // TODO-5962: this does include layout components, which have no value, so we need to check
    //  whether the key is present in `values`. An alternative might be to add all component
    //  variable keys to the serializer.
    for (const component of Object.values(componentMap)) {
      const key = component.key;
      // Need `isEqual` for arrays and objects.
      if (key in values && !isEqual(values[key], initialValues[key])) {
        dataDiff[key] = values[key];
      }
    }

    // json logic might return a NaN, which the renderer seems to convert to null, so we could get
    // into an infinite loop if we don't convert them here.
    stepCopy.data = nanToNull(dataDiff);

    onLogicCheckResult(submission, stepCopy);
  };

  return runFrontendLogic;
};

// TODO-5962: import from formio-renderer?
/**
 * Recursively (and depth-first) iterate over all components in the component definition.
 *
 * The components returned here are how they are seen from the root down to the leaf
 * nodes, and matches how we handle values. This has some implications for components that
 * have nested component definitions inside them - we must treat those appropriately:
 */
function* iterComponents(components: AnyComponentSchema[]): Generator<AnyComponentSchema> {
  for (const component of components) {
    yield component;

    switch (component.type) {
      case 'fieldset': {
        yield* iterComponents(component.components);
        break;
      }
      case 'columns': {
        for (const column of component.columns) {
          yield* iterComponents(column.components);
        }
        break;
      }
      case 'editgrid': {
        // Components inside editgrids cannot be targeted with "backend" logic, so we do not add
        // them to the map (in contrast to what happens in the backend).
        break;
      }
    }
  }
}

/**
 * Given a tree of component definitions, transform it into a mapping of component key
 * to the component configuration. Useful to look up component key references and
 * introspect the matching component type/configuration.
 */
export const getComponentsMap = (
  components: AnyComponentSchema[]
): Record<string, AnyComponentSchema> => {
  const map: Record<string, AnyComponentSchema> = {};
  for (const component of iterComponents(components)) {
    map[component.key] = component;
  }
  return map;
};

function nanToNull(value) {
  if (typeof value === 'number' && Number.isNaN(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(nanToNull);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, nanToNull(v)]));
  }

  return value;
}

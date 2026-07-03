import {getRegistryEntry} from '@open-formulieren/formio-renderer';
import {isHidden} from '@open-formulieren/formio-renderer/formio.js';
import {processVisibility} from '@open-formulieren/formio-renderer/visibility.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {set} from 'lodash';

import type {LogicAction, PropertyAction} from '@/data/logic';

import type {LogicEvaluationState} from './types';

export const isPropertyAction = (action: LogicAction): action is PropertyAction => {
  return action.action.type === 'property';
};

/**
 * Resolve the referenced component and set the specified property to the desired state.
 *
 * This runs even if the component already has the desired state, effectively resulting
 * in a no-op action. Side-effects like updating values and errors to clear only run
 * when a relevant change is detected.
 */
export const applyPropertyAction = (
  logicState: LogicEvaluationState,
  action: PropertyAction
): void => {
  const {componentsMap, ruleIsTriggered} = logicState;
  const {
    component: componentKey,
    action: {
      property: {value: propertyPath},
      state,
    },
  } = action;

  // this *could* point to a component in another step
  const targetComponent = componentsMap[componentKey];
  if (!targetComponent) return;

  const becameOptional = propertyPath === 'validate.required' && ruleIsTriggered !== state;

  if (ruleIsTriggered) {
    set(targetComponent, propertyPath, state);
  }

  // processVisibility takes care of applying side effects of:
  // - `clearOnHide`
  // - restoring the value when a component becomes visible again
  //
  // both lead to updates in the submission data.
  if (propertyPath === 'hidden') {
    // XXX: backend logic rules targeting editgrids are currently not supported - this
    // codepath will need to be updated when we add support for that.
    const {updatedValues} = processVisibility(
      // we must scope the visibility processing to this component and its potential
      // children, otherwise we risk adding back values to the state for visible
      // components that only get hidden (and cleared) by a future action/rule, and that
      // results in infinite render cycles because the Formik values bounce between two
      // or more different states. This means that we need a different mechanism to
      // determine if the parent of the target component is hidden...
      [targetComponent],
      logicState.data,
      // we can't and don't need to pass errors - processVisibility runs (again)
      // internally in the Formio renderer and manages the Formik validation errors
      // there for hidden components. At the logic evaluation layer, we don't have
      // access to the Formik state and can't even pass the errors.
      {},
      {
        parentHidden: hasHiddenParent(targetComponent, logicState),
        initialValues: logicState.initialValues,
        getRegistryEntry,
        componentsMap,
      }
    );
    logicState.data = updatedValues;
  }

  // validate.required flipping from true -> false should reset possible 'this field
  // is required' validation errors
  if (becameOptional) {
    logicState.errorsToClear.push(componentKey);
  }
};

const hasHiddenParent = (
  component: AnyComponentSchema,
  logicState: LogicEvaluationState
): boolean => {
  const parentKey: string | undefined = logicState.componentParentLinks[component.key];
  // not present in lookup map -> it doesn't have any parents
  if (!parentKey) return false;
  // test the parent - if it's visible, recurse as there may be hidden grand parent(s)
  const parent = logicState.componentsMap[parentKey];
  // `isHidden` considers the `conditional` and `hidden` properties.
  if (isHidden(parent, logicState.data, getRegistryEntry, logicState.componentsMap)) {
    return true;
  }
  return hasHiddenParent(parent, logicState);
};

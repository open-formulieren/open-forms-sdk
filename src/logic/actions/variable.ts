import type {JSONValue} from '@open-formulieren/types';
import {getIn, setIn} from 'formik';
import {isEqual} from 'lodash';

import type {LogicAction, VariableAction} from '@/data/logic';
import evaluateJsonLogic from '@/logic/json-logic';

import {UNDEFINED_VALUE} from '../json-logic/extensions/context';
import type {LogicEvaluationState} from './types';

export const isVariableAction = (action: LogicAction): action is VariableAction => {
  return action.action.type === 'variable';
};

export const applyVariableAction = (
  logicState: LogicEvaluationState,
  action: VariableAction
): void => {
  const {componentsMap, ruleIsTriggered} = logicState;
  // only apply the value if the rule was triggered
  if (!ruleIsTriggered) return;

  // for client-side logic, only component variables can be targeted
  const {
    variable: componentKey,
    action: {value: valueExpression},
  } = action;

  // if there is no component/variable with the specified key, there's nothing to do
  const targetComponent = componentsMap[componentKey];
  if (!targetComponent) return;

  const updatedData = logicState.data;
  const targetValue = evaluateJsonLogic(valueExpression, updatedData);
  const currentValue: JSONValue | undefined = getIn(updatedData, componentKey);
  // isEqual is necessary for deep equality checks with Arrays and Objects
  if (isEqual(currentValue, targetValue)) return;

  if (targetValue === UNDEFINED_VALUE) {
    // when the variable is not present we do not want to have null but the specific
    // UNDEFINED_VALUE which means we have to populate the variable with its initial
    // value
    logicState.data = setIn(updatedData, componentKey, logicState.initialValues[componentKey]);
  } else {
    logicState.data = setIn(updatedData, componentKey, targetValue);
    logicState.initialValues = setIn(logicState.initialValues, componentKey, targetValue);
  }
};

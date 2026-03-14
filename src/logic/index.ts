/**
 * JSON logic evaluation helpers.
 *
 * Open Forms (through formio.js) supports logic triggers and actions that use JsonLogic
 * expressions, evaluated with the form submission (step) data. Originally,
 * json-logic-js is bundled in formio.js. A modern implementation, backed around an
 * open source ecosystem, exists in json-logic-engine - see https://github.com/json-logic.
 *
 * Ultimately the engine is not so relevant for Open Forms - interoperability between
 * the engines in the backend and the frontend is, and that's what this module provides.
 *
 * The core engine is extended with the Open Forms-specific backend extensions.
 */
import type {JSONValue} from '@open-formulieren/types';
import {LogicEngine} from 'json-logic-engine';

import {
  customAddition,
  customEquals,
  customGreaterThan,
  customGreaterThanEquals,
  customLessThan,
  customLessThanEquals,
  customMaximum,
  customMinimum,
  customNotEquals,
  customNotStrictEquals,
  customStrictEquals,
  customSubtraction,
  jsonLogicDateTime,
  jsonLogicDuration,
  jsonLogicRelativeDelta,
} from './extensions';

const engine = new LogicEngine();
engine.addMethod('datetime', jsonLogicDateTime, {deterministic: true});
engine.addMethod('rdelta', jsonLogicRelativeDelta, {deterministic: true});
engine.addMethod('duration', jsonLogicDuration, {deterministic: true});

// overrides to handle our own data types
// reference of logic builtins: https://json-logic.github.io/json-logic-engine/docs/logic
engine.addMethod('>', customGreaterThan);
engine.addMethod('>=', customGreaterThanEquals);
engine.addMethod('<', customLessThan);
engine.addMethod('<=', customLessThanEquals);
engine.addMethod('==', customEquals);
engine.addMethod('===', customStrictEquals);
engine.addMethod('!=', customNotEquals);
engine.addMethod('!==', customNotStrictEquals);
// reference of math builtins: https://json-logic.github.io/json-logic-engine/docs/math
engine.addMethod('+', customAddition);
engine.addMethod('-', customSubtraction);
engine.addMethod('max', customMaximum);
engine.addMethod('min', customMinimum);

// remove methods that are either syntactic sugar or extensions from json-logic-js, to
// prevent people accidentally using them while we don't support them in the backend.
// See https://jsonlogic.com/operations.html for the original reference.
delete engine.methods['not'];
delete engine.methods['??'];
delete engine.methods['?:'];
delete engine.methods['length'];
delete engine.methods['get'];
delete engine.methods['preserve'];
delete engine.methods['keys'];
delete engine.methods['val'];
delete engine.methods['exists'];
delete engine.methods['every'];
delete engine.methods['eachKey'];

interface EvaluationOptions {
  /**
   * Flag to opt-out of non-JSON datatype serialization.
   */
  serializeResult?: boolean;
}

/**
 * Evaluate a json logic expression with the provided data.
 *
 * By default, any result that is not a JSON data type (string, null, number, bool, list, object)
 * is serialized
 *
 * @param expression The JsonLogic expression/rule to evaluate.
 * @param data The context/input data for the rule evaluation.
 * @param serializeResult Flag to opt-out of non-JSON datatype serialization.
 */
const evaluate = (
  expression: JSONValue,
  data: JSONValue,
  {serializeResult = true}: EvaluationOptions = {}
): JSONValue => {
  // use the .run variant instead of .build & call, as this has a built-in optimizer,
  // which is well-suited to our case where we'll probably evaluate the same rule
  // multiple times.
  const result = engine.run(expression, data);
  return serializeResult ? serialize(result) : result;
};

const serialize = (value: unknown): JSONValue => {
  // avoid round trip if it's already a primitive
  if (
    typeof value == 'string' ||
    typeof value == 'boolean' ||
    typeof value == 'number' ||
    value === null
  ) {
    return value;
  }

  // otherwise do a roundtrip to JSON serialize and parse it - builtins have a toJSON
  // method that gets called in this process
  const serializedJsonString = JSON.stringify(value);
  return JSON.parse(serializedJsonString);
};

export default evaluate;

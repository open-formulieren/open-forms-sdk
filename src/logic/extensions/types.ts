import type {LogicEngine} from 'json-logic-engine';

/**
 * Signature for a (custom) method added to json-logic-endinge.
 * @see {@Link https://json-logic.github.io/json-logic-engine/docs/methods#additional-flexibility}
 */
export type JsonLogicEngineMethod<T = unknown> = (
  input: unknown[],
  context?: unknown,
  above?: unknown[],
  engine?: LogicEngine
) => T;

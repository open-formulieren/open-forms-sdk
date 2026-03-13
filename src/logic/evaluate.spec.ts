import type {JSONObject} from '@open-formulieren/types';

import evaluate from './index';

// smoke test for the public interface
test('evaluate simple logic rule expression with provided data', () => {
  const expression: JSONObject = {'+': [{var: 'foo.bar'}, {var: 'foo.baz'}]};
  const data: JSONObject = {foo: {bar: 6, baz: 7}};

  const result = evaluate(expression, data);

  expect(result).toBe(13);
});

// we don't test the core specification, per
// https://github.com/json-logic/.github/blob/22aac2a67bf07b48f952d6b0f61dfe70947d1a23/ACCEPTED_PROPOSALS.md
// this is already covered under the accepted "Respecting backwards compatibility" proposal.

test('evaluate can return unserialized results', () => {
  // @ts-expect-error someVar is not a JSON type, but we're testing the passthrough
  // behaviour here - it's not realistics input data for real usage
  const input: JSONObject = {someVar: new Date()};

  const result = evaluate({var: 'someVar'}, input, {serializeResult: false});

  expect(result).toBeInstanceOf(Date);
});

test('evaluate returns serialized results by default', () => {
  // @ts-expect-error someVar is not a JSON type, but we're testing the passthrough
  // behaviour here - it's not realistics input data for real usage
  const input: JSONObject = {someVar: new Date()};

  const result = evaluate({var: 'someVar'}, input);

  expect(typeof result).toBe('string');
});

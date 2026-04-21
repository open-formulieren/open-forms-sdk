import type {JSONObject, JSONValue} from '@open-formulieren/types';
import {describe, expect, test} from 'vitest';

import evaluate from '.';
import sharedTests from '../../../org-dotgithub/json-logic/custom-operators.json';

interface CasesGroup {
  name: string;
  // expression / input data / result
  cases: [JSONObject, JSONObject, JSONValue][];
}

for (const {name, cases} of sharedTests as CasesGroup[]) {
  describe(name, () => {
    test.each(cases)(
      `expression: %o, input: %o`,
      (expression: JSONObject, inputData: JSONObject, expectedResult: JSONValue) => {
        const result = evaluate(expression, inputData);

        expect(result).toEqual(expectedResult);
      }
    );
  });
}

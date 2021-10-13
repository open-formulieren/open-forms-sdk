import React from 'react';
import _ from 'lodash';
import {Formio} from "@formio/react";
import {iban, twoComponentForm} from './fixtures/iban';
import OpenFormsModule from "../../../formio/module";

// Use our custom components
Formio.use(OpenFormsModule);

describe('IBAN Component', () => {
  test('IBAN component validation', (done) => {
    const formJSON = _.cloneDeep(iban);

    const validValues = [
      'BR15 0000 0000 0000 1093 2840 814 P2',
      'FR76 3000 6000 0112 3456 7890 189',
      'MU43 BOMM 0101 1234 5678 9101 000 MUR',
      'BR1500000000000010932840814P2',
      'FR76-3000-6000-0112-3456-7890-189',
    ];

    const invalidValues = [
      'BR15 0000 0000 0000 1093 2840 814 00',
      'FR76 3000 6000 0112 3456 7890 000',
      'MU43 BOMM 0101 1234 5678 9101 000 MUR 00',
      'BR150000000000001093284081400',
      'FR76-3000-6000-0112-3456-7890-000',
    ];

    const testValidity = (values, valid) => {
      values.forEach((value) => {
        const element = document.createElement('div');

        Formio.createForm(element, formJSON).then(form => {
          form.setPristine(false);
          const component = form.getComponent('iban');
          const changed = component.setValue(value);
          expect(changed).toBeTruthy();

          setTimeout(() => {
            if (valid) {
              expect(!!component.error).toBeFalsy();
            } else {
              expect(!!component.error).toBeTruthy();
              expect(component.error.message).toEqual("Invalid IBAN");
            }

            if (value === invalidValues[4]) {
              done();
            }
          }, 300);
        }).catch(done);
      });
    };

    testValidity(validValues, true);
    testValidity(invalidValues, false);
  });

  test("IBAN validation not triggered by other components", (done) => {
    const formJSON = _.cloneDeep(twoComponentForm);

    const testValidity = () => {
      const element = document.createElement('div');

      Formio.createForm(element, formJSON).then(form => {
        form.setPristine(false);
        const component = form.getComponent('name');
        const changed = component.setValue('John');
        expect(changed).toBeTruthy();

        setTimeout(() => {
            expect(!!component.error).toBeFalsy();
            done();
        }, 300);
      }).catch(done);
    };

    testValidity();
  });
});

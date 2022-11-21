import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';
import LicensePlateField from 'formio/components/LicensePlateField';
import {licenseplate} from './fixtures/licenseplate';

// Use our custom components
Formio.use(OpenFormsModule);

describe('License plate Component', () => {
  test('License plate component validation', done => {
    const formJSON = _.cloneDeep(licenseplate);
    const componentSchema = LicensePlateField.schema();

    formJSON.components[0].validate.pattern = componentSchema.validate.pattern;
    formJSON.components[0].errors.pattern = componentSchema.errors.pattern;

    const validValues = ['GF-CP-51', '123-123-123', 'J-206-FV'];

    const invalidValues = ['123123123', '- - -', 'abcabcabc'];

    const testValidity = (values, valid) => {
      values.forEach(value => {
        const element = document.createElement('div');

        Formio.createForm(element, formJSON)
          .then(form => {
            form.setPristine(false);
            const component = form.getComponent('licenseplate');
            component.setValue(value);

            setTimeout(() => {
              if (valid) {
                expect(!!component.error).toBeFalsy();
              } else {
                expect(!!component.error).toBeTruthy();
                expect(component.error.message).toEqual('Invalid Dutch license plate');
              }

              if (value === invalidValues[2]) {
                done();
              }
            }, 300);
          })
          .catch(done);
      });
    };

    testValidity(validValues, true);
    testValidity(invalidValues, false);
  });
});

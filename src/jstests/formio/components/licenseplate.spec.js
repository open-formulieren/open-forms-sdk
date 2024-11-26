import _ from 'lodash';
import {Formio} from 'react-formio';

import LicensePlateField from 'formio/components/LicensePlateField';
import OpenFormsModule from 'formio/module';
import {sleep} from 'utils';

import {licenseplate} from './fixtures/licenseplate';

// Use our custom components
Formio.use(OpenFormsModule);

describe('License plate Component', () => {
  test.each([
    // valid values
    ['GF-CP-51', true],
    ['123-123-123', true],
    ['J-206-FV', true],
    // invalid values
    ['123123123', false],
    ['- - -', false],
    ['abcabcabc', false],
  ])('License plate component validation (%s, valid: %s)', async (value, valid) => {
    const formJSON = _.cloneDeep(licenseplate);
    const componentSchema = LicensePlateField.schema();

    formJSON.components[0].validate.pattern = componentSchema.validate.pattern;
    formJSON.components[0].errors.pattern = componentSchema.errors.pattern;

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('licenseplate');
    component.setValue(value);

    await sleep(300);

    if (valid) {
      expect(!!component.error).toBeFalsy();
    } else {
      expect(!!component.error).toBeTruthy();
      expect(component.error.message).toEqual('Invalid Dutch license plate');
    }
  });
});

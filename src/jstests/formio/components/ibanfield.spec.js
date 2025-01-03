import _ from 'lodash';
import {Formio} from 'react-formio';

import {sleep} from 'utils';

import {iban, twoComponentForm} from './fixtures/iban';

describe('IBAN Component', () => {
  test.each([
    // valid values
    ['BR15 0000 0000 0000 1093 2840 814 P2', true],
    ['FR76 3000 6000 0112 3456 7890 189', true],
    ['MU43 BOMM 0101 1234 5678 9101 000 MUR', true],
    ['BR1500000000000010932840814P2', true],
    ['FR76-3000-6000-0112-3456-7890-189', true],
    // invalid values
    ['BR15 0000 0000 0000 1093 2840 814 00', false],
    ['FR76 3000 6000 0112 3456 7890 000', false],
    ['MU43 BOMM 0101 1234 5678 9101 000 MUR 00', false],
    ['BR150000000000001093284081400', false],
    ['FR76-3000-6000-0112-3456-7890-000', false],
  ])('IBAN component validation (%s, valid: %s)', async (value, valid) => {
    const formJSON = _.cloneDeep(iban);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('iban');
    const changed = component.setValue(value);
    expect(changed).toBeTruthy();

    await sleep(300);

    if (valid) {
      expect(!!component.error).toBeFalsy();
    } else {
      expect(!!component.error).toBeTruthy();
      expect(component.error.message).toEqual('Invalid IBAN');
    }
  });

  test('IBAN validation not triggered by other components', async () => {
    const formJSON = _.cloneDeep(twoComponentForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('name');
    const changed = component.setValue('John');
    expect(changed).toBeTruthy();

    await sleep(300);
    expect(!!component.error).toBeFalsy();
  });
});

import _ from 'lodash';
import {Formio} from 'react-formio';

import {sleep} from 'utils';

import {timeForm} from './fixtures/time';

describe('Time Component', () => {
  it.each([
    ['09:00:00', true],
    ['10:30:00', true],
    ['11:11:11', true],
    ['17:00:00', true],
    ['17:30:00', false],
    ['08:30:00', false],
  ])('Time component with min/max time validation', async (value, valid) => {
    let formJSON = _.cloneDeep(timeForm);
    formJSON.components[0].validate.minTime = '09:00:00';
    formJSON.components[0].validate.maxTime = '17:00:00';

    const element = document.createElement('div');
    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);

    const component = form.getComponent('time');
    const changed = component.setValue(value);
    expect(changed).toBeTruthy();
    await sleep(300);
    if (valid) {
      expect(!!component.error).toBeFalsy();
    } else {
      expect(!!component.error).toBeTruthy();
      expect(component.error.message).toEqual('invalid_time');
    }
  });

  it.each(['00:00:00', '23:59:59', '11:11:11'])(
    'Time component without min/max time validation',
    async value => {
      let formJSON = _.cloneDeep(timeForm);

      const element = document.createElement('div');
      const form = await Formio.createForm(element, formJSON);
      form.setPristine(false);

      const component = form.getComponent('time');
      const changed = component.setValue(value);
      await sleep(300);

      expect(changed).toBeTruthy();
      expect(!!component.error).toBeFalsy();
    }
  );

  it.each([
    ['17:00:00', true],
    ['08:00:00', false],
  ])('Time component with only min time validation', async (value, valid) => {
    let formJSON = _.cloneDeep(timeForm);
    formJSON.components[0].validate.minTime = '09:00:00';

    const element = document.createElement('div');
    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);

    const component = form.getComponent('time');
    const changed = component.setValue(value);
    expect(changed).toBeTruthy();
    await sleep(300);
    if (valid) {
      expect(!!component.error).toBeFalsy();
    } else {
      expect(!!component.error).toBeTruthy();
      expect(component.error.message).toEqual('invalid_time');
    }
  });

  it.each([
    ['08:00:00', true],
    ['09:00:00', true],
    ['17:00:00', false],
  ])('Time component with only max time validation', async (value, valid) => {
    let formJSON = _.cloneDeep(timeForm);
    formJSON.components[0].validate.maxTime = '09:00:00';

    const element = document.createElement('div');
    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);

    const component = form.getComponent('time');
    const changed = component.setValue(value);
    expect(changed).toBeTruthy();
    await sleep(300);
    if (valid) {
      expect(!!component.error).toBeFalsy();
    } else {
      expect(!!component.error).toBeTruthy();
      expect(component.error.message).toEqual('invalid_time');
    }
  });

  it.each([
    ['09:00:00', true],
    ['00:30:00', true],
    ['01:00:00', true],
    ['08:00:00', true],
    ['02:00:00', false],
  ])(
    'Time component with min time boundary larger than max time boundary',
    async (value, valid) => {
      let formJSON = _.cloneDeep(timeForm);
      formJSON.components[0].validate.maxTime = '01:00:00';
      formJSON.components[0].validate.minTime = '08:00:00';

      const element = document.createElement('div');
      const form = await Formio.createForm(element, formJSON);
      form.setPristine(false);

      const component = form.getComponent('time');
      const changed = component.setValue(value);
      expect(changed).toBeTruthy();

      await sleep(300);
      if (valid) {
        expect(!!component.error).toBeFalsy();
      } else {
        expect(!!component.error).toBeTruthy();
        expect(component.error.message).toEqual('invalid_time');
      }
    }
  );

  test('Time component with both min/max and max > min validation and custom error', async () => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! max time {{ maxTime }}',
    };
    formJSON.components[0].validate.maxTime = '13:00:00';
    formJSON.components[0].validate.minTime = '12:00:00';

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('time');
    const changed = component.setValue('10:00');
    expect(changed).toBeTruthy();

    await sleep(300);
    expect(!!component.error).toBeTruthy();
    expect(component.error.message).toEqual('Custom error! Min time 12:00');
  });

  test('Time component with both min/max and max < min validation and custom error', async () => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! max time {{ maxTime }}',
    };
    formJSON.components[0].validate.maxTime = '01:00:00'; // One o'clock in the night of the next day
    formJSON.components[0].validate.minTime = '08:00:00';

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('time');
    const changed = component.setValue('07:00');
    expect(changed).toBeTruthy();

    await sleep(300);
    expect(!!component.error).toBeTruthy();
    expect(component.error.message).toEqual('Custom error! Min time: 08:00 Max time: 01:00.');
  });

  test('Time component with only min and custom error', async () => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! max time {{ maxTime }}',
    };
    formJSON.components[0].validate.minTime = '13:00:00';

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('time');
    const changed = component.setValue('10:00');
    expect(changed).toBeTruthy();

    await sleep(300);
    expect(!!component.error).toBeTruthy();
    expect(component.error.message).toEqual('Custom error! Min time 13:00');
  });

  test('Time component with only max and custom error', async () => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! Max time {{ maxTime }}',
    };
    formJSON.components[0].validate.maxTime = '13:00:00';

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('time');
    const changed = component.setValue('14:00');
    expect(changed).toBeTruthy();

    await sleep(300);
    expect(!!component.error).toBeTruthy();
    expect(component.error.message).toEqual('Custom error! Max time 13:00');
  });

  test('Time component with empty string error', async () => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: '',
    };
    formJSON.components[0].validate.maxTime = '13:00:00';

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('time');
    const changed = component.setValue('14:00');
    expect(changed).toBeTruthy();

    await sleep(300);
    expect(!!component.error).toBeTruthy();
    expect(component.error.message).toEqual('invalid_time');
  });
});

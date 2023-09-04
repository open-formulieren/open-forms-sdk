import _ from 'lodash';
import React from 'react';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';

import {timeForm} from './fixtures/time';

// Use our custom components
Formio.use(OpenFormsModule);

describe('Time Component', () => {
  test('Time component with min/max time validation', done => {
    let formJSON = _.cloneDeep(timeForm);
    formJSON.components[0].minTime = '09:00:00';
    formJSON.components[0].maxTime = '17:00:00';

    const validValues = ['09:00:00', '10:30:00', '11:11:11'];

    const invalidValues = ['17:00:00', '17:30:00', '08:30:00'];

    const testValidity = (values, valid) => {
      values.forEach(value => {
        const element = document.createElement('div');

        Formio.createForm(element, formJSON)
          .then(form => {
            form.setPristine(false);
            const component = form.getComponent('time');
            const changed = component.setValue(value);
            expect(changed).toBeTruthy();

            setTimeout(() => {
              if (valid) {
                expect(!!component.error).toBeFalsy();
              } else {
                expect(!!component.error).toBeTruthy();
                expect(component.error.message).toEqual('invalid_time');
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

  test('Time component without min/max time validation', done => {
    let formJSON = _.cloneDeep(timeForm);

    const validValues = ['00:00:00', '23:59:59', '11:11:11'];

    const testValidity = values => {
      values.forEach(value => {
        const element = document.createElement('div');

        Formio.createForm(element, formJSON)
          .then(form => {
            form.setPristine(false);
            const component = form.getComponent('time');
            const changed = component.setValue(value);
            expect(changed).toBeTruthy();

            setTimeout(() => {
              expect(!!component.error).toBeFalsy();

              if (value === validValues[2]) {
                done();
              }
            }, 300);
          })
          .catch(done);
      });
    };

    testValidity(validValues);
  });

  test('Time component with only min time validation', done => {
    let formJSON = _.cloneDeep(timeForm);
    formJSON.components[0].minTime = '09:00:00';

    const validValues = ['17:00:00'];

    const invalidValues = ['08:00:00'];

    const testValidity = (values, valid) => {
      values.forEach(value => {
        const element = document.createElement('div');

        Formio.createForm(element, formJSON)
          .then(form => {
            form.setPristine(false);
            const component = form.getComponent('time');
            const changed = component.setValue(value);
            expect(changed).toBeTruthy();

            setTimeout(() => {
              if (valid) {
                expect(!!component.error).toBeFalsy();
              } else {
                expect(!!component.error).toBeTruthy();
              }

              if (value === invalidValues[0]) {
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

  test('Time component with only max time validation', done => {
    let formJSON = _.cloneDeep(timeForm);
    formJSON.components[0].maxTime = '09:00:00';

    const validValues = ['08:00:00'];

    const invalidValues = ['17:00:00'];

    const testValidity = (values, valid) => {
      values.forEach(value => {
        const element = document.createElement('div');

        Formio.createForm(element, formJSON)
          .then(form => {
            form.setPristine(false);
            const component = form.getComponent('time');
            const changed = component.setValue(value);
            expect(changed).toBeTruthy();

            setTimeout(() => {
              if (valid) {
                expect(!!component.error).toBeFalsy();
              } else {
                expect(!!component.error).toBeTruthy();
              }

              if (value === invalidValues[0]) {
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

  test('Time component with min time boundary larger than max time boundary', done => {
    let formJSON = _.cloneDeep(timeForm);
    formJSON.components[0].maxTime = '01:00:00';
    formJSON.components[0].minTime = '08:00:00';

    const validValues = ['09:00:00', '00:30:00'];

    const invalidValues = ['02:00:00'];

    const testValidity = (values, valid) => {
      values.forEach(value => {
        const element = document.createElement('div');

        Formio.createForm(element, formJSON)
          .then(form => {
            form.setPristine(false);
            const component = form.getComponent('time');
            const changed = component.setValue(value);
            expect(changed).toBeTruthy();

            setTimeout(() => {
              if (valid) {
                expect(!!component.error).toBeFalsy();
              } else {
                expect(!!component.error).toBeTruthy();
              }

              if (value === invalidValues[0]) {
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

  test('Time component with both min/max and max > min validation and custom error', done => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! max time {{ maxTime }}',
    };
    formJSON.components[0].maxTime = '13:00:00';
    formJSON.components[0].minTime = '12:00:00';

    const element = document.createElement('div');

    Formio.createForm(element, formJSON)
      .then(form => {
        form.setPristine(false);
        const component = form.getComponent('time');
        const changed = component.setValue('10:00');
        expect(changed).toBeTruthy();

        setTimeout(() => {
          expect(!!component.error).toBeTruthy();
          expect(component.error.message).toEqual('Custom error! Min time: 12:00 Max time: 13:00.');

          done();
        }, 300);
      })
      .catch(done);
  });

  test('Time component with both min/max and max < min validation and custom error', done => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! max time {{ maxTime }}',
    };
    formJSON.components[0].maxTime = '01:00:00'; // One o'clock in the night of the next day
    formJSON.components[0].minTime = '08:00:00';

    const element = document.createElement('div');

    Formio.createForm(element, formJSON)
      .then(form => {
        form.setPristine(false);
        const component = form.getComponent('time');
        const changed = component.setValue('07:00');
        expect(changed).toBeTruthy();

        setTimeout(() => {
          expect(!!component.error).toBeTruthy();
          expect(component.error.message).toEqual('Custom error! Min time: 08:00 Max time: 01:00.');

          done();
        }, 300);
      })
      .catch(done);
  });

  test('Time component with only min and custom error', done => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! max time {{ maxTime }}',
    };
    formJSON.components[0].minTime = '13:00:00';

    const element = document.createElement('div');

    Formio.createForm(element, formJSON)
      .then(form => {
        form.setPristine(false);
        const component = form.getComponent('time');
        const changed = component.setValue('10:00');
        expect(changed).toBeTruthy();

        setTimeout(() => {
          expect(!!component.error).toBeTruthy();
          expect(component.error.message).toEqual('Custom error! Min time 13:00');

          done();
        }, 300);
      })
      .catch(done);
  });

  test('Time component with only max and custom error', done => {
    let formJSON = _.cloneDeep(timeForm);
    // Note: the backend dynamically updates the configuration so that `translatedErrors` are added to
    // `errors` in the correct language.
    formJSON.components[0].errors = {
      invalid_time: 'Custom error! Min time: {{ minTime }} Max time: {{ maxTime }}.',
      minTime: 'Custom error! Min time {{ minTime }}',
      maxTime: 'Custom error! Max time {{ maxTime }}',
    };
    formJSON.components[0].maxTime = '13:00:00';

    const element = document.createElement('div');

    Formio.createForm(element, formJSON)
      .then(form => {
        form.setPristine(false);
        const component = form.getComponent('time');
        const changed = component.setValue('14:00');
        expect(changed).toBeTruthy();

        setTimeout(() => {
          expect(!!component.error).toBeTruthy();
          expect(component.error.message).toEqual('Custom error! Max time 13:00');

          done();
        }, 300);
      })
      .catch(done);
  });
});

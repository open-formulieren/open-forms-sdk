import set from 'lodash/set';
import {Formio} from 'react-formio';

import MinMaxDateValidator from 'formio/validators/minMaxDateValidator';

const FormioComponent = Formio.Components.components.component;

describe('Date Component', () => {
  test('Date validator: check min date', done => {
    const component = {
      label: 'date',
      key: 'date',
      type: 'date',
      datePicker: {
        minDate: '2023-09-08',
        maxDate: null,
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {dateMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid1 = MinMaxDateValidator.check(componentInstance, {}, '2020-01-01');

    expect(isValid1).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateValidatorErrorKeys
    ).toContain('minDate');

    const isValid2 = MinMaxDateValidator.check(componentInstance, {}, '2024-01-01');

    expect(isValid2).toBeTruthy();

    done();
  });

  test('Date validator: check max date', done => {
    const component = {
      label: 'date',
      key: 'date',
      type: 'date',
      datePicker: {
        minDate: null,
        maxDate: '2023-09-08',
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {dateMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid1 = MinMaxDateValidator.check(componentInstance, {}, '2024-01-01');

    expect(isValid1).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateValidatorErrorKeys
    ).toContain('maxDate');

    const isValid2 = MinMaxDateValidator.check(componentInstance, {}, '2020-01-01');

    expect(isValid2).toBeTruthy();

    done();
  });

  test('Date validator: error message', done => {
    const component = {
      label: 'date',
      key: 'date',
      type: 'date',
      datePicker: {
        minDate: '2023-09-08',
        maxDate: null,
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {dateMinMax: true},
    };

    const mockTranslation = jest.fn((message, values) => message);

    const componentInstance = new FormioComponent(component, {}, {});
    componentInstance.t = mockTranslation;

    MinMaxDateValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[0][0]).toEqual('invalidDate');

    set(componentInstance, 'openForms.validationErrorContext.minMaxDateValidatorErrorKeys', [
      'minDate',
    ]);

    MinMaxDateValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[1][0]).toEqual('minDate');

    set(componentInstance, 'openForms.validationErrorContext.minMaxDateValidatorErrorKeys', [
      'maxDate',
    ]);

    MinMaxDateValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[2][0]).toEqual('maxDate');

    done();
  });

  test('Date validator: check max date AND min date', done => {
    const component = {
      label: 'date',
      key: 'date',
      type: 'date',
      datePicker: {
        minDate: '2023-09-01',
        maxDate: '2023-09-08',
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {dateMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid1 = MinMaxDateValidator.check(componentInstance, {}, '2024-01-01');

    expect(isValid1).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateValidatorErrorKeys
    ).toContain('maxDate');

    const isValid2 = MinMaxDateValidator.check(componentInstance, {}, '2020-01-01');

    expect(isValid2).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateValidatorErrorKeys
    ).toContain('minDate');

    done();
  });
});

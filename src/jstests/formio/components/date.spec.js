import set from 'lodash/set';
import {Formio} from 'react-formio';

import {MinMaxDateValidator} from 'formio/validators/minMaxDateAndDatetimeValidator';

const FormioComponent = Formio.Components.components.component;

describe('Date Component', () => {
  test('Date validator: check min date', () => {
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
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('minDate');

    const isValid2 = MinMaxDateValidator.check(componentInstance, {}, '2024-01-01');

    expect(isValid2).toBeTruthy();
  });

  test('Date validator: check max date', () => {
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
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('maxDate');

    const isValid2 = MinMaxDateValidator.check(componentInstance, {}, '2020-01-01');

    expect(isValid2).toBeTruthy();
  });

  test('Date validator: check max date including the current one', () => {
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

    const isValid1 = MinMaxDateValidator.check(componentInstance, {}, '2023-09-08');

    expect(isValid1).toBeTruthy();
  });

  test('Date validator: error message', () => {
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
      errors: {
        minDate: 'Custom error message for minDate',
      },
    };

    const mockTranslation = vi.fn(message => message);

    const componentInstance = new FormioComponent(component, {}, {});
    componentInstance.t = mockTranslation;
    componentInstance.options.intl = {
      formatDate: vi.fn(() => 'formatted date'),
    };

    set(
      componentInstance,
      'openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey',
      'minDate'
    );

    MinMaxDateValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[0][0]).toEqual('Custom error message for minDate');

    set(
      componentInstance,
      'openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey',
      'maxDate'
    );

    MinMaxDateValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[1][0]).toEqual('maxDate');
  });

  test('Date validator: check max date AND min date', () => {
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
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('maxDate');

    const isValid2 = MinMaxDateValidator.check(componentInstance, {}, '2020-01-01');

    expect(isValid2).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('minDate');
  });
});

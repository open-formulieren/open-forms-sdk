import set from 'lodash/set';
import {Formio} from 'react-formio';

import {MinMaxDatetimeValidator} from 'formio/validators/minMaxDateAndDatetimeValidator';

const FormioComponent = Formio.Components.components.component;

describe('Datetime Component', () => {
  test('Datetime validator: no min/max datetime', () => {
    const component = {
      label: 'datetime',
      key: 'datetime',
      type: 'datetime',
      datePicker: {
        minDate: null,
        maxDate: null,
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {datetimeMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2020-01-01T10:00:00+01:00'
    );

    expect(isValid).toBeTruthy();
  });

  test('Datetime validator: check min datetime', () => {
    const component = {
      label: 'datetime',
      key: 'datetime',
      type: 'datetime',
      datePicker: {
        minDate: '2023-01-01T10:00:00+01:00',
        maxDate: null,
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {datetimeMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid1 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2020-01-01T10:00:00+01:00'
    );

    expect(isValid1).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('minDate');

    const isValid2 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2024-01-01T10:00:00+01:00'
    );

    expect(isValid2).toBeTruthy();
  });

  test('Datetime validator: check max datetime', () => {
    const component = {
      label: 'datetime',
      key: 'datetime',
      type: 'datetime',
      datePicker: {
        minDate: null,
        maxDate: '2023-01-01T10:00:00+01:00',
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {datetimeMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid1 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2024-01-01T10:00:00+01:00'
    );

    expect(isValid1).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('maxDate');

    const isValid2 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2020-01-01T10:00:00+01:00'
    );

    expect(isValid2).toBeTruthy();
  });

  test('Datetime validator: check max datetime including the current one', () => {
    const component = {
      label: 'datetime',
      key: 'datetime',
      type: 'datetime',
      datePicker: {
        minDate: null,
        maxDate: '2023-09-08T10:00:00+01:00',
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {datetimeMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid1 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2023-09-08T10:00:00+01:00'
    );

    expect(isValid1).toBeTruthy();
  });

  test('Datetime validator: error message', () => {
    const component = {
      label: 'datetime',
      key: 'datetime',
      type: 'datetime',
      datePicker: {
        minDate: '2023-09-08T10:00:00+01:00',
        maxDate: null,
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {datetimeMinMax: true},
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

    MinMaxDatetimeValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[0][0]).toEqual('Custom error message for minDate');

    set(
      componentInstance,
      'openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey',
      'maxDate'
    );

    MinMaxDatetimeValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[1][0]).toEqual('maxDate');
  });

  test('Datetime validator: check max datetime AND min datetime', () => {
    const component = {
      label: 'datetime',
      key: 'datetime',
      type: 'datetime',
      datePicker: {
        minDate: '2023-09-01T10:00:00+01:00',
        maxDate: '2023-09-08T10:00:00+01:00',
      },
      customOptions: {
        allowInvalidPreload: true,
      },
      validate: {datetimeMinMax: true},
    };

    const componentInstance = new FormioComponent(component, {}, {});

    const isValid1 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2024-01-01T10:00:00+01:00'
    );

    expect(isValid1).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('maxDate');

    const isValid2 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2020-01-01T10:00:00+01:00'
    );

    expect(isValid2).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDateAndDatetimeValidatorErrorKey
    ).toContain('minDate');
  });
});

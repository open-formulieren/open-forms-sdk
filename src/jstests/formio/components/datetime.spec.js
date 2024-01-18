import set from 'lodash/set';
import {Formio} from 'react-formio';

import MinMaxDatetimeValidator from 'formio/validators/minMaxDatetimeValidator';

const FormioComponent = Formio.Components.components.component;

describe('Datetime Component', () => {
  test('Datetime validator: no min/max datetime', done => {
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

    done();
  });

  test('Datetime validator: check min datetime', done => {
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
      componentInstance.openForms.validationErrorContext.minMaxDatetimeValidatorErrorKeys
    ).toContain('minDatetime');

    const isValid2 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2024-01-01T10:00:00+01:00'
    );

    expect(isValid2).toBeTruthy();

    done();
  });

  test('Datetime validator: check max datetime', done => {
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
      componentInstance.openForms.validationErrorContext.minMaxDatetimeValidatorErrorKeys
    ).toContain('maxDatetime');

    const isValid2 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2020-01-01T10:00:00+01:00'
    );

    expect(isValid2).toBeTruthy();

    done();
  });

  test('Datetime validator: check max datetime including the current one', done => {
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

    done();
  });

  test('Datetime validator: error message', done => {
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
    };

    const mockTranslation = jest.fn((message, values) => message);

    const componentInstance = new FormioComponent(component, {}, {});
    componentInstance.t = mockTranslation;

    MinMaxDatetimeValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[0][0]).toEqual('invalidDatetime');

    set(componentInstance, 'openForms.validationErrorContext.minMaxDatetimeValidatorErrorKeys', [
      'minDatetime',
    ]);

    MinMaxDatetimeValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[1][0]).toEqual('minDatetime');

    set(componentInstance, 'openForms.validationErrorContext.minMaxDatetimeValidatorErrorKeys', [
      'maxDatetime',
    ]);

    MinMaxDatetimeValidator.message(componentInstance);

    expect(mockTranslation.mock.calls[2][0]).toEqual('maxDatetime');

    done();
  });

  test('Datetime validator: check max datetime AND min datetime', done => {
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
      componentInstance.openForms.validationErrorContext.minMaxDatetimeValidatorErrorKeys
    ).toContain('maxDatetime');

    const isValid2 = MinMaxDatetimeValidator.check(
      componentInstance,
      {},
      '2020-01-01T10:00:00+01:00'
    );

    expect(isValid2).toBeFalsy();
    expect(
      componentInstance.openForms.validationErrorContext.minMaxDatetimeValidatorErrorKeys
    ).toContain('minDatetime');

    done();
  });
});

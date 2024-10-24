import {electronicFormatIBAN, isValidIBAN} from 'ibantools';
import {Formio} from 'react-formio';

import {setErrorAttributes} from '../utils';

const TextField = Formio.Components.components.textfield;

const IbanValidator = {
  key: 'validate.iban',
  message(component) {
    return component.t(component.errorMessage('Invalid IBAN'), {
      field: component.errorLabel,
      data: component.data,
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    const iban = electronicFormatIBAN(value);
    return isValidIBAN(iban);
  },
};

export default class IBANField extends TextField {
  constructor(component, options, data) {
    super(component, options, data);
    this.validator.validators.iban = IbanValidator;
    this.validators.push('iban');
  }

  static schema(...extend) {
    return IBANField.schema(
      {
        type: 'iban',
        label: 'IBAN',
        key: 'iban',
        validateOn: 'blur',
      },
      ...extend
    );
  }

  get inputInfo() {
    const info = super.inputInfo;
    // apply NLDS CSS classes
    info.attr.class = [
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--openforms',
    ].join(' ');
    return info;
  }

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    // setErrorAttributes cannot be done for a `multiple` component
    // https://github.com/open-formulieren/open-forms-sdk/pull/717#issuecomment-2405060364
    if (!this.component.multiple) {
      setErrorAttributes(elements, hasErrors, hasMessages, this.refs.messageContainer.id);
    }
    return super.setErrorClasses(elements, dirty, hasErrors, hasMessages);
  }
}

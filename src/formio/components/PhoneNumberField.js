import {Formio} from 'formiojs';

import {setErrorAttributes} from '../utils';
import enableValidationPlugins from '../validators/plugins';

const PhoneNumber = Formio.Components.components.phoneNumber;

const PHONE_NUMBER_REGEX = /^[+0-9][- 0-9]+$/;

const PhoneNumberValidator = {
  key: 'validate.phoneNumber',
  message(component) {
    return component.t(component.errorMessage('Invalid Phone Number'), {
      field: component.errorLabel,
      data: component.data,
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    return PHONE_NUMBER_REGEX.test(value);
  },
};

/**
 * @deprecated - instead, use a TextField with the appropriate validators and options.
 */
class PhoneNumberField extends PhoneNumber {
  constructor(component, options, data) {
    super(component, options, data);
    this.validator.validators.phoneNumber = PhoneNumberValidator;
    this.validators.push('phoneNumber');
    enableValidationPlugins(this);
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

  checkComponentValidity(data, dirty, row, options = {}) {
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
  }
}

export default PhoneNumberField;

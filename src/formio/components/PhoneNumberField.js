import {Formio} from "formiojs";
import {applyPrefix} from "../utils";
import enableValidationPlugins from "../validators/plugins";

const PhoneNumber = Formio.Components.components.phoneNumber;


const PHONE_NUMBER_REGEX = /^\+{0,1}[- 0-9]{0,}$/;


const PhoneNumberValidator = {
  key: "validate.phoneNumber",
  message(component) {
    return component.t(component.errorMessage('Invalid Phone Number'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    return PHONE_NUMBER_REGEX.test(value);
  }
};


class PhoneNumberField extends PhoneNumber {

    constructor(component, options, data) {
      super(component, options, data);
      this.validator.validators.phoneNumber = PhoneNumberValidator;
      this.validators.push("phoneNumber");
      enableValidationPlugins(this);
    }

    get inputInfo() {
      const info = super.inputInfo;
      // change the default CSS classes
      info.attr.class = [
        applyPrefix('input'),
        'utrecht-textbox',
        'utrecht-textbox--html-input',
      ].join(' ');
      return info;
    }

  checkComponentValidity(data, dirty, row, options = {}){
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
  }
}

export default PhoneNumberField;

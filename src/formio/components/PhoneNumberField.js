import {Formio} from "formiojs";

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
    return PHONE_NUMBER_REGEX.test(value);
  }
};


class PhoneNumberField extends PhoneNumber {

    constructor(component, options, data) {
      super(component, options, data);
      this.validator.validators.phoneNumber = PhoneNumberValidator;
      this.validators.push("phoneNumber");
    }

    get inputInfo() {
      const info = super.inputInfo;
      // change the default CSS classes
      info.attr.class = 'utrecht-textbox';
      return info;
    }
}

export default PhoneNumberField;

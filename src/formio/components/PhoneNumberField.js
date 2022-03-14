import {Formio} from "formiojs";
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
      info.attr.class = 'denhaag-textfield__input';
      return info;
    }

  checkComponentValidity(data, dirty, row, options = {}){
    return super.checkComponentValidity(data, dirty, row, {...options, async: true});
  }
}

export default PhoneNumberField;

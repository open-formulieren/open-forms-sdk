import isValidBsn from "../validators/bsn";
import TextField from "./TextField";

const BsnValidator = {
  key: "validate.bsn",
  message(component) {
    return component.t(component.errorMessage('Invalid BSN'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    return isValidBsn(value.replaceAll('_', ''));
  }
};

class BsnField extends TextField {

  constructor(component, options, data) {
    super(component, options, data);
    // Override mask validator check since we want to do
    // the validation in our own custom validator
    this.validator.validators.mask.check = () => true;
    this.validator.validators.bsn = BsnValidator;
    this.validators.push("bsn");
  }

  static schema(...extend) {
    return TextField.schema({
        type: 'bsn',
        label: 'BSN',
        key: 'bsn',
        inputMask: '999999999',
    }, ...extend);
  }
}

export default BsnField;

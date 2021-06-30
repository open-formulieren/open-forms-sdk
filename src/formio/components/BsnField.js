import {Formio} from "react-formio";
import {applyPrefix, isValidBsn} from "../utils";

const TextField = Formio.Components.components.textfield;

const BsnValidator = {
  key: "validate.bsn",
  hasLabel: true,
  message(component) {
    return component.t(component.errorMessage('Invalid BSN'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (value.replaceAll('_', '').length === 9) {
      return isValidBsn(value);
    }
    return true;
  }
};

class BsnField extends TextField {
  static schema(...extend) {
    return TextField.schema({
        type: 'bsn',
        label: 'BSN',
        key: 'bsn',
        inputMask: '999999999',
    }, ...extend);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }

  init() {
        super.init();
        // Override mask validator check since we want to do
        // the validation in our own custom validator
        this.validator.validators.mask.check = () => true;
        this.validator.validators.custom = BsnValidator;
    }
}

export default BsnField;

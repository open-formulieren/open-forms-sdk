import {Formio} from "react-formio";
import {applyPrefix} from "../utils";

const TextField = Formio.Components.components.textfield;

const MaskValidator = {
  key: "inputMask",
  hasLabel: true,
  message(component) {
    return component.t(component.errorMessage(''), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    return true;
  }
};

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
      return false;
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
    info.attr.class = applyPrefix('iban');
    return info;
  }

  init() {
        super.init();
        this.validator.validators.mask = MaskValidator;
        this.validator.validators.custom = BsnValidator;
    }
}

export default BsnField;

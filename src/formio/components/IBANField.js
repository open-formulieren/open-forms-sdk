import {Formio} from "react-formio";
import {applyPrefix} from "../utils";
import {electronicFormatIBAN, isValidIBAN} from "ibantools";

const TextField = Formio.Components.components.textfield;

const IbanValidator = {
  key: "validate.iban",
  hasLabel: true,
  message(component) {
    return component.t(component.errorMessage('Invalid IBAN'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    const iban = electronicFormatIBAN(value);
    return isValidIBAN(iban);
  }
};

export default class IBANField extends TextField {
  static schema(...extend) {
    return IBANField.schema({
        type: 'iban',
        label: 'IBAN',
        key: 'iban',
        validate: {
          custom: true,
        }
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
    if(this.component.validate.custom){
      // The validator is called when the field is changed
      this.validator.validators["custom"] = IbanValidator;
    }
  }
}

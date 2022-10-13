import {Formio} from "react-formio";
import {applyPrefix} from "../utils";
import {electronicFormatIBAN, isValidIBAN} from "ibantools";

const TextField = Formio.Components.components.textfield;

const IbanValidator = {
  key: "validate.iban",
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

  constructor(component, options, data) {
    super(component, options, data);
    this.validator.validators.iban = IbanValidator;
    this.validators.push("iban");
  }

  static schema(...extend) {
    return IBANField.schema({
        type: 'iban',
        label: 'IBAN',
        key: 'iban',
        validateOn: 'blur',
    }, ...extend);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('iban'),
      'utrecht-textbox',
      'utrecht-textbox--html-input',
    ].join(' ');
    return info;
  }
}

import {Formio} from "react-formio";
import {applyPrefix} from "../utils";

const NumberField = Formio.Components.components.number;

class BsnField extends NumberField {
  static schema(...extend) {
    return BsnField.schema({
        type: 'bsn',
        label: 'BSN',
        key: 'bsn',
    }, ...extend);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('iban');
    return info;
  }
}

export default BsnField;

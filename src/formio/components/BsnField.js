import {Formio} from "react-formio";
import {applyPrefix} from "../utils";

const TextField = Formio.Components.components.textfield;

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
}

export default BsnField;

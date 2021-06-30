import {Formio} from "react-formio";
import {applyPrefix} from "../utils";

const TextField = Formio.Components.components.textfield;

class PostcodeField extends TextField {
  static schema(...extend) {
    return TextField.schema({
        type: 'postcode',
        label: 'Postcode',
        key: 'postcode',
        inputMask: '9999 AA'
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
        // Override mask validator check since we don't need
        // to show validation error
        this.validator.validators.mask.check = () => true;
    }
}

export default PostcodeField;

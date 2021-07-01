import {Formio} from "react-formio";
import {applyPrefix} from "../utils";

const TextField = Formio.Components.components.textfield;


class PostcodeField extends TextField {
  static schema(...extend) {
    return TextField.schema({
        type: 'postcode',
        label: 'Postcode',
        key: 'postcode',
        inputMask: '9999 AA',
        validateOn: 'blur',
        validate: {
          customMessage: 'Invalid Postcode'
        }
    }, ...extend);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }
}

export default PostcodeField;

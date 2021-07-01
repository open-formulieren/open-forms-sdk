import {Formio} from "react-formio";
import {applyPrefix} from "../utils";
import {POSTCODE_REGEX} from "../constants";

const TextField = Formio.Components.components.textfield;

const PostcodeValidator = {
  key: "validate.postcode",
  hasLabel: true,
  message(component) {
    return component.t(component.errorMessage('Invalid Postcode'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    return POSTCODE_REGEX.test(value);
  }
};


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
        // Override mask validator check since we want to
        // do our own validation
        this.validator.validators.mask.check = () => true;
        this.validator.validators.custom = PostcodeValidator;
    }
}

export default PostcodeField;

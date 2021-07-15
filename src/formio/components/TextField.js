import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';
import {post} from "../../api";

const {REACT_APP_BASE_API_URL} = process.env;

const KvkNumberValidator = {
  key: "validate.kvkNumber",
  message(component) {
    return component.t(component.errorMessage('Invalid Kvk Number'), {
      field: component.errorLabel,
      data: component.data
    });
  },
  check(component, setting, value) {
    if (!value) {
      return true;
    }
    post(`${REACT_APP_BASE_API_URL}validation/plugins/kvk-kvkNumber`, {value: value})
      .then(response => {
        console.log('response.data.isValid: ' + response.data.isValid);
        return response.data.isValid;
      })
      .catch(error => console.log(error));
  }
};

/**
 * Extend the default text field to modify it to our needs.
 */
class TextField extends Formio.Components.components.textfield {

  constructor(component, options, data) {
    super(component, options, data);
    // Access plugin validators with
    // this.component.validate.plugins;
    this.validator.validators.kvkNumber = KvkNumberValidator;
    this.validators.push("kvkNumber");
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }
}


export default TextField;

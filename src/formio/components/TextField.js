import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

import { KvkNumberValidator, RsinValidator, BranchNumberValidator} from "../validators/kvk";


/**
 * Extend the default text field to modify it to our needs.
 */
class TextField extends Formio.Components.components.textfield {

  constructor(component, options, data) {
    super(component, options, data);
    for (let plugin of this.component.validate.plugins) {
      if (plugin === 'kvk-kvkNumber') {
        this.validator.validators.kvkNumber = KvkNumberValidator;
        this.validators.push("kvkNumber");
      }
      if (plugin === 'kvk-rsin') {
        this.validator.validators.rsin = RsinValidator;
        this.validators.push("rsin");
      }
      if (plugin === 'kvk-branchNumber') {
        this.validator.validators.branchNumber = BranchNumberValidator;
        this.validators.push("branchNumber");
      }
    }
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }
}


export default TextField;

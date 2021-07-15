import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';
import KvkValidatorMapping from "../validators/kvk";

/**
 * Extend the default text field to modify it to our needs.
 */
class Number extends Formio.Components.components.number {

  constructor(component, options, data) {
    super(component, options, data);
    for (let plugin of this.component.validate.plugins) {
      this.validator.validators[plugin] = KvkValidatorMapping[plugin];
      this.validators.push(plugin);
    }
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }
}


export default Number;

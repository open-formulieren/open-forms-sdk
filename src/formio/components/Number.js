import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

import PluginValidatorMapping from "../validators/plugins";

/**
 * Extend the default text field to modify it to our needs.
 */
class Number extends Formio.Components.components.number {

  constructor(component, options, data) {
    super(component, options, data);
    if (Array.isArray(this.component.validate.plugins)) {
      for (let plugin of this.component.validate.plugins) {
        const validator = PluginValidatorMapping[plugin];
        if (validator !== undefined) {
          this.component.validateOn = 'blur';
          this.validator.validators[plugin] = validator;
          this.validators.push(plugin);
        } else {
          console.warn(`Could not find validator for plugin: ${plugin}. Validation not added.`);
        }
      }
    }
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }

  checkComponentValidity(data, dirty, row, options = {}){
    return super.checkComponentValidity(data, dirty, row, {...options, async: true});
  }
}


export default Number;

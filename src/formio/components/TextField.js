import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

import PluginValidatorMapping from "../validators/plugins";


/**
 * Extend the default text field to modify it to our needs.
 */
class TextField extends Formio.Components.components.textfield {

  constructor(component, options, data) {
    super(component, options, data);
    if (this.component.validate.plugins && this.component.validate.plugins.isArray()) {
      for (let plugin of this.component.validate.plugins) {
        const validator = PluginValidatorMapping[plugin];
        if (validator !== undefined) {
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
}


export default TextField;

import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

import enableValidationPlugins from "../validators/plugins";

/**
 * Extend the default text field to modify it to our needs.
 */
class Number extends Formio.Components.components.number {

  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('input'),
      'utrecht-textbox',
      'utrecht-textbox--html-input',
    ].join(' ');
    return info;
  }

  checkComponentValidity(data, dirty, row, options = {}){
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
  }
}


export default Number;

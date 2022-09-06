import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


/**
 * Extend the default checkbox field to modify it to our needs.
 */
class Checkbox extends Formio.Components.components.checkbox {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('checkbox__input'),
      'utrecht-custom-checkbox',
      'utrecht-custom-checkbox--html-input',
    ].join(' ');
    return info;
  }
}


export default Checkbox;

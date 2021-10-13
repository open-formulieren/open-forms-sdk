import { Formio } from '@formio/react';

import { applyPrefix } from '../utils';


/**
 * Extend the default checkbox field to modify it to our needs.
 */
class Checkbox extends Formio.Components.components.checkbox {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('checkbox__input');
    return info;
  }
}


export default Checkbox;

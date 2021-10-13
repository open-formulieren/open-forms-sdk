import { Formio } from '@formio/react';

import { applyPrefix } from '../utils';


/**
 * Extend the default radio field to modify it to our needs.
 */
class Radio extends Formio.Components.components.radio {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('checkbox__input');
    return info;
  }
}


export default Radio;

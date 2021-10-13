import { Formio } from '@formio/react';

import { applyPrefix } from '../utils';


/**
 * Extend the default button field to modify it to our needs.
 */
class Button extends Formio.Components.components.button {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('button');
    return info;
  }
}


export default Button;

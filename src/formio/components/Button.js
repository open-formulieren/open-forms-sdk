import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


/**
 * Extend the default text field to modify it to our needs.
 */
class Button extends Formio.Components.components.textarea {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('button');
    return info;
  }
}


export default Button;

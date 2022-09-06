import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


/**
 * Extend the default password field to modify it to our needs.
 */
class Password extends Formio.Components.components.password {
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
}


export default Password;

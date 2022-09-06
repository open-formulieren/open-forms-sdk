import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


/**
 * Extend the default email field to modify it to our needs.
 */
class Email extends Formio.Components.components.email {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('email'),
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--email',
    ].join(' ');
    return info;
  }
}


export default Email;

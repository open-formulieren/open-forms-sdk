import { Formio } from '@formio/react';

import { applyPrefix } from '../utils';


/**
 * Extend the default email field to modify it to our needs.
 */
class Email extends Formio.Components.components.email {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('email');
    return info;
  }
}


export default Email;

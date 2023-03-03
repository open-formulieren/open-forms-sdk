import {Formio} from 'react-formio';

import {applyPrefix} from '../utils';

/**
 * Extend the default password field to modify it to our needs.
 */
class Password extends Formio.Components.components.password {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [applyPrefix('input'), 'utrecht-textbox', 'utrecht-textbox--html-input'].join(
      ' '
    );
    return info;
  }

  getView(value, options) {
    // In Formio they use '--- PROTECTED ---' which then somewhere gets stripped out
    return '*'.repeat(value.length);
  }
}

export default Password;

import {Formio} from 'react-formio';

import {setErrorAttributes} from '../utils';

/**
 * Extend the default password field to modify it to our needs.
 *
 * @deprecated - no real world usage has come up, password input will be removed in 2.0
 */
class Password extends Formio.Components.components.password {
  get inputInfo() {
    const info = super.inputInfo;
    // apply NLDS CSS classes
    info.attr.class = [
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--openforms',
    ].join(' ');
    return info;
  }

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    setErrorAttributes(elements, hasErrors, hasMessages, this.element);
    return super.setErrorClasses(elements, dirty, hasErrors, hasMessages);
  }
}

export default Password;

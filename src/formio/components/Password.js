import {Formio} from 'react-formio';

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
}

export default Password;

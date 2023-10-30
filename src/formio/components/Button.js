import {Formio} from 'react-formio';

/**
 * Extend the default button field to modify it to our needs.
 */
class Button extends Formio.Components.components.button {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = 'utrecht-button utrecht-button--secondary-action';
    return info;
  }
}

export default Button;

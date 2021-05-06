import { Formio } from 'react-formio';


/**
 * Extend the default text field to modify it to our needs.
 */
class TextField extends Formio.Components.components.textfield {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = 'openforms-input';
    return info;
  }
}


export default TextField;

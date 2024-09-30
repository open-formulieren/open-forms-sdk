import {Formio} from 'react-formio';

import {setErrorAttributes} from '../utils';
import './Checkbox.scss';

/**
 * Extend the default checkbox field to modify it to our needs.
 */
class Checkbox extends Formio.Components.components.checkbox {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      'utrecht-custom-checkbox',
      'utrecht-custom-checkbox--html-input',
      'utrecht-custom-checkbox--openforms',
      'utrecht-form-field__input',
    ].join(' ');
    return info;
  }

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    setErrorAttributes(elements, hasErrors, hasMessages, this.element);
    return super.setErrorClasses(elements, dirty, hasErrors, hasMessages);
  }
}

export default Checkbox;

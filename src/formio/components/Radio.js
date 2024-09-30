import {Formio} from 'react-formio';

import {setErrorAttributes} from '../utils';

/**
 * Extend the default radio field to modify it to our needs.
 */
class Radio extends Formio.Components.components.radio {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      'utrecht-radio-button',
      'utrecht-radio-button--html-input',
      'utrecht-form-field__input',
    ].join(' ');
    return info;
  }

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    setErrorAttributes(elements, hasErrors, hasMessages, this.element);
    return super.setErrorClasses(elements, dirty, hasErrors, hasMessages);
  }
}

export default Radio;

import {Formio} from 'react-formio';

import 'components/forms/RadioField/RadioField.scss';

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
}

export default Radio;

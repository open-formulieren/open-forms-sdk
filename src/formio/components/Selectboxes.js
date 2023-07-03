import {Formio} from 'react-formio';

import './Checkbox.scss';

/**
 * Extend the default selectboxes field to modify it to our needs.
 */
class Selectboxes extends Formio.Components.components.selectboxes {
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
}

export default Selectboxes;

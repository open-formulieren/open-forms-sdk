import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


/**
 * Extend the default radio field to modify it to our needs.
 */
class Radio extends Formio.Components.components.radio {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('checkbox__input'),
      'utrecht-radio-button',
      'utrecht-radio-button--html-input',
    ].join(' ');
    return info;
  }
}


export default Radio;

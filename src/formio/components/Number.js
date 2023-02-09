import { Formio } from 'react-formio';
import { maskInput } from 'vanilla-text-mask';

import { applyPrefix } from '../utils';

import enableValidationPlugins from "../validators/plugins";

/**
 * Extend the default text field to modify it to our needs.
 */
class Number extends Formio.Components.components.number {

  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }

  checkComponentValidity(data, dirty, row, options = {}){
    return super.checkComponentValidity(data, dirty, row, {...options, async: true});
  }

  // Issue OF#1351
  // Taken from Formio https://github.com/formio/formio.js/blob/v4.13.13/src/components/number/Number.js#L112
  // Modified for the case where negative numbers are allowed.
  setInputMask(input) {
    let numberPattern = '';
    if (this.component.allowNegative) {
      numberPattern += '-*';
    }
    numberPattern += '[0-9';
    numberPattern += this.decimalSeparator || '';
    numberPattern += this.delimiter || '';
    numberPattern += ']*';

    input.setAttribute('pattern', numberPattern);
    input.mask = maskInput({
      inputElement: input,
      mask: this.numberMask,
      shadowRoot: this.root ? this.root.shadowRoot : null,
    });
  }
}


export default Number;

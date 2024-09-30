import {maskInput} from '@formio/vanilla-text-mask';
import {set} from 'lodash';
import {Formio} from 'react-formio';

import {setErrorAttributes} from '../utils';
import enableValidationPlugins from '../validators/plugins';

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
    // apply NLDS CSS classes
    info.attr.class = [
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--openforms',
    ].join(' ');
    return info;
  }

  checkComponentValidity(data, dirty, row, options = {}) {
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
  }

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    setErrorAttributes(elements, hasErrors, hasMessages, this.element);
    return super.setErrorClasses(elements, dirty, hasErrors, hasMessages);
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

  // Overwrite Formio method because of issue OF#2903
  set dataValue(value) {
    if (
      !this.allowData ||
      !this.key ||
      (!this.visible && this.component.clearOnHide && !this.rootPristine)
    ) {
      return;
    }
    // Issue 2903 - make it possible to set the value to null. Otherwise, the user cannot clear the
    // value of a number/currency field if it has already been saved.
    if (value === undefined) {
      this.unset();
      return;
    }

    value = this.hook('setDataValue', value, this.key, this._data);
    set(this._data, this.key, value);
  }

  // Inheritance of getter/setter: since we have overwritten the setter, we must define a
  // getter or the property 'dataValue' will always return undefined
  get dataValue() {
    return super.dataValue;
  }
}

export default Number;

import {Formio} from 'react-formio';

import {applyPrefix, setErrorAttributes} from '../utils';

/**
 * Extend the default select field to modify it to our needs.
 */
class Select extends Formio.Components.components.select {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [applyPrefix('select'), 'utrecht-select', 'utrecht-select--html-select'].join(
      ' '
    );
    return info;
  }

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    const inputClone = this.element.querySelector('input:not([type="hidden"])');
    const targetElements = inputClone ? [inputClone] : [];
    setErrorAttributes(targetElements, hasErrors, hasMessages, this.refs.messageContainer.id);
    return super.setErrorClasses(targetElements, dirty, hasErrors, hasMessages);
  }
}

export default Select;

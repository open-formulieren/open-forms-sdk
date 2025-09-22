import {Formio} from 'react-formio';

import {setErrorAttributes} from '../utils';

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

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    setErrorAttributes(elements, hasErrors, hasMessages, this.refs.messageContainer.id);
    return super.setErrorClasses(elements, dirty, hasErrors, hasMessages);
  }

  checkComponentValidity(data, dirty, rowData, options) {
    // check if we need to skip validation before calling isValid
    // base on the fix in formio upstream https://github.com/formio/formio.js/pull/5280
    // commit - https://github.com/formio/formio.js/commit/3c73460a1da638d4a5107e7141c1486e69c07692
    if (!this.shouldSkipValidation(data, dirty, rowData)) {
      return super.checkComponentValidity(data, dirty, rowData, options);
    }
  }
}

export default Selectboxes;

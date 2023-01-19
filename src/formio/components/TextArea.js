import {Formio} from 'react-formio';

import {applyPrefix, escapeHtml} from '../utils';

/**
 * Extend the default text field to modify it to our needs.
 */
class TextArea extends Formio.Components.components.textarea {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('textarea'),
      'utrecht-textarea',
      'utrecht-textarea--html-textarea',
    ].join(' ');
    return info;
  }

  renderElement(value, index) {
    // security issue #19 - self XSS if the contents are not escaped and formio ends
    // up rendering the unsanitized content. As a workaround, we apply the escaping
    // ourselves.
    // See also the Input.renderElement that _does_ escaping of quotes (as the value
    // there is injected between double quotes rather than just somewhere in the DOM).
    const sanitizedValue = escapeHtml(value);
    return super.renderElement(sanitizedValue, index);
  }
}

export default TextArea;

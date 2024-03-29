import {Formio} from 'react-formio';

import {escapeHtml} from '../utils';

/**
 * Extend the default text field to modify it to our needs.
 */
class TextArea extends Formio.Components.components.textarea {
  get inputInfo() {
    const info = super.inputInfo;
    // apply NLDS CSS classes
    info.attr.class = [
      'utrecht-textarea',
      'utrecht-textarea--html-textarea',
      'utrecht-textarea--openforms',
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

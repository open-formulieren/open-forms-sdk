import {Formio} from 'react-formio';

import {escapeHtml, setErrorAttributes} from '../utils';

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

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    // setErrorAttributes cannot be done for a `multiple` component
    // https://github.com/open-formulieren/open-forms-sdk/pull/717#issuecomment-2405060364
    if (!this.component.multiple) {
      setErrorAttributes(elements, hasErrors, hasMessages, this.refs.messageContainer.id);
    }
    return super.setErrorClasses(elements, dirty, hasErrors, hasMessages);
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

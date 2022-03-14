import {Formio} from 'react-formio';

/**
 * Extend the default text field to modify it to our needs.
 */
class TextArea extends Formio.Components.components.textarea {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = 'denhaag-textarea__input';
    return info;
  }
}


export default TextArea;

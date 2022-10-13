import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


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
}


export default TextArea;

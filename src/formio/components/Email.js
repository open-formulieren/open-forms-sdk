import {Formio} from 'react-formio';

import {applyPrefix} from '../utils';

/**
 * Extend the default email field to modify it to our needs.
 */
class Email extends Formio.Components.components.email {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('email'),
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--email',
    ].join(' ');
    return info;
  }

  restoreCaretPosition() {
    if (!this.root?.currentSelection || !this.refs.input?.length) return;

    const {index} = this.root.currentSelection;
    let input = this.refs.input[index];

    if (!input) {
      input = this.refs.input[this.refs.input.length];
    }

    // Issue #2909 - setSelectionRange does not work for inputs of type email.
    // So, we first change the input type ...
    input.setAttribute('type', 'text');

    // ... then we move the cursor back to the end of the input ...
    const lastCharacter = input.value?.length || 0;
    input.setSelectionRange(lastCharacter, lastCharacter);

    // ... and we finally restore the type to email.
    input.setAttribute('type', 'email');
  }
}

export default Email;

import {Formio} from 'react-formio';

import {setErrorAttributes} from '../utils';

/**
 * Extend the default email field to modify it to our needs.
 */
class Email extends Formio.Components.components.email {
  get inputInfo() {
    const info = super.inputInfo;
    // apply NLDS CSS classes
    info.attr.class = [
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--email',
      'utrecht-textbox--openforms',
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

  attach(element) {
    this.loadRefs(element, {
      verifyButton: 'multiple',
    });
    return super.attach(element);
  }

  attachElement(element, index) {
    const promise = super.attachElement(element, index);

    const verifyButton = this.refs.verifyButton[index];
    this.addEventListener(verifyButton, 'click', () => {
      const key = this.component.key;
      const email = this.getValueAt(index) || '';
      const callback = this.options.ofContext?.verifyEmailCallback;
      if (callback) callback({key, email});
    });

    return promise;
  }
}

export default Email;

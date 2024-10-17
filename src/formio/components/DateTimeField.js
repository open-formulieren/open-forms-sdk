import {Formio} from 'react-formio';

import {MinMaxDatetimeValidator} from 'formio/validators/minMaxDateAndDatetimeValidator';

import {setErrorAttributes} from '../utils';

const DateTimeFormio = Formio.Components.components.datetime;

class DateTimeField extends DateTimeFormio {
  constructor(component, options, data) {
    super(component, options, data);

    if (component.datePicker.minDate || component.datePicker.maxDate) {
      component.validate.datetimeMinMax = true;
    }

    this.validators.push('datetimeMinMax');
    this.validator.validators['datetimeMinMax'] = MinMaxDatetimeValidator;
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

  setErrorClasses(elements, dirty, hasErrors, hasMessages) {
    const inputClone = this.element.querySelector('input:not([type="hidden"])');
    const targetElements = inputClone ? [inputClone] : [];

    // setErrorAttributes cannot be done for a `multiple` component
    // https://github.com/open-formulieren/open-forms-sdk/pull/717#issuecomment-2405060364
    if (!this.component.multiple) {
      setErrorAttributes(targetElements, hasErrors, hasMessages, this.refs.messageContainer.id);
    }
    return super.setErrorClasses(targetElements, dirty, hasErrors, hasMessages);
  }

  get suffix() {
    // Don't show an icon
    return null;
  }
}

export default DateTimeField;

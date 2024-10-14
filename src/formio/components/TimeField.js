import {Formio} from 'react-formio';

import MinMaxTimeValidator from 'formio/validators/MinMaxTimeValidator';

import {setErrorAttributes} from '../utils';

const Time = Formio.Components.components.time;

class TimeField extends Time {
  constructor(component, options, data) {
    super(component, options, data);

    this.validator.validators['timeMinMax'] = MinMaxTimeValidator;
    this.validators.push('time');
    this.validators.push('timeMinMax');
  }

  get suffix() {
    // Don't show an icon
    return null;
  }

  get inputInfo() {
    const info = super.inputInfo;
    // apply NLDS CSS classes
    info.attr.class = [
      'utrecht-textbox',
      'utrecht-textbox--html-input',
      'utrecht-textbox--openforms',
      'utrecht-textbox--openforms-time',
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

  getStringAsValue(value) {
    const result = super.getStringAsValue(value);
    if (result === 'Invalid date') return value;

    return result;
  }

  getValueAsString(value) {
    const result = super.getValueAsString(value);
    if (result === 'Invalid date') return value;

    return result;
  }
}

export default TimeField;

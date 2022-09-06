import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


const DateTimeField = Formio.Components.components.datetime;


const extractDate = (value) => {
  if (!value) {
    // multiple values has null instead of empty str
    return ""
  }
  return value.substring(0, 10);
}


class DateField extends DateTimeField {

    get suffix() {
      // Don't show an icon
      return null;
    }

    get inputInfo() {
      const info = super.inputInfo;
      // change the default CSS classes
      info.attr.class = [
        applyPrefix('input'),
        'utrecht-textbox',
        'utrecht-textbox--html-input',
      ].join(' ')
      return info;
    }

    beforeSubmit() {
      // The field itself should prevent any invalid dates from being passed in
      // so we are not checking that here
      if (this._data[this.component.key]) {
        let currentValue = this._data[this.component.key];
        // normalize to list
        if (!this.component.multiple) currentValue = [currentValue];

        // strip off the time part
        currentValue = currentValue.map(val => extractDate(val));

        // format back to single/multiple
        if (!this.component.multiple) currentValue = currentValue[0];

        // assign back to internal data structure
        this._data[this.component.key] = currentValue;
      }
      super.beforeSubmit();
    }

}


export default DateField;

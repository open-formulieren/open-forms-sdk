import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


const DateTimeField = Formio.Components.components.datetime;


class DateField extends DateTimeField {

    get suffix() {
      // Don't show an icon
      return null;
    }

    get inputInfo() {
      const info = super.inputInfo;
      // change the default CSS classes
      info.attr.class = applyPrefix('input');
      return info;
    }

    beforeSubmit() {
      // The field itself should prevent any invalid dates from being passed in
      // so we are not checking that here
      if (this._data[this.component.key]) {
        // Strip time off the datetime
        // This value should be in iso format but we are casting to a Date just to be sure
        this._data[this.component.key] = new Date(this._data[this.component.key]).toISOString().substring(0, 10);
      }
      super.beforeSubmit();
    }

}


export default DateField;

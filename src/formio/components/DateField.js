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
        // Strip time off the iso datetime
        this._data[this.component.key] = this._data[this.component.key].substring(0, 10);
      }
      super.beforeSubmit();
    }

}


export default DateField;

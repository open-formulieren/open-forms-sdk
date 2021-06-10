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
      // Strip time off the datetime
      this._data[this.component.key] = this._data[this.component.key].split('T')[0];
      super.beforeSubmit();
    }

}


export default DateField;

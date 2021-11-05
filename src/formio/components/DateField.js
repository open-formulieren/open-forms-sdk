import { Formio } from 'react-formio';

const DateTimeField = Formio.Components.components.datetime;


class DateField extends DateTimeField {

    get suffix() {
      // Don't show an icon
      return null;
    }

    get inputInfo() {
      const info = super.inputInfo;
      // change the default CSS classes
      info.attr.class = 'utrecht-textbox';
      return info;
    }

    beforeSubmit() {
      // The field itself should prevent any invalid dates from being passed in
      // so we are not checking that here
      if (this._data[this.component.key]) {
        // Strip time off the iso datetime string
        this._data[this.component.key] = this._data[this.component.key].substring(0, 10);
      }
      super.beforeSubmit();
    }

}


export default DateField;

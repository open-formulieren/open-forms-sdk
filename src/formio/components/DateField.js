import {Formio} from 'react-formio';

import {MinMaxDateValidator} from 'formio/validators/minMaxDateAndDatetimeValidator';

const DateTimeField = Formio.Components.components.datetime;

const extractDate = value => {
  if (!value) {
    // multiple values has null instead of empty str
    return '';
  }
  return value.substring(0, 10);
};

class DateField extends DateTimeField {
  constructor(component, options, data) {
    // GH#5240
    // override the date format of the calendar widget to always emit dates instead
    // of datetimes so that backend validation doesn't choke on datetimes when dates
    // are expected.
    if (!component.customOptions) {
      component.customOptions = {allowInvalidPreload: true};
    }
    component.customOptions.dateFormat = 'yyyy-MM-dd';
    super(component, options, data);

    if (component.datePicker.minDate || component.datePicker.maxDate) {
      component.validate.dateMinMax = true;
    }

    this.validators.push('dateMinMax');
    this.validator.validators['dateMinMax'] = MinMaxDateValidator;
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
    ].join(' ');
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

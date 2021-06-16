import {Formio} from "react-formio";
import {applyPrefix} from "../utils";

const DateTime = Formio.Components.components.datetime;


export default class Time24hField extends DateTime {
  static schema(...extend) {
    return DateTime.schema({
      type: 'time24h',
      label: 'Time',
      key: 'time24h',
      format: 'HH:mm',
      useLocaleSettings: false,
      allowInput: true,
      enableDate: false,
      enableTime: true,
      defaultValue: '',
      defaultDate: '',
      displayInTimezone: 'viewer',
      timezone: '',
      datepickerMode: 'day',
      datePicker: {
        showWeeks: true,
        startingDay: 0,
        initDate: '',
        minMode: 'day',
        maxMode: 'year',
        yearRows: 4,
        yearColumns: 5,
        minDate: null,
        maxDate: null
      },
      timePicker: {
        hourStep: 1,
        minuteStep: 1,
        showMeridian: false,
        readonlyInput: false,
        mousewheel: true,
        arrowkeys: true
      },
    customOptions: {},
    }, ...extend);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('time24h');
    return info;
  }
}

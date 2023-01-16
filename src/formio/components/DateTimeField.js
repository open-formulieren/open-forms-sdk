import {Formio} from 'react-formio';

import {applyPrefix} from 'formio/utils';

const DateTimeFormio = Formio.Components.components.datetime;

class DateTimeField extends DateTimeFormio {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [applyPrefix('input'), 'utrecht-textbox', 'utrecht-textbox--html-input'].join(
      ' '
    );
    return info;
  }

  get suffix() {
    // Don't show an icon
    return null;
  }
}

export default DateTimeField;

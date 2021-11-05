import {Formio} from 'react-formio';
import MinMaxTimeValidator from 'formio/validators/MinMaxTimeValidator';

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
    // change the default CSS classes
    info.attr.class = 'utrecht-textbox';
    return info;
  }
}


export default TimeField;

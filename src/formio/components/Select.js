import isObject from 'lodash/isObject';
import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

/**
 * Extend the default select field to modify it to our needs.
 */
class Select extends Formio.Components.components.select {

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = [
      applyPrefix('select'),
      'utrecht-select',
      'utrecht-select--html-select',
    ].join(' ');
    return info;
  }

  setValue(value, flags = {}) {
    // check if it's an appointment config field
    if ( this.component?.appointments != null ) {
      // beforeSubmit converts the combination (value, label) into an object, which is
      // stored in the backend as {"identifier": value, "name": label}. So, when data
      // from the backend is loaded, we convert this back into the original format to
      // make sure the select understands the value and displays the label instead of
      // just a blank value.
      if (isObject(value) && value.identifier) {
        value = value.identifier;
      } else {
        // check if the value is still available, if not -> clear it
        if (this.component.appointments.showTimes) {
          // reserved times are no longer available in the option list, and then formio
          // injects an option with label = value, which is ISO-8601 format. This does
          // not look good for end-users, so we just drop the value alltogether. The end
          // user is changing the appointment anyway, so at the least they would be changing
          // the time, possibly the date or location/product even which all reset the time
          // field anyway.
          const option = this.selectOptions.find(opt => opt.value === value);
          if (option == null) {
            value = '';
          }
        }
      }
    }
    return super.setValue(value, flags);
  }

  beforeSubmit() {
    // TODO: check if we can solve this via getOptionValue method instead of monkey-patching
    // state. See also https://github.com/open-formulieren/open-forms/issues/682 which
    // might help put the options in the React state, giving easy access to display logic
    // in the summary page.
    // UPDATE - this is required because on the summary page, all the Formio instances
    // have been destroyed and are no longer available.
    if (this.component?.appointments?.showProducts || this.component?.appointments?.showLocations) {
      // For these two types of components we need to send both the identifier and name to the backend
      const value = this.getValue();
      const selectedOption = this.selectOptions.find(option => option.value === value);
      if (selectedOption) {
        const formattedValue = {identifier: selectedOption.value, name: selectedOption.label};
        // bypass events etc. (which this.setValue(...) calls!)
        this.dataValue = formattedValue;
      }
    }
    super.beforeSubmit();
  }
}


export default Select;

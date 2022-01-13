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
    info.attr.class = applyPrefix('select');
    return info;
  }

  setValue(value, flags = {}) {
    // check if it's an appointment config field
    if ( this.component?.appointments != null ) {
      if (isObject(value) && value.identifier) {
        value = value.identifier;
      } else {
        // check if the value is still available, if not -> clear it
        if (this.component.appointments.showTimes) {
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

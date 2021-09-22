import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

/**
 * Extend the default select field to modify it to our needs.
 */
class Select extends Formio.Components.components.select {
  constructor(component, options, data) {
    super(component, options, data);

    // setting the widget to html5 instead of null ensures that the select gets rendered,
    // instead of the whole wrapper that replaces the <select> element (and messes with styling).
    // We're deliberately forcing this, as we have dysfunctional styles for anything else.
    this.component.widget = 'html5';
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('select');
    return info;
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

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
}


export default Select;

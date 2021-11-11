import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

/**
 * Extend the default text field to modify it to our needs.
 */
class Currency extends Formio.Components.components.currency {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = 'utrecht-textbox';
    return info;
  }
}


export default Currency;

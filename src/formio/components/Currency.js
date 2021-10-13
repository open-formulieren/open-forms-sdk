import { Formio } from '@formio/react';

import { applyPrefix } from '../utils';

/**
 * Extend the default text field to modify it to our needs.
 */
class Currency extends Formio.Components.components.currency {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }
}


export default Currency;

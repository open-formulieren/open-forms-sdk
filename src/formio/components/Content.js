import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

/**
 * Extend the default text field to modify it to our needs.
 */
class Content extends Formio.Components.components.content {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }
}


export default Content;

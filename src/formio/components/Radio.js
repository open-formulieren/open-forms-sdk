import { Formio } from 'react-formio';

/**
 * Extend the default radio field to modify it to our needs.
 */
class Radio extends Formio.Components.components.radio {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = "denhaag-radio__input";
    return info;
  }
}


export default Radio;

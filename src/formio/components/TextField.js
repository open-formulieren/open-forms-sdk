import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';
import { get } from '../../api';
import enableValidationPlugins from "../validators/plugins";


const POSTCODE_REGEX = /^[0-9]{4}\s?[a-zA-Z]{2}$/;
const HOUSE_NUMBER_REGEX = /^\d+$/;


/**
 * Extend the default text field to modify it to our needs.
 */
class TextField extends Formio.Components.components.textfield {

  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);
  }

  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('input');
    return info;
  }

  checkComponentValidity(data, dirty, row, options = {}){
    return super.checkComponentValidity(data, dirty, row, {...options, async: true});
  }

  setLocationData(postcode, house_number, key) {
    get(`${this.options.baseUrl}location/get-street-name-and-city`, {postcode, house_number})
      .then(result => {
        if (result[key]) {
          this.setValue(result[key]);
        } else {
          this.setValue('');
        }
      })
      .catch(error => console.log(error));
  }

  handleSettingLocationData(data) {
    const isValidHouseNumber = HOUSE_NUMBER_REGEX.test(data[this.component.deriveHouseNumber]);
    const isValidPostcode = POSTCODE_REGEX.test(data[this.component.derivePostcode]);

    // Fill data if it is not set yet or if the field is readonly (i.e. Formio's disabled).
    // Unrelated to the HTML 'disabled' attribute.
    // See #1717 and #1832 - we only want to make API calls if there is useful work to
    // be done.
    const mayAutofillValue = !this.getValue() || this.component.disabled;
    if (!mayAutofillValue) {
      return;
    }

    if (isValidHouseNumber && isValidPostcode) {
      if (this.component.deriveStreetName) {
        this.setLocationData(
          data[this.component.derivePostcode],
          data[this.component.deriveHouseNumber],
          'streetName'
        );
      }
      if (this.component.deriveCity) {
        this.setLocationData(
          data[this.component.derivePostcode],
          data[this.component.deriveHouseNumber],
          'city'
        );
      }
    }
  }

  fieldLogic(data, row) {
    const changed = super.fieldLogic(data, row);
    this.handleSettingLocationData(data);
    return changed;
  }
}


export default TextField;

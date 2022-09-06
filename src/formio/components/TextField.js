import { Formio } from 'react-formio';
import debounce from 'lodash/debounce';

import { applyPrefix } from '../utils';
import { get } from '../../api';
import enableValidationPlugins from "../validators/plugins";


const POSTCODE_REGEX = /^[0-9]{4}\s?[a-zA-Z]{2}$/;
const HOUSE_NUMBER_REGEX = /^\d+$/;

const LOCATION_AUTOCOMPLETE_DEBOUNCE = 200;

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
    info.attr.class = [
      applyPrefix('input'),
      'utrecht-textbox',
      'utrecht-textbox--html-input',
    ].join(' ');
    return info;
  }

  checkComponentValidity(data, dirty, row, options = {}){
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
  }

  /**
   * Return a debounced method to look up and autocomplete the location data.
   */
  get setLocationData() {
    if (!this._debouncedSetLocationData) {
      this._debouncedSetLocationData = debounce((postcode, house_number, key) => {
        get(`${this.options.baseUrl}location/get-street-name-and-city`, {postcode, house_number})
          .then(result => {
            if (result[key]) {
              this.setValue(result[key]);
            } else {
              this.setValue('');
            }
          })
          .catch(console.error);
        }, LOCATION_AUTOCOMPLETE_DEBOUNCE);
    } else {
      this._debouncedSetLocationData.cancel();
    }
    return this._debouncedSetLocationData;
  }

  handleSettingLocationData(data) {
    const isValidHouseNumber = HOUSE_NUMBER_REGEX.test(data[this.component.deriveHouseNumber]);
    const isValidPostcode = POSTCODE_REGEX.test(data[this.component.derivePostcode]);

    if (isValidHouseNumber && isValidPostcode) {
      // Fill data if it is not set yet or if the field is readonly (i.e. Formio's disabled).
      // Unrelated to the HTML 'disabled' attribute.
      // See also #1832 for how this can lead to way too many API calls.
      const mayAutofillValue = !this.getValue() || this.component.disabled;
      if (!mayAutofillValue) {
        return;
      }

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

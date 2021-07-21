import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';

import enableValidationPlugins from "../validators/plugins";


import {get} from "../../api";

const {REACT_APP_BASE_API_URL} = process.env;


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
    get(`${REACT_APP_BASE_API_URL}location/get-street-name-and-city`, {postcode, house_number})
      .then(result => {
        this.setValue(result[key] || '');
      })
      .catch(error => console.log(error));

  }

  fieldLogic(data, row) {
    if (data.postcode && data.houseNumber) {
      if (this.component.key === 'streetName' || this.component.key === 'city') {
        this.setLocationData(data.postcode, data.houseNumber, this.component.key);
      }
    }
  }
}


export default TextField;

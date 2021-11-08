import { Formio } from 'react-formio';

const FormioMultivalue = Formio.Components.components.multivalue;

function addValue(value) {
  if (value === undefined) {
    value = this.component.defaultValue ?
    this.component.defaultValue : this.emptyValue;
    // If default is an empty array, default back to empty value.
    if (Array.isArray(value) && value.length === 0) {
      value = this.emptyValue;
    }
  }
  let dataValue = Array.isArray(this.dataValue) ? [...this.dataValue] : [this.dataValue];

  if (Array.isArray(value)) {
    dataValue = dataValue.concat(value);
  }
  else {
    dataValue.push(value);
  }
  this.dataValue = dataValue;
}

function splice(index) {
  if (this.hasValue()) {
    let dataValue = Array.isArray(this.dataValue) ? [...this.dataValue] : [this.dataValue];
    if (dataValue.hasOwnProperty(index)) {
      dataValue.splice(index, 1);
      this.dataValue = dataValue;
      this.triggerChange();
    }
  }
}


class Multivalue extends FormioMultivalue {
  addNewValue(value) {
    addValue.call(this, value);
  }

  splice(index) {
    splice.call(this, index);
  }
}


Object.assign(
  FormioMultivalue.prototype,
  {
    addNewValue: function (value) {
      return addValue.call(this, value);
    },
    splice: function (index) {
      return splice.call(this, index);
    }
  }
);



export default Multivalue;


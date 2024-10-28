import {Formio} from 'react-formio';

const FormioContentField = Formio.Components.components.content;

class SoftRequiredErrors extends FormioContentField {
  static schema(...extend) {
    return FormioContentField.schema(
      {
        type: 'softRequiredErrors',
        key: 'softRequiredErrors',
        label: '', // not displayed anyway
      },
      ...extend
    );
  }

  constructor(component, options, data) {
    component.refreshOnChange = true;
    super(component, options, data);
  }

  get content() {
    const missingFieldLabels = ['Foo', 'Bar'];

    if (!missingFieldLabels.length) return '';

    const missingFieldsMarkup = this.renderTemplate('missingFields', {labels: missingFieldLabels});
    return this.interpolate(this.component.html, {
      missingFields: missingFieldsMarkup,
    });
  }
}

export default SoftRequiredErrors;

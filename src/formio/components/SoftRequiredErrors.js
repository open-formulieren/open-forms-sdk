import FormioUtils from 'formiojs/utils';
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
    // figure out which components use soft required validation
    const softRequiredComponents = [];
    FormioUtils.eachComponent(this.root.components, component => {
      if (component.component.openForms?.softRequired) {
        softRequiredComponents.push(component);
      }
    });

    const missingFieldLabels = [];
    // check which components have an empty value
    for (const component of softRequiredComponents) {
      const isEmpty = component.isEmpty();
      if (isEmpty) missingFieldLabels.push(component.label);
    }

    if (!missingFieldLabels.length) return '';

    const missingFieldsMarkup = this.renderTemplate('missingFields', {labels: missingFieldLabels});
    const content = this.interpolate(this.component.html, {
      missingFields: missingFieldsMarkup,
    });

    return `<div id="${this.id}-content">${content}</div>`;
  }
}

export default SoftRequiredErrors;

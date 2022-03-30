import {Formio} from 'react-formio';

const Field = Formio.Components.components.field;


export default class DMNEvaluation extends Field {
  static schema(...extend) {
    return Field.schema({
      type: 'dmn',
      label: 'DMN Evaluation',
      key: 'dmn',
      input: false,
      dmn: {
          engine: '',
          decisionDefinition: '',
          decisionDefinitionVersion: '',
          resultDisplayTemplate: '',
          resultDisplay: '',  // evaluated resultDisplayTemplate after the DMN table was evaluated
      },
    }, ...extend);
  }

  get defaultSchema() {
    return DMNEvaluation.schema();
  }

  render() {
    return super.render(this.renderTemplate('dmn'));
  }

  // dirty hack to transform the defaultValue into the actual value so that it's available for
  // further processing. Technically the end-user can spoof this!
  get hasInput() {
    return true;
  }

  attach(element) {
    this.setPristine(false);
    this.updateValue(this.component.defaultValue);
    return super.attach(element);
  }
}

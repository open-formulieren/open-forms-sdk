import React from 'react';
import ReactDOM from 'react-dom';
import {Formio} from 'react-formio';
import { IntlProvider } from 'react-intl';

import { applyPrefix } from '../utils';
import CoSignReact from 'components/CoSign';

const Field = Formio.Components.components.field;

export default class CoSign extends Field {
  static schema(...extend) {
      return Field.schema({
          label: 'Co-sign',
          type: 'coSign',
          authPlugin: 'digid', // default
          input: false,
      }, ...extend);
  }

  render() {
    return super.render(
      `<div ref="element">
        <div ref="coSignContainer" class="${applyPrefix('co-sign')}">
          <!-- React managed -->
        </div>
      </div>`
    );
  }

  /**
   * Defer to React to actually render things - this keeps components DRY.
   * @param  {[type]} element [description]
   * @return {[type]}     [description]
   */
  attach(element) {
    this.loadRefs(element, {
      coSignContainer: 'single',
    });
    return super
      .attach(element)
      .then(() => this.renderReact());
  }

  destroy() {
    const container = this.refs.coSignContainer;
    container && ReactDOM.unmountComponentAtNode(container);
    super.destroy();
  }

  renderReact() {
    const container = this.refs.coSignContainer;
    // no container node ready (yet), defer to next render cycle
    if (!container) return;

    ReactDOM.render(
      <IntlProvider {...this.options.intl}>
        <CoSignReact
          authPlugin={this.component.authPlugin}
          baseUrl={this.options.baseUrl}
          form={this.options.form}
          submissionUuid={this.options.submissionUuid}
        />
      </IntlProvider>,
      container,
    );
  }
}

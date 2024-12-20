import React from 'react';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {IntlProvider} from 'react-intl';

import {ConfigContext} from 'Context';
import CoSignReact from 'components/CoSign';

import {applyPrefix} from '../utils';

const Field = Formio.Components.components.field;

export default class CoSignOld extends Field {
  static schema(...extend) {
    return Field.schema(
      {
        label: 'Co-sign',
        type: 'coSign',
        authPlugin: 'digid', // default
        input: false,
      },
      ...extend
    );
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
    return super.attach(element).then(() => {
      this.reactRoot = createRoot(this.refs.coSignContainer);
      this.renderReact();
    });
  }

  destroy() {
    const container = this.refs.coSignContainer;
    container && this.reactRoot.unmount();
    super.destroy();
  }

  renderReact() {
    const container = this.refs.coSignContainer;
    // no container node ready (yet), defer to next render cycle
    if (!container) return;

    const {form, submissionUuid, saveStepData} = this.options.ofContext;

    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider value={{baseUrl: this.options.baseUrl}}>
          <CoSignReact
            authPlugin={this.component.authPlugin}
            form={form}
            submissionUuid={submissionUuid}
            saveStepData={saveStepData}
          />
        </ConfigContext.Provider>
      </IntlProvider>
    );
  }
}

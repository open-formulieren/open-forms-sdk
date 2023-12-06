/**
 * A form widget to select a location on a Leaflet map.
 */
import {Formik} from 'formik';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {FormattedMessage, IntlProvider} from 'react-intl';

import {ConfigContext} from 'Context';
import {TextField} from 'components/forms';

const Field = Formio.Components.components.field;

export default class AddressNL extends Field {
  static schema(...extend) {
    return Field.schema(
      {
        type: 'addressNL',
        label: 'Address NL',
        key: 'addressNL',
      },
      ...extend
    );
  }

  static get builderInfo() {
    return {
      title: 'Address NL',
      icon: 'home',
      weight: 500,
      schema: AddressNL.schema(),
    };
  }

  get defaultSchema() {
    return AddressNL.schema();
  }

  get emptyValue() {
    return {
      postcode: '',
      houseNumber: '',
      houseLetter: '',
      houseNumberAddition: '',
    };
  }

  validateMultiple() {
    return false;
  }

  render() {
    return super.render(
      `<div ref="element">
        ${this.renderTemplate('addressNL')}
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
      addressNLContainer: 'single',
    });
    return super.attach(element).then(() => {
      this.reactRoot = createRoot(this.refs.addressNLContainer);
      this.renderReact();
    });
  }

  destroy() {
    const container = this.refs.addressNLContainer;
    container && this.reactRoot.unmount();
    super.destroy();
  }

  onMarkerSet(newLatLng) {
    this.setValue(newLatLng, {modified: true});
  }

  renderReact() {
    const required = AddressNL.schema().validate.required;
    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider value={{baseUrl: this.options.baseUrl}}>
          <Formik initialValues={this.emptyValue}>
            <>
              <div className="openforms-columns">
                <div className="column column--span-6 openforms-form-field-container">
                  <TextField
                    name="postcode"
                    label={
                      <FormattedMessage
                        description="Label for addressNL postcode input"
                        defaultMessage="Postcode"
                      />
                    }
                    placeholder="1234AB"
                    isRequired={required}
                  />
                </div>
                <div className="column column--span-6 openforms-form-field-container">
                  <TextField
                    name="houseNumber"
                    label={
                      <FormattedMessage
                        description="Label for addressNL houseNumber input"
                        defaultMessage="House number"
                      />
                    }
                    isRequired={required}
                  />
                </div>
              </div>
              <div className="openforms-columns">
                <div className="column column--span-6 openforms-form-field-container">
                  <TextField
                    name="houseLetter"
                    label={
                      <FormattedMessage
                        description="Label for addressNL houseLetter input"
                        defaultMessage="Houser letter"
                      />
                    }
                  />
                </div>
                <div className="column column--span-6 openforms-form-field-container">
                  <TextField
                    name="houseNumberAddition"
                    label={
                      <FormattedMessage
                        description="Label for addressNL houseNumberAddition input"
                        defaultMessage="House number addition"
                      />
                    }
                  />
                </div>
              </div>
            </>
          </Formik>
        </ConfigContext.Provider>
      </IntlProvider>
    );
  }

  setValue(value, flags = {}) {
    const changed = super.setValue(value, flags);
    // re-render if the value is set, which may be because of existing submission data
    changed && this.renderReact();
    return changed;
  }
}

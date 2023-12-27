/**
 * A form widget to select a location on a Leaflet map.
 */
import {Formik, useFormikContext} from 'formik';
import FormioUtils from 'formiojs/utils';
import {isEqual} from 'lodash';
import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {FormattedMessage, IntlProvider} from 'react-intl';

import {ConfigContext} from 'Context';
import {TextField} from 'components/forms';

import enableValidationPlugins from '../validators/plugins';

const Field = Formio.Components.components.field;

export default class AddressNL extends Field {
  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);
  }

  static schema(...extend) {
    return Field.schema(
      {
        type: 'addressNL',
        label: 'Address NL',
        input: true,
        key: 'addressNL',
        defaultValue: {},
        validateOn: 'blur',
        openForms: {
          checkIsEmptyBeforePluginValidate: true,
        },
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

  get inputInfo() {
    const info = super.elementInfo();
    // Hide the input element
    info.attr.type = 'hidden';
    return info;
  }

  checkComponentValidity(data, dirty, row, options = {}) {
    let updatedOptions = {...options};
    if (this.component.validate.plugins && this.component.validate.plugins.length) {
      updatedOptions.async = true;
    }
    return super.checkComponentValidity(data, dirty, row, updatedOptions);
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

  onFormikChange(value) {
    this.updateValue(value, {modified: true});

    // we can shortcuts-skip validation if the subkeys that should be present aren't,
    // validating that (probably?) doesn't make any sense.
    // TODO: perhaps we need to wire up a client-side validator for this though, since
    // if the component as a whole is required, so are these keys.
    if (!value.postcode || !value.houseNumber) return;

    // `enableValidationPlugins` forces the component to be validateOn = 'blur', which
    // surpresses the validators due to onChange events.
    // Since this is a composite event, we need to fire the blur event ourselves and
    // schedule the validation to run.
    // Code inspired on Formio.js' `src/components/_classes/input/Input.js`, in
    // particular the `addFocusBlurEvents` method.
    //
    // XXX: this can be improved upon if we can relay formik focus/blur state to the
    // formio component, but it seems like the events are sufficiently debounced already
    // through some manual testing.
    this.root.pendingBlur = FormioUtils.delay(() => {
      this.emit('blur', this);
      if (this.component.validateOn === 'blur') {
        this.root.triggerChange(
          {fromBlur: true},
          {
            instance: this,
            component: this.component,
            value: this.dataValue,
            flags: {fromBlur: true},
          }
        );
      }
      this.root.focusedComponent = null;
      this.root.pendingBlur = null;
    });
  }

  renderReact() {
    const required = this.component?.validate?.required || false;
    const initialValue = {...this.emptyValue, ...this.dataValue};

    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider
          value={{
            baseUrl: this.options.baseUrl,
            requiredFieldsWithAsterisk: this.options.evalContext.requiredFieldsWithAsterisk,
          }}
        >
          <Formik
            initialValues={initialValue}
            validate={values => {
              const errors = {};
              if (required) {
                if (!values.postcode) errors.postcode = 'Required';
                if (!values.houseNumber) errors.houseNumber = 'Required';
              }
              return errors;
            }}
          >
            <FormikAddress
              required={required}
              formioValues={initialValue}
              setFormioValues={this.onFormikChange.bind(this)}
            />
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

const FormikAddress = ({required, formioValues, setFormioValues}) => {
  const {values} = useFormikContext();

  useEffect(() => {
    if (!isEqual(values, formioValues)) {
      setFormioValues(values);
    }
  });

  return (
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
  );
};

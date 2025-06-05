/**
 * The partners component.
 */
import {Formik} from 'formik';
import debounce from 'lodash/debounce';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {IntlProvider} from 'react-intl';

import {ConfigContext} from 'Context';
import enableValidationPlugins from 'formio/validators/plugins';

import PartnersForm from './PartnersForm';

const Field = Formio.Components.components.field;

export default class Partners extends Field {
  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);
  }

  static schema(...extend) {
    return Field.schema({
      type: 'partners',
      label: 'Partners',
      key: 'partners',
      input: true,
      defaultValue: [],
      ...extend,
    });
  }

  static get builderInfo() {
    return {
      title: 'Partners',
      icon: 'users',
      group: 'custom_special',
      weight: 300,
      schema: Partners.schema(),
    };
  }

  get defaultSchema() {
    return Partners.schema();
  }

  get emptyValue() {
    return [];
  }

  getValue() {
    return this.dataValue;
  }

  setValue(value, flags = {}) {
    if (!value) {
      value = [];
    }

    const changed = super.setValue(value, flags);

    // re-render if the value is set, which may be because of existing submission data
    // and redraw because otherwise the template is not re-evaluated and we always get
    // the button to add a partner
    if (changed) {
      this.renderReact();
      this.redraw();
    }

    return changed;
  }

  isEmpty() {
    return !this.dataValue || this.dataValue?.length === 0;
  }

  destroy() {
    const container = this.refs.partnersContainer;
    if (!this.component?.hidden && container) this.reactRoot.unmount();
    super.destroy();
  }

  onFormikChange(value) {
    this.updateValue(value, {modified: true});

    // `enableValidationPlugins` forces the component to be validateOn = 'blur', which
    // surpresses the validators due to onChange events.
    // Since this is a composite event, we need to fire the blur event ourselves and
    // schedule the validation to run.
    // Code inspired on Formio.js' `src/components/_classes/input/Input.js`, in
    // particular the `addFocusBlurEvents` method.
    //
    if (this.component.validateOn === 'blur') {
      if (this._debouncedBlur) {
        this._debouncedBlur.cancel();
      }

      this._debouncedBlur = debounce(() => {
        this.root.triggerChange(
          {fromBlur: true},
          {
            instance: this,
            component: this.component,
            value: this.dataValue,
            flags: {fromBlur: true},
          }
        );
      }, 50);

      this._debouncedBlur();
    }
  }

  render() {
    return super.render(
      `<div ref="element">
          ${this.renderTemplate('partners', this.renderContext)}
        </div>`
    );
  }

  openPartnerModal(partner = null) {
    const key = this.component.key;
    const callback = this.options?.ofContext?.addPartnerCallback;

    if (!callback) return;

    callback({
      key,
      partner,
      onSave: newPartner => {
        if (!partner) {
          // new partner
          newPartner.__addedManually = true;
          this.setValue([newPartner], {modified: true});
        } else {
          // editing an existing partner (only manually added ones)
          const updatedPartner = {
            ...partner,
            ...newPartner,
            __addedManually: true,
          };
          this.setValue([updatedPartner], {modified: true});
        }

        this.renderReact();
      },
    });
  }

  attach(element) {
    this.loadRefs(element, {
      partnersContainer: 'single',
      addPartnerButton: 'single',
      editPartnerButton: 'single',
    });

    if (this.refs.addPartnerButton) {
      this.addEventListener(this.refs.addPartnerButton, 'click', () => {
        this.openPartnerModal();
      });
    }

    if (this.refs.editPartnerButton) {
      this.addEventListener(this.refs.editPartnerButton, 'click', () => {
        const partner = this.dataValue?.[0];
        if (partner?.__addedManually) {
          this.openPartnerModal(partner);
        }
      });
    }

    return super.attach(element).then(() => {
      if (!this.component?.hidden) {
        this.reactRoot = createRoot(this.refs.partnersContainer);
        this.renderReact();
      }
    });
  }

  renderReact() {
    if (this.component?.hidden) {
      return;
    }

    const initialValues = this.dataValue?.length ? this.dataValue : this.emptyValue;

    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider
          value={{
            baseUrl: this.options.baseUrl,
            requiredFieldsWithAsterisk: this.options.evalContext.requiredFieldsWithAsterisk,
            component: this.component,
          }}
        >
          <Formik initialValues={initialValues} enableReinitialize>
            <PartnersForm setFormioValues={this.onFormikChange.bind(this)} />
          </Formik>
        </ConfigContext.Provider>
      </IntlProvider>
    );
  }
}

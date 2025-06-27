/**
 * The partners component.
 */
import debounce from 'lodash/debounce';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {IntlProvider} from 'react-intl';

import {ConfigContext} from 'Context';
import enableValidationPlugins from 'formio/validators/plugins';

import {AddPartnerModal} from './AddPartnerModal';
import {PartnersComponent} from './PartnersForm';

const Field = Formio.Components.components.field;

export default class Partners extends Field {
  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);

    this.state = {
      isPartnerModalOpen: false,
      partnerBeingEdited: null,
    };
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
    if (changed) {
      this.renderReact();
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
    this.state.isPartnerModalOpen = true;
    this.state.partnerBeingEdited = partner;
    this.renderReact();
  }

  closePartnerModal() {
    this.state.isPartnerModalOpen = false;
    this.state.partnerBeingEdited = null;
    this.renderReact();
  }

  handlePartnerSave(newPartner) {
    const updated = [{...newPartner, __addedManually: true}];

    this.updateValue(updated, {modified: true});
  }

  attach(element) {
    this.loadRefs(element, {
      partnersContainer: 'single',
    });

    return super.attach(element).then(() => {
      if (!this.component?.hidden) {
        this.reactRoot = createRoot(this.refs.partnersContainer);
        this.renderReact();
      }
    });
  }

  renderReact() {
    if (this.component?.hidden || !this.reactRoot) return;

    const values = this.dataValue || [];
    const manuallyAddedPartner = values.find(p => p?.__addedManually);
    const hasNoPartners = values.length === 0;

    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider
          value={{
            baseUrl: this.options.baseUrl,
            requiredFieldsWithAsterisk: this.options.evalContext.requiredFieldsWithAsterisk,
            component: this.component,
          }}
        >
          <PartnersComponent
            partners={values}
            onFormikChange={this.onFormikChange.bind(this)}
            hasNoPartners={hasNoPartners}
            manuallyAddedPartner={manuallyAddedPartner}
            onAddPartner={() => this.openPartnerModal()}
            onEditPartner={() => this.openPartnerModal(manuallyAddedPartner)}
          />

          <AddPartnerModal
            isOpen={this.state.isPartnerModalOpen}
            partner={this.state.partnerBeingEdited}
            closeModal={() => this.closePartnerModal()}
            onSave={this.handlePartnerSave.bind(this)}
          />
        </ConfigContext.Provider>
      </IntlProvider>
    );
  }
}

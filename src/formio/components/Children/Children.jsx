/**
 * The children component.
 */
import debounce from 'lodash/debounce';
import {createRoot} from 'react-dom/client';
import {Formio} from 'react-formio';
import {IntlProvider} from 'react-intl';

import {ConfigContext} from 'Context';
import enableValidationPlugins from 'formio/validators/plugins';

import AddChildModal from './AddChildModal';
import {ChildrenComponent} from './ChildrenForm';

const Field = Formio.Components.components.field;

export default class Children extends Field {
  constructor(component, options, data) {
    super(component, options, data);
    enableValidationPlugins(this);

    this.state = {
      isChildModalOpen: false,
      childBeingEdited: null,
    };
  }

  static schema(...extend) {
    return Field.schema({
      type: 'children',
      label: 'Children',
      key: 'children',
      input: true,
      defaultValue: [],
      ...extend,
    });
  }

  static get builderInfo() {
    return {
      title: 'Children',
      icon: 'children',
      group: 'custom_special',
      weight: 300,
      schema: Children.schema(),
    };
  }

  get defaultSchema() {
    return Children.schema();
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

    // Normalize each child to ensure `__addedManually` is always a boolean.
    // The key `selected` should be a boolean only when the enableSelection from the
    // component configuration is set to True (otherwise should be null).
    // Both are used to track the added/selected children by the user.
    const allowSelection = this.component.enableSelection === true;
    value = value.map(child => ({
      ...child,
      selected:
        typeof child.selected === 'boolean' ? child.selected : allowSelection ? false : null,
      __addedManually: typeof child.__addedManually === 'boolean' ? child.__addedManually : false,
      __id: child.__id ?? crypto.randomUUID(),
    }));

    const changed = super.setValue(value, flags);

    // Re-render if the value was actually changed
    if (changed) {
      this.renderReact();
    }

    return changed;
  }

  isEmpty() {
    return !this.dataValue || this.dataValue?.length === 0;
  }

  destroy() {
    const container = this.refs.childrenContainer;
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
          ${this.renderTemplate('children', this.renderContext)}
        </div>`
    );
  }

  openChildModal(child = null) {
    this.state.isChildModalOpen = true;
    this.state.childBeingEdited = child;
    this.renderReact();
  }

  closeChildModal() {
    this.state.isChildModalOpen = false;
    this.state.childBeingEdited = null;
    this.renderReact();
  }

  handleChildSave(newChild) {
    const childExists = newChild.__addedManually === true && newChild.__id;
    const oldChild = this.state.childBeingEdited;

    let updated;
    if (childExists) {
      // Update the existing child
      updated = this.dataValue.map(child =>
        child.__id === oldChild.__id ? {...child, ...newChild} : child
      );
    } else {
      // Add the new child to the ones already added by the user
      updated = [
        ...this.dataValue,
        {...newChild, __addedManually: true, __id: crypto.randomUUID()},
      ];
    }

    this.updateValue(updated, {modified: true});
  }

  checkComponentValidity(data, dirty, row) {
    this.setCustomValidity('', data);

    // Check for duplicate BSNs
    const bsnSet = new Set();
    for (const child of this.dataValue) {
      if (bsnSet.has(child.bsn)) {
        this.setCustomValidity(this.t('Multiple children share the same BSN number'), data);
        return false;
      }
      bsnSet.add(child.bsn);
    }

    return super.checkComponentValidity(data, dirty, row);
  }

  handleChildRemoval(childToRemove) {
    const removalConfirmed = window.confirm(
      this.t('Are you sure you want to remove child with BSN: "{{bsn}}"?', {bsn: childToRemove.bsn})
    );

    if (!removalConfirmed) return;

    const newValue = this.dataValue.filter(child => child.__id !== childToRemove.__id);
    this.updateValue(newValue);
    this.renderReact();
  }

  toggleChildSelection(childId) {
    this.dataValue = this.dataValue.map(child => {
      if (child.__id === childId) {
        return {...child, selected: child.selected === null ? true : !child.selected};
      }
      return child;
    });

    this.updateValue(this.dataValue);
    this.renderReact();
  }

  attach(element) {
    this.loadRefs(element, {
      childrenContainer: 'single',
    });

    return super.attach(element).then(() => {
      if (!this.component?.hidden) {
        this.reactRoot = createRoot(this.refs.childrenContainer);
        this.renderReact();
      }
    });
  }

  renderReact() {
    if (this.component?.hidden || !this.reactRoot) return;

    const values = this.dataValue || [];
    const manuallyAddedChild = values.find(c => c?.__addedManually);
    const hasNoChildren = values.length === 0;

    this.reactRoot.render(
      <IntlProvider {...this.options.intl}>
        <ConfigContext.Provider
          value={{
            baseUrl: this.options.baseUrl,
            requiredFieldsWithAsterisk: this.options.evalContext.requiredFieldsWithAsterisk,
            component: this.component,
          }}
        >
          <ChildrenComponent
            childrenValues={values}
            onFormikChange={this.onFormikChange.bind(this)}
            hasNoChildren={hasNoChildren}
            enableCreation={hasNoChildren || manuallyAddedChild}
            enableSelection={this.component.enableSelection}
            onAddChild={() => this.openChildModal()}
            onEditChild={childToEdit => this.openChildModal(childToEdit)}
            onRemoveChild={childToRemove => this.handleChildRemoval(childToRemove)}
            toggleChildSelection={childId => this.toggleChildSelection(childId)}
          />

          <AddChildModal
            childValues={this.state.childBeingEdited}
            isOpen={this.state.isChildModalOpen}
            closeModal={() => this.closeChildModal()}
            onSave={this.handleChildSave.bind(this)}
          />
        </ConfigContext.Provider>
      </IntlProvider>
    );
  }
}

import {Formio} from 'react-formio';

import {applyPrefix} from 'utils';

const FormioEditGrid = Formio.Components.components.editgrid;

const EditRowState = {
  New: 'new',
  Editing: 'editing',
  Saved: 'saved',
  Viewing: 'viewing',
  Removed: 'removed',
  Draft: 'draft',
};

class EditGrid extends FormioEditGrid {
  get inputInfo() {
    const info = super.inputInfo;
    // change the default CSS classes
    info.attr.class = applyPrefix('editgrid');
    return info;
  }

  renderRow(row, rowIndex) {
    // Taken from Formio: https://github.com/formio/formio.js/blob/4.13.x/src/components/editgrid/EditGrid.js#L430
    // Overwritten so that we can use a custom template for each collapsed row
    const dataValue = this.dataValue;
    if (this.isOpen(row)) {
      return this.renderComponents(row.components);
    } else {
      const flattenedComponents = this.flattenComponents(rowIndex);

      return this.renderTemplate('editgridrow', {
        row: dataValue[rowIndex] || {},
        data: this.data,
        rowIndex,
        components: this.component.components,
        flattenedComponents,
        displayValue: component => this.displayComponentValue(component),
        isVisibleInRow: component => this.isComponentVisibleInRow(component, flattenedComponents),
        getView: (component, data) => {
          const instance = flattenedComponents[component.key];
          const view = instance ? instance.getView(data || instance.dataValue) : '';

          // If there is an html tag in view, don't allow it to be injected in template
          const htmlTagRegExp = new RegExp('<(.*?)>');
          return typeof view === 'string' &&
            view.length &&
            !instance.component?.template &&
            htmlTagRegExp.test(view)
            ? `<input type="text" value="${view.replace(/"/g, '&quot;')}" readonly/>`
            : view;
        },
        state: this.editRows[rowIndex].state,
        t: this.t.bind(this),
      });
    }
  }

  // shouldValidateDraft and shouldValidateRow are copied from Formio, because when calling validateRow, 'this' seems
  // to only have methods defined on Component and not EditGrid
  shouldValidateDraft(editRow) {
    // Draft rows should be validated only when there was an attempt to submit a form
    return (
      (editRow.state === EditRowState.Draft &&
        !this.pristine &&
        !this.root?.pristine &&
        !this.hasOpenRows()) ||
      this.root?.submitted
    );
  }

  // shouldValidateDraft and shouldValidateRow are copied from Formio, because when calling validateRow, 'this' seems
  // to only have methods defined on Component and not EditGrid
  shouldValidateRow(editRow, dirty) {
    return this.shouldValidateDraft(editRow) || editRow.state === EditRowState.Editing || dirty;
  }

  // Overwritten from Formio, because we have the case where some components can have Async validation
  // In this case we need to wait for the promise to be resolved before returning
  validateRow(editRow, dirty) {
    let valid = true;
    const errorsSnapshot = [...this.errors];

    if (this.shouldValidateRow(editRow, dirty)) {
      editRow.components.forEach(comp => {
        if (!this.component.rowDrafts) {
          comp.setPristine(!dirty);
        }

        const silentCheck = this.component.rowDrafts && !this.shouldValidateDraft(editRow);

        if (comp.component.validate.plugins && comp.component.validate.plugins.length) {
          valid &= comp.checkAsyncValidity(null, dirty, editRow.data, silentCheck);
        } else {
          valid &= comp.checkValidity(null, dirty, editRow.data, silentCheck);
        }
      });
    }

    if (this.component.validate && this.component.validate.row) {
      valid = this.evaluate(
        this.component.validate.row,
        {
          valid,
          row: editRow.data,
        },
        'valid',
        true
      );
      if (valid.toString() !== 'true') {
        editRow.error = valid;
        valid = false;
      } else {
        editRow.error = null;
      }
      if (valid === null) {
        valid = `Invalid row validation for ${this.key}`;
      }
    }

    editRow.errors = !valid ? this.errors.filter(err => !errorsSnapshot.includes(err)) : null;

    if (!this.component.rowDrafts || this.root?.submitted) {
      this.showRowErrorAlerts(editRow, !!valid);
    }

    return !!valid;
  }

  /**
   * Copied from Formio https://github.com/formio/formio.js/blob/v4.13.13/src/components/editgrid/EditGrid.js#L969
   * The call to super was moved AFTER the checks of whether the rows are invalid or if there are open (unsaved rows).
   *
   * See: open-formulieren/open-forms#3096
   */
  checkComponentValidity(data, dirty, row, options) {
    if (this.shouldSkipValidation(data, dirty, row)) {
      return true;
    }

    let rowsValid = true;
    let rowsEditing = false;

    this.editRows.forEach((editRow, index) => {
      // Trigger all errors on the row.
      const rowValid = this.validateRow(editRow, editRow.alerts || dirty);

      rowsValid &= rowValid;

      if (this.rowRefs) {
        const rowContainer = this.rowRefs[index];

        if (rowContainer) {
          const errorContainer = rowContainer.querySelector('.editgrid-row-error');

          if (!rowValid && errorContainer) {
            errorContainer.textContent = this.t('invalidRowError');
          }
        }
      }
      // If this is a dirty check, and any rows are still editing, we need to throw validation error.
      rowsEditing |= dirty && this.isOpen(editRow);
    });

    if (!rowsValid) {
      this.setCustomValidity(this.t('invalidRowsError'), dirty);
      return false;
    } else if (rowsEditing && this.saveEditMode) {
      this.setCustomValidity(this.t('unsavedRowsError'), dirty);
      return false;
    }

    const message = this.invalid || this.invalidMessage(data, dirty);
    this.setCustomValidity(message, dirty);

    return super.checkComponentValidity(data, dirty, row, options);
  }

  cancelRow(rowIndex) {
    if (this.options.readOnly) {
      return;
    }

    this.triggerChange({
      modified: true,
      noPristineChangeOnModified: this.component.rowDrafts,
      isolateRow: true,
      // Issue #2488 - Add a flag so that from the onFormIOChange function we know that this onChange was triggered
      // by removing a repeating group row. Then we can force re-evaluation of the logic.
      deletedRepeatingGroupRow: true,
    });

    return super.cancelRow(rowIndex);
  }
}

export default EditGrid;

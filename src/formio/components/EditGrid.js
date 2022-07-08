import { Formio } from 'react-formio';

import { applyPrefix } from '../utils';


class EditGrid extends Formio.Components.components.editgrid {
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
    }
    else {
      const flattenedComponents = this.flattenComponents(rowIndex);

      return this.renderTemplate(
        'editgridrow',
        {
          row: dataValue[rowIndex] || {},
          data: this.data,
          rowIndex,
          components: this.component.components,
          flattenedComponents,
          displayValue: (component) => this.displayComponentValue(component),
          isVisibleInRow: (component) => this.isComponentVisibleInRow(component, flattenedComponents),
          getView: (component, data) => {
            const instance = flattenedComponents[component.key];
            const view = instance ? instance.getView(data || instance.dataValue) : '';

            // If there is an html tag in view, don't allow it to be injected in template
            const htmlTagRegExp = new RegExp('<(.*?)>');
            return typeof view === 'string' && view.length && !instance.component?.template && htmlTagRegExp.test(view)
            ? `<input type="text" value="${view.replace(/"/g, '&quot;')}" readonly/>`
            : view;
          },
          state: this.editRows[rowIndex].state,
          t: this.t.bind(this)
        },
      );
    }
  }
}


export default EditGrid;

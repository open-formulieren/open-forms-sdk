import FormioUtils from 'formiojs/utils';

import {get} from 'api';

const shouldDisplayComponent = component => {
  // hidden components are never shown
  if (component.hidden) return false;

  // non-layout components depend on their configured properties and/or defaults
  if (!FormioUtils.isLayoutComponent(component)) {
    // otherwise, check what's configured in the form designer (if nothing, default
    // to displaying it)
    return component.showInSummary ?? true;
  }

  // layout component - only visible if the children are visible!
  const children = getComponentChildren(component);
  const visibleChildren = children.filter(child => shouldDisplayComponent(child));
  return visibleChildren.length > 0;
};

// taken/modified from FormioUtils.eachComponent
const getComponentChildren = component => {
  const hasColumns = component.columns && Array.isArray(component.columns);
  const hasRows = component.rows && Array.isArray(component.rows);
  const hasComps = component.components && Array.isArray(component.components);

  let children = [];
  if (hasColumns) {
    component.columns.forEach(column => {
      children = children.concat(column.components);
    });
  } else if (hasRows) {
    component.rows.forEach(row => {
      if (Array.isArray(row)) {
        row.forEach(column => {
          children = children.concat(column.components);
        });
      }
    });
  } else if (hasComps) {
    children = children.concat(component.components);
  }

  return children;
};

const loadSummaryData = async submissionUrl => {
  return await get(`${submissionUrl.href}/summary`);
};

export {shouldDisplayComponent, loadSummaryData};

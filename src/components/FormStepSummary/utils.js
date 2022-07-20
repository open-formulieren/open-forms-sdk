import React from 'react';
import {Utils as FormioUtils} from 'formiojs';

const iterComponentsWithData = (components, data) => {
  // Iterate over (pre-flattened) components and return key/values
  // Use in combination with getSummaryComponents and getComponentLabel
  return components.map(component => ({
    ...component,
    value: data[component.key],
  }));
};


const getComponentLabel = (component) => {
  if (component === undefined) {
    // If no component is found then just return an empty string
    // This should not happen but is here to prevent a crash
    return '';
  }
  const {label, type} = component;

  switch (type) {
    case 'fieldset' :
    case 'editgrid' : {
      if (component.hideHeader) return '';
      return (<strong>{label}</strong>);
    }
    case 'content':
    case 'columns': {
      return '';
    }
    default:
      return label;
  }
};


/**
 * Takes a file size in bytes and returns the appropriate human readable value + unit
 * to use.
 * @param  {Number} size File size in bytes
 * @return {Object}      Object with the human readable number and unit.
 */
const humanFileSize = (size) => {
  if (size === 0) {
    return {size: 0, unit: 'byte'};
  }
  const index = Math.floor( Math.log(size) / Math.log(1024) );
  const newSize = (size / Math.pow(1024, index)).toFixed(2) * 1;
  const unit = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'][index];
  return {size: newSize, unit};
};

// Duplicate code from Open Forms Admin
const isChildOfEditGrid = (component, configuration) => {
  // Get all edit grids in the configuration
  let editGrids = [];
  FormioUtils.eachComponent(configuration.components, configComponent => {
    if (configComponent.type === 'editgrid') editGrids.push(configComponent);
  });

  // Check if our component is in the editgrid
  for (const editGrid of editGrids) {
    const foundComponent = FormioUtils.getComponent(editGrid.components, component.key, true);
    if (foundComponent) return true;
  }

  return false;
};

export {iterComponentsWithData, getComponentLabel, humanFileSize, isChildOfEditGrid};

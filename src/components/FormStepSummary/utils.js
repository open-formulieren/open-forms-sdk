const iterVisibleComponentsWithData = (components, data) => {
  // Iterate over (pre-flattened) components and return key/values
  // Often used in combination with flattenComponents and getComponentLabel/getComponentValue
  return components.filter(component => !component.hidden).map(component => ({
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
    case 'fieldset' : {
      return (<strong>{label}</strong>);
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

export {iterVisibleComponentsWithData, getComponentLabel, humanFileSize};

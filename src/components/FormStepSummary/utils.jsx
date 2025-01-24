const getComponentLabel = component => {
  if (component === undefined) {
    // If no component is found then just return an empty string
    // This should not happen but is here to prevent a crash
    return '';
  }
  const {label, type} = component;

  switch (type) {
    case 'fieldset':
    case 'editgrid': {
      if (component.hideHeader) return '';
      return <strong>{label}</strong>;
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
const humanFileSize = size => {
  if (size === 0) {
    return {size: 0, unit: 'byte'};
  }
  const index = Math.floor(Math.log(size) / Math.log(1024));
  const newSize = (size / Math.pow(1024, index)).toFixed(2) * 1;
  const unit = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'][index];
  return {size: newSize, unit};
};

export {getComponentLabel, humanFileSize};

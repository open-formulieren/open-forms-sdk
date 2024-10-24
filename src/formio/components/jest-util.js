const getComponentNode = element => element.closest('[ref="component"]');

const getAllChildInputs = element => element.querySelectorAll('input');

export {getAllChildInputs, getComponentNode};

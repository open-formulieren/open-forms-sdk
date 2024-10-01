export const testEmptyFields = [
  {
    name: 'Amount to Pay',
    value: undefined,
    component: {
      key: 'amountToPay',
      type: 'currency',
      multiple: false,
    },
  },
  {
    name: 'Number of people',
    value: undefined,
    component: {
      key: 'nPeople',
      type: 'number',
      multiple: false,
    },
  },
  {
    name: 'Upload File',
    value: [],
    component: {
      key: 'uploadFile',
      type: 'file',
      multiple: false,
    },
  },
  {
    name: 'Upload File Multiple',
    value: [],
    component: {
      key: 'uploadFileMultiple',
      type: 'file',
      multiple: true,
    },
  },
  {
    name: 'Upload File',
    value: [undefined],
    component: {
      key: 'uploadFile1',
      type: 'file',
      multiple: true,
    },
  },
  {
    name: 'Select boxes',
    value: undefined,
    component: {
      key: 'selectBoxes',
      type: 'selectboxes',
      multiple: false,
    },
  },
  {
    name: 'Radio button',
    value: undefined,
    component: {
      key: 'radioButton',
      type: 'radio',
      multiple: false,
    },
  },
  {
    name: 'Select field',
    value: undefined,
    component: {
      key: 'select',
      type: 'select',
      multiple: false,
    },
  },
];

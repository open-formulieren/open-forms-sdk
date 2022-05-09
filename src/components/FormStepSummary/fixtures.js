import {getSummaryComponents} from 'components/Summary/utils';

export const testStepDataEmptyDate = {
  "submissionStep": {
    "id": "31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "name": "Details",
    "url": "http://testserver.nl/api/v1/submissions/774db9fc-1c0f-42ef-a7f7-b96d8c7d5905/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "formStep": "http://testserver.nl/api/v1/forms/3ef4c822-c6c7-496d-99d6-897c1d1c1219/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "isApplicable": true,
    "completed": true,
    "optional": false,
    "canSubmit": true
  },
  "title": "Test Details",
  "data": {
    "dateOfBirth": ""
  },
  "configuration": {
    "flattenedComponents": [
      {
        "id": "em3xsol",
        "key": "dateOfBirth",
        "type": "date",
        "input": true,
        "label": "Date of birth",
        "format": "dd-MM-yyyy",
        "hidden": false,
      }
    ]
  }
};


export const testStepDataSelectMultivalue = {
  "submissionStep": {
    "id": "31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "name": "Details",
    "url": "http://testserver.nl/api/v1/submissions/774db9fc-1c0f-42ef-a7f7-b96d8c7d5905/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "formStep": "http://testserver.nl/api/v1/forms/3ef4c822-c6c7-496d-99d6-897c1d1c1219/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "isApplicable": true,
    "completed": true,
    "optional": false,
    "canSubmit": true
  },
  "title": "Test Multi-value select field",
  "data": {
    "selectPets": ["dog", "fish"]
  },
  "configuration": {
    "flattenedComponents": [
      {
        "id": "em3xsol",
        "key": "selectPets",
        "type": "select",
        "input": true,
        "multiple": true,
        "label": "Select Pets",
        "widget": "choicesjs",
        "data": {
          "url": "",
          "json": "",
          "custom": "",
          "values": [
            {
              "label": "Cat",
              "value": "cat"
            },
            {
              "label": "Dog",
              "value": "dog"
            },
            {
              "label": "Fish",
              "value": "fish"
            }
          ],
          "resource": ""
        }
      }
    ]
  }
};


export const testStepEmptyFields = {
  "submissionStep": {
    "id": "31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "name": "Details",
    "url": "http://testserver.nl/api/v1/submissions/774db9fc-1c0f-42ef-a7f7-b96d8c7d5905/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "formStep": "http://testserver.nl/api/v1/forms/3ef4c822-c6c7-496d-99d6-897c1d1c1219/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "isApplicable": true,
    "completed": true,
    "optional": false,
    "canSubmit": true
  },
  "title": "Test empty upload file field",
  "data": {
    "uploadFile": []
  },
  "configuration": {
    "flattenedComponents": [
      {
        "id": "em3xsol",
        "key": "amountToPay",
        "type": "currency",
        "input": true,
        "multiple": false,
        "label": "Amount to Pay",
        "data": {
          "value": undefined,
        }
      },
      {
        "id": "em3xsal",
        "key": "nPeople",
        "type": "number",
        "input": true,
        "multiple": false,
        "label": "Number of people",
        "data": {
          "value": undefined,
        }
      },
      {
        "id": "em3xsel",
        "key": "uploadFile",
        "type": "file",
        "input": true,
        "multiple": false,
        "label": "Upload File",
        "data": {
          "value": [],
        }
      },
      {
        "id": "em5xsel",
        "key": "uploadFileMultiple",
        "type": "file",
        "input": true,
        "multiple": true,
        "label": "Upload File Multiple",
        "data": {
          "value": undefined,
        }
      },
      {
        "id": "em3xsul",
        "key": "uploadFile1",
        "type": "file",
        "input": true,
        "multiple": true,
        "label": "Upload File",
        "data": {
          "value": [undefined],
        }
      },
            {
        "id": "em4xsul",
        "key": "selectBoxes",
        "type": "selectboxes",
        "input": true,
        "multiple": false,
        "label": "Select boxes",
        "data": {
          "value": undefined,
        }
      },
      {
        "key": "radioButton",
        "type": "radio",
        "input": true,
        "multiple": false,
        "label": "Radio button",
        "data": {
          "value": undefined,
        }
      },
      {
        "key": "select",
        "type": "select",
        "input": true,
        "multiple": false,
        "label": "Select field",
        "data": {
          "value": undefined,
        }
      }
    ]
  }
};


export const testStepColumns = {
  "submissionStep": {
    "id": "31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "name": "Details",
    "url": "http://testserver.nl/api/v1/submissions/774db9fc-1c0f-42ef-a7f7-b96d8c7d5905/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "formStep": "http://testserver.nl/api/v1/forms/3ef4c822-c6c7-496d-99d6-897c1d1c1219/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "isApplicable": true,
    "completed": true,
    "optional": false,
    "canSubmit": true
  },
  "title": "Test empty upload file field",
  "data": {
    "input1": "First input",
    "input2": "Second input",
  },
  "configuration": {
    "flattenedComponents": getSummaryComponents([
      {
        key: 'columns',
        type: 'columns',
        label: 'Columns',
        columns: [
          {
            size: 6,
            components: [
              {
                key: 'input1',
                type: 'textfield',
                label: 'Input 1',
                input: true,
              }
            ]
          },
          {
            size: 6,
            components: [
              {
                key: 'input2',
                type: 'textfield',
                label: 'Input 2',
                input: true,
              }
            ]
          }
        ]
      }
    ])
  }
};

export const testStepHiddenFieldsetHeader = {
  "submissionStep": {
    "id": "31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "name": "Details",
    "url": "http://testserver.nl/api/v1/submissions/774db9fc-1c0f-42ef-a7f7-b96d8c7d5905/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "formStep": "http://testserver.nl/api/v1/forms/3ef4c822-c6c7-496d-99d6-897c1d1c1219/steps/31bd9fc8-57b7-4b32-bae7-a0b6d8c076cc",
    "isApplicable": true,
    "completed": true,
    "optional": false,
    "canSubmit": true
  },
  "title": "Test empty upload file field",
  "data": {
    "input1": "First input",
    "input2": "Second input",
  },
  "configuration": {
    "flattenedComponents": getSummaryComponents([
      {
        key: 'fieldset',
        type: 'fieldset',
        label: 'Fieldset',
        hideHeader: true,
        components: [
          {
            key: 'input1',
            type: 'textfield',
            label: 'Input 1',
            input: true,
          },
          {
            key: 'input2',
            type: 'textfield',
            label: 'Input 2',
            input: true,
          }
        ]
      }
    ])
  }
};

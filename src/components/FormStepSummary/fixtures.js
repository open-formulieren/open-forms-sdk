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
    "components": [
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
    "components": [
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


export const testStepUploadFile = {
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
    "components": [
      {
        "id": "em3xsol",
        "key": "uploadFile",
        "type": "file",
        "input": true,
        "multiple": false,
        "label": "Upload File",
        "data": {
          "value": [],
        }
      }
    ]
  }
};

export const testStepUploadMultiFile = {
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
    "components": [
      {
        "id": "em3xsol",
        "key": "uploadFile",
        "type": "file",
        "input": true,
        "multiple": true,
        "label": "Upload File",
        "data": {
          "value": [undefined],
        }
      }
    ]
  }
};

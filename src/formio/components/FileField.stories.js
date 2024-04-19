import {expect, userEvent, within} from '@storybook/test';
import {getWorker} from 'msw-storybook-addon';

import {withUtrechtDocument} from 'story-utils/decorators';
import {sleep} from 'utils';

import {
  UPLOAD_URL,
  mockFileUploadDelete,
  mockFileUploadErrorPost,
  mockFileUploadPost,
} from './FileField.mocks';
import {SingleFormioComponent} from './story-util';

const FILEPATTERN = [
  'application/pdf',
  'application/msword',
  'application/vnd.rar',
  'application/zip',
  'image/heic',
  'image/jpeg',
  'image/png',
  'text/csv',
  'text/plain',
];

const MIME_TO_LABEL = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.rar': '.rar',
  'application/zip': '.zip',
  'image/heic': '.heic',
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'text/csv': '.csv',
  'text/plain': '.txt',
};

export default {
  title: 'Form.io components / Vanilla / FileUpload',
  decorators: [withUtrechtDocument],
  args: {
    type: 'file',
    extraComponentProperties: {},
    evalContext: {},
  },
  argTypes: {
    key: {type: {required: true}},
    label: {type: {required: true}},
    type: {table: {disable: true}},
    extraComponentProperties: {
      description: `Any additional Form.io component properties, recursively merged into the
        component definition.`,
    },
    evalContext: {table: {disable: true}},
    filePattern: {
      options: FILEPATTERN,
      control: {type: 'check'},
    },
  },
  parameters: {
    controls: {sort: 'requiredFirst'},
    msw: {
      handlers: [mockFileUploadPost, mockFileUploadDelete],
    },
  },
};

const worker = getWorker();

const render = ({
  multiple = false,
  description = '',
  filePattern = [],
  backendErrors = [],
  ...args
}) => {
  if (backendErrors.length) {
    worker.use(mockFileUploadErrorPost(backendErrors));
  }
  return SingleFormioComponent({
    ...args,
    extraComponentProperties: {
      ...args.extraComponentProperties,
      description,
      multiple,
      filePattern: filePattern.join(','),
      storage: 'url',
      url: UPLOAD_URL,
      file: {
        type: filePattern,
        allowedTypesLabels: filePattern.map(pattern => MIME_TO_LABEL[pattern]),
      },
    },
  });
};

export const HappyFlow = {
  name: 'Happy flow',
  render,
  args: {
    key: 'file',
    label: 'Attachment',
    description: 'Klik om een bestand te selecteren en in te zenden',
    multiple: false,
    extraComponentProperties: {
      validate: {required: false},
    },
  },
};

export const OneAllowedFileType = {
  name: 'One allowed file type',
  render,
  args: {
    key: 'attachment',
    label: 'Attachment',
    description: 'Klik om een bestand te selecteren en in te zenden. Alleen PDFs zijn toegestaan.',
    multiple: false,
    filePattern: ['application/pdf'],
    extraComponentProperties: {
      validate: {required: false},
    },
  },
  argTypes: {
    filePattern: {table: {disable: true}},
  },
  play: async ({canvasElement}) => {
    await sleep(200); // formio needs time to bind click events...
    const canvas = within(canvasElement);
    // Click on browse to make the input node injected in the dom
    const browseLink = canvas.getByRole('link', {name: 'browse'});
    // This opens the file dialog, but without it the input node is not injected into the DOM
    await userEvent.click(browseLink);

    // Upload a file of the wrong type
    const file = new File(['not-a-pdf'], 'not-a-pdf.png', {type: 'image/png'});
    const inputfile = document.querySelectorAll('.openforms-file-upload-input');
    await userEvent.upload(inputfile[0], file, {applyAccept: false});

    // Check that the error message is there
    const errorMessage = await canvas.findByText(
      'The uploaded file is not of an allowed type. It must be: .pdf.'
    );
    await expect(errorMessage).toBeVisible();
  },
};

export const MultipleAllowedFileTypes = {
  name: 'Multiple allowed file types',
  render,
  args: {
    key: 'attachments',
    label: 'Attachment',
    description:
      'Klik om een bestand te selecteren en in te zenden. Alleen PDFs en PNGs zijn toegestaan.',
    multiple: false,
    filePattern: ['application/pdf', 'image/png'],
    extraComponentProperties: {
      validate: {required: false},
    },
  },
  argTypes: {
    filePattern: {table: {disable: true}},
  },
  play: async ({canvasElement}) => {
    await sleep(200); // formio needs time to bind click events...
    const canvas = within(canvasElement);
    // Click on browse to make the input node injected in the dom
    const browseLink = canvas.getByRole('link', {name: 'browse'});
    await userEvent.click(browseLink);

    // Upload a file of the wrong type
    const file = new File(['not-a-pdf-or-png'], 'not-a-pdf-or-png.txt', {type: 'text/plain'});
    const inputfile = document.querySelectorAll('.openforms-file-upload-input');
    await userEvent.upload(inputfile[0], file, {applyAccept: false});

    // Check that the error message is there
    const errorMessage = await canvas.findByText(
      'The uploaded file is not of an allowed type. It must be: .pdf or .png.'
    );
    await expect(errorMessage).toBeVisible();
  },
};

export const ErrorFlow = {
  name: 'Error flow',
  render,
  args: {
    key: 'attachments',
    label: 'Attachment',
    multiple: false,
    backendErrors: ['A dangerous virus was detected!'],
    extraComponentProperties: {
      validate: {required: false},
    },
  },
  argTypes: {
    filePattern: {table: {disable: true}},
  },
};

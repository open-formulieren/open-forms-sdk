import {expect} from '@storybook/test';
import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import 'flatpickr';
import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';

// Use our custom components
Formio.use(OpenFormsModule);

const fileForm = {
  type: 'form',
  components: [
    {
      type: 'file',
      label: 'File Upload',
      key: 'file',
    },
  ],
};

const renderForm = async formConfig => {
  let formJSON = _.cloneDeep(formConfig);
  const container = document.createElement('div');
  document.body.appendChild(container);
  const form = await Formio.createForm(container, formJSON);
  return {form, container};
};

describe('The file component', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('File starting with blankspace', async () => {
    const user = userEvent.setup({delay: 50});
    await renderForm(fileForm);

    const browseLink = screen.getByRole('link', {name: 'browse'});
    await userEvent.click(browseLink);

    // Upload a file of the wrong type
    const file = new File(['some-random-file'], '  foo.png', {type: 'image/png'});
    const inputfile = document.querySelectorAll('.openforms-file-upload-input');
    await userEvent.upload(inputfile[0], file, {applyAccept: false});

    // Check that the error message is there
    const errorMessage = await screen.findByText(
      'The name of the uploaded file cannot start with a whitespace.'
    );
    await expect(errorMessage).toBeVisible();
  });
});

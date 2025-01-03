import _ from 'lodash';
import {Formio} from 'react-formio';

const maxNFilesForm = {
  type: 'form',
  components: [
    {
      label: 'Upload multiple files',
      key: 'multipleFiles',
      type: 'file',
      multiple: true,
      maxNumberOfFiles: 2,
    },
  ],
  title: 'Test Files form',
  display: 'Test Files form',
  name: 'testFilesForm',
  path: 'testFilesForm',
};

describe('Multiple File Component', () => {
  test('Uploading 1 file gives no error', async () => {
    let formJSON = _.cloneDeep(maxNFilesForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('multipleFiles');
    component.upload([{name: 'File 1', size: '50'}]);

    expect(!!component.error).toBeFalsy();
  });

  test('Uploading 3 files gives an error', async () => {
    let formJSON = _.cloneDeep(maxNFilesForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('multipleFiles');
    component.upload([
      {name: 'File 1', size: '50'},
      {name: 'File 2', size: '50'},
      {name: 'File 3', size: '50'},
    ]);

    expect(!!component.error).toBeTruthy();
    expect(component.error.message).toEqual(
      'Too many files added. The maximum allowed number of files is 2.'
    );
  });

  // GH-4222
  test('Uploading 1 file then 2 files gives an error', async () => {
    let formJSON = _.cloneDeep(maxNFilesForm);

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON);
    form.setPristine(false);
    const component = form.getComponent('multipleFiles');
    component.dataValue.push({name: 'File 1', size: '50'});

    component.upload([
      {name: 'File 2', size: '50'},
      {name: 'File 3', size: '50'},
    ]);

    expect(!!component.error).toBeTruthy();
    expect(component.error.message).toEqual(
      'Too many files added. The maximum allowed number of files is 2.'
    );
  });
});

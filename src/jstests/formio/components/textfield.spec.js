import _ from 'lodash';
import {Formio} from 'react-formio';

import {BASE_URL} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import OpenFormsModule from 'formio/module';
import {sleep} from 'utils';

import {addressPrefillForm} from './fixtures/textfield';
import {mockLocationGet} from './textfield.mocks';

// Use our custom components
Formio.use(OpenFormsModule);

describe('TextField Component', () => {
  test('Address prefill city', async () => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({city: 'Amsterdam', streetName: 'Beautiful Street'}));

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON, {baseUrl: BASE_URL});
    form.setPristine(false);
    const componentCity = form.getComponent('city');
    componentCity.handleSettingLocationData({postcode: '1111AA', houseNumber: '1'});
    componentCity._debouncedSetLocationData.flush();
    await sleep(300);
    expect(componentCity.getValue()).toEqual('Amsterdam');
  });

  test('TextField (readonly) with address prefill refreshes city on invalid data', async () => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    formJSON.components[2].disabled = true;
    formJSON.components[3].disabled = true;
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON, {baseUrl: BASE_URL});
    form.setPristine(false);
    const componentCity = form.getComponent('city');
    componentCity.setValue('Amsterdam');

    componentCity.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
    componentCity._debouncedSetLocationData.flush();
    await sleep(300);
    expect(componentCity.getValue()).toEqual('');
  });

  test('TextField (editable) with address prefill does not modify city if already filled', async () => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON, {baseUrl: BASE_URL});
    form.setPristine(false);
    const componentCity = form.getComponent('city');
    componentCity.setValue('Amsterdam');

    componentCity.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
    componentCity.setLocationData; // access the getter so the debounced method is created
    componentCity._debouncedSetLocationData.flush();
    await sleep(300);
    expect(componentCity.getValue()).toEqual('Amsterdam');
  });

  test('Address prefill street', async () => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({city: 'Amsterdam', streetName: 'Beautiful Street'}));

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON, {baseUrl: BASE_URL});
    form.setPristine(false);
    const componentStreet = form.getComponent('streetName');
    componentStreet.handleSettingLocationData({postcode: '1111AA', houseNumber: '1'});
    componentStreet._debouncedSetLocationData.flush();
    await sleep(300);
    expect(componentStreet.getValue()).toEqual('Beautiful Street');
  });

  test('TextField (readonly) with address prefill refreshes street on invalid data', async () => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    formJSON.components[2].disabled = true;
    formJSON.components[3].disabled = true;
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON, {baseUrl: BASE_URL});
    form.setPristine(false);
    const componentStreet = form.getComponent('streetName');
    componentStreet.setValue('Beautiful Street');

    componentStreet.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
    componentStreet._debouncedSetLocationData.flush();
    await sleep(300);
    expect(componentStreet.getValue()).toEqual('');
  });

  test('TextField (editable) with address prefill (invalid data) does not modify street if already filled', async () => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    const form = await Formio.createForm(element, formJSON, {baseUrl: BASE_URL});
    form.setPristine(false);
    const componentStreet = form.getComponent('streetName');
    componentStreet.setValue('Beautiful Street');

    componentStreet.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
    componentStreet.setLocationData; // access the getter so the debounced method is created
    componentStreet._debouncedSetLocationData.flush();
    await sleep(300);
    expect(componentStreet.getValue()).toEqual('Beautiful Street');
  });
});

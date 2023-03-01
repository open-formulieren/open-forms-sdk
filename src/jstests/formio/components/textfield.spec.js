import _ from 'lodash';
import {Formio} from 'react-formio';

import {BASE_URL} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import OpenFormsModule from 'formio/module';

import {addressPrefillForm} from './fixtures/textfield';
import {mockLocationGet} from './textfield.mocks';

// Use our custom components
Formio.use(OpenFormsModule);

describe('TextField Component', () => {
  test('Address prefill city', done => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({city: 'Amsterdam', streetName: 'Beautiful Street'}));

    const element = document.createElement('div');

    Formio.createForm(element, formJSON, {baseUrl: BASE_URL})
      .then(form => {
        form.setPristine(false);
        const componentCity = form.getComponent('city');
        componentCity.handleSettingLocationData({postcode: '1111AA', houseNumber: '1'});
        componentCity._debouncedSetLocationData.flush();

        setTimeout(() => {
          expect(componentCity.getValue()).toEqual('Amsterdam');
          done();
        }, 300);
      })
      .catch(done);
  });

  test('TextField (readonly) with address prefill refreshes city on invalid data', done => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    formJSON.components[2].disabled = true;
    formJSON.components[3].disabled = true;
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    Formio.createForm(element, formJSON, {baseUrl: BASE_URL})
      .then(form => {
        form.setPristine(false);
        const componentCity = form.getComponent('city');
        componentCity.setValue('Amsterdam');

        componentCity.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
        componentCity._debouncedSetLocationData.flush();

        setTimeout(() => {
          expect(componentCity.getValue()).toEqual('');
          done();
        }, 300);
      })
      .catch(done);
  });

  test('TextField (editable) with address prefill does not modify city if already filled', done => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    Formio.createForm(element, formJSON, {baseUrl: BASE_URL})
      .then(form => {
        form.setPristine(false);
        const componentCity = form.getComponent('city');
        componentCity.setValue('Amsterdam');

        componentCity.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
        componentCity.setLocationData; // access the getter so the debounced method is created
        componentCity._debouncedSetLocationData.flush();

        setTimeout(() => {
          expect(componentCity.getValue()).toEqual('Amsterdam');
          done();
        }, 300);
      })
      .catch(done);
  });

  test('Address prefill street', done => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({city: 'Amsterdam', streetName: 'Beautiful Street'}));

    const element = document.createElement('div');

    Formio.createForm(element, formJSON, {baseUrl: BASE_URL})
      .then(form => {
        form.setPristine(false);
        const componentStreet = form.getComponent('streetName');
        componentStreet.handleSettingLocationData({postcode: '1111AA', houseNumber: '1'});
        componentStreet._debouncedSetLocationData.flush();

        setTimeout(() => {
          expect(componentStreet.getValue()).toEqual('Beautiful Street');
          done();
        }, 300);
      })
      .catch(done);
  });

  test('TextField (readonly) with address prefill refreshes street on invalid data', done => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    formJSON.components[2].disabled = true;
    formJSON.components[3].disabled = true;
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    Formio.createForm(element, formJSON, {baseUrl: BASE_URL})
      .then(form => {
        form.setPristine(false);
        const componentStreet = form.getComponent('streetName');
        componentStreet.setValue('Beautiful Street');

        componentStreet.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
        componentStreet._debouncedSetLocationData.flush();

        setTimeout(() => {
          expect(componentStreet.getValue()).toEqual('');
          done();
        }, 300);
      })
      .catch(done);
  });

  test('TextField (editable) with address prefill (invalid data) does not modify street if already filled', done => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    mswServer.use(mockLocationGet({}));

    const element = document.createElement('div');

    Formio.createForm(element, formJSON, {baseUrl: BASE_URL})
      .then(form => {
        form.setPristine(false);
        const componentStreet = form.getComponent('streetName');
        componentStreet.setValue('Beautiful Street');

        componentStreet.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});
        componentStreet.setLocationData; // access the getter so the debounced method is created
        componentStreet._debouncedSetLocationData.flush();

        setTimeout(() => {
          expect(componentStreet.getValue()).toEqual('Beautiful Street');
          done();
        }, 300);
      })
      .catch(done);
  });
});

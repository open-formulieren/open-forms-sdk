import React from 'react';
import _ from 'lodash';
import {Formio} from 'react-formio';

import OpenFormsModule from 'formio/module';
import {addressPrefillForm} from './fixtures/textfield';

const apiModule = require('../../../api');
jest.mock('../../../api');

// Use our custom components
Formio.use(OpenFormsModule);


describe('TextField Component', () => {
  test('Address prefill city', (done) => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    apiModule.get.mockResolvedValue({city: 'Amsterdam', streetName: 'Beautiful Street'});

    const element = document.createElement('div');

    Formio.createForm(element, formJSON).then(form => {
      form.setPristine(false);
      const componentCity = form.getComponent('city');
      componentCity.handleSettingLocationData({postcode: '1111AA', houseNumber: '1'});

      setTimeout(() => {
        expect(componentCity.getValue()).toEqual('Amsterdam');
        done();
      }, 300);

    }).catch(done);
  });

  test('TextField (readonly) with address prefill refreshes city on invalid data', (done) => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    formJSON.components[2].disabled = true;
    formJSON.components[3].disabled = true;
    apiModule.get.mockResolvedValue({});

    const element = document.createElement('div');

    Formio.createForm(element, formJSON).then(form => {
      form.setPristine(false);
      const componentCity = form.getComponent('city');
      componentCity.setValue('Amsterdam');

      componentCity.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});

      setTimeout(() => {
        expect(componentCity.getValue()).toEqual('');
        done();
      }, 300);

    }).catch(done);
  });

  test('TextField (editable) with address prefill does not modify city if already filled', (done) => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    apiModule.get.mockResolvedValue({});

    const element = document.createElement('div');

    Formio.createForm(element, formJSON).then(form => {
      form.setPristine(false);
      const componentCity = form.getComponent('city');
      componentCity.setValue('Amsterdam');

      componentCity.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});

      setTimeout(() => {
        expect(componentCity.getValue()).toEqual('Amsterdam');
        done();
      }, 300);

    }).catch(done);
  });

  test('Address prefill street', (done) => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    apiModule.get.mockResolvedValue({city: 'Amsterdam', streetName: 'Beautiful Street'});

    const element = document.createElement('div');

    Formio.createForm(element, formJSON).then(form => {
      form.setPristine(false);
      const componentStreet = form.getComponent('streetName');
      componentStreet.handleSettingLocationData({postcode: '1111AA', houseNumber: '1'});

      setTimeout(() => {
        expect(componentStreet.getValue()).toEqual('Beautiful Street');
        done();
      }, 300);

    }).catch(done);
  });

  test('TextField (readonly) with address prefill refreshes street on invalid data', (done) => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    formJSON.components[2].disabled = true;
    formJSON.components[3].disabled = true;
    apiModule.get.mockResolvedValue({});

    const element = document.createElement('div');

    Formio.createForm(element, formJSON).then(form => {
      form.setPristine(false);
      const componentStreet = form.getComponent('streetName');
      componentStreet.setValue('Beautiful Street');

      componentStreet.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});

      setTimeout(() => {
        expect(componentStreet.getValue()).toEqual('');
        done();
      }, 300);

    }).catch(done);
  });

  test('TextField (editable) with address prefill (invalid data) does not modify street if already filled', (done) => {
    let formJSON = _.cloneDeep(addressPrefillForm);
    apiModule.get.mockResolvedValue({});

    const element = document.createElement('div');

    Formio.createForm(element, formJSON).then(form => {
      form.setPristine(false);
      const componentStreet = form.getComponent('streetName');
      componentStreet.setValue('Beautiful Street');

      componentStreet.handleSettingLocationData({postcode: '0000AA', houseNumber: '0'});

      setTimeout(() => {
        expect(componentStreet.getValue()).toEqual('Beautiful Street');
        done();
      }, 300);

    }).catch(done);
  });

});

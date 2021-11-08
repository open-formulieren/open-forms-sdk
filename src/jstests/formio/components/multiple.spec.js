import React from 'react';
import _ from 'lodash';
import {Formio} from "react-formio";
import {multipleForm} from './fixtures/multiple';
import OpenFormsModule from "../../../formio/module";

jest.mock("../../../map/rd", () => jest.fn());

// Use our custom components
Formio.use(OpenFormsModule);

describe('Multiple Component', () => {

  test('After having filled a text field, add new value', (done) => {
    const formJSON = _.cloneDeep(multipleForm);

    const testAddNewValue = () => {
      const element = document.createElement('div');

      Formio.createForm(element, formJSON).then(form => {
        form.setPristine(false);
        const component = form.getComponent('petNames');
        const initialValue = ['Qui'];
        // The Form gets the submission data from the React state, so it is immutable (src/components/FormStep.js:315)
        // The 'seal' is to simulate an immutable object.
        Object.seal(initialValue);
        component.dataValue = initialValue;
        component.addNewValue('Quo');

        const componentValue = component.dataValue;
        expect(componentValue).toContain('Quo');
        expect(componentValue).toContain('Qui');
        done();

      }).catch(done);
    };

    testAddNewValue();
  });

  test('Remove a filled value', (done) => {
    const formJSON = _.cloneDeep(multipleForm);

    const testAddNewValue = () => {
      const element = document.createElement('div');

      Formio.createForm(element, formJSON).then(form => {
        form.setPristine(false);
        const component = form.getComponent('petNames');
        // The Form gets the submission data from the React state, so it is immutable (src/components/FormStep.js:315)
        // The 'seal' is to simulate an immutable object.
        const initialValue = ['Qui', 'Quo'];
        Object.seal(initialValue);
        component.dataValue = initialValue;
        component.removeValue(0);

        const componentValue = component.dataValue;
        expect(componentValue).toContain('Quo');
        expect(componentValue).not.toContain('Qui');
        done();
      }).catch(done);
    };

    testAddNewValue();
  });
});

import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import useQuery from 'hooks/useQuery';
import FormStart from '.';

import {testForm} from './fixtures';

jest.mock('hooks/useQuery');

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('Form start page start if _start parameter is present', () => {
  const testLocation = new URLSearchParams('?_start=1');
  useQuery.mockReturnValue(testLocation);

  const onFormStart = jest.fn();

  act(() => {
    render(
      <FormStart
        form={testForm}
        onFormStart={onFormStart}
      />,
      container
    );
  });

  expect(onFormStart).toHaveBeenCalled();
});

it('Form start does not start if there are auth errors', () => {
  const onFormStart = jest.fn();

  const testQueries = {
    '_digid-message=error': 'Er is een fout opgetreden bij het inloggen met DigiD. Probeer het later opnieuw.',
    '_digid-message=login-cancelled': 'Je hebt het inloggen met DigiD geannuleerd.',
    '_eherkenning-message=error': 'Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.',
    '_eherkenning-message=login-cancelled': 'Je hebt het inloggen met EHerkenning geannuleerd.',
  };

  for (const [testQuery, expectedMessage] of Object.entries(testQueries)) {
    const testLocation = new URLSearchParams(`?_start=1&${testQuery}`);
    useQuery.mockReturnValue(testLocation);

    act(() => {
      render(
        <FormStart
          form={testForm}
          onFormStart={onFormStart}
        />,
        container
      );
    });

    expect(container.textContent).toContain(expectedMessage);
    expect(onFormStart).toHaveBeenCalledTimes(0);
  }
});

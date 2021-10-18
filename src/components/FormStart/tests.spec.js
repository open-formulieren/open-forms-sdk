import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { IntlProvider } from 'react-intl';

import useQuery from 'hooks/useQuery';
import messagesNL from 'i18n/compiled/nl.json';

import FormStart from '.';
import {testForm} from './fixtures';

jest.mock("../../map/rd", () => jest.fn());
jest.mock('hooks/useQuery');
let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

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
      <IntlProvider locale="nl" messages={messagesNL}>
        <FormStart
          form={testForm}
          onFormStart={onFormStart}
        />
      </IntlProvider>,
      container
    );
  });

  expect(onFormStart).toHaveBeenCalled();
});

it('Form start does not start if there are auth errors', () => {
  const onFormStart = jest.fn();

  const testQueries = {
    '_digid-message=error': 'Er is een fout opgetreden in de communicatie met DigiD. Probeert u het later nogmaals. Indien deze fout blijft aanhouden, kijk dan op de website https://www.digid.nl voor de laatste informatie.',
    '_digid-message=login-cancelled': 'Je hebt het inloggen met DigiD geannuleerd.',
    '_eherkenning-message=error': 'Er is een fout opgetreden bij het inloggen met EHerkenning. Probeer het later opnieuw.',
    '_eherkenning-message=login-cancelled': 'Je hebt het inloggen met EHerkenning geannuleerd.',
  };

  for (const [testQuery, expectedMessage] of Object.entries(testQueries)) {
    const testLocation = new URLSearchParams(`?_start=1&${testQuery}`);
    useQuery.mockReturnValue(testLocation);

    act(() => {
      render(
        <IntlProvider locale="nl" messages={messagesNL}>
          <FormStart
            form={testForm}
            onFormStart={onFormStart}
          />
        </IntlProvider>,
        container
      );
    });

    expect(container.textContent).toContain(expectedMessage);
    expect(onFormStart).toHaveBeenCalledTimes(0);
  }
});

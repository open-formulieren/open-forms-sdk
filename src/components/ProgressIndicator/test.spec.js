import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import messagesNL from 'i18n/compiled/nl.json';

import ProgressIndicator from './index';


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


it('Progress Indicator submission allowed', () => {

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <MemoryRouter initialEntries={['/']}>
          <ProgressIndicator
            title="Test Name"
            steps={[]}
            submission={{"steps": []}}
            submissionAllowed="yes"
          />
        </MemoryRouter>
      </IntlProvider>,
      container
    );
  });

  const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
  expect(progressIndicatorSteps.textContent).toContain('Inloggen');
  expect(progressIndicatorSteps.textContent).toContain('Overzicht');
  expect(progressIndicatorSteps.textContent).toContain('Bevestiging');
});

it('Progress Indicator submission not allowed, with overview page', () => {

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <MemoryRouter initialEntries={['/']}>
          <ProgressIndicator
            title="Test Name"
            steps={[]}
            submission={{"steps": []}}
            submissionAllowed="no_with_overview"
          />
        </MemoryRouter>
      </IntlProvider>,
      container
    );
  });

  const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
  expect(progressIndicatorSteps.textContent).toContain('Inloggen');
  expect(progressIndicatorSteps.textContent).toContain('Overzicht');
  expect(progressIndicatorSteps.textContent).not.toContain('Bevestiging');
});

it('Progress Indicator submission not allowed, without overview page', () => {

  act(() => {
    render(
      <IntlProvider
        locale="nl"
        messages={messagesNL}
      >
        <MemoryRouter initialEntries={['/']}>
          <ProgressIndicator
            title="Test Name"
            steps={[]}
            submission={{"steps": []}}
            submissionAllowed="no_without_overview"
          />
        </MemoryRouter>
      </IntlProvider>,
      container
    );
  });

  const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
  expect(progressIndicatorSteps.textContent).toContain('Inloggen');
  expect(progressIndicatorSteps.textContent).not.toContain('Overzicht');
  expect(progressIndicatorSteps.textContent).not.toContain('Bevestiging');
});

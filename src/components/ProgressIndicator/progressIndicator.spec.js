import messagesNL from 'i18n/compiled/nl.json';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router-dom';

import ProgressIndicator from './index';
import {addFixedSteps, getStepsInfo} from './utils';

let container = null;
let root = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  // cleanup on exiting
  act(() => {
    root.unmount();
    container.remove();
    root = null;
    container = null;
  });
});

const submissionDefaults = {
  id: 'some-id',
  url: 'https://some-url',
  form: 'https://some-form',
  steps: [
    {
      uuid: 'd6cab0dd',
      slug: 'first-step',
      to: 'first-step',
      formDefinition: 'Stap 1',
      isCompleted: false,
      isApplicable: true,
      isCurrent: false,
      canNavigateTo: true,
    },
  ],
  payment: {
    isRequired: false,
    amount: '',
    hasPaid: false,
  },
};

let steps = [
  {
    uuid: 'd6cab0dd',
    slug: 'first-step',
    to: 'first-step',
    formDefinition: 'Stap 1',
    isCompleted: false,
    isApplicable: true,
    isCurrent: false,
    canNavigateTo: true,
  },
];

it('Progress Indicator renders expected steps', () => {
  steps = getStepsInfo(steps, submissionDefaults, 'https://some-form/startpagina');
  const updatedSteps = addFixedSteps(
    steps,
    submissionDefaults,
    'https://some-form/startpagina',
    true,
    true
  );

  act(() => {
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            progressIndicatorTitle="Progress"
            formTitle="Test Name"
            steps={updatedSteps}
            ariaMobileIconLabel="test aria mobile"
            accessibleToggleStepsLabel="test mobile"
          />
        </IntlProvider>
      </MemoryRouter>
    );
  });

  const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
  expect(progressIndicatorSteps.textContent).toContain('Startpagina');
  expect(progressIndicatorSteps.textContent).toContain('Stap 1');
  expect(progressIndicatorSteps.textContent).toContain('Overzicht');
  expect(progressIndicatorSteps.textContent).toContain('Bevestiging');
});

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import ProgressIndicator from './index';
import {SUBMISSION_ALLOWED} from 'components/constants';
import messagesNL from 'i18n/compiled/nl.json';
import {IsFormDesigner} from 'headers';

jest.mock('headers');

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

const submissionDefaults = {
  id: 'some-id',
  url: 'https://some-url',
  form: 'https://some-form',
  steps: [],
  payment: {
    isRequired: false,
    amount: '',
    hasPaid: false,
  },
};

it('Progress Indicator submission allowed', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            title="Test Name"
            steps={[]}
            submission={{...submissionDefaults, submissionAllowed: SUBMISSION_ALLOWED.yes}}
            submissionAllowed={SUBMISSION_ALLOWED.yes}
          />
        </IntlProvider>
      </MemoryRouter>,
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
      <MemoryRouter initialEntries={['/']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            title="Test Name"
            steps={[]}
            submission={{
              ...submissionDefaults,
              submissionAllowed: SUBMISSION_ALLOWED.noWithOverview,
            }}
            submissionAllowed={SUBMISSION_ALLOWED.noWithOverview}
          />
        </IntlProvider>
      </MemoryRouter>,
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
      <MemoryRouter initialEntries={['/']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            title="Test Name"
            steps={[]}
            submission={{
              ...submissionDefaults,
              submissionAllowed: SUBMISSION_ALLOWED.noWithoutOverview,
            }}
            submissionAllowed={SUBMISSION_ALLOWED.noWithoutOverview}
          />
        </IntlProvider>
      </MemoryRouter>,
      container
    );
  });

  const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
  expect(progressIndicatorSteps.textContent).toContain('Inloggen');
  expect(progressIndicatorSteps.textContent).not.toContain('Overzicht');
  expect(progressIndicatorSteps.textContent).not.toContain('Bevestiging');
});

it('Form landing page, no submission present in session', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            title="Test Name"
            steps={[]}
            submission={null}
            submissionAllowed={SUBMISSION_ALLOWED.yes}
          />
        </IntlProvider>
      </MemoryRouter>,
      container
    );
  });

  const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
  expect(progressIndicatorSteps.textContent).toContain('Inloggen');
  expect(progressIndicatorSteps.textContent).toContain('Overzicht');
  expect(progressIndicatorSteps.textContent).toContain('Bevestiging');
});

it('Progress indicator does NOT let you navigate between steps if you are NOT a form designer', () => {
  const steps = [
    {
      slug: 'step-1',
      formDefinition: 'Step 1',
      index: 0,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/111',
      uuid: '111',
      completed: true,
    },
    {
      slug: 'step-2',
      formDefinition: 'Step 2',
      index: 1,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/222',
      uuid: '222',
      completed: false,
    },
    {
      slug: 'step-3',
      formDefinition: 'Step 3',
      index: 2,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/333',
      uuid: '333',
      completed: false,
    },
  ];

  IsFormDesigner.getValue.mockReturnValue(false);

  act(() => {
    render(
      <MemoryRouter initialEntries={['/stap/step-2']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            title="Test Name"
            steps={steps}
            submission={{
              ...submissionDefaults,
              submissionAllowed: SUBMISSION_ALLOWED.yes,
              steps: steps,
            }}
            submissionAllowed={SUBMISSION_ALLOWED.yes}
          />
        </IntlProvider>
      </MemoryRouter>,
      container
    );
  });

  const step1 = container.getElementsByTagName('li')[1]; // Item 0 is the 'inloggen' step
  const step3 = container.getElementsByTagName('li')[3];

  const link = step1.getElementsByTagName('a')[0];
  const disabledLink = step3.getElementsByTagName('span')[0];

  expect(link).not.toBeUndefined();
  expect(disabledLink).not.toBeUndefined();

  expect(link.textContent).toContain('Step 1');
  expect(disabledLink.textContent).toContain('Step 3');
});

it('Progress indicator DOES let you navigate between steps if you ARE a form designer', () => {
  const steps = [
    {
      slug: 'step-1',
      formDefinition: 'Step 1',
      index: 0,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/111',
      uuid: '111',
      completed: true,
    },
    {
      slug: 'step-2',
      formDefinition: 'Step 2',
      index: 1,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/222',
      uuid: '222',
      completed: false,
    },
    {
      slug: 'step-3',
      formDefinition: 'Step 3',
      index: 2,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/333',
      uuid: '333',
      completed: false,
    },
  ];

  IsFormDesigner.getValue.mockReturnValue(true);

  act(() => {
    render(
      <MemoryRouter initialEntries={['/stap/step-2']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            title="Test Name"
            steps={steps}
            submission={{
              ...submissionDefaults,
              submissionAllowed: SUBMISSION_ALLOWED.yes,
              steps: steps,
            }}
            submissionAllowed={SUBMISSION_ALLOWED.yes}
          />
        </IntlProvider>
      </MemoryRouter>,
      container
    );
  });

  const step1 = container.getElementsByTagName('li')[1]; // Item 0 is the 'inloggen' step
  const step3 = container.getElementsByTagName('li')[3];

  const link1 = step1.getElementsByTagName('a')[0];
  const link2 = step3.getElementsByTagName('a')[0];

  expect(link1).not.toBeUndefined();
  expect(link2).not.toBeUndefined();

  expect(link1.textContent).toContain('Step 1');
  expect(link2.textContent).toContain('Step 3');
});

it('Progress indicator DOES let you navigate between steps if you are NOT a form designer but a step is NOT applicable', () => {
  const steps = [
    {
      slug: 'step-1',
      formDefinition: 'Step 1',
      index: 0,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/111',
      uuid: '111',
      completed: true,
    },
    {
      slug: 'step-2',
      formDefinition: 'Step 2',
      index: 1,
      isApplicable: false,
      url: 'http://test.nl/api/v1/forms/111/steps/222',
      uuid: '222',
      completed: false,
    },
    {
      slug: 'step-3',
      formDefinition: 'Step 3',
      index: 2,
      isApplicable: true,
      url: 'http://test.nl/api/v1/forms/111/steps/333',
      uuid: '333',
      completed: false,
    },
  ];

  IsFormDesigner.getValue.mockReturnValue(false);

  act(() => {
    render(
      <MemoryRouter initialEntries={['/stap/step-1']}>
        <IntlProvider locale="nl" messages={messagesNL}>
          <ProgressIndicator
            title="Test Name"
            steps={steps}
            submission={{
              ...submissionDefaults,
              submissionAllowed: SUBMISSION_ALLOWED.yes,
              steps: steps,
            }}
            submissionAllowed={SUBMISSION_ALLOWED.yes}
          />
        </IntlProvider>
      </MemoryRouter>,
      container
    );
  });

  const step3 = container.getElementsByTagName('li')[3];

  const link = step3.getElementsByTagName('a')[0];

  expect(link).not.toBeUndefined();
  expect(link.textContent).toContain('Step 3');
});

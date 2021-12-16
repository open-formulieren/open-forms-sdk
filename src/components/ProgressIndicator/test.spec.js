import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import ProgressIndicator from './index';
import {SUBMISSION_ALLOWED} from 'components/constants';


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
      <MemoryRouter initialEntries={['/']}>
        <ProgressIndicator
          title="Test Name"
          steps={[]}
          submission={{steps: [], submissionAllowed: SUBMISSION_ALLOWED.yes}}
        />
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
        <ProgressIndicator
          title="Test Name"
          steps={[]}
          submission={{steps: [], submissionAllowed: SUBMISSION_ALLOWED.noWithOverview}}
        />
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
        <ProgressIndicator
          title="Test Name"
          steps={[]}
          submission={{steps: [], submissionAllowed: SUBMISSION_ALLOWED.noWithoutOverview}}
        />
      </MemoryRouter>,
      container
    );
  });

  const progressIndicatorSteps = container.getElementsByTagName('ol')[0];
  expect(progressIndicatorSteps.textContent).toContain('Inloggen');
  expect(progressIndicatorSteps.textContent).not.toContain('Overzicht');
  expect(progressIndicatorSteps.textContent).not.toContain('Bevestiging');
});

import {render as renderTest, screen} from '@testing-library/react';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {MemoryRouter} from 'react-router-dom';

import {SUBMISSION_ALLOWED} from 'components/constants';

import ButtonsToolbar from './index';

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

const LITERALS = {
  nextText: {value: '', resolved: 'Next step'},
  saveText: {value: '', resolved: 'Save step'},
  previousText: {value: '', resolved: 'Previous step'},
};

it('Last step of submittable form, button is present', () => {
  const mockFunction = jest.fn();

  act(() => {
    root.render(
      <MemoryRouter>
        <ButtonsToolbar
          literals={LITERALS}
          canSubmitStep={true}
          canSubmitForm={SUBMISSION_ALLOWED.yes}
          canSuspendForm={true}
          isAuthenticated={false}
          isLastStep={true}
          isCheckingLogic={false}
          loginRequired={false}
          onFormSave={mockFunction}
          onLogout={mockFunction}
          previousPage="#"
        />
      </MemoryRouter>
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(3);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
  expect(buttons[2].textContent).toEqual('Next step');
});

it('Last step of non-submittable form with overview, button is present', () => {
  const mockFunction = jest.fn();

  act(() => {
    root.render(
      <MemoryRouter>
        <ButtonsToolbar
          literals={LITERALS}
          canSubmitStep={true}
          canSubmitForm={SUBMISSION_ALLOWED.noWithOverview}
          canSuspendForm={true}
          isAuthenticated={false}
          isLastStep={true}
          isCheckingLogic={false}
          loginRequired={false}
          previousPage="#"
          onFormSave={mockFunction}
          onLogout={mockFunction}
        />
      </MemoryRouter>
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(3);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
  expect(buttons[2].textContent).toEqual('Next step');
});

it('Last step of non-submittable form without overview, button is NOT present', () => {
  const mockFunction = jest.fn();

  act(() => {
    root.render(
      <MemoryRouter>
        <ButtonsToolbar
          literals={LITERALS}
          canSubmitStep={true}
          canSubmitForm={SUBMISSION_ALLOWED.noWithoutOverview}
          canSuspendForm={true}
          isAuthenticated={false}
          isLastStep={true}
          isCheckingLogic={false}
          loginRequired={false}
          previousPage="#"
          onFormSave={mockFunction}
          onLogout={mockFunction}
        />
      </MemoryRouter>
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(2);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
});

it('Non-last step of non-submittable form without overview, button IS present', () => {
  const mockFunction = jest.fn();

  act(() => {
    root.render(
      <MemoryRouter>
        <ButtonsToolbar
          literals={LITERALS}
          canSubmitStep={true}
          canSubmitForm={SUBMISSION_ALLOWED.noWithoutOverview}
          canSuspendForm={true}
          isAuthenticated={false}
          isLastStep={false}
          isCheckingLogic={false}
          loginRequired={false}
          previousPage="#"
          onFormSave={mockFunction}
          onLogout={mockFunction}
        />
      </MemoryRouter>
    );
  });

  const buttons = container.getElementsByClassName('openforms-toolbar__list-item');

  expect(buttons.length).toEqual(3);
  expect(buttons[0].textContent).toEqual('Previous step');
  expect(buttons[1].textContent).toEqual('Save step');
  expect(buttons[2].textContent).toEqual('Next step');
});

it('Suspending form allowed, button is present', () => {
  const mockFunction = jest.fn();

  renderTest(
    <MemoryRouter>
      <ButtonsToolbar
        literals={LITERALS}
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.yes}
        canSuspendForm={true}
        isAuthenticated={false}
        isLastStep={true}
        isCheckingLogic={false}
        loginRequired={false}
        previousPage="#"
        onFormSave={mockFunction}
        onLogout={mockFunction}
      />
    </MemoryRouter>
  );

  expect(screen.queryByText('Save step')).toBeInTheDocument();
});

it('Suspending form not allowed, button is NOT present', () => {
  const mockFunction = jest.fn();

  renderTest(
    <MemoryRouter>
      <ButtonsToolbar
        literals={LITERALS}
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.yes}
        canSuspendForm={false}
        isAuthenticated={false}
        isLastStep={true}
        isCheckingLogic={false}
        loginRequired={false}
        previousPage="#"
        onFormSave={mockFunction}
        onLogout={mockFunction}
      />
    </MemoryRouter>
  );

  expect(screen.queryByText('Save step')).not.toBeInTheDocument();
});

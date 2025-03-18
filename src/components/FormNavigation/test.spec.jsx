import {render, screen} from '@testing-library/react';
import messagesNL from 'i18n/compiled/nl.json';
import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router';

import {LiteralsProvider} from 'components/Literal';
import {SUBMISSION_ALLOWED} from 'components/constants';

import FormNavigation from './index';

const LITERALS = {
  nextText: {value: '', resolved: 'Next step'},
  saveText: {value: '', resolved: 'Save step'},
  previousText: {value: '', resolved: 'Previous step'},
};

const Wrap = ({children}) => (
  <IntlProvider locale="nl" messages={messagesNL}>
    <MemoryRouter>
      <LiteralsProvider literals={LITERALS}>{children}</LiteralsProvider>
    </MemoryRouter>
  </IntlProvider>
);

it('Last step of submittable form, button is present', () => {
  const mockFunction = vi.fn();

  render(
    <Wrap>
      <FormNavigation
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.yes}
        canSuspendForm={true}
        isAuthenticated={false}
        isLastStep={true}
        isCheckingLogic={false}
        loginRequired={false}
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
        previousPage="#"
      />
    </Wrap>
  );

  expect(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Next step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

it('Last step of non-submittable form with overview, button is present', () => {
  const mockFunction = vi.fn();

  render(
    <Wrap>
      <FormNavigation
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.noWithOverview}
        canSuspendForm={true}
        isAuthenticated={false}
        isLastStep={true}
        isCheckingLogic={false}
        loginRequired={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  expect(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Next step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

it('Last step of non-submittable form without overview, button is NOT present', () => {
  const mockFunction = vi.fn();

  render(
    <Wrap>
      <FormNavigation
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.noWithoutOverview}
        canSuspendForm={true}
        isAuthenticated={false}
        isLastStep={true}
        isCheckingLogic={false}
        loginRequired={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  expect(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  expect(screen.queryByRole('button', {name: 'Next step'})).not.toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

it('Non-last step of non-submittable form without overview, button IS present', () => {
  const mockFunction = vi.fn();

  render(
    <Wrap>
      <FormNavigation
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.noWithoutOverview}
        canSuspendForm={true}
        isAuthenticated={false}
        isLastStep={false}
        isCheckingLogic={false}
        loginRequired={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  expect(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Next step'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

it('Suspending form allowed, button is present', () => {
  const mockFunction = vi.fn();

  render(
    <Wrap>
      <FormNavigation
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.yes}
        canSuspendForm={true}
        isAuthenticated={false}
        isLastStep={true}
        isCheckingLogic={false}
        loginRequired={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  expect(screen.queryByText('Save step')).toBeInTheDocument();
});

it('Suspending form not allowed, button is NOT present', () => {
  const mockFunction = vi.fn();

  render(
    <Wrap>
      <FormNavigation
        canSubmitStep={true}
        canSubmitForm={SUBMISSION_ALLOWED.yes}
        canSuspendForm={false}
        isAuthenticated={false}
        isLastStep={true}
        isCheckingLogic={false}
        loginRequired={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  expect(screen.queryByText('Save step')).not.toBeInTheDocument();
});

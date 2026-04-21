import {IntlProvider} from 'react-intl';
import {MemoryRouter} from 'react-router';
import {expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

import {LiteralsProvider} from '@/components/Literal';
import messagesNL from '@/i18n/compiled/nl.json';

import FormNavigation, {StepSubmitButton} from './index';

const LITERALS = {
  nextText: {value: '', resolved: 'Next step'},
  saveText: {value: '', resolved: 'Save step'},
  previousText: {value: '', resolved: 'Previous step'},
};

const Wrap: React.FC<React.PropsWithChildren> = ({children}) => (
  <IntlProvider locale="nl" messages={messagesNL}>
    <MemoryRouter>
      <LiteralsProvider literals={LITERALS}>{children}</LiteralsProvider>
    </MemoryRouter>
  </IntlProvider>
);

test('Last step of submittable form, button is present', async () => {
  const mockFunction = vi.fn();

  const screen = await render(
    <Wrap>
      <FormNavigation
        submitButton={
          <StepSubmitButton canSubmitForm="yes" canSubmitStep isLastStep isCheckingLogic={false} />
        }
        isAuthenticated={false}
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
        previousPage="#"
      />
    </Wrap>
  );

  await expect.element(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Next step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

test('Last step of non-submittable form with overview, button is present', async () => {
  const mockFunction = vi.fn();

  const screen = await render(
    <Wrap>
      <FormNavigation
        submitButton={
          <StepSubmitButton
            canSubmitForm="no_with_overview"
            canSubmitStep
            isLastStep
            isCheckingLogic={false}
          />
        }
        isAuthenticated={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  await expect.element(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Next step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

test('Last step of non-submittable form without overview, button is NOT present', async () => {
  const mockFunction = vi.fn();

  const screen = await render(
    <Wrap>
      <FormNavigation
        submitButton={
          <StepSubmitButton
            canSubmitForm="no_without_overview"
            canSubmitStep
            isLastStep
            isCheckingLogic={false}
          />
        }
        isAuthenticated={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  await expect.element(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Next step'})).not.toBeInTheDocument();
  await expect.element(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

test('Non-last step of non-submittable form without overview, button IS present', async () => {
  const mockFunction = vi.fn();

  const screen = await render(
    <Wrap>
      <FormNavigation
        submitButton={
          <StepSubmitButton
            canSubmitForm="no_with_overview"
            canSubmitStep
            isLastStep={false}
            isCheckingLogic={false}
          />
        }
        isAuthenticated={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  await expect.element(screen.getByRole('link', {name: 'Previous step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Save step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Next step'})).toBeVisible();
  await expect.element(screen.getByRole('button', {name: 'Annuleren'})).toBeVisible();
});

test('Suspending form allowed, button is present', async () => {
  const mockFunction = vi.fn();

  const screen = await render(
    <Wrap>
      <FormNavigation
        submitButton={
          <StepSubmitButton canSubmitForm="yes" canSubmitStep isLastStep isCheckingLogic={false} />
        }
        isAuthenticated={false}
        previousPage="#"
        onFormSave={mockFunction}
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  await expect.element(screen.getByText('Save step')).toBeVisible();
});

test('Suspending form not allowed, button is NOT present', async () => {
  const mockFunction = vi.fn();

  const screen = await render(
    <Wrap>
      <FormNavigation
        submitButton={
          <StepSubmitButton canSubmitForm="yes" canSubmitStep isLastStep isCheckingLogic={false} />
        }
        onFormSave={undefined}
        isAuthenticated={false}
        previousPage="#"
        onDestroySession={mockFunction}
      />
    </Wrap>
  );

  await expect.element(screen.getByText('Save step')).not.toBeInTheDocument();
});

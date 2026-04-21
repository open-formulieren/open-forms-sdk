import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';
import {userEvent} from 'vitest/browser';

import {ConfigContext, FormContext} from '@/Context';
import {updateSessionExpiry} from '@/api';
import {BASE_URL, buildForm, buildSubmission} from '@/api-mocks';
import {
  mockAppointmentCustomerFieldsGet,
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentPost,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '@/api-mocks/appointments';
import mswWorker from '@/api-mocks/msw-worker';
import {mockSubmissionPost, mockSubmissionProcessingStatusErrorGet} from '@/api-mocks/submissions';
import {SESSION_STORAGE_KEY as SUBMISSION_SESSION_STORAGE_KEY} from '@/hooks/useGetOrCreateSubmission';
import messagesEN from '@/i18n/compiled/en.json';
import routes, {FUTURE_FLAGS} from '@/routes';

import type {AppointmentDataByStep} from '../types';
import {SESSION_STORAGE_KEY as APPOINTMENT_SESSION_STORAGE_KEY} from './CreateAppointmentState';

const renderApp = async (initialRoute: string = '/') => {
  const form = buildForm({
    appointmentOptions: {
      isAppointment: true,
      supportsMultipleProducts: true,
    },
  });
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  return await render(
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        debug: false,
      }}
    >
      <IntlProvider locale="en" messages={messagesEN}>
        <FormContext.Provider value={form}>
          <RouterProvider router={router} />
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
});

describe('Create appointment session expiration', () => {
  test('resets the session storage/local state', {timeout: 15_000}, async () => {
    mswWorker.use(
      mockSubmissionPost(buildSubmission({steps: []})),
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentDatesGet,
      mockAppointmentTimesGet
    );
    // initially render the app
    const screen = await renderApp();

    // wait for submission to be created and recorded in the local storage
    await expect.poll(() => sessionStorage.getItem('appointment|submission')).not.toBe('null');

    // select a product
    await expect.poll(() => screen.getByRole('combobox').all()).toHaveLength(1);
    await screen.getByRole('combobox').click();

    await userEvent.keyboard('[ArrowDown]');
    const product = screen.getByText('Paspoort aanvraag');
    await expect.element(product).toBeVisible();
    await product.click();

    // submit and navigate to the next page
    await screen.getByRole('button', {name: 'Confirm products'}).click();

    // and wait until locations etc. are loaded
    await expect.element(screen.getByLabelText('Location', {exact: true})).toBeVisible();

    // now finally let the session timeout in 1s
    updateSessionExpiry(1);

    await expect
      .element(screen.getByRole('heading', {name: 'Your session has expired'}))
      .toBeVisible();

    // and click the link to restart...
    const restartLink = screen.getByRole('link', {name: 'Click here to restart'});
    await restartLink.click();

    // Here, take this if you need to figure out which keys are present
    // console.log(Object.entries(sessionStorage));

    // introspect session storage
    await expect.poll(() => sessionStorage.getItem('appointment|formData')).toBe('{}');
    await expect.element(screen.getByText('Select your product(s)')).toBeVisible();

    const productDropdown = screen.getByRole('combobox');
    await expect.element(productDropdown).toHaveDisplayValue('');

    // wait for submission to be created and recorded in the local storage, as this confirms
    // there are no more pending requests
    await expect.poll(() => sessionStorage.getItem('appointment|submission')).not.toBe('null');
  });
});

describe('Create appointment status checking', () => {
  test('displays error status message on summary page', async () => {
    mswWorker.use(
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentCustomerFieldsGet,
      mockAppointmentPost,
      mockSubmissionProcessingStatusErrorGet
    );
    // set the appointment data in sessionStorage
    const submission = buildSubmission({steps: []});
    const appointmentData: AppointmentDataByStep = {
      producten: {
        products: [{productId: '166a5c79', amount: 1, amountLimit: 0}],
      },
      kalender: {
        location: '1396f17c',
        date: '2023-08-22',
        datetime: '2023-08-22T15:00:00+02:00',
      },
      contactgegevens: {contactDetails: {lastName: 'Gem'}},
    };
    sessionStorage.setItem(SUBMISSION_SESSION_STORAGE_KEY, JSON.stringify(submission));
    sessionStorage.setItem(APPOINTMENT_SESSION_STORAGE_KEY, JSON.stringify(appointmentData));

    const screen = await renderApp('/afspraak-maken/overzicht');

    await expect.element(screen.getByText('Paspoort aanvraag')).toBeVisible();
    // check all checkboxes
    for (const checkbox of screen.getByRole('checkbox').all()) {
      await checkbox.click();
    }
    const submitButton = screen.getByRole('button', {name: 'Confirm'});
    await expect.element(submitButton).toHaveAttribute('aria-disabled', 'false');
    await submitButton.click();

    await expect.poll(() => screen.getByText(/Processing/)).toBeVisible();
    // wait for summary page to be rendered again
    await expect.element(screen.getByRole('heading', {name: 'Check and confirm'})).toBeVisible();
    await expect.element(screen.getByText('Computer says no.')).toBeVisible();

    // submitting again causes error message to vanish
    for (const checkbox of screen.getByRole('checkbox').all()) {
      await checkbox.click();
    }
    const submitButton2 = screen.getByRole('button', {name: 'Confirm'});
    await submitButton2.click();

    await expect.element(screen.getByText('Computer says no.')).not.toBeInTheDocument();

    // wait for network IO to settle again
    await expect.element(screen.getByText('Computer says no.')).toBeVisible();
  });
});

describe('The create appointment wrapper', () => {
  test('prevents the ./kalender nested route from being accessed directly', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission({steps: []})), mockAppointmentProductsGet);

    const screen = await renderApp('/afspraak-maken/kalender');

    await expect
      .element(screen.getByRole('heading', {name: 'Select your product(s)'}))
      .toBeVisible();
    await expect
      .element(screen.getByRole('heading', {name: 'Location and time'}))
      .not.toBeInTheDocument();
  });

  test('prevents the ./contactgegevens nested route from being accessed directly', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission({steps: []})), mockAppointmentProductsGet);

    const screen = await renderApp('/afspraak-maken/contactgegevens');

    await expect
      .element(screen.getByRole('heading', {name: 'Select your product(s)'}))
      .toBeVisible();
    await expect
      .element(screen.getByRole('heading', {name: 'Contact details'}))
      .not.toBeInTheDocument();
  });
});

describe('Preselecting a product via querystring', () => {
  test('displays the preselected product in the dropdown', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission({steps: []})), mockAppointmentProductsGet);

    const screen = await renderApp('/?product=166a5c79');

    const productDropdown = screen.getByRole('combobox');
    await expect.element(productDropdown).toBeVisible();
    // and the product should be auto selected
    await expect.element(screen.getByText('Paspoort aanvraag')).toBeVisible();
  });

  test('does not crash on invalid product IDs', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission({steps: []})), mockAppointmentProductsGet);

    const screen = await renderApp('/?product=bb72a36b-b791');

    const productDropdown = screen.getByRole('combobox');
    await expect.element(productDropdown).toBeVisible();
    // nothing should be selected
    await expect.element(screen.getByText('Paspoort aanvraag')).not.toBeInTheDocument();
    await expect
      .element(screen.getByText('Rijbewijs aanvraag (Drivers license)'))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByText('Not available with drivers license'))
      .not.toBeInTheDocument();

    // now open the dropdown and select a product
    await productDropdown.click();
    await userEvent.keyboard('[ArrowDown]');
    const option = screen.getByRole('option', {name: 'Paspoort aanvraag'});
    await expect.element(option).toBeVisible();
    await option.click();
    await expect
      .element(screen.getByText('Rijbewijs aanvraag (Drivers license)'))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByText('Not available with drivers license'))
      .not.toBeInTheDocument();
    await expect.element(screen.getByText('Paspoort aanvraag', {exact: true})).toBeVisible();
  });
});

describe('Changing the product amounts', () => {
  // regression test for https://github.com/open-formulieren/open-forms/issues/3536
  test('does not crash when clearing the amount field to enter a value', async () => {
    mswWorker.use(mockSubmissionPost(buildSubmission({steps: []})), mockAppointmentProductsGet);

    const screen = await renderApp();

    const productDropdown = screen.getByRole('combobox');
    await expect.element(productDropdown).toBeVisible();

    const amountInput = screen.getByLabelText('Amount');
    await expect.element(amountInput).toBeVisible();
    await expect.element(amountInput).toHaveDisplayValue('1');

    // clear the field value to enter a different value
    await userEvent.clear(amountInput);
    await amountInput.fill('3');
    await expect.element(amountInput).toHaveDisplayValue('3');
  });
});

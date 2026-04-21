import {IntlProvider} from 'react-intl';
import type {RouteObject} from 'react-router';
import {Outlet, RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {render as realRender} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm, buildSubmission} from '@/api-mocks';
import {
  mockAppointmentCustomerFieldsGet,
  mockAppointmentErrorPost,
  mockAppointmentLocationsGet,
  mockAppointmentPost,
  mockAppointmentProductsGet,
} from '@/api-mocks/appointments';
import mswWorker from '@/api-mocks/msw-worker';
import {LiteralsProvider} from '@/components/Literal';
import messagesEN from '@/i18n/compiled/en.json';
import {FUTURE_FLAGS} from '@/routes';

import {CreateAppointmentContext} from '../Context';
import type {AppointmentDataByStep} from '../types';
import {buildContextValue} from './CreateAppointmentState';
import Summary from './Summary';

const renderSummary = async (
  errorHandler?: Parameters<typeof buildContextValue>[0]['setAppointmentErrors']
) => {
  const appointmentData: AppointmentDataByStep = {
    producten: {
      products: [{productId: '166a5c79', amount: 1, amountLimit: 0}],
    },
    kalender: {
      location: '1396f17c',
      date: '2023-07-12',
      datetime: `2023-07-12T08:00:00Z`,
    },
    contactgegevens: {
      contactDetails: {
        lastName: 'Kundera',
        dateOfBirth: '1929-04-01',
        email: 'milan@kundera.cz',
        phone: '12345678',
        bsn: '123456782',
        gender: 'M',
      },
    },
  };
  const form = buildForm();
  const appointmentContext = buildContextValue({
    submission: buildSubmission({
      url: `${BASE_URL}submissions/64042633-a995-40c8-ad18-3e098b9527d1`,
    }),
    currentStep: '',
    appointmentData: appointmentData,
    setAppointmentErrors: errorHandler,
  });
  const routes: RouteObject[] = [
    {
      path: '/appointments',
      children: [
        {
          path: '*',
          element: (
            <ConfigContext.Provider
              value={{
                baseUrl: BASE_URL,
                basePath: '',
                clientBaseUrl: '',
                baseTitle: '',
                requiredFieldsWithAsterisk: true,
                debug: false,
              }}
            >
              <IntlProvider locale="en" messages={messagesEN}>
                <LiteralsProvider literals={form.literals}>
                  <CreateAppointmentContext.Provider value={appointmentContext}>
                    <Outlet />
                  </CreateAppointmentContext.Provider>
                </LiteralsProvider>
              </IntlProvider>
            </ConfigContext.Provider>
          ),
          children: [
            {
              path: 'contactgegevens',
              element: <>Back to contact details.</>,
            },
            {
              path: 'overzicht',
              element: <Summary />,
            },
            {
              path: 'bevestiging',
              element: <>Everyone likes confirmation.</>,
            },
          ],
        },
      ],
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/appointments/overzicht'],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  return await realRender(
    <FormContext.Provider value={form}>
      <RouterProvider router={router} />
    </FormContext.Provider>
  );
};

beforeEach(() => {
  window.sessionStorage.clear();
  mswWorker.use(
    mockAppointmentProductsGet,
    mockAppointmentLocationsGet,
    mockAppointmentCustomerFieldsGet
  );
});

afterEach(() => {
  window.sessionStorage.clear();
});

describe('The appointment summary', () => {
  test('displays the human readable data', async () => {
    const screen = await renderSummary();

    await expect.element(screen.getByText('Paspoort aanvraag', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('Open Gem', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('7/12/2023', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('10:00 AM', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('Kundera', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('4/1/1929', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('milan@kundera.cz', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('12345678', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('123456782', {exact: true})).toBeVisible();
    await expect.element(screen.getByText('Male', {exact: true})).toBeVisible();
  });

  test('disables the submit button when the privacy policy needs to be accepted', async () => {
    const screen = await renderSummary();

    await expect.element(screen.getByText('Paspoort aanvraag')).toBeVisible();
    const checkbox = screen.getByLabelText(
      'I accept the privacy policy and consent to the processing of my personal data.'
    );
    await expect.element(checkbox).not.toBeChecked();
    const submitButton = screen.getByRole('button', {name: 'Confirm'});
    await expect.element(submitButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('enables the submit button when the privacy policy is accepted', async () => {
    mswWorker.use(mockAppointmentPost);

    const screen = await renderSummary();

    // enable the submit button
    await expect.element(screen.getByText('Paspoort aanvraag')).toBeVisible();
    const checkbox = screen.getByLabelText(
      'I accept the privacy policy and consent to the processing of my personal data.'
    );
    await checkbox.click();
    const submitButton = screen.getByRole('button', {name: 'Confirm'});
    await expect.element(submitButton).not.toHaveAttribute('aria-disabled', 'true');

    // submit the form -> this creates the appointment and redirects to the confirmation
    // page.
    await submitButton.click();

    await expect.element(screen.getByText('Everyone likes confirmation.')).toBeVisible();
  });

  test('processes backend validation errors', async () => {
    mswWorker.use(mockAppointmentErrorPost);
    const errorHandler = vi.fn();

    const screen = await renderSummary(errorHandler);

    const checkbox = screen.getByLabelText(
      'I accept the privacy policy and consent to the processing of my personal data.'
    );
    await checkbox.click();
    const submitButton = screen.getByRole('button', {name: 'Confirm'});
    await expect.element(submitButton).not.toHaveAttribute('aria-disabled', 'true');
    await submitButton.click();

    await expect.poll(() => errorHandler.mock.calls).toHaveLength(1);
    expect(errorHandler).toHaveBeenCalledWith({
      initialTouched: {
        contactDetails: {dateOfBirth: true},
      },
      initialErrors: {
        contactDetails: {dateOfBirth: 'You cannot be born in the future.'},
      },
    });

    await expect.element(screen.getByText('Back to contact details.')).toBeVisible();
  });
});

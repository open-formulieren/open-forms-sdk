import {IntlProvider} from 'react-intl';
import type {RouteObject} from 'react-router';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {render as realRender} from 'vitest-browser-react';

import {ConfigContext} from '@/Context';
import {BASE_URL, buildSubmission} from '@/api-mocks';
import {
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '@/api-mocks/appointments';
import mswWorker from '@/api-mocks/msw-worker';
import messagesEN from '@/i18n/compiled/en.json';
import {FUTURE_FLAGS} from '@/routes';

import {CreateAppointmentContext} from '../Context';
import {buildContextValue} from '../CreateAppointment/CreateAppointmentState';
import type {AppointmentDataByStep} from '../types';
import LocationAndTimeStep from './LocationAndTimeStep';

const render = async (
  initialValues: AppointmentDataByStep['producten'] & AppointmentDataByStep['kalender']
) => {
  const {products, ...stepData} = initialValues;
  const appointmentContext = buildContextValue({
    submission: buildSubmission(),
    currentStep: 'kalender',
    appointmentData: {
      producten: {products},
      kalender: stepData,
    },
  });
  const routes: RouteObject[] = [
    {
      path: '/appointments/kalender',
      element: (
        <ConfigContext.Provider
          value={{
            baseUrl: BASE_URL,
            showFormTitle: true,
            basePath: '',
            clientBaseUrl: '',
            baseTitle: '',
            requiredFieldsWithAsterisk: true,
            debug: false,
          }}
        >
          <IntlProvider locale="en" messages={messagesEN}>
            <CreateAppointmentContext.Provider value={appointmentContext}>
              <LocationAndTimeStep />
            </CreateAppointmentContext.Provider>
          </IntlProvider>
        </ConfigContext.Provider>
      ),
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/appointments/kalender'],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  return await realRender(<RouterProvider router={router} />);
};

beforeEach(() => {
  vi.setSystemTime(new Date('2023-06-12T14:00:00Z'));
});

afterEach(() => {
  window.sessionStorage.clear();
});

describe('The location and time step', () => {
  test('disables date and time until a location is selected', async () => {
    mswWorker.use(mockAppointmentProductsGet, mockAppointmentLocationsGet);

    const screen = await render(
      // product with multiple locations, see api-mocks/appointments
      {
        products: [{productId: 'e8e045ab', amount: 1, amountLimit: 0}],
        location: '',
        date: '',
        datetime: '',
      }
    );

    // No location should be selected, as there are multiple options
    await expect.element(screen.getByText('Open Gem (Amsterdam)')).not.toBeInTheDocument();
    await expect
      .element(screen.getByText('Bahamas (Winsome Dr, 1014 EG, Nassau)'))
      .not.toBeInTheDocument();
    await expect.element(screen.getByLabelText('Date')).toHaveAttribute('readonly');
    await expect.element(screen.getByLabelText('Time')).toHaveAttribute('aria-readonly', 'true');
  });

  test('disables time until a location and date are selected', async () => {
    mswWorker.use(mockAppointmentProductsGet, mockAppointmentLocationsGet, mockAppointmentDatesGet);

    const screen = await render({
      products: [{productId: 'e8e045ab', amount: 1, amountLimit: 0}],
      location: '34000e85',
      date: '',
      datetime: '',
    });

    await expect.element(screen.getByText('Bahamas (Winsome Dr, 1014 EG, Nassau)')).toBeVisible();
    await expect
      .element(screen.getByLabelText('Date'))
      .not.toHaveAttribute('aria-readonly', 'true');
    await expect.element(screen.getByLabelText('Time')).toHaveAttribute('aria-readonly', 'true');
  });

  test('retains focus on the date input', async () => {
    mswWorker.use(
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentDatesGet,
      mockAppointmentTimesGet
    );

    const screen = await render({
      products: [{productId: 'e8e045ab', amount: 1, amountLimit: 0}],
      location: '34000e85',
      date: '',
      datetime: '',
    });

    // location Bahamas always has 'today' available
    await expect.element(screen.getByText('Bahamas (Winsome Dr, 1014 EG, Nassau)')).toBeVisible();
    const dateInput = screen.getByLabelText('Date');
    await dateInput.fill('6/12/2023');
    await expect.element(dateInput).toHaveFocus();
  });

  test('enables time when a location and date are selected', async () => {
    mswWorker.use(
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentDatesGet,
      mockAppointmentTimesGet
    );

    const screen = await render({
      products: [{productId: 'e8e045ab', amount: 1, amountLimit: 0}],
      location: '34000e85',
      date: '2023-06-12', // location Bahamas always has 'today' available
      datetime: '',
    });

    await expect.element(screen.getByText('Bahamas (Winsome Dr, 1014 EG, Nassau)')).toBeVisible();
    await expect
      .element(screen.getByLabelText('Date'))
      .not.toHaveAttribute('aria-readonly', 'true');
    await expect
      .element(screen.getByLabelText('Time'))
      .not.toHaveAttribute('aria-readonly', 'true');
  });

  test('autoselects location when there is only one option and enables the date field', async () => {
    mswWorker.use(mockAppointmentProductsGet, mockAppointmentLocationsGet, mockAppointmentDatesGet);

    const screen = await render({
      products: [{productId: '166a5c79', amount: 1, amountLimit: 0}],
      location: '',
      date: '',
      datetime: '',
    });

    await expect.element(screen.getByText('Open Gem (Amsterdam)')).toBeVisible();
    await expect
      .element(screen.getByLabelText('Date'))
      .not.toHaveAttribute('aria-readonly', 'true');
    await expect.element(screen.getByLabelText('Time')).toHaveAttribute('aria-readonly', 'true');
  });
});

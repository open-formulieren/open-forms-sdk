import {act, render as realRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {BASE_URL, buildSubmission} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';

import {CreateAppointmentContext} from '../Context';
import {buildContextValue} from '../CreateAppointment/CreateAppointmentState';
import {
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '../mocks';
import LocationAndTimeStep from './LocationAndTimeStep';

const render = initialValues => {
  const {products, ...stepData} = initialValues;
  const appointmentContext = buildContextValue({
    submission: buildSubmission(),
    currentStep: 'kalender',
    appointmentData: {
      producten: {products},
      kalender: stepData,
    },
  });
  const routes = [
    {
      path: '/appointments/kalender',
      element: (
        <ConfigContext.Provider
          value={{
            baseUrl: BASE_URL,
            basePath: '',
            baseTitle: '',
            requiredFieldsWithAsterisk: true,
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
  });
  realRender(<RouterProvider router={router} />);
};

beforeEach(() => {
  vi.setSystemTime(new Date('2023-06-12T14:00:00Z'));
});

afterEach(() => {
  window.sessionStorage.clear();
});

describe('The location and time step', () => {
  it('disables date and time until a location is selected', async () => {
    mswServer.use(mockAppointmentProductsGet, mockAppointmentLocationsGet);

    await act(async () => {
      render(
        // product with multiple locations, see ./mocks.js
        {
          products: [{productId: 'e8e045ab', amount: 1}],
          location: '',
          date: '',
          datetime: '',
        }
      );
    });
    // No location should be selected, as there are multiple options
    await waitFor(() => {
      expect(screen.queryByText('Open Gem')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('Bahamas')).not.toBeInTheDocument();

    expect(screen.getByLabelText('Date')).toBeDisabled();
    expect(screen.getByLabelText('Time')).toBeDisabled();
  });

  it('disables time until a location and date are selected', async () => {
    mswServer.use(mockAppointmentProductsGet, mockAppointmentLocationsGet, mockAppointmentDatesGet);

    render({
      products: [{productId: 'e8e045ab', amount: 1}],
      location: '34000e85',
      date: '',
      datetime: '',
    });

    expect(await screen.findByText('Bahamas')).toBeVisible();
    expect(screen.getByLabelText('Date')).not.toBeDisabled();
    expect(screen.getByLabelText('Time')).toBeDisabled();
  });

  it('retains focus on the date input', async () => {
    const user = userEvent.setup();
    mswServer.use(
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentDatesGet,
      mockAppointmentTimesGet
    );

    render({
      products: [{productId: 'e8e045ab', amount: 1}],
      location: '34000e85',
      date: '',
      datetime: '',
    });

    // location Bahamas always has 'today' available
    expect(await screen.findByText('Bahamas')).toBeVisible();
    const dateInput = screen.getByLabelText('Date');
    await user.type(dateInput, '6/12/2023');
    expect(dateInput).toHaveFocus();
  });

  it('enables time when a location and date are selected', async () => {
    mswServer.use(
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentDatesGet,
      mockAppointmentTimesGet
    );

    render({
      products: [{productId: 'e8e045ab', amount: 1}],
      location: '34000e85',
      date: '2023-06-12', // location Bahamas always has 'today' available
      datetime: '',
    });

    expect(await screen.findByText('Bahamas')).toBeVisible();
    expect(screen.getByLabelText('Date')).not.toBeDisabled();
    expect(screen.getByLabelText('Time')).not.toBeDisabled();
  });

  it('autoselects location when there is only one option and enables the date field', async () => {
    mswServer.use(mockAppointmentProductsGet, mockAppointmentLocationsGet, mockAppointmentDatesGet);

    render({
      products: [{productId: '166a5c79', amount: 1}],
      location: '',
      date: '',
      datetime: '',
    });

    expect(await screen.findByText('Open Gem')).toBeVisible();
    await waitFor(() => {
      expect(screen.getByLabelText('Date')).not.toBeDisabled();
    });
    expect(screen.getByLabelText('Time')).toBeDisabled();
  });
});

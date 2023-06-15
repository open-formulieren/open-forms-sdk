import {jest} from '@jest/globals';
import {render as realRender, screen, waitFor} from '@testing-library/react';
import {Formik} from 'formik';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {BASE_URL} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';

import LocationAndTimeStep from './LocationAndTimeStep';
import {
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from './mocks';

const render = (comp, initialValues) => {
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
            displayComponents: {},
          }}
        >
          <IntlProvider locale="en" messages={messagesEN}>
            <Formik initialValues={initialValues} onSubmit={console.log}>
              {comp}
            </Formik>
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
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2023-06-12T14:00:00Z'));
  // Jest 28+
  // jest.useFakeTimers({
  //   advanceTimers: true,
  //   now: new Date('2023-06-12T14:00:00Z'),
  // });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('The location and time step', () => {
  it('disables date and time until a location is selected', async () => {
    mswServer.use(mockAppointmentProductsGet, mockAppointmentLocationsGet);

    render(
      <LocationAndTimeStep />,
      // product with multiple locations, see ./mocks.js
      {
        products: [{product: 'e8e045ab', amount: 1}],
        location: '',
        date: '',
        datetime: '',
      }
    );

    // No location should be selected, as there are multiple options
    await waitFor(() => {
      expect(screen.queryByText('Open Gem')).not.toBeInTheDocument();
      expect(screen.queryByText('Bahamas')).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText('Date')).toBeDisabled();
    expect(screen.getByLabelText('Time')).toBeDisabled();
  });

  it('disables time until a location and date are selected', async () => {
    mswServer.use(mockAppointmentProductsGet, mockAppointmentLocationsGet, mockAppointmentDatesGet);

    render(<LocationAndTimeStep />, {
      products: [{product: 'e8e045ab', amount: 1}],
      location: '34000e85',
      date: '',
      datetime: '',
    });

    expect(await screen.findByText('Bahamas')).toBeVisible();
    expect(screen.getByLabelText('Date')).not.toBeDisabled();
    expect(screen.getByLabelText('Time')).toBeDisabled();
  });

  it('enables time when a location and date are selected', async () => {
    mswServer.use(
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentDatesGet,
      mockAppointmentTimesGet
    );

    render(<LocationAndTimeStep />, {
      products: [{product: 'e8e045ab', amount: 1}],
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

    render(<LocationAndTimeStep />, {
      products: [{product: '166a5c79', amount: 1}],
      location: '',
      date: '',
      datetime: '',
    });

    expect(await screen.findByText('Open Gem')).toBeVisible();
    await waitFor(() => {
      expect(screen.getByLabelText('Date')).not.toBeDisabled();
      expect(screen.getByLabelText('Time')).toBeDisabled();
    });
  });
});

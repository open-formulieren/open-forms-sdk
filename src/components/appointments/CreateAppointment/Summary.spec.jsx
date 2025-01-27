import {render as realRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {Outlet, RouterProvider, createMemoryRouter} from 'react-router';

import {ConfigContext, FormContext} from 'Context';
import {BASE_URL, buildForm, buildSubmission} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {LiteralsProvider} from 'components/Literal';
import {FUTURE_FLAGS, PROVIDER_FUTURE_FLAGS} from 'routes';

import {CreateAppointmentContext} from '../Context';
import {
  mockAppointmentCustomerFieldsGet,
  mockAppointmentErrorPost,
  mockAppointmentLocationsGet,
  mockAppointmentPost,
  mockAppointmentProductsGet,
} from '../mocks';
import {buildContextValue} from './CreateAppointmentState';
import Summary from './Summary';

const renderSummary = errorHandler => {
  const appointmentData = {
    producten: {
      products: [{productId: '166a5c79', amount: 1}],
    },
    kalender: {
      location: '1396f17c',
      date: '2023-07-12',
      datetime: `2023-07-12T08:00:00Z`,
    },
    contactgegevens: {
      lastName: 'Kundera',
      dateOfBirth: '1929-04-01',
      email: 'milan@kundera.cz',
      phone: '12345678',
      bsn: '123456782',
      gender: 'M',
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
  const routes = [
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
                baseTitle: '',
                requiredFieldsWithAsterisk: true,
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
  realRender(
    <FormContext.Provider value={form}>
      <RouterProvider router={router} future={PROVIDER_FUTURE_FLAGS} />
    </FormContext.Provider>
  );
};

beforeEach(() => {
  window.sessionStorage.clear();
  mswServer.use(
    mockAppointmentProductsGet,
    mockAppointmentLocationsGet,
    mockAppointmentCustomerFieldsGet
  );
});

afterEach(() => {
  window.sessionStorage.clear();
});

describe('The appointment summary', () => {
  it('displays the human readable data', async () => {
    renderSummary();

    await screen.findByText('Paspoort aanvraag');
    await screen.findByText('Open Gem');
    await screen.findByText('7/12/2023');
    await screen.findByText('10:00 AM');
    await screen.findByText('Kundera');
    await screen.findByText('4/1/1929');
    await screen.findByText('milan@kundera.cz');
    await screen.findByText('12345678');
    await screen.findByText('123456782');
    await screen.findByText('Male');
  });

  it('disables the submit button when the privacy policy needs to be accepted', async () => {
    renderSummary();

    await screen.findByText('Paspoort aanvraag');
    const checkbox = await screen.findByLabelText(
      'I accept the privacy policy and consent to the processing of my personal data.'
    );
    expect(checkbox).not.toBeChecked();
    const submitButton = screen.getByRole('button', {name: 'Confirm'});
    expect(submitButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('enables the submit button when the privacy policy is accepted', async () => {
    mswServer.use(mockAppointmentPost);
    const user = userEvent.setup({delay: null});

    renderSummary();

    // enable the submit button
    await screen.findByText('Paspoort aanvraag');
    const checkbox = await screen.findByLabelText(
      'I accept the privacy policy and consent to the processing of my personal data.'
    );
    await user.click(checkbox);
    const submitButton = screen.getByRole('button', {name: 'Confirm'});
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');

    // submit the form -> this creates the appointment and redirects to the confirmation
    // page.
    await user.click(submitButton);

    await screen.findByText('Everyone likes confirmation.');
  });

  it('processes backend validation errors', async () => {
    mswServer.use(mockAppointmentErrorPost);
    const user = userEvent.setup({delay: null});
    const errorHandler = vi.fn();

    renderSummary(errorHandler);

    const checkbox = await screen.findByLabelText(
      'I accept the privacy policy and consent to the processing of my personal data.'
    );
    await user.click(checkbox);
    const submitButton = screen.getByRole('button', {name: 'Confirm'});
    expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
    await user.click(submitButton);

    await waitFor(() => {
      expect(errorHandler).toBeCalledWith({
        initialTouched: {
          contactDetails: {dateOfBirth: true},
        },
        initialErrors: {
          contactDetails: {dateOfBirth: 'You cannot be born in the future.'},
        },
      });
    });
    await screen.findByText('Back to contact details.');
  });
});

import {render as realRender, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext} from 'Context';
import {BASE_URL, buildSubmission} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {FUTURE_FLAGS, PROVIDER_FUTURE_FLAGS} from 'routes';

import {CreateAppointmentContext} from '../Context';
import {buildContextValue} from '../CreateAppointment/CreateAppointmentState';
import {mockAppointmentProductsGet} from '../mocks';
import ChooseProductStep from './ChooseProductStep';

const render = () => {
  const appointmentContext = buildContextValue({
    submission: buildSubmission(),
    currentStep: 'producten',
    appointmentData: {},
  });
  const routes = [
    {
      path: '/appointments/producten',
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
              <ChooseProductStep />
            </CreateAppointmentContext.Provider>
          </IntlProvider>
        </ConfigContext.Provider>
      ),
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/appointments/producten'],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  realRender(<RouterProvider router={router} future={PROVIDER_FUTURE_FLAGS} />);
};

afterEach(() => {
  window.sessionStorage.clear();
});

describe('The product selection step', () => {
  it('initially displays the full list of products', async () => {
    const user = userEvent.setup({delay: null});
    mswServer.use(mockAppointmentProductsGet);

    render();

    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(1);
    await user.click(dropdowns[0]);
    await user.keyboard('[ArrowDown]');
    expect(await screen.findByText('Paspoort aanvraag')).toBeVisible();
    expect(await screen.findByText('Rijbewijs aanvraag (Drivers license)')).toBeVisible();
  });

  it('limits the second product choices based on first choosen product', async () => {
    const user = userEvent.setup({delay: null});
    mswServer.use(mockAppointmentProductsGet);

    render();

    // select the first product which limits the choices for the second
    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(1);
    await user.click(dropdowns[0]);
    await user.keyboard('[ArrowDown]');
    await user.click(await screen.findByText('Rijbewijs aanvraag (Drivers license)'));

    const addButton = screen.getByRole('button', {name: 'Add another product'});
    await user.click(addButton);

    const updatedDropdowns = await screen.findAllByRole('combobox');
    expect(updatedDropdowns).toHaveLength(2);
    const secondDropdown = updatedDropdowns[1];
    await user.click(secondDropdown);
    await user.keyboard('[ArrowDown]');
    expect(await screen.findByText('Paspoort aanvraag')).toBeVisible();
    expect(screen.queryByText('Not available with drivers license')).not.toBeInTheDocument();
  });
});

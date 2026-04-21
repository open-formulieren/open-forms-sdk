import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {afterEach, describe, expect, test} from 'vitest';
import {render as realRender} from 'vitest-browser-react';
import {userEvent} from 'vitest/browser';

import {ConfigContext} from '@/Context';
import {BASE_URL, buildSubmission} from '@/api-mocks';
import {mockAppointmentProductsGet} from '@/api-mocks/appointments';
import mswWorker from '@/api-mocks/msw-worker';
import messagesEN from '@/i18n/compiled/en.json';
import {FUTURE_FLAGS} from '@/routes';

import {CreateAppointmentContext} from '../Context';
import {buildContextValue} from '../CreateAppointment/CreateAppointmentState';
import ChooseProductStep from './ChooseProductStep';

const render = async () => {
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
            clientBaseUrl: '',
            baseTitle: '',
            requiredFieldsWithAsterisk: true,
            debug: false,
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
  return await realRender(<RouterProvider router={router} />);
};

afterEach(() => {
  window.sessionStorage.clear();
});

describe('The product selection step', () => {
  test('initially displays the full list of products', async () => {
    mswWorker.use(mockAppointmentProductsGet);

    const screen = await render();

    const dropdowns = screen.getByRole('combobox').all();
    expect(dropdowns).toHaveLength(1);
    await dropdowns[0].click();
    await userEvent.keyboard('[ArrowDown]');
    await expect.element(screen.getByText('Paspoort aanvraag')).toBeVisible();
    await expect.element(screen.getByText('Rijbewijs aanvraag (Drivers license)')).toBeVisible();
  });

  test('limits the second product choices based on first choosen product', async () => {
    mswWorker.use(mockAppointmentProductsGet);

    const screen = await render();

    // select the first product which limits the choices for the second
    const dropdowns = screen.getByRole('combobox').all();
    expect(dropdowns).toHaveLength(1);
    await dropdowns[0].click();
    await userEvent.keyboard('[ArrowDown]');
    await screen.getByText('Rijbewijs aanvraag (Drivers license)').click();

    const addButton = screen.getByRole('button', {name: 'Add another product'});
    await addButton.click();

    const updatedDropdowns = screen.getByRole('combobox').all();
    expect(updatedDropdowns).toHaveLength(2);
    const secondDropdown = updatedDropdowns[1];
    await secondDropdown.click();
    await userEvent.keyboard('[ArrowDown]');
    await expect.element(screen.getByText('Paspoort aanvraag')).toBeVisible();
    await expect
      .element(screen.getByText('Not available with drivers license'))
      .not.toBeInTheDocument();
  });
});

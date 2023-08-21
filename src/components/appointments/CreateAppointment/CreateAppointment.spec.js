import {act, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';

import {ConfigContext, FormContext} from 'Context';
import {updateSessionExpiry} from 'api';
import {BASE_URL, buildForm} from 'api-mocks';
import mswServer from 'api-mocks/msw-server';
import {buildSubmission, mockSubmissionPost} from 'api-mocks/submissions';
import App, {routes as nestedRoutes} from 'components/App';

import {
  mockAppointmentDatesGet,
  mockAppointmentLocationsGet,
  mockAppointmentProductsGet,
  mockAppointmentTimesGet,
} from '../mocks';

// scrollIntoView is not not supported in Jest
let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

const routes = [
  {
    path: '*',
    element: <App />,
    children: nestedRoutes,
  },
];

const renderApp = () => {
  const form = buildForm({
    appointmentOptions: {
      isAppointment: true,
      supportsMultipleProducts: true,
    },
  });
  const router = createMemoryRouter(routes);
  render(
    <ConfigContext.Provider
      value={{
        baseUrl: BASE_URL,
        clientBaseUrl: 'http://localhost/',
        basePath: '',
        baseTitle: '',
        requiredFieldsWithAsterisk: true,
        displayComponents: {},
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

describe('Create appointment session expiration', () => {
  it('resets the session storage/local state', async () => {
    const user = userEvent.setup({delay: null});
    mswServer.use(
      mockSubmissionPost(buildSubmission({steps: []})),
      mockAppointmentProductsGet,
      mockAppointmentLocationsGet,
      mockAppointmentDatesGet,
      mockAppointmentTimesGet
    );
    // initially render the app
    renderApp();

    // wait for submission to be created and recorded in the local storage
    await waitFor(() => {
      const submission = sessionStorage.getItem('appointment|submission');
      expect(submission).not.toBe('null');
    });

    // select a product
    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(1);
    await user.click(dropdowns[0]);
    await user.keyboard('[ArrowDown]');
    const product = await screen.findByText('Paspoort aanvraag');
    expect(product).toBeVisible();
    await user.click(product);

    // submit and navigate to the next page
    await user.click(screen.getByRole('button', {name: 'Confirm products'}));

    // and wait until locations etc. are loaded
    await screen.findByLabelText('Location');

    // now finally let the session timeout in 1s
    act(() => updateSessionExpiry(1));
    await waitFor(async () => {
      await screen.findByText('Your session has expired');
    });

    // and click the link to restart...
    const restartLink = await screen.findByRole('link', {name: 'here'});
    await user.click(restartLink);

    // Here, take this if you need to figure out which keys are present
    // console.log(Object.entries(sessionStorage));

    // introspect session storage
    await waitFor(() => {
      const formData = sessionStorage.getItem('appointment|formData');
      expect(formData).toBe('{}');
    });
    await screen.findByText('Select your product(s)');

    const productDropdown = screen.getByRole('combobox');
    expect(productDropdown).toHaveDisplayValue('');
  });
});

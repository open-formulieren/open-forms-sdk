import {render, screen} from '@testing-library/react';
import messagesEN from 'i18n/compiled/en.json';
import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import routes, {FUTURE_FLAGS} from '@/routes';

const Wrapper = () => {
  const form = buildForm({
    appointmentOptions: {
      isAppointment: true,
      supportsMultipleProducts: true,
    },
  });
  const router = createMemoryRouter(routes, {
    initialEntries: [
      '/afspraak-annuleren?time=2023-08-31T07:35:00Z&submission_uuid=bc38ca5e-4efd-4d9d-a3df-8cf5be7f0726',
    ],
    initialIndex: 0,
    future: FUTURE_FLAGS,
  });
  return (
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
        <FormContext.Provider value={form}>
          <RouterProvider router={router} />
        </FormContext.Provider>
      </IntlProvider>
    </ConfigContext.Provider>
  );
};

describe('Cancelling an appointment', () => {
  it('renders the correct page for a cancel route', async () => {
    render(<Wrapper />);

    const textbox = await screen.findByRole<HTMLInputElement>('textbox', {
      name: 'Your email address',
    });
    expect(textbox).toBeVisible();
    expect(textbox.name).toBe('email');
    expect(screen.getByRole('button')).toBeVisible();
  });
});

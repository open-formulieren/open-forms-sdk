import {IntlProvider} from 'react-intl';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {describe, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';

import {ConfigContext, FormContext} from '@/Context';
import {BASE_URL, buildForm} from '@/api-mocks';
import messagesEN from '@/i18n/compiled/en.json';
import routes, {FUTURE_FLAGS} from '@/routes';

const Wrapper = () => {
  const form = buildForm({
    type: 'appointment',
    appointmentOptions: {
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
        showFormTitle: true,
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
  test('renders the correct page for a cancel route', async () => {
    const screen = await render(<Wrapper />);

    const textbox = screen.getByRole('textbox', {name: 'Your email address'});
    await expect.element(textbox).toBeVisible();
    await expect.element(textbox).toHaveAttribute('name', 'email');
    await expect.element(screen.getByRole('button')).toBeVisible();
  });
});

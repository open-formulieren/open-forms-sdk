import {act, render as realRender, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Formik} from 'formik';
import {IntlProvider} from 'react-intl';

import {ConfigContext} from '@/Context';
import {BASE_URL} from '@/api-mocks';
import {mockAppointmentTimesGet} from '@/api-mocks/appointments';
import mswServer from '@/api-mocks/msw-server';
import type {AppointmentProduct} from '@/data/appointments';
import messagesEN from '@/i18n/compiled/en.json';

import TimeSelect from './TimeSelect';

const products: AppointmentProduct[] = [{productId: 'e8e045ab', amount: 1}];

const render = (children: React.ReactNode, locationId: string) =>
  realRender(
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
        <Formik
          initialValues={{
            location: locationId,
            date: '2023-06-14',
          }}
          onSubmit={vi.fn()}
        >
          {children}
        </Formik>
      </IntlProvider>
    </ConfigContext.Provider>
  );

describe('The appointment time select', () => {
  it('makes sure times are localized', async () => {
    const user = userEvent.setup();
    mswServer.use(mockAppointmentTimesGet);

    render(<TimeSelect products={products} />, '1396f17c');

    const timeSelect = await screen.findByLabelText('Time');

    // open the options dropdown
    act(() => {
      timeSelect.focus();
    });
    await user.keyboard('[ArrowDown]');

    // see mocks.js for the returned times
    expect(await screen.findByRole('option', {name: '8:00 AM'})).toBeVisible();
    expect(screen.getByRole('option', {name: '8:10 AM'})).toBeVisible();
    expect(screen.getByRole('option', {name: '10:00 AM'})).toBeVisible();
    expect(screen.getByRole('option', {name: '10:30 AM'})).toBeVisible();
    expect(screen.getByRole('option', {name: '2:30 PM'})).toBeVisible();
  });
});

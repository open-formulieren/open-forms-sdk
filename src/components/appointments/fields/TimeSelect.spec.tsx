import {Formik} from 'formik';
import {IntlProvider} from 'react-intl';
import {describe, expect, test, vi} from 'vitest';
import {render as realRender} from 'vitest-browser-react';
import {userEvent} from 'vitest/browser';

import {ConfigContext} from '@/Context';
import {BASE_URL} from '@/api-mocks';
import {mockAppointmentTimesGet} from '@/api-mocks/appointments';
import mswWorker from '@/api-mocks/msw-worker';
import type {AppointmentProduct} from '@/data/appointments';
import messagesEN from '@/i18n/compiled/en.json';

import TimeSelect from './TimeSelect';

const products: AppointmentProduct[] = [{productId: 'e8e045ab', amount: 1, amountLimit: 0}];

const render = async (children: React.ReactNode, locationId: string) =>
  await realRender(
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
  test('makes sure times are localized', async () => {
    mswWorker.use(mockAppointmentTimesGet);

    const screen = await render(<TimeSelect products={products} />, '1396f17c');

    const timeSelect = screen.getByLabelText('Time');
    await expect.element(timeSelect).toBeVisible();

    // open the options dropdown
    await timeSelect.click();
    await userEvent.keyboard('[ArrowDown]');

    // see mocks.js for the returned times
    await expect.element(screen.getByRole('option', {name: '8:00 AM'})).toBeVisible();
    await expect.element(screen.getByRole('option', {name: '8:10 AM'})).toBeVisible();
    await expect.element(screen.getByRole('option', {name: '10:00 AM'})).toBeVisible();
    await expect.element(screen.getByRole('option', {name: '10:30 AM'})).toBeVisible();
    await expect.element(screen.getByRole('option', {name: '2:30 PM'})).toBeVisible();
  });
});

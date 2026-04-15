import {Formik} from 'formik';
import {IntlProvider} from 'react-intl';
import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render as realRender} from 'vitest-browser-react';

import {ConfigContext} from '@/Context';
import {BASE_URL} from '@/api-mocks';
import {mockAppointmentDatesGet} from '@/api-mocks/appointments';
import mswWorker from '@/api-mocks/msw-worker';
import type {AppointmentProduct} from '@/data/appointments';
import messagesEN from '@/i18n/compiled/en.json';

import DateSelect from './DateSelect';

const products: AppointmentProduct[] = [{productId: 'e8e045ab', amount: 1, amountLimit: 0}];

const render = async (children: React.ReactNode, locationId: string) =>
  await realRender(
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
            date: '',
          }}
          onSubmit={vi.fn()}
        >
          {children}
        </Formik>
      </IntlProvider>
    </ConfigContext.Provider>
  );

beforeEach(() => {
  vi.setSystemTime(new Date('2023-06-12T14:00:00Z'));
});

describe('The appointment date select', () => {
  test('disables dates before and after the available dates range', async () => {
    mswWorker.use(mockAppointmentDatesGet);

    const screen = await render(<DateSelect products={products} />, '1396f17c');

    const input = screen.getByLabelText('Date');
    await expect.element(input).not.toBeDisabled();
    await expect.element(input).not.toHaveAttribute('aria-readonly');

    const datePickerTrigger = screen.getByRole('button', {name: 'Toggle calendar'});
    await expect.element(datePickerTrigger).toBeVisible();

    await datePickerTrigger.click();
    await expect.element(screen.getByRole('dialog')).toBeVisible();

    await expect.element(screen.getByRole('button', {name: 'Monday 12 June 2023'})).toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Tuesday 13 June 2023'}))
      .not.toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Wednesday 14 June 2023'}))
      .not.toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Thursday 15 June 2023'}))
      .not.toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Friday 16 June 2023'}))
      .not.toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Saturday 17 June 2023'}))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole('button', {name: 'Sunday 18 June 2023'}))
      .not.toBeInTheDocument();
  });

  test('disables missing dates within the available dates range', async () => {
    mswWorker.use(mockAppointmentDatesGet);

    const screen = await render(<DateSelect products={products} />, '34000e85');

    const input = screen.getByLabelText('Date');
    await expect.element(input).not.toBeDisabled();
    await expect.element(input).not.toHaveAttribute('aria-readonly');

    const datePickerTrigger = screen.getByRole('button', {name: 'Toggle calendar'});
    await expect.element(datePickerTrigger).toBeVisible();

    await datePickerTrigger.click();

    await expect.element(screen.getByRole('dialog')).toBeVisible();
    await expect
      .element(screen.getByRole('button', {name: 'Monday 12 June 2023'}))
      .not.toBeDisabled();
    await expect.element(screen.getByRole('button', {name: 'Tuesday 13 June 2023'})).toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Wednesday 14 June 2023'}))
      .toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Thursday 15 June 2023'}))
      .not.toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Friday 16 June 2023'}))
      .not.toBeDisabled();
    await expect
      .element(screen.getByRole('button', {name: 'Saturday 17 June 2023'}))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole('button', {name: 'Sunday 18 June 2023'}))
      .not.toBeInTheDocument();
  });
});
